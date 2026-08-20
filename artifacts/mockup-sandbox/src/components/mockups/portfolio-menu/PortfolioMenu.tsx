import { useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

import "./styles.css";
import { FloatingVideosFooter } from "./FloatingVideosFooter";
import { WorkShowcase } from "./WorkShowcase";

gsap.registerPlugin(SplitText);

export function PortfolioMenu() {
  useEffect(() => {
    const menu = document.querySelector(".menu");
    const menuBg = document.querySelector(".menu-bg");
    const menuItems = document.querySelectorAll(".menu-item");
    const navToggler = document.querySelector(".nav-toggler");

    if (!menu || !menuBg || !navToggler) return;

    const items = [...menuItems].map((item) => {
      const index = item.querySelector(".item-index");
      const label = item.querySelector(".item-label");
      const divider = item.querySelector(".item-divider");

      if (!index || !label || !divider) {
        throw new Error("Portfolio menu item is missing required markup.");
      }

      const chars = new SplitText(label, { type: "chars", mask: "chars" }).chars;
      const [firstChar, ...trailingChars] = chars;

      const trailingCharBox = document.createElement("span");
      trailingCharBox.className = "item-body";
      trailingChars.forEach((char) => trailingCharBox.appendChild(char.parentElement!));
      label.after(trailingCharBox);

      const indexWord = new SplitText(index, { type: "words", mask: "words" }).words;

      gsap.set([indexWord, firstChar], { yPercent: 100 });
      gsap.set(trailingChars, { xPercent: 125 });
      gsap.set(trailingCharBox, { width: 0 });

      return { indexWord, firstChar, trailingChars, trailingCharBox, divider };
    });

    function flickerTextTo(element: Element, text: string) {
      const target = element as HTMLElement & { flickerSplit?: SplitText };
      target.flickerSplit?.revert();
      target.textContent = text;
      target.flickerSplit = new SplitText(target, { type: "chars" });
      gsap.fromTo(
        target.flickerSplit.chars,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.05,
          ease: "power2.inOut",
          overwrite: true,
          stagger: { amount: 0.3, from: "random" },
        },
      );
    }

    const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    let isMenuOpen = false;

    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      menu.classList.toggle("is-menu-open", isMenuOpen);
      isMenuOpen ? timeline.play() : timeline.reverse();
      flickerTextTo(navToggler, isMenuOpen ? "Close" : "Menu");
    };

    navToggler.addEventListener("click", toggleMenu);

    timeline.to(menuBg, { opacity: 1, duration: 0.75 }, 0);

    items.forEach(({ indexWord, firstChar, trailingChars, trailingCharBox, divider }, i) => {
      const startTime = 0.5 + i * 0.15;

      timeline
        .to([indexWord, firstChar], { yPercent: 0, duration: 0.75 }, startTime)
        .to(divider, { scaleY: 1, duration: 1, ease: "power3.out" }, startTime + 0.05)
        .to(
          trailingCharBox,
          {
            width: trailingCharBox.scrollWidth,
            duration: 1,
            ease: "power4.inOut",
          },
          startTime + 0.25,
        )
        .to(trailingChars, { xPercent: 0, duration: 0.75, stagger: 0.05 }, startTime + 0.5);
    });

    return () => {
      navToggler.removeEventListener("click", toggleMenu);
      timeline.kill();
      menuItems.forEach((item) => {
        item.querySelector(".item-label")?.querySelectorAll(".char").forEach((char) => {
          char.replaceWith(char.textContent ?? "");
        });
        item.querySelector(".item-body")?.remove();
      });
    };
  }, []);

  return (
    <>
      <nav>
        <div className="nav-logo">
          <a href="/">Obscura</a>
        </div>
        <button className="nav-toggler" type="button">Menu</button>
      </nav>

      <nav className="menu" aria-label="Primary navigation">
        <div className="menu-bg" />
        <a className="menu-item" href="/work">
          <span className="item-index">01</span>
          <span className="item-label">Work</span>
          <span className="item-divider" />
        </a>
        <a className="menu-item sans" href="/portfolio">
          <span className="item-index">02</span>
          <span className="item-label">Portfolio</span>
          <span className="item-divider" />
        </a>
        <a className="menu-item sans" href="/retrospective">
          <span className="item-index">03</span>
          <span className="item-label">Retrospective</span>
          <span className="item-divider" />
        </a>
        <a className="menu-item" href="/lens">
          <span className="item-index">04</span>
          <span className="item-label">Lens</span>
          <span className="item-divider" />
        </a>
        <a className="menu-item" href="/selected">
          <span className="item-index">05</span>
          <span className="item-label">Selected</span>
          <span className="item-divider" />
        </a>
        <a className="menu-item sans" href="/enquire">
          <span className="item-index">06</span>
          <span className="item-label">Enquire</span>
          <span className="item-divider" />
        </a>
      </nav>

      <section className="hero" aria-label="Portfolio hero" />
      <WorkShowcase />
      <section className="portfolio-placeholder" aria-label="About placeholder">
        <span>02</span>
        <h2>About</h2>
        <p>Next component placeholder</p>
      </section>
      <section className="portfolio-placeholder" aria-label="Archive placeholder">
        <span>03</span>
        <h2>Archive</h2>
        <p>Next component placeholder</p>
      </section>
      <section className="portfolio-placeholder" aria-label="Contact placeholder">
        <span>04</span>
        <h2>Start a project</h2>
        <p>Next component placeholder</p>
      </section>
      <FloatingVideosFooter />
    </>
  );
}

export default PortfolioMenu;