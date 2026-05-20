# MLS-MPM — React Three Fiber template

Master Bible §3.8. Production starting point; extend with full grid transfers and screen-space surface pass.

```tsx
// MLS-MPM Fluid System – React Three Fiber + WebGPU (copy-paste ready)
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const NUM_PARTICLES = 65536   // 64k particles – easily scalable to 128k–180k

export function MLSMPMFluid() {
  const { gl } = useThree()
  const renderer = gl as any // WebGPURenderer

  const particlesBuffer = useMemo(() => {
    const buffer = new Float32Array(NUM_PARTICLES * 4) // x,y,z,w (w = mass)
    for (let i = 0; i < NUM_PARTICLES; i++) {
      buffer[i * 4]     = (Math.random() - 0.5) * 4     // x
      buffer[i * 4 + 1] = Math.random() * 3 + 1         // y (above floor)
      buffer[i * 4 + 2] = (Math.random() - 0.5) * 4     // z
      buffer[i * 4 + 3] = 1.0                           // mass
    }
    return buffer
  }, [])

  const storageBuffer = useMemo(() => {
    return renderer.createBuffer({
      label: 'MLS-MPM Particles',
      size: particlesBuffer.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    })
  }, [renderer])

  useMemo(() => {
    renderer.queue.writeBuffer(storageBuffer, 0, particlesBuffer)
  }, [])

  const computePipeline = useMemo(() => {
    // Full pipeline: renderer.device.createComputePipeline + WGSL from mls-mpm-wgsl-kernel.md
    return null // placeholder – standard WebGPU compute setup
  }, [])

  useFrame(() => {
    const computePass = renderer.commandEncoder.beginComputePass()
    computePass.setPipeline(computePipeline)
    computePass.setBindGroup(0, particleBindGroup)
    computePass.dispatchWorkgroups(Math.ceil(NUM_PARTICLES / 64))
    computePass.end()

    // Render: screen-space fluid pass — see ../../rendering/screen-space-fluid-rendering.md
  })

  return null
}
```

## Frame graph

1. Dispatch compute ([`mls-mpm-wgsl-kernel.md`](mls-mpm-wgsl-kernel.md))
2. Screen-space fluid surface ([`../../rendering/screen-space-fluid-rendering.md`](../../rendering/screen-space-fluid-rendering.md))
3. ACES post-process ([`../shaders/wgsl-aces-pipeline.md`](../shaders/wgsl-aces-pipeline.md))
