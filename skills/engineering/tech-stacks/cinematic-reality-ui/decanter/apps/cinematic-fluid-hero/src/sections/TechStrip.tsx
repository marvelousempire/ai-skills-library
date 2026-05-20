const stack = [
  "Vite",
  "React 19",
  "R3F",
  "WebGPU",
  "ACES",
  "MLS-MPM",
  "Postprocessing",
  "Motion",
];

export function TechStrip() {
  return (
    <section id="stack" className="tech-strip" aria-label="Technology stack">
      <div className="container tech-strip-inner">
        {stack.map((item) => (
          <span
            key={item}
            className={`tech-pill${item === "ACES" || item === "WebGPU" ? " tech-pill--accent" : ""}`}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
