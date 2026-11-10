"use client";

import { useEffect, useRef } from "react";

const VIDEO_PROPS = {
  src: "/hero-video.mp4",
  autoPlay: true,
  muted: true,
  loop: true,
  playsInline: true,
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  preload: "auto",
  "aria-hidden": true,
  tabIndex: -1,
} as const;

/**
 * The full 16:9 frame is shown uncropped (sized to fit the hero, anchored right), with a
 * blurred copy of the same video filling the remaining space behind the text.
 * Both layers react to the --px / --py pointer variables from HeroStage.
 */
export function HeroVideo() {
  const backdropRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videos = [backdropRef.current, frameRef.current].filter(
      (video): video is HTMLVideoElement => video !== null,
    );

    // React doesn't reliably reflect `muted` as an attribute, so enforce it on the element.
    for (const video of videos) {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
    }

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPreference = () => {
      for (const video of videos) {
        if (preference.matches) {
          video.pause();
        } else {
          void video.play().catch(() => {
            // Autoplay blocked: the gradient backdrop behind the video remains visible.
          });
        }
      }
    };

    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => {
      preference.removeEventListener("change", syncPreference);
      for (const video of videos) video.pause();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden @container-size">
      <video
        ref={backdropRef}
        {...VIDEO_PROPS}
        className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-2xl [translate:calc(var(--px,0)*-24px)_calc(var(--py,0)*-16px)]"
      />
      <video
        ref={frameRef}
        {...VIDEO_PROPS}
        className="pointer-events-none absolute right-0 top-3/5 aspect-video w-[min(100cqw,calc(120cqh*16/8))] -translate-y-1/2 object-cover will-change-transform origin-right mask-[linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] md:mask-[linear-gradient(to_right,transparent,#000_14%)] transform-[perspective(1600px)_rotateY(calc(var(--px,0)*2deg))_rotateX(calc(var(--py,0)*-1.5deg))_scale(0.965)]"
      />
    </div>
  );
}
