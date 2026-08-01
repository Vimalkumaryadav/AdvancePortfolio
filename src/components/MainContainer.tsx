import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import { useLoading } from "../context/LoadingProvider";
import { setAllTimeline } from "./utils/GsapScroll";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    () => window.innerWidth > 1024
  );
  const { setLoading, isLoading } = useLoading();

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // Mobile: no 3D character — unlock loading quickly
  useEffect(() => {
    if (isDesktopView || !isLoading) return;

    let percent = 0;
    const interval = setInterval(() => {
      percent = Math.min(100, percent + 20);
      setLoading(percent);
      if (percent >= 100) {
        clearInterval(interval);
        try {
          setAllTimeline();
        } catch (err) {
          console.error("setAllTimeline failed:", err);
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isDesktopView, isLoading, setLoading]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing />
            <About />
            <WhatIDo />
            <Career />
            <Work />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
