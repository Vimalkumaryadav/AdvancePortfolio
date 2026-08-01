import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (percent < 100 || loaded) return;
    // Short exit animation — keep total loader under a few seconds
    const t1 = setTimeout(() => {
      setLoaded(true);
      setTimeout(() => setIsLoaded(true), 280);
    }, 180);
    return () => clearTimeout(t1);
  }, [percent, loaded]);

  // Hard cap: never keep the loader longer than ~5s from mount
  useEffect(() => {
    const failsafe = setTimeout(() => {
      setLoaded(true);
      setIsLoaded(true);
    }, 4500);
    return () => clearTimeout(failsafe);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    import("./utils/initialFX")
      .then((module) => {
        if (cancelled) return;
        setClicked(true);
        setTimeout(() => {
          try {
            module.initialFX?.();
          } catch (err) {
            console.error("initialFX failed, unlocking page anyway:", err);
            document.body.style.overflowY = "auto";
            document.getElementsByTagName("main")[0]?.classList.add("main-active");
          }
          setIsLoading(false);
        }, 220);
      })
      .catch((err) => {
        console.error("Failed to load initialFX:", err);
        setClicked(true);
        document.body.style.overflowY = "auto";
        document.getElementsByTagName("main")[0]?.classList.add("main-active");
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a
          href={import.meta.env.BASE_URL}
          className="loader-title"
          data-cursor="disable"
          onClick={(e) => e.preventDefault()}
        >
          VKY
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee>
            <span> Sr. QA Automation engineer</span> <span>QA Engineer</span>
            <span> Sr. QA Automation engineer</span> <span>QA Engineer</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent = 0;
  let done = false;
  let interval: ReturnType<typeof setInterval> | undefined;

  // Steady climb to ~90% in ~2s while assets load — no multi-second stalls
  interval = setInterval(() => {
    if (done) {
      if (interval) clearInterval(interval);
      return;
    }
    if (percent < 90) {
      percent = Math.min(90, percent + 4 + Math.round(Math.random() * 4));
      setLoading(percent);
    } else if (interval) {
      clearInterval(interval);
      interval = undefined;
    }
  }, 80);

  function destroy() {
    done = true;
    if (interval) clearInterval(interval);
  }

  function clear() {
    destroy();
    percent = 100;
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent = Math.min(100, percent + 8);
          setLoading(percent);
        } else {
          done = true;
          if (interval) clearInterval(interval);
          resolve(100);
        }
      }, 16);
    });
  }

  return { loaded, percent, clear, destroy };
};
