import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import "./code-two-section.css";

gsap.registerPlugin(ScrollTrigger);

export function CodeTwoSection() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".code-two-section");
    const footerContainer = root?.querySelector<HTMLElement>(".footer-container");
    const canvasContainer = root?.querySelector<HTMLElement>("#footer-canvas");
    const footer = root?.querySelector("footer");

    if (!root || !footerContainer || !footer) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (canvasContainer) canvasContainer.style.display = "none";

    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(footerContainer, { y: `${-35 * (1 - self.progress)}%` });
      },
    });

    return () => {
      trigger.kill();
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <div className="code-two-section">
      <section className="one"><h1>Section 1</h1></section>
      <section className="two"><h1>Section 2</h1></section>
      <section className="three"><h1>Section 3</h1></section>
      <footer>
        <div className="footer-container">
          <div id="footer-canvas" />
          <div className="footer-content">
            <div className="footer-row">
              <div className="footer-col"><h2>Restoring meaning to the things we build</h2></div>
              <div className="footer-col">
                <div className="footer-sub-col"><h3>Work resumes</h3><h3>2026</h3></div>
                <div className="footer-sub-col">
                  <a href="#">Write to me</a>
                  <a href="#">Professional orbit</a>
                  <a href="#">Loose thoughts</a>
                  <a href="#">Long form</a>
                </div>
              </div>
            </div>
            <div className="footer-row"><p>Experiment 518</p></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
