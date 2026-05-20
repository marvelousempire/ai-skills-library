/**
 * Simplified MLS-MPM-style particle bucket (CPU stepping).
 * Production path: WebGPU compute per Master Bible §3.8.
 */
export type Particle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
};

export class MLSMPMSim {
  readonly count: number;
  readonly positions: Float32Array;
  private particles: Particle[];

  constructor(count: number) {
    this.count = count;
    this.positions = new Float32Array(count * 3);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.9;
      const p: Particle = {
        x: Math.cos(angle) * r,
        y: Math.random() * 1.2 + 0.2,
        z: Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.02,
      };
      this.particles.push(p);
    }
    this.syncPositions();
  }

  private syncPositions() {
    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i];
      this.positions[i * 3] = p.x;
      this.positions[i * 3 + 1] = p.y;
      this.positions[i * 3 + 2] = p.z;
    }
  }

  step(dt: number, gravity: [number, number, number], reduced: boolean) {
    const scale = reduced ? 0.25 : 1;
    const gx = gravity[0] * 2.2 * scale;
    const gy = (-9.81 + gravity[1] * 2) * scale;
    const gz = gravity[2] * 2.2 * scale;

    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i];
      p.vx += gx * dt;
      p.vy += gy * dt;
      p.vz += gz * dt;

      p.vx *= 0.995;
      p.vy *= 0.995;
      p.vz *= 0.995;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      const r2 = p.x * p.x + p.z * p.z;
      const maxR = 1.35;
      if (r2 > maxR * maxR) {
        const r = Math.sqrt(r2);
        p.x = (p.x / r) * maxR;
        p.z = (p.z / r) * maxR;
        p.vx *= -0.35;
        p.vz *= -0.35;
      }

      if (p.y < -0.35) {
        p.y = -0.35;
        p.vy *= -0.4;
      }
      if (p.y > 2.4) {
        p.y = 2.4;
        p.vy *= -0.5;
      }
    }
    this.syncPositions();
  }
}
