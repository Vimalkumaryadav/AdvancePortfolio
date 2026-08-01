import { useEffect, MouseEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother | undefined;

const BASE = import.meta.env.BASE_URL;

const Navbar = () => {
  useEffect(() => {
    const useSmoother = window.innerWidth > 1024 && ScrollTrigger.isTouch !== 1;

    if (useSmoother) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.7,
        speed: 1.7,
        effects: true,
        autoResize: true,
        ignoreMobileResize: true,
      });
      smoother.scrollTop(0);
      smoother.paused(true);
    } else {
      // Native mobile scroll — ScrollSmoother causes empty gaps / broken layout
      smoother = undefined;
      document.body.style.overflowY = "hidden";
    }

    const links = document.querySelectorAll(".header ul a");
    const onNavClick = (e: Event) => {
      if (window.innerWidth > 1024 && smoother) {
        e.preventDefault();
        const elem = e.currentTarget as HTMLAnchorElement;
        const section = elem.getAttribute("data-href");
        if (section) smoother.scrollTo(section, true, "top top");
      }
    };
    links.forEach((elem) => elem.addEventListener("click", onNavClick));

    const onResize = () => {
      if (smoother) ScrollSmoother.refresh(true);
    };
    window.addEventListener("resize", onResize);

    return () => {
      links.forEach((elem) => elem.removeEventListener("click", onNavClick));
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.innerWidth > 1024 && smoother) {
      smoother.scrollTo(0, true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="header">
        <a
          href={BASE}
          className="navbar-title"
          data-cursor="disable"
          onClick={handleHomeClick}
        >
          VKY
        </a>
        <a
          href="mailto:yadavvimalk@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          yadavvimalk@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
