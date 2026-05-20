import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { wrapEffect } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import { CinematicLmtEffect } from "./CinematicLmtEffect";
import { tokens } from "../tokens";

const CinematicLmt = wrapEffect(CinematicLmtEffect);

type Props = {
  reduced: boolean;
};

/**
 * bible/post-processing-pipeline.md:
 * exposure → LMT → (ACES RRT on renderer) → bloom → grain 8–12% → vignette → CA
 */
export function CinematicPostProcess({ reduced }: Props) {
  const exposure = useMemo(() => (reduced ? 0.85 : tokens.effect.exposure), [reduced]);

  const bloomIntensity = reduced
    ? tokens.effect.bloomIntensity * 0.35
    : tokens.effect.bloomIntensity;
  const grain = reduced ? 0.03 : tokens.effect.filmGrain;
  const vignette = reduced ? 0.28 : tokens.effect.vignette;

  return (
    <EffectComposer multisampling={0}>
      <CinematicLmt exposure={exposure} />
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={tokens.effect.bloomThreshold}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={tokens.effect.bloomRadius}
      />
      <Noise opacity={grain} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil offset={0.14} darkness={vignette} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={
          reduced
            ? [0, 0]
            : [tokens.effect.chromaticAberration, tokens.effect.chromaticAberration]
        }
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}
