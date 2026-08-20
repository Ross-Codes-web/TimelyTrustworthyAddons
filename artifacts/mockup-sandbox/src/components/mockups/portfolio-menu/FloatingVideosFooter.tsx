import { useEffect } from "react";
import gsap from "gsap";

import "./floating-videos-footer.css";

const asset = (name: string) => `/__mockup/images/floating-videos/${name}`;

export function FloatingVideosFooter() {
  useEffect(() => {
    const itemsArray: HTMLElement[] = [];
    const footer = document.querySelector<HTMLElement>(".floating-videos-footer");
    const cursor = footer?.querySelector<HTMLElement>(".cursor");
    const itemsContainer = footer?.querySelector<HTMLElement>(".items-container");

    if (!footer || !cursor || !itemsContainer) return;

    const onMouseMove = (event: MouseEvent) => {
      gsap.to(cursor, {
        x: event.clientX - cursor.offsetWidth / 2,
        y: event.clientY - cursor.offsetHeight / 2,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const onClick = (event: MouseEvent) => {
      const clickSound = new Audio(asset("click-sfx.mp3"));
      void clickSound.play().catch(() => undefined);

      const itemType = Math.random() < 0.5 ? "video" : "image";
      const container = document.createElement("div");
      const elementWidth = 700;

      if (itemType === "video") {
        const videoNumber = Math.floor(Math.random() * 7) + 1;
        container.innerHTML = `<div class="video-container">
                                  <video autoplay loop muted playsinline>
                                    <source src="${asset(`vid-${videoNumber}.mp4`)}" type="video/mp4"/>
                                  </video>
                                </div>`;
      } else {
        const imgNumber = Math.floor(Math.random() * 6) + 1;
        container.innerHTML = `<div class="img-container">
                                  <img src="${asset(`img-${imgNumber}.jpg`)}" alt="" />
                                </div>`;
      }

      const appendedElement = container.firstElementChild;
      if (!appendedElement) return;

      itemsContainer.appendChild(appendedElement);
      itemsArray.push(appendedElement as HTMLElement);

      const element = appendedElement as HTMLElement;
      element.style.left = `${event.clientX - elementWidth / 2}px`;
      element.style.top = `${event.clientY}px`;
      const randomRotation = Math.random() * 10 - 5;

      gsap.set(element, {
        scale: 0,
        rotation: randomRotation,
        transformOrigin: "center",
      });

      const timeline = gsap.timeline();
      const randomScale = Math.random() * 0.5 + 0.5;

      timeline.to(element, {
        scale: randomScale,
        duration: 0.5,
        delay: 0.1,
      });

      timeline.to(
        element,
        {
          y: () => "-=500",
          opacity: 1,
          duration: 4,
          ease: "none",
        },
        "<",
      ).to(
        element,
        {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            element.parentNode?.removeChild(element);
            const index = itemsArray.indexOf(element);
            if (index > -1) itemsArray.splice(index, 1);
          },
        },
        "-=0.5",
      );
    };

    document.addEventListener("mousemove", onMouseMove);
    footer.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      footer.removeEventListener("click", onClick);
      itemsArray.forEach((item) => item.remove());
      gsap.killTweensOf(cursor);
    };
  }, []);

  return (
    <footer className="floating-videos-footer">
      <div className="items-container" />

      <div className="cursor" aria-hidden="true">
        <img src={asset("cursor.png")} alt="" />
      </div>

      <div className="floating-videos-wrapper">
        <nav>
          <div className="nav-item">
            <p>
              Knowing by Building <br />
              ShieldInferno
            </p>
          </div>
          <div className="nav-item">
            <p>
              Digital &amp; Brand Design <br />
              Photography &amp; Film Production
            </p>
            <p>
              Founded in 2020 <br />
              Brooklyn, NY
            </p>
          </div>
        </nav>
        <div className="header">
          <h1>ShieldInferno</h1>
        </div>
      </div>
    </footer>
  );
}
