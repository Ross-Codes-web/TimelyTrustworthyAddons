import { useEffect } from "react";
import gsap from "gsap";

import "./work-showcase.css";

export function WorkShowcase() {
  useEffect(() => {
    const projects = gsap.utils.toArray<HTMLElement>(".work-showcase .project");
    const thumbnails = gsap.utils.toArray<HTMLElement>(".work-showcase .thumbnail");
    const projectThumbnail = document.querySelector<HTMLElement>(
      ".work-showcase .project-thumbnail",
    );
    const projectsContainer = document.querySelector<HTMLElement>(
      ".work-showcase .projects",
    );

    if (!projectThumbnail || !projectsContainer) return;

    gsap.set(projectThumbnail, { scale: 0, xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(projectThumbnail, "x", {
      duration: 0.4,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(projectThumbnail, "y", {
      duration: 0.4,
      ease: "power3.out",
    });

    const onMouseMove = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const onMouseLeave = () => {
      gsap.to(projectThumbnail, {
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    projectsContainer.addEventListener("mousemove", onMouseMove);
    projectsContainer.addEventListener("mouseleave", onMouseLeave);

    const cleanups = projects.map((project, index) => {
      const onMouseEnter = () => {
        gsap.to(projectThumbnail, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(thumbnails, {
          yPercent: -100 * index,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      project.addEventListener("mouseenter", onMouseEnter);
      return () => project.removeEventListener("mouseenter", onMouseEnter);
    });

    return () => {
      projectsContainer.removeEventListener("mousemove", onMouseMove);
      projectsContainer.removeEventListener("mouseleave", onMouseLeave);
      cleanups.forEach((cleanup) => cleanup());
      gsap.killTweensOf([projectThumbnail, ...thumbnails]);
    };
  }, []);

  return (
    <section className="work-showcase">
      <div className="index">
        <div className="index__container">
          <div className="projects">
            <div className="project">
              <h2>Mann Sales</h2>
              <p>Design &amp; Development</p>
            </div>
            <div className="project">
              <h2>Lab.</h2>
              <p>Project Type</p>
            </div>
            <div className="project">
              <h2>Fringe</h2>
              <p>Project Type</p>
            </div>
            <div className="project">
              <h2>Astro Club</h2>
              <p>Project Type</p>
            </div>
          </div>
          <div className="project-thumbnail">
            <div className="thumbnail">
              <img
                src="https://i.pinimg.com/1200x/6d/47/22/6d4722b27a1acccd09b1add01c905ff3.jpg"
                alt=""
              />
            </div>
            <div className="thumbnail">
              <img
                src="https://i.pinimg.com/736x/8f/39/c4/8f39c40449d2f512763fff45719b20e3.jpg"
                alt=""
              />
            </div>
            <div className="thumbnail">
              <img
                src="https://i.pinimg.com/736x/89/c5/b3/89c5b3925874afdd643fbe67a487813d.jpg"
                alt=""
              />
            </div>
            <div className="thumbnail">
              <img
                src="https://i.pinimg.com/736x/9a/cd/c5/9acdc5e6672acb43c4648a0d2fce3a52.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
