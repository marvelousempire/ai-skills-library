import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { tokens } from "../tokens";

const GLASS_RADIUS = 0.55;
const GLASS_HEIGHT = 1.1;
const GLASS_BOTTOM = -0.35;

type MilkParticlesProps = {
  tilt: THREE.Vector2;
  pouring: boolean;
  reducedMotion: boolean;
};

type Particle = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
};

function createParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const y = GLASS_BOTTOM + Math.random() * GLASS_HEIGHT * 0.7;
    const r = Math.random() * GLASS_RADIUS * 0.65;
    const a = Math.random() * Math.PI * 2;
    particles.push({
      position: new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
      ),
    });
  }
  return particles;
}

export function MilkParticles({ tilt, pouring, reducedMotion }: MilkParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = reducedMotion ? tokens.fluid.particleCountReduced : tokens.fluid.particleCount;
  const particles = useMemo(() => createParticles(count), [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const gravity = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dt = reducedMotion ? delta * 0.25 : Math.min(delta, 0.033);
    gravity.set(tilt.x * 4, -tokens.fluid.gravity, tilt.y * 4);

    if (pouring && !reducedMotion) {
      for (let i = 0; i < 3; i++) {
        const p = particles[Math.floor(Math.random() * particles.length)];
        p.position.set(
          (Math.random() - 0.5) * 0.15,
          GLASS_BOTTOM + GLASS_HEIGHT + 0.15,
          (Math.random() - 0.5) * 0.15,
        );
        p.velocity.set(
          (Math.random() - 0.5) * 0.4,
          -tokens.fluid.pourRate * 2,
          (Math.random() - 0.5) * 0.4,
        );
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!reducedMotion) {
        p.velocity.addScaledVector(gravity, dt * 0.35);
        p.velocity.multiplyScalar(0.98 * tokens.fluid.viscosity);
        p.position.addScaledVector(p.velocity, dt);

        const xz = Math.hypot(p.position.x, p.position.z);
        if (xz > GLASS_RADIUS * 0.9) {
          const push = (GLASS_RADIUS * 0.9) / xz;
          p.position.x *= push;
          p.position.z *= push;
          p.velocity.x *= -0.35;
          p.velocity.z *= -0.35;
        }
        if (p.position.y < GLASS_BOTTOM) {
          p.position.y = GLASS_BOTTOM;
          p.velocity.y *= -0.25;
          p.velocity.x += (Math.random() - 0.5) * 0.08;
          p.velocity.z += (Math.random() - 0.5) * 0.08;
        }
        if (p.position.y > GLASS_BOTTOM + GLASS_HEIGHT) {
          p.position.y = GLASS_BOTTOM + GLASS_HEIGHT;
          p.velocity.y *= -0.2;
        }
      }

      dummy.position.copy(p.position);
      dummy.scale.setScalar(0.045);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhysicalMaterial
        color={tokens.color.milk}
        opacity={tokens.fluid.opacity}
        transparent
        roughness={0.35}
        metalness={0.05}
        clearcoat={0.4}
        clearcoatRoughness={0.2}
        emissive="#fff8ee"
        emissiveIntensity={0.08}
      />
    </instancedMesh>
  );
}
