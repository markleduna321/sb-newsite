"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type RocketCanvasProps = {
  targetIndex: number;
  flightId: number;
  directFlight: boolean;
  explosionId: number;
  exploding: boolean;
  onLand: (index: number, flightId: number) => void;
  onFailure: () => void;
};

type LandingCallback = (index: number, flightId: number) => void;

// Keep the remaining route attached to the last painted position after a reflow.
// The correction fades to zero, so the rebuilt route still ends at its new pad.
class RebasedFlightPath extends THREE.Curve<THREE.Vector2> {
  constructor(
    private readonly route: THREE.Curve<THREE.Vector2>,
    private readonly offset: number,
    private readonly correction: THREE.Vector2,
  ) {
    super();
  }

  getPoint(progress: number, target = new THREE.Vector2()): THREE.Vector2 {
    this.route.getPoint(this.offset + (1 - this.offset) * progress, target);
    return target.addScaledVector(this.correction, (1 - progress) ** 3);
  }
}

class RocketEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly stage: HTMLElement;
  private readonly launchButton: HTMLElement | null;
  private readonly colorProbe: CanvasRenderingContext2D;
  private readonly onLand: LandingCallback;
  private readonly onFailure: () => void;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(0, 1, 0, 1, 0.1, 500);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly rocket = new THREE.Group();
  private readonly flame = new THREE.Group();
  private readonly exhaust: THREE.Group;
  private readonly explosion = new THREE.Group();
  private width = 1;
  private height = 1;
  private current = new THREE.Vector2();
  private stageLeft = 0;
  private stageTop = 0;
  private parkedIndex: number | undefined;
  private flight:
    | {
        from: THREE.Vector2;
        to: THREE.Vector2;
        path: THREE.Curve<THREE.Vector2>;
        routeOffset: number;
        progress: number;
        startedAt: number;
        endsAt: number;
        index: number;
        id: number;
        direct: boolean;
      }
    | undefined;
  private explosionStartedAt: number | undefined;
  private frameId: number | undefined;
  private onscreen = true;
  private documentVisible = true;
  private suspendedAt: number | undefined;
  private disposed = false;
  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly visibilityHandler: () => void;
  private readonly contextLostHandler: (event: Event) => void;
  private targetCard: HTMLElement | null = null;
  private targetTransitionHandler: ((event: TransitionEvent) => void) | null = null;
  private targetRebaseTimeout: number | undefined;

  constructor(
    canvas: HTMLCanvasElement,
    stage: HTMLElement,
    onLand: LandingCallback,
    onFailure: () => void,
  ) {
    this.canvas = canvas;
    this.stage = stage;
    this.launchButton =
      stage.parentElement?.parentElement?.querySelector<HTMLElement>(
        "[data-rocket-launch-button]",
      ) ?? null;
    this.onLand = onLand;
    this.onFailure = onFailure;

    const colorProbe = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true });
    if (!colorProbe) {
      throw new Error("Canvas color parsing is unavailable.");
    }
    this.colorProbe = colorProbe;

    if (typeof ResizeObserver === "undefined" || typeof IntersectionObserver === "undefined") {
      throw new Error("Browser observers are unavailable.");
    }

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      throw new Error("WebGL is unavailable.");
    }

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.camera.position.z = 100;

    const ambient = new THREE.AmbientLight(this.readCssColor("--rocket-ambient-color"), 2.1);
    const keyLight = new THREE.DirectionalLight(
      this.readCssColor("--rocket-key-light-color"),
      2.8,
    );
    keyLight.position.set(-20, 40, 50);
    this.scene.add(ambient, keyLight);

    this.exhaust = this.buildRocket();
    this.buildExplosion();
    this.scene.add(this.rocket, this.explosion);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(stage);
    if (this.launchButton) {
      this.resizeObserver.observe(this.launchButton);
    }
    stage.parentElement?.querySelectorAll("li").forEach((card) => {
      this.resizeObserver.observe(card);
    });
    this.intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        this.onscreen = entry.isIntersecting;
        this.updateActivity();
      }
    });
    this.intersectionObserver.observe(stage);

    this.visibilityHandler = () => {
      this.documentVisible = document.visibilityState === "visible";
      this.updateActivity();
    };
    document.addEventListener("visibilitychange", this.visibilityHandler);

    this.contextLostHandler = (event) => {
      event.preventDefault();
      this.dispose();
      this.onFailure();
    };
    canvas.addEventListener("webglcontextlost", this.contextLostHandler);
    this.resize();
    if (this.disposed) {
      throw new Error("WebGL rendering is unavailable.");
    }
  }

  flyTo(index: number, id: number, direct: boolean) {
    this.parkedIndex = undefined;
    this.explosionStartedAt = undefined;
    this.explosion.visible = false;
    this.rocket.visible = true;
    this.exhaust.visible = true;
    this.exhaust.scale.y = 1;
    this.flame.visible = true;
    this.flame.scale.y = 1;
    const destination = this.targetPosition(index);
    const startedAt = this.suspendedAt ?? performance.now();
    this.flight = {
      from: this.current.clone(),
      to: destination,
      path: direct
        ? new THREE.LineCurve(this.current.clone(), destination.clone())
        : this.createFlightPath(this.current, index, destination),
      routeOffset: 0,
      progress: 0,
      startedAt,
      endsAt: startedAt + (direct ? 1650 : 2600),
      index,
      id,
      direct,
    };
    this.trackTargetTransform(index, id);
    this.updateActivity();
  }

  setExplosion() {
    this.clearTargetTracking();
    this.flight = undefined;
    this.rocket.visible = false;
    this.flame.visible = false;
    this.explosion.visible = true;
    this.explosion.position.copy(this.rocket.position);
    this.explosionStartedAt = performance.now();
    this.updateActivity();
  }

  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    if (this.frameId !== undefined) {
      cancelAnimationFrame(this.frameId);
      this.frameId = undefined;
    }
    this.clearTargetTracking();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", this.visibilityHandler);
    this.canvas.removeEventListener("webglcontextlost", this.contextLostHandler);
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    this.renderer.dispose();
  }

  private buildRocket(): THREE.Group {
    const shell = new THREE.MeshStandardMaterial({
      color: this.readCssColor("--rocket-shell-color"),
      metalness: 0.16,
      roughness: 0.22,
    });
    const nose = new THREE.MeshStandardMaterial({
      color: this.readCssColor("--rocket-nose-color"),
      metalness: 0.12,
      roughness: 0.2,
    });
    const trim = new THREE.MeshStandardMaterial({
      color: this.readCssColor("--rocket-trim-color"),
      metalness: 0.82,
      roughness: 0.2,
    });
    const portholeRim = new THREE.MeshStandardMaterial({
      color: this.readCssColor("--rocket-rim-color"),
      metalness: 0.9,
      roughness: 0.17,
    });
    const portholeGlass = new THREE.MeshStandardMaterial({
      color: this.readCssColor("--rocket-window-color"),
      metalness: 0.48,
      roughness: 0.12,
    });

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.17, 0.54, 24, 1, false),
      shell,
    );
    body.position.y = -0.01;
    const noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.36, 24), nose);
    noseCone.position.y = 0.37;

    const portholeRimMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.095, 20, 12),
      portholeRim,
    );
    portholeRimMesh.scale.set(0.82, 0.82, 0.28);
    portholeRimMesh.position.set(0, 0.08, 0.145);
    const porthole = new THREE.Mesh(
      new THREE.SphereGeometry(0.069, 20, 12),
      portholeGlass,
    );
    porthole.scale.set(0.86, 0.86, 0.3);
    porthole.position.set(0, 0.08, 0.17);

    const finShape = new THREE.Shape();
    finShape.moveTo(0.1, -0.18);
    finShape.lineTo(0.25, -0.3);
    finShape.lineTo(0.23, -0.49);
    finShape.lineTo(0.07, -0.39);
    finShape.lineTo(0.04, -0.26);
    finShape.closePath();
    const finGeometry = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.012,
    });
    const fins = [-1, 1].map((direction) => {
      const fin = new THREE.Mesh(finGeometry, nose);
      fin.scale.x = direction;
      fin.position.z = -0.045;
      return fin;
    });

    const thruster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.075, 0.16, 20, 1, false),
      trim,
    );
    thruster.position.y = -0.32;
    const tailRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.018, 8, 24),
      trim,
    );
    tailRing.rotation.x = Math.PI / 2;
    tailRing.position.y = -0.29;

    const exhaust = new THREE.Group();
    const puffMaterial = new THREE.MeshStandardMaterial({
      color: this.readCssColor("--rocket-puff-color"),
      emissive: this.readCssColor("--rocket-puff-emissive-color"),
      emissiveIntensity: 0.18,
      roughness: 0.42,
    });
    [
      { x: 0, y: -0.02, radius: 0.075 },
      { x: -0.055, y: -0.075, radius: 0.052 },
      { x: 0.055, y: -0.075, radius: 0.052 },
      { x: 0, y: -0.13, radius: 0.044 },
    ].forEach(({ x, y, radius }) => {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 12, 8),
        puffMaterial,
      );
      puff.position.set(x, y, 0.015);
      exhaust.add(puff);
    });
    exhaust.position.y = -0.42;
    exhaust.visible = false;

    const flameOuter = new THREE.Mesh(
      new THREE.ConeGeometry(0.135, 0.46, 16, 1, false),
      new THREE.MeshBasicMaterial({ color: this.readCssColor("--rocket-flame-color") }),
    );
    flameOuter.rotation.z = Math.PI;
    flameOuter.position.set(0, -0.52, 0.015);
    const flameCore = new THREE.Mesh(
      new THREE.ConeGeometry(0.072, 0.31, 14, 1, false),
      new THREE.MeshBasicMaterial({ color: this.readCssColor("--rocket-flame-core-color") }),
    );
    flameCore.rotation.z = Math.PI;
    flameCore.position.set(0, -0.49, 0.04);
    this.flame.add(flameOuter, flameCore);
    this.flame.visible = false;

    this.rocket.add(
      body,
      noseCone,
      portholeRimMesh,
      porthole,
      ...fins,
      thruster,
      tailRing,
      exhaust,
      this.flame,
    );
    return exhaust;
  }

  private readCssColor(variable: string): THREE.Color {
    const cssColor = getComputedStyle(this.canvas).getPropertyValue(variable).trim();
    if (!cssColor) {
      throw new Error(`Missing rocket color token: ${variable}`);
    }

    this.colorProbe.clearRect(0, 0, 1, 1);
    this.colorProbe.fillStyle = cssColor;
    this.colorProbe.fillRect(0, 0, 1, 1);
    const pixel = this.colorProbe.getImageData(0, 0, 1, 1).data;
    return new THREE.Color().setRGB(
      (pixel[0] ?? 0) / 255,
      (pixel[1] ?? 0) / 255,
      (pixel[2] ?? 0) / 255,
      THREE.SRGBColorSpace,
    );
  }

  private buildExplosion() {
    const colors = [
      "--rocket-burst-amber-color",
      "--rocket-burst-blue-color",
      "--rocket-burst-orange-color",
      "--rocket-puff-color",
    ] as const;
    colors.forEach((color, colorIndex) => {
      for (let particleIndex = 0; particleIndex < 5; particleIndex += 1) {
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(0.055 + (particleIndex % 2) * 0.025, 8, 6),
          new THREE.MeshBasicMaterial({ color: this.readCssColor(color) }),
        );
        const angle = (particleIndex / 5) * Math.PI * 2 + colorIndex * 0.18;
        const distance = 0.38 + colorIndex * 0.13;
        particle.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, 0);
        this.explosion.add(particle);
      }
    });
    this.explosion.scale.setScalar(28);
    this.explosion.visible = false;
  }

  private targetPosition(index: number) {
    const marker = this.stage.parentElement?.querySelector<HTMLElement>(
      `[data-rocket-target="${index}"]`,
    );
    const stageRect = this.stage.getBoundingClientRect();
    const markerRect = marker?.getBoundingClientRect();

    if (!markerRect) {
      return new THREE.Vector2(this.width / 2, this.height / 2);
    }
    return new THREE.Vector2(
      markerRect.left - stageRect.left + markerRect.width / 2,
      this.height -
        (markerRect.top - stageRect.top + markerRect.height / 2) +
        this.rocket.scale.y * 0.49,
    );
  }

  private trackTargetTransform(index: number, flightId: number) {
    this.clearTargetTracking();
    const marker = this.stage.parentElement?.querySelector<HTMLElement>(
      `[data-rocket-target="${index}"]`,
    );
    const card = marker?.closest<HTMLElement>("li");
    if (!card) {
      return;
    }

    const onTransformSettled = (event: TransitionEvent) => {
      if (event.target !== card || event.propertyName !== "transform") {
        return;
      }
      if (this.flight?.id !== flightId) {
        return;
      }
      if (event.type === "transitionend") {
        this.clearTargetTracking();
      }
      this.rebaseFlightTarget(index);
    };

    this.targetCard = card;
    this.targetTransitionHandler = onTransformSettled;
    card.addEventListener("transitionend", onTransformSettled);
    card.addEventListener("transitioncancel", onTransformSettled);
    // Cover a missing transition event (for example, if the transition is
    // skipped by the browser) without changing the flight's original deadline.
    this.targetRebaseTimeout = window.setTimeout(() => {
      this.targetRebaseTimeout = undefined;
      if (this.flight?.id === flightId) {
        this.rebaseFlightTarget(index);
      }
    }, 250);
  }

  private clearTargetTracking() {
    if (this.targetCard && this.targetTransitionHandler) {
      this.targetCard.removeEventListener("transitionend", this.targetTransitionHandler);
      this.targetCard.removeEventListener("transitioncancel", this.targetTransitionHandler);
    }
    if (this.targetRebaseTimeout !== undefined) {
      window.clearTimeout(this.targetRebaseTimeout);
      this.targetRebaseTimeout = undefined;
    }
    this.targetCard = null;
    this.targetTransitionHandler = null;
  }

  private rebaseFlightTarget(index: number) {
    const flight = this.flight;
    if (!flight || flight.index !== index) {
      return;
    }

    const destination = this.targetPosition(index);
    flight.from.copy(this.current);
    flight.to.copy(destination);
    flight.path = flight.direct
      ? new THREE.LineCurve(this.current.clone(), destination.clone())
      : this.createFlightPath(this.current, index, destination);
    flight.routeOffset = 0;
    flight.progress = 0;
    // Keep endsAt unchanged so this correction fits the remaining flight time.
    flight.startedAt = this.suspendedAt ?? performance.now();
    this.updateActivity();
  }

  private createFlightPath(from: THREE.Vector2, index: number, destination: THREE.Vector2) {
    const marker = this.stage.parentElement?.querySelector<HTMLElement>(
      `[data-rocket-target="${index}"]`,
    );
    const card = marker?.closest("li");
    const route = new THREE.CurvePath<THREE.Vector2>();

    if (!card) {
      route.add(new THREE.LineCurve(from.clone(), destination.clone()));
      return route;
    }

    // Keep the long body above the cards, then use their right-hand padding as
    // a clear vertical lane before approaching the title-side landing bay.
    const rightLane = Math.max(12, this.width - 24);
    const start = from.clone();
    const target = destination.clone();
    const laneStart = new THREE.Vector2(rightLane, start.y);
    const laneEnd = new THREE.Vector2(rightLane, target.y);

    if (Math.abs(laneStart.x - start.x) > 1) {
      const direction = Math.sign(laneStart.x - start.x);
      const bend = Math.min(28, Math.abs(laneStart.x - start.x) / 3);
      route.add(new THREE.CubicBezierCurve(
        start,
        new THREE.Vector2(start.x + direction * bend, start.y),
        new THREE.Vector2(laneStart.x - direction * bend, laneStart.y),
        laneStart,
      ));
    }
    if (Math.abs(laneEnd.y - laneStart.y) > 1) {
      const direction = Math.sign(laneEnd.y - laneStart.y);
      const bend = Math.min(28, Math.abs(laneEnd.y - laneStart.y) / 3);
      route.add(new THREE.CubicBezierCurve(
        laneStart,
        new THREE.Vector2(laneStart.x, laneStart.y + direction * bend),
        new THREE.Vector2(laneEnd.x, laneEnd.y - direction * bend),
        laneEnd,
      ));
    }
    if (Math.abs(target.x - laneEnd.x) > 1) {
      const direction = Math.sign(target.x - laneEnd.x);
      const bend = Math.min(28, Math.abs(target.x - laneEnd.x) / 3);
      route.add(new THREE.CubicBezierCurve(
        laneEnd,
        new THREE.Vector2(laneEnd.x + direction * bend, laneEnd.y),
        new THREE.Vector2(target.x - direction * bend, target.y),
        target,
      ));
    }
    if (route.curves.length === 0) {
      route.add(new THREE.LineCurve(start, target));
    }
    return route;
  }

  private resize() {
    if (this.disposed) {
      return;
    }

    try {
      const rect = this.stage.getBoundingClientRect();
      const launchRect = this.launchButton?.getBoundingClientRect();
      const oldHeight = this.height;
      const shiftX = this.stageLeft - rect.left;
      const shiftY = rect.height - oldHeight + rect.top - this.stageTop;
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      this.stageLeft = rect.left;
      this.stageTop = rect.top;
      this.renderer.setSize(this.width, this.height, false);
      this.camera.left = 0;
      this.camera.right = this.width;
      this.camera.top = this.height;
      this.camera.bottom = 0;
      this.camera.updateProjectionMatrix();
      const minimumLength = Math.max(
        64,
        (launchRect?.width ?? 0) * 0.5,
        (launchRect?.height ?? 0) * 0.5,
      );
      this.rocket.scale.setScalar((minimumLength * 1.15) / 1.04);

      if (!this.flight && this.parkedIndex !== undefined && this.explosionStartedAt === undefined) {
        this.current.copy(this.targetPosition(this.parkedIndex));
        this.rocket.position.set(this.current.x, this.current.y, 0);
      } else if (!this.flight && this.current.length() === 0) {
        this.current.set(this.width / 2, this.height - 12);
        this.rocket.position.set(this.current.x, this.current.y, 0);
      } else if (this.flight) {
        const flight = this.flight;
        const offset = flight.routeOffset + (1 - flight.routeOffset) * flight.progress;
        // Keep the last painted screen position; never restart from an old pad.
        this.current.set(this.rocket.position.x + shiftX, this.rocket.position.y + shiftY);
        this.rocket.position.set(this.current.x, this.current.y, 0);
        flight.from.add(new THREE.Vector2(shiftX, shiftY));
        flight.to.copy(this.targetPosition(flight.index));
        const route = flight.direct
          ? new THREE.LineCurve(flight.from.clone(), flight.to.clone())
          : this.createFlightPath(flight.from, flight.index, flight.to);
        const correction = this.current.clone().sub(route.getPoint(offset));
        flight.path = new RebasedFlightPath(route, offset, correction);
        flight.routeOffset = offset;
        flight.progress = 0;
        // The original deadline survives resize, including while suspended.
        flight.startedAt = Math.min(this.suspendedAt ?? performance.now(), flight.endsAt);
      } else if (this.explosionStartedAt !== undefined) {
        this.explosion.position.set(this.current.x, this.current.y, 0);
      }
      this.render();
    } catch {
      this.dispose();
      this.onFailure();
    }
  }

  private updateActivity() {
    if (this.disposed) {
      return;
    }
    const shouldRun = this.onscreen && this.documentVisible;

    if (!shouldRun) {
      if (this.frameId !== undefined) {
        cancelAnimationFrame(this.frameId);
        this.frameId = undefined;
      }
      if (this.suspendedAt === undefined) {
        this.suspendedAt = performance.now();
      }
    } else if (this.suspendedAt !== undefined) {
      const pausedFor = performance.now() - this.suspendedAt;
      if (this.flight) {
        this.flight.startedAt += pausedFor;
        this.flight.endsAt += pausedFor;
      }
      if (this.explosionStartedAt !== undefined) {
        this.explosionStartedAt += pausedFor;
      }
      this.suspendedAt = undefined;
    }

    if (shouldRun && (this.flight || this.explosionStartedAt !== undefined)) {
      this.requestFrame();
    } else if (shouldRun) {
      this.render();
    }
  }

  private requestFrame() {
    if (this.frameId === undefined && !this.disposed) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  private readonly animate = (now: number) => {
    this.frameId = undefined;
    if (this.disposed || !this.onscreen || !this.documentVisible) {
      return;
    }

    if (this.flight) {
      const flight = this.flight;
      const duration = flight.endsAt - flight.startedAt;
      const timeProgress =
        duration <= 0 ? 1 : THREE.MathUtils.clamp((now - flight.startedAt) / duration, 0, 1);
      const progress = flight.direct ? 1 - (1 - timeProgress) ** 3 : timeProgress;
      flight.progress = progress;
      flight.path.getPoint(progress, this.current);
      this.rocket.position.set(this.current.x, this.current.y, 0);
      const tangent = flight.path.getTangent(progress);
      this.rocket.rotation.z = Math.atan2(tangent.y, tangent.x) - Math.PI / 2;
      const descent = THREE.MathUtils.smoothstep(timeProgress, 0.7, 1);
      this.exhaust.scale.y = (0.75 + Math.sin(now / 55) * 0.3) * (1 - descent * 0.75);
      this.flame.scale.y = (0.8 + Math.sin(now / 48) * 0.2) * (1 - descent * 0.82);

      if (progress >= 1) {
        this.current.copy(flight.to);
        this.parkedIndex = flight.index;
        this.rocket.position.set(this.current.x, this.current.y, 0);
        this.rocket.rotation.z = 0;
        this.exhaust.visible = false;
        this.flame.visible = false;
        this.clearTargetTracking();
        this.flight = undefined;
        this.render();
        this.onLand(flight.index, flight.id);
        return;
      }
    }

    if (this.explosionStartedAt !== undefined) {
      const progress = Math.min(1, (now - this.explosionStartedAt) / 850);
      const scale = 28 * (0.25 + progress * 1.6);
      this.explosion.scale.setScalar(scale);
      this.explosion.rotation.z += 0.045;
      this.explosion.traverse((object) => {
        if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshBasicMaterial) {
          object.material.opacity = 1 - progress * 0.8;
          object.material.transparent = true;
        }
      });
      if (progress >= 1) {
        this.explosionStartedAt = undefined;
        this.explosion.visible = false;
      }
    }

    this.render();
    if (this.flight || this.explosionStartedAt !== undefined) {
      this.requestFrame();
    }
  };

  private render() {
    if (!this.disposed) {
      try {
        this.renderer.render(this.scene, this.camera);
      } catch {
        this.dispose();
        this.onFailure();
      }
    }
  }
}

export function RocketCanvas({
  targetIndex,
  flightId,
  directFlight,
  explosionId,
  exploding,
  onLand,
  onFailure,
}: RocketCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<RocketEngine | null>(null);
  const onLandRef = useRef(onLand);
  const onFailureRef = useRef(onFailure);

  useEffect(() => {
    onLandRef.current = onLand;
    onFailureRef.current = onFailure;
  }, [onFailure, onLand]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) {
      return;
    }

    try {
      const engine = new RocketEngine(
        canvas,
        stage,
        (index, id) => onLandRef.current(index, id),
        () => onFailureRef.current(),
      );
      engineRef.current = engine;
      return () => {
        engine.dispose();
        engineRef.current = null;
      };
    } catch {
      onFailureRef.current();
    }
  }, []);

  useEffect(() => {
    engineRef.current?.flyTo(targetIndex, flightId, directFlight);
  }, [directFlight, flightId, targetIndex]);

  useEffect(() => {
    if (exploding) {
      engineRef.current?.setExplosion();
    }
  }, [exploding, explosionId]);

  return (
    <div ref={stageRef} aria-hidden="true" className="screen-two-rocket-canvas">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
