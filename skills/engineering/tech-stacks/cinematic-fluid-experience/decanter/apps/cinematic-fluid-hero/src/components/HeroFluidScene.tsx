import { Float, OrbitControls, Sparkles, Stars, Torus } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CinematicFluidVolume } from "../fluid/ScreenSpaceFluid";
import { CinematicPostProcess } from "../postprocess/CinematicPostProcess";
import { HolographicHeroHud } from "./HolographicHeroHud";
import { createCinematicRenderer } from "../renderer/createCinematicRenderer";
import { useExperienceStore } from "../store/experienceStore";
import { tokens } from "../tokens";

type SceneProps = {
  reduced: boolean;
  tilt: { x: number; y: number };
};

function StatOrb({
  position,
  color,
  reduced,
}: {
  position: [number, number, number];
  color: string;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.08;
  });

  return (
    <Float speed={2} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          roughness={0.06}
          metalness={0.5}
          transparent
          opacity={0.92}
          transmission={0.22}
          thickness={0.55}
          attenuationColor={new THREE.Color(color)}
          attenuationDistance={0.4}
        />
      </mesh>
    </Float>
  );
}

function BroadcastRing({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <Torus ref={ref} args={[2.4, 0.025, 64, 16]} rotation={[Math.PI / 2.2, 0, 0]}>
      <meshPhysicalMaterial
        color={tokens.color.cyan}
        emissive={tokens.color.cyan}
        emissiveIntensity={0.9}
        roughness={0.1}
        metalness={0.6}
        transparent
        opacity={0.4}
      />
    </Torus>
  );
}

function CinematicLighting({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={tokens.effect.ambientLight} />
      <hemisphereLight args={[tokens.color.fog, tokens.color.bg, 0.35]} />
      <spotLight
        position={[6, 10, 5]}
        intensity={reduced ? 1.2 : tokens.effect.godRayIntensity}
        angle={0.28}
        penumbra={0.85}
        color="#ffffff"
        castShadow={false}
      />
      <spotLight
        position={[-5, 4, -3]}
        intensity={reduced ? 0.8 : tokens.effect.rimIntensity}
        angle={0.45}
        penumbra={0.7}
        color={tokens.color.cyan}
      />
      <pointLight
        position={[2, -0.5, 3]}
        intensity={reduced ? 0.5 : 1.2}
        color={tokens.color.orange}
        distance={12}
      />
      <pointLight
        position={[-2, 1.5, -2]}
        intensity={0.6}
        color={tokens.color.cyan}
        distance={10}
      />
    </>
  );
}

function ArenaScene({ reduced, tilt }: SceneProps) {
  return (
    <>
      <color attach="background" args={[tokens.color.bg]} />
      <fogExp2 attach="fog" args={[tokens.color.fog, tokens.effect.fogDensity]} />
      <CinematicLighting reduced={reduced} />
      <Stars
        radius={90}
        depth={50}
        count={reduced ? 400 : 1800}
        factor={2.5}
        saturation={0}
        fade
        speed={reduced ? 0.15 : 0.45}
      />
      <Sparkles
        count={reduced ? 40 : 160}
        scale={12}
        size={2.2}
        speed={reduced ? 0.1 : 0.35}
        opacity={0.45}
        color={tokens.color.cyan}
      />
      <Sparkles
        count={reduced ? 20 : 60}
        scale={7}
        size={1.4}
        speed={reduced ? 0.08 : 0.22}
        opacity={0.3}
        color={tokens.color.orange}
      />
      <BroadcastRing reduced={reduced} />
      <CinematicFluidVolume reduced={reduced} tilt={tilt} />
      <StatOrb position={[-1.8, 0.6, 0.2]} color={tokens.color.cyan} reduced={reduced} />
      <StatOrb position={[1.6, -0.2, 0.5]} color={tokens.color.orange} reduced={reduced} />
      <StatOrb position={[0.3, 1.1, -0.8]} color={tokens.color.cyan} reduced={reduced} />
      <HolographicHeroHud />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.28}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 3.3}
        rotateSpeed={0.35}
        dampingFactor={0.08}
        enableDamping
      />
      <CinematicPostProcess reduced={reduced} />
    </>
  );
}

type HeroFluidSceneProps = {
  reduced: boolean;
  tilt: { x: number; y: number };
};

export function HeroFluidScene({ reduced, tilt }: HeroFluidSceneProps) {
  const setRendererMode = useExperienceStore((s) => s.setRendererMode);
  const dpr = useMemo(() => Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2), []);

  return (
    <Canvas
      className="hero-canvas"
      dpr={dpr}
      camera={{ position: [0, 0.55, 6.4], fov: 38 }}
      gl={async (props) => {
        const { renderer, mode } = await createCinematicRenderer(props.canvas as HTMLCanvasElement);
        setRendererMode(mode);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = tokens.effect.exposure;
        return renderer;
      }}
    >
      <ArenaScene reduced={reduced} tilt={tilt} />
    </Canvas>
  );
}
