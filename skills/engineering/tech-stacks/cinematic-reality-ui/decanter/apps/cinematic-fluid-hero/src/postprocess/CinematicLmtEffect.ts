import { Effect } from "postprocessing";
import * as THREE from "three";

/** Cinematic LMT — metal-cinematic-lmt.md / post-processing-pipeline.md step 3 */
const fragmentShader = /* glsl */ `
uniform float exposure;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 color = inputColor.rgb * exposure;

  vec3 c = max(color, 0.0);
  vec3 slope = vec3(1.05, 0.98, 1.08);
  vec3 offset = vec3(0.0, 0.005, 0.01);
  vec3 power = vec3(1.12, 1.08, 1.05);
  float sat = 1.15;

  c = pow(c * slope + offset, power);
  float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = luma + sat * (c - luma);

  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 teal = vec3(0.85, 1.05, 1.15);
  vec3 orange = vec3(1.15, 1.05, 0.85);
  c = mix(c * teal, c * orange, smoothstep(0.2, 0.85, lum));
  c = pow(c, vec3(1.05));

  outputColor = vec4(clamp(c, 0.0, 1.0), inputColor.a);
}
`;

export class CinematicLmtEffect extends Effect {
  constructor({ exposure = 1.0 }: { exposure?: number } = {}) {
    super("CinematicLmtEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([["exposure", new THREE.Uniform(exposure)]]),
    });
  }

  set exposure(value: number) {
    this.uniforms.get("exposure")!.value = value;
  }
}
