import { useEffect, useState } from "react";

export type Tilt = { x: number; y: number };

export function useDeviceTilt(enabled: boolean): Tilt {
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const onMotion = (e: DeviceMotionEvent) => {
      const g = e.accelerationIncludingGravity;
      if (!g) return;
      const x = Math.max(-1, Math.min(1, (g.x ?? 0) / 9.81));
      const y = Math.max(-1, Math.min(1, (g.y ?? 0) / 9.81));
      setTilt({ x, y });
    };

    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [enabled]);

  return tilt;
}
