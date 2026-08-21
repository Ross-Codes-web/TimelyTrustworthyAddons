import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

import "./voyeur-verite-scroll.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const asset = (name: string) => `/__mockup/images/attached-178/${name}`;

export function VoyeurVeriteScroll() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".voyeur-verite-scroll");
    if (!root) return;

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const outroHeader = root.querySelector(".hero-outro-header h3");
    const fgContent = root.querySelector(".hero-fg-content");
    const fgOverlayDark = root.querySelector(".hero-fg-overlay-dark");
    const fgOverlayAccent = root.querySelector(".hero-fg-overlay");
    const bgCopies = root.querySelectorAll(".hero-bg-content-copy");
    const outroImages = root.querySelectorAll(".hero-outro-img");

    if (!outroHeader || !fgContent || !fgOverlayDark || !fgOverlayAccent || bgCopies.length < 2 || outroImages.length < 2) {
      lenis.destroy();
      gsap.ticker.remove(raf);
      return;
    }

    const outroHeaderSplit = SplitText.create(outroHeader, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });
    gsap.set(outroHeaderSplit.lines, { y: "100%" });

    let areOutroLinesRevealed = false;
    const trigger = ScrollTrigger.create({
      trigger: root.querySelector(".hero"),
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        const phase1Progress = gsap.utils.clamp(0, 1, scrollProgress / 0.25);
        const slitLeftEdge = gsap.utils.interpolate(0, 48, phase1Progress);
        const slitRightEdge = gsap.utils.interpolate(100, 52, phase1Progress);

        gsap.set(fgContent, {
          clipPath: `polygon(${slitLeftEdge}% 0%, ${slitRightEdge}% 0%, ${slitRightEdge}% 100%, ${slitLeftEdge}% 100%)`,
        });
        gsap.set(fgOverlayDark, { opacity: gsap.utils.interpolate(0, 1, phase1Progress) });

        const phase2Progress = gsap.utils.clamp(0, 1, (scrollProgress - 0.25) / 0.2);
        gsap.set(fgContent, { rotate: gsap.utils.interpolate(0, 65, phase2Progress) });

        const phase3Progress = gsap.utils.clamp(0, 1, (scrollProgress - 0.45) / 0.2);
        gsap.set(fgContent, { scale: gsap.utils.interpolate(1, 0, phase3Progress) });
        gsap.set(bgCopies[0], { x: `${gsap.utils.interpolate(0, 100, phase3Progress)}%` });
        gsap.set(bgCopies[1], { x: `${gsap.utils.interpolate(0, -100, phase3Progress)}%` });
        gsap.set(fgOverlayAccent, {
          opacity: gsap.utils.interpolate(0, 1, gsap.utils.clamp(0, 1, (scrollProgress - 0.45) / 0.05)),
        });

        const phase4Progress = gsap.utils.clamp(0, 1, (scrollProgress - 0.65) / 0.2);
        gsap.set(outroImages[0], {
          clipPath: `polygon(0% 0%, 100% 0%, 100% ${gsap.utils.interpolate(0, 100, phase4Progress)}%, 0% ${gsap.utils.interpolate(0, 100, phase4Progress)}%)`,
        });
        const bottomImgTopEdge = gsap.utils.interpolate(100, 0, phase4Progress);
        gsap.set(outroImages[1], {
          clipPath: `polygon(0% ${bottomImgTopEdge}%, 100% ${bottomImgTopEdge}%, 100% 100%, 0% 100%)`,
        });

        if (scrollProgress >= 0.9 && !areOutroLinesRevealed) {
          areOutroLinesRevealed = true;
          gsap.to(outroHeaderSplit.lines, { y: "0%", duration: 0.75, stagger: 0.1, ease: "power3.out" });
        } else if (scrollProgress < 0.9 && areOutroLinesRevealed) {
          areOutroLinesRevealed = false;
          gsap.to(outroHeaderSplit.lines, { y: "100%", duration: 0.25, stagger: -0.05, ease: "power3.out" });
        }
      },
    });

    return () => {
      trigger.kill();
      outroHeaderSplit.revert();
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <section className="voyeur-verite-scroll">
      <section className="hero">
        <div className="hero-fg-content">
          <div className="hero-fg-img"><img src={asset("hero.jpg")} alt="" /></div>
          <div className="hero-fg-header"><h1>Silhouettes against the burning dark</h1></div>
          <div className="hero-fg-overlay-dark" />
          <div className="hero-fg-overlay" />
        </div>
        <div className="hero-bg-content">
          <div className="hero-bg-content-col"><div className="hero-bg-content-copy"><h3>Motion</h3><p>Bodies drawn through engineered light and open dark. Every frame caught between the signal and the shadow that it quietly leaves behind.</p></div></div>
          <div className="hero-bg-content-col"><div className="hero-bg-content-copy"><h3>Silence</h3><p>Stillness measured in reflected color and slow heat. Where the moving crowd dissolves and only the burning outline holds against the night.</p></div></div>
        </div>
        <div className="hero-outro-content">
          <div className="hero-outro-img"><img src={asset("hero-outro-img-1.jpg")} alt="" /></div>
          <div className="hero-outro-img"><img src={asset("hero-outro-img-2.jpg")} alt="" /></div>
          <div className="hero-outro-header"><h3>You become the shape that the light finally learns to find.</h3></div>
        </div>
      </section>
      <section className="about"><h3>A studio built for image, motion, and the quiet glow that keeps burning after.</h3></section>
    </section>
  );
}
