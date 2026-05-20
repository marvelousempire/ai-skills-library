import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type FpsTrackerProps = {
  onFps: (fps: number) => void;
};

export function FpsTracker({ onFps }: FpsTrackerProps) {
  const frames = useRef(0);
  const last = useRef(performance.now());

  useFrame(() => {
    frames.current++;
    const now = performance.now();
    if (now - last.current >= 500) {
      onFps(Math.round((frames.current * 1000) / (now - last.current)));
      frames.current = 0;
      last.current = now;
    }
  });

  return null;
}
