import { HeroFluidScene } from "../components/HeroFluidScene";
import type { Tilt } from "../hooks/useDeviceTilt";

type Props = {
  reduced: boolean;
  tilt: Tilt;
};

/** Full-viewport canvas; copy lives in HolographicHeroHud (3D) per hard-rules.md */
export function Hero({ reduced, tilt }: Props) {
  return (
    <section className="hero" aria-label="Cinematic fluid experience">
      <div className="hero-canvas-wrap">
        <HeroFluidScene reduced={reduced} tilt={tilt} />
        <div
          className={`hero-vignette${reduced ? " hero-vignette--reduced" : ""}`}
          aria-hidden
        />
      </div>
      <p className="sr-only">
        Cinematic interactive PWA with ACES post-processing and GPU fluid simulation.
      </p>
    </section>
  );
}
