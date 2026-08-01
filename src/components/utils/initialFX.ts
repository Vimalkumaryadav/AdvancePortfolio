import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  try {
    smoother?.paused(false);
  } catch (err) {
    console.error("ScrollSmoother unlock failed:", err);
  }
  document.getElementsByTagName("main")[0]?.classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const isMobile = window.innerWidth <= 1024;

  // Mobile: simple fade only — SplitText/LoopText stacks & hides role words
  if (isMobile) {
    gsap.fromTo(
      [
        ".landing-info h3",
        ".landing-intro h2",
        ".landing-intro h1",
        ".landing-info-h2",
        ".landing-h2-1",
        ".landing-h2-info",
      ],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.04,
        delay: 0.15,
      }
    );
    return;
  }

  try {
    var landingText = new SplitText(
      [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
      {
        type: "chars,lines",
        linesClass: "split-line",
      }
    );
    gsap.fromTo(
      landingText.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    );

    let TextProps = { type: "chars,lines", linesClass: "split-h2" };

    var landingText2 = new SplitText(".landing-h2-info", TextProps);
    gsap.fromTo(
      landingText2.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    );

    gsap.fromTo(
      ".landing-info-h2",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        y: 0,
        delay: 0.8,
      }
    );

    var landingText3 = new SplitText(".landing-h2-info-1", TextProps);
    var landingText4 = new SplitText(".landing-h2-1", TextProps);
    var landingText5 = new SplitText(".landing-h2-2", TextProps);

    LoopText(landingText2, landingText3);
    LoopText(landingText4, landingText5);
  } catch (err) {
    console.error("SplitText intro failed, using simple fade:", err);
    gsap.fromTo(
      [
        ".landing-info h3",
        ".landing-intro h2",
        ".landing-intro h1",
        ".landing-info-h2",
        ".landing-h2-info",
        ".landing-h2-info-1",
        ".landing-h2-1",
        ".landing-h2-2",
      ],
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.05,
        delay: 0.2,
      }
    );
  }
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
