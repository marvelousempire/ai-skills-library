import { Nav } from "./components/Nav";
import { RendererChip } from "./components/RendererChip";
import { Features } from "./sections/Features";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { TechStrip } from "./sections/TechStrip";
import { useDeviceTilt } from "./hooks/useDeviceTilt";
import { useReducedMotion } from "./hooks/useReducedMotion";

export default function App() {
  const { reduced, toggle } = useReducedMotion();
  const tilt = useDeviceTilt(!reduced);

  return (
    <>
      <Nav />
      <button type="button" className="motion-toggle" onClick={toggle} aria-pressed={reduced}>
        {reduced ? "Motion: reduced" : "Reduce motion"}
      </button>
      <RendererChip />
      <main>
        <Hero reduced={reduced} tilt={tilt} />
        <TechStrip />
        <Features />
      </main>
      <Footer />
    </>
  );
}
