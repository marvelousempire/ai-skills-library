import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WebGPUParticleSim } from "./WebGPUParticleSim";
import { tokens } from "../tokens";
import { useExperienceStore } from "../store/experienceStore";

type Props = {
  reduced: boolean;
  tilt: { x: number; y: number };
};

const vertexShader = /* glsl */ `
  attribute float aSize;
  varying vec3 vWorldPos;
  varying float vDepth;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (320.0 / max(vDepth, 0.1));
  }
`;

/** PBR-ish emissive fluid — hard-rules: SSS hint, no flat colors */
const fragmentShader = /* glsl */ `
  uniform vec3 uCyan;
  uniform vec3 uOrange;
  uniform float uTime;
  varying vec3 vWorldPos;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    float soft = smoothstep(0.5, 0.06, d);
    float rim = pow(1.0 - d * 2.0, 3.0);
    float y = vWorldPos.y * 0.45 + 0.5;
    vec3 base = mix(uCyan, uOrange, smoothstep(0.15, 0.9, y));

    float thickness = soft * (1.0 + rim * 0.8);
    vec3 subsurface = base * (0.65 + 0.35 * sin(uTime * 1.2 + vWorldPos.x * 3.0));
    vec3 col = subsurface * thickness + rim * vec3(1.0, 0.95, 0.9) * 0.35;

    float alpha = clamp(thickness * 0.92, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function CinematicFluidVolume({ reduced, tilt }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const sim = useMemo(() => new WebGPUParticleSim(tokens.fluid.particleCount), []);
  const [ready, setReady] = useState(false);
  const setFluidBackend = useExperienceStore((s) => s.setFluidBackend);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(sim.positions, 3));
    const sizes = new Float32Array(sim.count);
    for (let i = 0; i < sim.count; i++) sizes[i] = 7 + Math.random() * 5;
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [sim]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uCyan: { value: new THREE.Color(tokens.color.cyan) },
          uOrange: { value: new THREE.Color(tokens.color.orange) },
          uTime: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: true,
        blending: THREE.NormalBlending,
      }),
    [],
  );

  useEffect(() => {
    void sim.init().then((backend) => {
      setFluidBackend(backend);
      setReady(true);
    });
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [sim, geometry, material, setFluidBackend]);

  useFrame((state, delta) => {
    if (!ready) return;
    const dt = reduced ? delta * 0.3 : delta;
    sim.step(dt, [tilt.x, tilt.y, 0]);
    void sim.syncPositionsFromGpu();
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.needsUpdate = true;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (pointsRef.current && !reduced) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
  );
}
