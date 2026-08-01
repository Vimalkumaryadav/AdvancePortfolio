import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const LOAD_TIMEOUT_MS = 5000;

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!canvasDiv.current) return;

    let disposed = false;
    let loadTimeout: ReturnType<typeof setTimeout> | undefined;
    let debounce: ReturnType<typeof setTimeout> | undefined;
    let renderer: THREE.WebGLRenderer | null = null;
    let progress: ReturnType<typeof setProgress> | null = null;
    let animationFrameId = 0;
    let characterObj: THREE.Object3D | null = null;

    const unlock = () => {
      if (disposed) return;
      progress?.clear();
    };

    const rect = canvasDiv.current.getBoundingClientRect();
    const container = {
      width: Math.max(rect.width, 1),
      height: Math.max(rect.height, 1),
    };
    const aspect = container.width / container.height || 1;
    const scene = sceneRef.current;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
    } catch (err) {
      console.error("WebGL unavailable, skipping character:", err);
      progress = setProgress((value) => setLoading(value));
      unlock();
      return () => {
        disposed = true;
        progress?.destroy?.();
      };
    }

    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | undefined;

    const clock = new THREE.Clock();

    const light = setLighting(scene);
    progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadTimeout = setTimeout(() => {
      console.warn("Character load timed out, unlocking page");
      unlock();
    }, LOAD_TIMEOUT_MS);

    loadCharacter()
      .then((gltf) => {
        if (disposed) return;
        clearTimeout(loadTimeout);
        if (!gltf) {
          unlock();
          return;
        }
        const animations = setAnimations(gltf);
        hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        characterObj = gltf.scene;
        scene.add(characterObj);
        headBone = characterObj.getObjectByName("spine006") || null;
        screenLight = characterObj.getObjectByName("screenlight") || null;
        progress?.loaded().then(() => {
          if (disposed) return;
          // Start intro quickly — don't hold the hero dark for 2.5s
          setTimeout(() => {
            if (disposed) return;
            light.turnOnLights();
            animations.startIntro();
          }, 350);
        });
        window.addEventListener("resize", onResize);
      })
      .catch((err) => {
        console.error("Character failed to load:", err);
        clearTimeout(loadTimeout);
        unlock();
      });

    let mouse = { x: 0, y: 0 },
      interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    const onResize = () => {
      if (renderer && characterObj) {
        handleResize(renderer, camera, canvasDiv, characterObj);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer?.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      clearTimeout(loadTimeout);
      clearTimeout(debounce);
      cancelAnimationFrame(animationFrameId);
      progress?.destroy?.();
      scene.clear();
      renderer?.dispose();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      if (canvasDiv.current && renderer?.domElement) {
        try {
          canvasDiv.current.removeChild(renderer.domElement);
        } catch {
          /* already removed */
        }
      }
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, [setLoading]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
