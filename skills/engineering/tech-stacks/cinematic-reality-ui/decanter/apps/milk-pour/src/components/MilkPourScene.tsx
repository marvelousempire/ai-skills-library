import { ContactShadows, Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useState } from "react";
import * as THREE from "three";
import { FpsTracker } from "./FpsTracker";
import { Glass } from "./Glass";
import { MilkParticles } from "./MilkParticles";

type MilkPourSceneProps = {
  reducedMotion: boolean;
  onFps: (fps: number) => void;
};

export function MilkPourScene({ reducedMotion, onFps }: MilkPourSceneProps) {
  const [tilt, setTilt] = useState(() => new THREE.Vector2(0, 0));
  const [pouring, setPouring] = useState(false);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    setTilt(new THREE.Vector2(nx * 0.6, -ny * 0.6));
  }, []);

  const handlePointerDown = useCallback(() => setPouring(true), []);
  const handlePointerUp = useCallback(() => setPouring(false), []);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onPointerMove={(e) => handlePointerMove(e.nativeEvent)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: false }} onCreated={({ gl }) => gl.setClearColor("#08080f")}>
        <FpsTracker onFps={onFps} />
        <PerspectiveCamera makeDefault position={[2.2, 1.4, 2.4]} fov={42} />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0.2, 0]}
        />
        <ambientLight intensity={0.25} />
        <spotLight position={[4, 6, 2]} angle={0.4} penumbra={0.6} intensity={2.2} castShadow />
        <spotLight position={[-3, 4, -2]} angle={0.5} intensity={0.8} color="#a8c8ff" />
        <pointLight position={[0, 2, 0]} intensity={0.4} color="#fff5e8" />
        <Environment preset="city" />
        <group rotation={[tilt.y * 0.15, 0, tilt.x * 0.15]}>
          <Glass />
          <MilkParticles tilt={tilt} pouring={pouring} reducedMotion={reducedMotion} />
        </group>
        <ContactShadows position={[0, -0.38, 0]} opacity={0.45} scale={8} blur={2.5} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.39, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#0c0c14" roughness={0.9} metalness={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
}
