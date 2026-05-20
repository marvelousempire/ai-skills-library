import { useState } from "react";
import { Hud } from "./components/Hud";
import { MilkPourScene } from "./components/MilkPourScene";
import { useWebGPU } from "./hooks/useWebGPU";

export default function App() {
  const webgpu = useWebGPU();
  const [fps, setFps] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <>
      <MilkPourScene reducedMotion={reducedMotion} onFps={setFps} />
      <Hud
        webgpu={webgpu}
        fps={fps}
        reducedMotion={reducedMotion}
        onReducedMotionChange={setReducedMotion}
      />
    </>
  );
}
