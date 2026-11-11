"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const RocketCanvas = dynamic(
  () => import("./rocket-canvas").then((module) => module.RocketCanvas),
  {
    ssr: false,
    loading: () => null,
  },
);

type Challenge = {
  title: string;
  body: string;
  cost: string;
  category: string;
};

type MotionPreference = "checking" | "reduced" | "motion";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const preference = window.matchMedia(REDUCED_MOTION_QUERY);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function getMotionPreference(): MotionPreference {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches ? "reduced" : "motion";
}

function getServerMotionPreference(): MotionPreference {
  return "checking";
}

const EXPLOSION_DURATION = 950;
const MIN_PARKED_INTERVAL = 4000;
const MAX_PARKED_INTERVAL = 7000;
const ACTIVATION_WINDOW = 2000;

export function RocketStage({ cards }: { cards: readonly Challenge[] }) {
  const motionPreference = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  );
  const [targetIndex, setTargetIndex] = useState(0);
  const [flightId, setFlightId] = useState(1);
  const [directFlight, setDirectFlight] = useState(false);
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [staticSelection, setStaticSelection] = useState<number | null>(null);
  const [tourPaused, setTourPaused] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [explosionId, setExplosionId] = useState(0);
  const [rendererFailed, setRendererFailed] = useState(false);
  const [status, setStatus] = useState("Preparing the rocket tour.");

  const stageRef = useRef<HTMLDivElement>(null);
  const latestFlight = useRef({ targetIndex, flightId });
  const launchRef = useRef<(index: number, direct?: boolean) => void>((index, direct = true) => {
    setTargetIndex(index);
    setLandedIndex(null);
    setSelectedIndex(index);
    setStaticSelection(null);
    setDirectFlight(direct);
    setFlightId((current) => current + 1);
    setStatus(`Rocket en route to ${cards[index].title}.`);
  });
  const activationTimes = useRef<number[]>([]);
  const explosionTimeout = useRef<number | null>(null);
  const explosionRestoreTarget = useRef(0);
  const [stageVisible, setStageVisible] = useState(false);

  const settings = useRef({ motionPreference, rendererFailed });

  useEffect(() => {
    latestFlight.current = { targetIndex, flightId };
    settings.current = { motionPreference, rendererFailed };
  }, [flightId, motionPreference, rendererFailed, targetIndex]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setStageVisible(entry.isIntersecting);
      }
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      landedIndex === null ||
      tourPaused ||
      exploding ||
      !stageVisible ||
      motionPreference !== "motion"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      launchRef.current(Math.floor(Math.random() * cards.length), false);
    }, MIN_PARKED_INTERVAL + Math.random() * (MAX_PARKED_INTERVAL - MIN_PARKED_INTERVAL));

    return () => window.clearTimeout(timer);
  }, [cards, exploding, landedIndex, motionPreference, stageVisible, tourPaused]);

  useEffect(() => {
    return () => {
      if (explosionTimeout.current !== null) {
        window.clearTimeout(explosionTimeout.current);
      }
    };
  }, []);

  function recordActivation(index: number) {
    if (exploding && motionPreference !== "reduced") {
      explosionRestoreTarget.current = index;
      return;
    }
    if (exploding && explosionTimeout.current !== null) {
      window.clearTimeout(explosionTimeout.current);
      explosionTimeout.current = null;
      setExploding(false);
    }

    const now = performance.now();
    activationTimes.current = activationTimes.current.filter(
      (time) => now - time <= ACTIVATION_WINDOW,
    );
    activationTimes.current.push(now);

    if (activationTimes.current.length >= 3) {
      activationTimes.current = [];
      explosionRestoreTarget.current = index;
      setLandedIndex(null);
      setSelectedIndex(motionPreference === "reduced" ? index : null);
      setStaticSelection(motionPreference === "reduced" ? index : null);
      setExploding(true);
      setExplosionId((current) => current + 1);
      setStatus(
        motionPreference === "reduced"
          ? "Static rocket burst. Selection will restore shortly."
          : "Rocket burst! The automatic tour will restore shortly.",
      );

      if (explosionTimeout.current !== null) {
        window.clearTimeout(explosionTimeout.current);
      }
      explosionTimeout.current = window.setTimeout(() => {
        setExploding(false);
        const nextIndex = explosionRestoreTarget.current;
        const currentSettings = settings.current;
        if (
          currentSettings.motionPreference === "motion" &&
          !currentSettings.rendererFailed
        ) {
          launchRef.current(nextIndex);
          return;
        }
        if (currentSettings.motionPreference === "reduced" || currentSettings.rendererFailed) {
          setTargetIndex(nextIndex);
          setSelectedIndex(nextIndex);
          setStaticSelection(nextIndex);
          setStatus(`Static selection set to ${cards[nextIndex].title}.`);
          return;
        }
        setStatus("Rocket tour restored and paused. Resume the tour to continue.");
      }, EXPLOSION_DURATION);
      return;
    }

    if (motionPreference === "reduced" || rendererFailed) {
      setTargetIndex(index);
      setSelectedIndex(index);
      setStaticSelection(index);
      setStatus(`Static selection set to ${cards[index].title}.`);
      return;
    }

    launchRef.current(index);
  }

  function handleLanding(index: number, completedFlightId: number) {
    if (completedFlightId !== latestFlight.current.flightId) {
      return;
    }
    setLandedIndex(index);
    setSelectedIndex(index);
    setStatus(`Rocket landed on ${cards[index].title}.`);
  }

  function launchNext() {
    recordActivation(Math.floor(Math.random() * cards.length));
  }

  let statusMessage = status;
  if (rendererFailed) {
    statusMessage = "3D rocket unavailable. Choose a challenge for a static selection.";
  } else if (motionPreference === "reduced") {
    const reducedSelection = staticSelection ?? selectedIndex;
    statusMessage = exploding
      ? "Static rocket burst. Selection will restore shortly."
      : reducedSelection === null
        ? "Reduced motion is on. Choose a challenge for a static selection."
        : `Static selection: ${cards[reducedSelection].title}.`;
  }

  return (
    <div ref={stageRef} className="mt-8 tall:lg:mt-12">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-rocket-launch-button
          onClick={launchNext}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-800 px-4 text-sm font-semibold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        >
          Launch rocket
        </button>
        <button
          type="button"
          disabled={motionPreference === "reduced"}
          onClick={() => setTourPaused((paused) => !paused)}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {motionPreference === "reduced"
            ? "Automatic tour off"
            : tourPaused
              ? "Resume rocket tour"
              : "Pause rocket tour"}
        </button>
        <p role="status" aria-live="polite" className="min-h-5 text-xs leading-5 text-zinc-600">
          {statusMessage}
        </p>
      </div>

      <div className="relative">
        <ul className="grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => {
            const headingId = `screen-two-challenge-${index + 1}-heading`;
            const categoryId = `screen-two-challenge-${index + 1}-category`;
            const bodyId = `screen-two-challenge-${index + 1}-body`;
            const isSelected =
              motionPreference === "reduced"
                ? (staticSelection ?? selectedIndex) === index
                : rendererFailed
                  ? (staticSelection ?? selectedIndex) === index
                  : selectedIndex === index;

            return (
              <li
                key={card.title}
                data-landed={isSelected}
                className="screen-two-card relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-labelledby={headingId}
                  aria-describedby={`${categoryId} ${bodyId}`}
                  onClick={() => recordActivation(index)}
                  className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                />
                <div className="screen-two-card-copy flex flex-1 flex-col">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-sm font-medium tabular-nums text-blue-800">
                      0{index + 1}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-zinc-200" />
                  </div>
                  <h3
                    id={headingId}
                    className="mt-5 flex min-h-10 items-center justify-between gap-3 text-lg font-semibold tracking-tight text-zinc-900"
                  >
                    <span>{card.title}</span>
                    <span
                      data-rocket-target={index}
                      aria-hidden="true"
                      className="screen-two-card-target"
                    />
                  </h3>
                  <p id={categoryId} className="mt-1 text-xs font-medium text-blue-800">
                    {card.category}
                  </p>
                  <p id={bodyId} className="mt-4 flex-1 text-sm leading-6 text-zinc-600">
                    {card.body}
                  </p>
                  <p className="mt-5 border-t border-zinc-200 pt-4 text-sm font-medium text-zinc-700">
                    {card.cost}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {motionPreference === "motion" && !rendererFailed && (
          <RocketCanvas
            targetIndex={targetIndex}
            flightId={flightId}
            directFlight={directFlight}
            explosionId={explosionId}
            exploding={exploding}
            onLand={handleLanding}
            onFailure={() => setRendererFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
