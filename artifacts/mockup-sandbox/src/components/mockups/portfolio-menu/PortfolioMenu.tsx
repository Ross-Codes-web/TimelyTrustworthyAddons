import { useEffect, useState } from "react";

import "./styles.css";

type MenuItem = {
  index: string;
  label: string;
  detail: string;
  sans?: boolean;
};

const menuItems: MenuItem[] = [
  { index: "01", label: "Selected work", detail: "Case studies" },
  { index: "02", label: "About", detail: "The person behind it", sans: true },
  { index: "03", label: "Archive", detail: "A wider body of work", sans: true },
  { index: "04", label: "Field notes", detail: "Images and observations" },
  { index: "05", label: "Capabilities", detail: "What I bring to a brief" },
  { index: "06", label: "Start a project", detail: "Let’s make something", sans: true },
];

export function PortfolioMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleMenu = () => setIsOpen((open) => !open);

  return (
    <main className="portfolio-menu">
      <div className="pm-vignette" aria-hidden="true" />
      <div className="pm-grain" aria-hidden="true" />

      <nav className="pm-nav" aria-label="Primary">
        <button
          className="pm-logo"
          type="button"
          aria-label="Return to the portfolio home"
          onClick={() => setIsOpen(false)}
        >
          Obscura
          <span>Independent studio</span>
        </button>

        <button
          className="pm-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="portfolio-navigation"
          data-open={isOpen}
          onClick={toggleMenu}
        >
          <span>{isOpen ? "Close" : "Menu"}</span>
          <span className="pm-toggle-mark" aria-hidden="true" />
        </button>
      </nav>

      <section className="pm-hero-copy" aria-label="Portfolio introduction">
        <p>Designing identities, interfaces<br />and useful little worlds.</p>
        <p>New York · London<br />Available for select work / 2024—25</p>
      </section>

      <div
        id="portfolio-navigation"
        className="pm-menu"
        data-open={isOpen}
        aria-hidden={!isOpen}
      >
        <button
          className="pm-menu-bg"
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
        />

        {menuItems.map((item) => (
          <button
            className={`pm-menu-item${item.sans ? " is-sans" : ""}`}
            key={item.index}
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <span className="pm-index">{item.index}</span>
            <span className="pm-label">{item.label}</span>
            <span className="pm-divider" aria-hidden="true" />
            <span className="pm-trailing" aria-hidden="true">
              <span className="pm-trailing-text">{item.detail}</span>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}

export default PortfolioMenu;