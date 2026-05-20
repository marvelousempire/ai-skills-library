import { motion } from "motion/react";
import { tokens } from "../tokens";

const features = [
  {
    title: "Master Bible pipeline",
    body: "Locked void palette, ACES filmic tone mapping, bloom, film grain, and vignette—per doctrine/docs/quality/bible/design-tokens.md and post-processing-pipeline.md.",
  },
  {
    title: "Cinematic fluid volume",
    body: "16k particle sim with screen-space-style shading and device tilt. WebGPU renderer when available; credible WebGL fallback.",
  },
  {
    title: "Broadcast arena bridge",
    body: "Stat orbs, stadium ring, and sparkles map native CinematicBroadcastArenaView garnish—scoreboard HUD lands in slice D.",
  },
];

export function Features() {
  return (
    <section id="experience" className="section features">
      <div className="container">
        <p className="section-label">Experience model</p>
        <h2>Arena patterns, web-native delivery</h2>
        <p className="section-intro">
          SSOT: <code>doctrine</code> — premium interactive PWA showcase, not a milk
          pour toy.
        </p>
        <div className="feature-grid">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: tokens.motion.easeOut }}
            >
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
