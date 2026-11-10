"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;

    const syncPreference = () => {
      if (preference.matches) {
        video.pause();
      } else {
        void video
          .play()
          .then(() => {
            if (!active) video.pause();
          })
          .catch((error: unknown) => {
            if (!active || (error instanceof DOMException && error.name === "AbortError")) return;
            setMessage("Video playback is unavailable. Use the playback controls to try again.");
          });
      };
    }

    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => {
      active = false;
      preference.removeEventListener("change", syncPreference);
      video.pause();
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        id="hero-video"
        src="/hero-video.mp4"
        width={1920}
        height={1080}
        muted
        loop
        playsInline
        controls
        preload="metadata"
        aria-label="Skybridge welcome video"
        className="block aspect-video w-full bg-background object-contain"
        onPlay={() => setMessage("")}
        onError={() => setMessage("The video could not load. Use the playback controls to try again.")}
      >
        Your browser does not support the video element.
      </video>
      {message && (
        <p
          role="status"
          className="mt-3 rounded-lg border border-(--hero-border) px-4 py-3 text-sm text-(--hero-muted)"
        >
          {message}
        </p>
      )}
    </>
  );
}
