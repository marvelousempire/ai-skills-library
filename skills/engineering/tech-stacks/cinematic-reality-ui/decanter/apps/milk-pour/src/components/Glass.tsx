import * as THREE from "three";
import { tokens } from "../tokens";

const GLASS_RADIUS = 0.58;
const GLASS_HEIGHT = 1.15;
const GLASS_BOTTOM = -0.38;

export function Glass() {
  return (
    <group position={[0, GLASS_BOTTOM + GLASS_HEIGHT / 2, 0]}>
      <mesh>
        <cylinderGeometry args={[GLASS_RADIUS, GLASS_RADIUS * 0.92, GLASS_HEIGHT, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          roughness={0.05}
          metalness={0.1}
          transmission={0.92}
          thickness={0.4}
          ior={1.45}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -GLASS_HEIGHT / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[GLASS_RADIUS * 0.92, 48]} />
        <meshStandardMaterial color={tokens.color.milkDim} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}
