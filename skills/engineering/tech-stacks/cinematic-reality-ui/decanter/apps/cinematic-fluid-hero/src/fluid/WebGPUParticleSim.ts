import { tokens } from "../tokens";

const WGSL = /* wgsl */ `
struct Params {
  dt: f32,
  gravityX: f32,
  gravityY: f32,
  gravityZ: f32,
  count: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read_write> positions: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> velocities: array<vec4f>;

@compute @workgroup_size(${tokens.fluid.workgroupSize})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= params.count) { return; }

  var pos = positions[i].xyz;
  var vel = velocities[i].xyz;

  let gx = params.gravityX * 2.2;
  let gy = (-9.81 + params.gravityY * 2.0);
  let gz = params.gravityZ * 2.2;

  vel += vec3f(gx, gy, gz) * params.dt;
  vel *= 0.995;
  pos += vel * params.dt;

  let r2 = pos.x * pos.x + pos.z * pos.z;
  let maxR = 1.35;
  if (r2 > maxR * maxR) {
    let r = sqrt(r2);
    pos.x = (pos.x / r) * maxR;
    pos.z = (pos.z / r) * maxR;
    vel.x *= -0.35;
    vel.z *= -0.35;
  }
  if (pos.y < -0.35) {
    pos.y = -0.35;
    vel.y *= -0.4;
  }
  if (pos.y > 2.4) {
    pos.y = 2.4;
    vel.y *= -0.5;
  }

  positions[i] = vec4f(pos, 1.0);
  velocities[i] = vec4f(vel, 0.0);
}
`;

export type SimBackend = "webgpu" | "cpu";

export class WebGPUParticleSim {
  readonly count: number;
  readonly positions: Float32Array;
  private backend: SimBackend = "cpu";
  private device: GPUDevice | null = null;
  private posBuffer: GPUBuffer | null = null;
  private velBuffer: GPUBuffer | null = null;
  private paramsBuffer: GPUBuffer | null = null;
  private pipeline: GPUComputePipeline | null = null;
  private bindGroup: GPUBindGroup | null = null;
  private readBuffer: GPUBuffer | null = null;
  private velX = new Float32Array(0);
  private velY = new Float32Array(0);
  private velZ = new Float32Array(0);
  private frame = 0;

  constructor(count: number) {
    this.count = count;
    this.positions = new Float32Array(count * 3);
    this.velX = new Float32Array(count);
    this.velY = new Float32Array(count);
    this.velZ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.9;
      this.positions[i * 3] = Math.cos(angle) * r;
      this.positions[i * 3 + 1] = Math.random() * 1.2 + 0.2;
      this.positions[i * 3 + 2] = Math.sin(angle) * r;
      this.velX[i] = (Math.random() - 0.5) * 0.02;
      this.velY[i] = (Math.random() - 0.5) * 0.02;
      this.velZ[i] = (Math.random() - 0.5) * 0.02;
    }
  }

  async init(): Promise<SimBackend> {
    if (!("gpu" in navigator)) return "cpu";
    try {
      const adapter = await navigator.gpu!.requestAdapter();
      if (!adapter) return "cpu";
      this.device = await adapter.requestDevice();

      const posData = new Float32Array(this.count * 4);
      const velData = new Float32Array(this.count * 4);
      for (let i = 0; i < this.count; i++) {
        posData.set(
          [
            this.positions[i * 3],
            this.positions[i * 3 + 1],
            this.positions[i * 3 + 2],
            1,
          ],
          i * 4,
        );
        velData.set([this.velX[i], this.velY[i], this.velZ[i], 0], i * 4);
      }

      const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
      this.posBuffer = this.device.createBuffer({ size: posData.byteLength, usage });
      this.velBuffer = this.device.createBuffer({ size: velData.byteLength, usage });
      this.device.queue.writeBuffer(this.posBuffer, 0, posData);
      this.device.queue.writeBuffer(this.velBuffer, 0, velData);

      this.paramsBuffer = this.device.createBuffer({
        size: 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      this.readBuffer = this.device.createBuffer({
        size: posData.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });

      const module = this.device.createShaderModule({ code: WGSL });
      this.pipeline = this.device.createComputePipeline({
        layout: "auto",
        compute: { module, entryPoint: "main" },
      });

      this.bindGroup = this.device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: this.paramsBuffer } },
          { binding: 1, resource: { buffer: this.posBuffer } },
          { binding: 2, resource: { buffer: this.velBuffer } },
        ],
      });

      this.backend = "webgpu";
      return "webgpu";
    } catch {
      this.backend = "cpu";
      return "cpu";
    }
  }

  getBackend(): SimBackend {
    return this.backend;
  }

  step(dt: number, gravity: [number, number, number]) {
    if (this.backend === "webgpu" && this.device && this.pipeline && this.bindGroup) {
      const params = new Float32Array([dt, gravity[0], gravity[1], gravity[2], this.count]);
      this.device.queue.writeBuffer(this.paramsBuffer!, 0, params);
      const encoder = this.device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(this.pipeline);
      pass.setBindGroup(0, this.bindGroup);
      pass.dispatchWorkgroups(Math.ceil(this.count / tokens.fluid.workgroupSize));
      pass.end();
      this.device.queue.submit([encoder.finish()]);
      return;
    }

    const gx = gravity[0] * 2.2;
    const gy = -9.81 + gravity[1] * 2;
    const gz = gravity[2] * 2.2;
    for (let i = 0; i < this.count; i++) {
      let vx = this.velX[i] + gx * dt;
      let vy = this.velY[i] + gy * dt;
      let vz = this.velZ[i] + gz * dt;
      vx *= 0.995;
      vy *= 0.995;
      vz *= 0.995;
      let x = this.positions[i * 3] + vx * dt;
      let y = this.positions[i * 3 + 1] + vy * dt;
      let z = this.positions[i * 3 + 2] + vz * dt;
      const r2 = x * x + z * z;
      if (r2 > 1.35 * 1.35) {
        const r = Math.sqrt(r2);
        x = (x / r) * 1.35;
        z = (z / r) * 1.35;
        vx *= -0.35;
        vz *= -0.35;
      }
      if (y < -0.35) {
        y = -0.35;
        vy *= -0.4;
      }
      if (y > 2.4) {
        y = 2.4;
        vy *= -0.5;
      }
      this.positions[i * 3] = x;
      this.positions[i * 3 + 1] = y;
      this.positions[i * 3 + 2] = z;
      this.velX[i] = vx;
      this.velY[i] = vy;
      this.velZ[i] = vz;
    }
  }

  async syncPositionsFromGpu(): Promise<void> {
    if (this.backend !== "webgpu" || !this.device || !this.posBuffer || !this.readBuffer) return;
    this.frame += 1;
    if (this.frame % 2 !== 0) return;

    const encoder = this.device.createCommandEncoder();
    encoder.copyBufferToBuffer(this.posBuffer, 0, this.readBuffer, 0, this.count * 16);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone();
    await this.readBuffer.mapAsync(GPUMapMode.READ);
    const mapped = new Float32Array(this.readBuffer.getMappedRange());
    for (let i = 0; i < this.count; i++) {
      this.positions[i * 3] = mapped[i * 4];
      this.positions[i * 3 + 1] = mapped[i * 4 + 1];
      this.positions[i * 3 + 2] = mapped[i * 4 + 2];
    }
    this.readBuffer.unmap();
  }
}
