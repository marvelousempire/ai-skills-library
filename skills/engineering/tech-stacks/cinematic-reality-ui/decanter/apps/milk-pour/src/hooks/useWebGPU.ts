import { useEffect, useState } from "react";

export type WebGPUStatus = "checking" | "supported" | "unsupported";

export function useWebGPU(): WebGPUStatus {
  const [status, setStatus] = useState<WebGPUStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    async function probe() {
      if (!("gpu" in navigator)) {
        if (!cancelled) setStatus("unsupported");
        return;
      }
      try {
        const gpu = navigator.gpu as { requestAdapter: () => Promise<unknown> };
        const adapter = await gpu.requestAdapter();
        if (!cancelled) setStatus(adapter ? "supported" : "unsupported");
      } catch {
        if (!cancelled) setStatus("unsupported");
      }
    }

    void probe();
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
