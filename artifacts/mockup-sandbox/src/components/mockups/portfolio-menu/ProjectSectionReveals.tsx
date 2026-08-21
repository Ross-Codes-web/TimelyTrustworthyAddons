import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import "./project-section-reveals.css";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    number: "02",
    eyebrow: "Independent studio",
    title: "About",
    copy: "Obscura builds identities, interfaces, and useful little worlds for people making something worth remembering.",
    tone: "about",
  },
  {
    number: "03",
    eyebrow: "A wider body of work",
    title: "Archive",
    copy: "Selected experiments, field notes, and visual systems collected from the edges of the practice.",
    tone: "archive",
  },
  {
    number: "04",
    eyebrow: "Let’s make something",
    title: "Start a project",
    copy: "Have a sharp idea or a difficult brief? Bring the first rough version. We’ll find the shape together.",
    tone: "project",
  },
];

export function ProjectSectionReveals() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".project-section-reveals");
    if (!root) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const panels = gsap.utils.toArray<HTMLElement>(".project-reveal-panel", root);
    const triggers = panels.map((panel) => {
      const content = panel.querySelector<HTMLElement>(".project-reveal-content");
      const veil = panel.querySelector<HTMLElement>(".project-reveal-veil");
      if (!content || !veil) return null;

      return ScrollTrigger.create({
        trigger: panel,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(content, {
            y: `${-14 * (1 - progress)}%`,
            opacity: gsap.utils.interpolate(0.45, 1, progress),
          });
          gsap.set(veil, { scaleY: gsap.utils.interpolate(1, 0, progress) });
        },
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <section className="project-section-reveals" aria-label="Portfolio sections">
      {sections.map((section) => (
        <article className={`project-reveal-panel ${section.tone}`} key={section.number}>
          <div className="project-reveal-veil" />
          <div className="project-reveal-content">
            <div className="project-reveal-meta">
              <span>{section.number}</span>
              <span>{section.eyebrow}</span>
            </div>
            <h2>{section.title}</h2>
            <p>{section.copy}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
