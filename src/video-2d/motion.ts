import { interpolate, interpolateColors } from "remotion";
import type { SceneSpec } from "./types";
export const C = {
  ink: "#112C47",
  cream: "#FFF4E0",
  teal: "#21CCB8",
  coral: "#FF746C",
  gold: "#FFD364",
};
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const ease = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: (p: number) => p * p * p * (10 + p * (-15 + 6 * p)),
} as const;
export const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], ease);
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const SPACING = 1280;
export const activeScene = (t: number, scenes: SceneSpec[]) =>
  Math.max(
    0,
    scenes.findIndex((s) => t >= s.start && t < s.end) === -1
      ? scenes.length - 1
      : scenes.findIndex((s) => t >= s.start && t < s.end),
  );
export const anchor = (index: number, end = false) => ({
  x: 540 + index * SPACING + (index === 0 && end ? 10 : 0),
  y: index === 0 && end ? 960 : 1080,
  zoom: index === 0 && end ? 1.14 : 1,
});
export const curve = (index: number, p: number) => {
  const a = anchor(index, true),
    b = anchor(index + 1),
    q = 1 - p;
  return {
    x:
      q * q * q * a.x +
      3 * q * q * p * (a.x + SPACING * 0.34) +
      3 * q * p * p * (b.x - SPACING * 0.34) +
      p * p * p * b.x,
    y:
      q * q * q * a.y +
      3 * q * q * p * (a.y - 90) +
      3 * q * p * p * (b.y + 70 * (index % 2 ? 1 : -1)) +
      p * p * p * b.y,
  };
};
export const transitionAt = (time: number, scenes: SceneSpec[]) => {
  for (let i = 0; i < scenes.length - 1; i++) {
    const boundary = scenes[i].end;
    if (time >= boundary - 0.95 && time <= boundary + 1.15)
      return {
        index: i,
        progress: ramp(time, boundary - 0.95, boundary + 1.15),
      };
  }
  return null;
};
export const cameraAt = (time: number, scenes: SceneSpec[]) => {
  const tr = transitionAt(time, scenes);
  if (tr) {
    const p = tr.progress,
      point = curve(tr.index, p),
      a = anchor(tr.index, true),
      b = anchor(tr.index + 1);
    return {
      ...point,
      zoom: mix(a.zoom, b.zoom, p) - 0.13 * Math.sin(Math.PI * p) ** 2,
    };
  }
  const index = activeScene(time, scenes),
    s = scenes[index],
    a = anchor(index);
  if (index === 0) {
    const focus = ramp(time, 6.8, s.end - 0.95);
    return {
      x: mix(a.x, a.x + 10, focus),
      y: mix(1080, 960, focus),
      zoom: mix(1, 1.14, focus),
    };
  }
  const p = clamp(
    (time - s.start - 1.15) / Math.max(0.1, s.end - s.start - 2.1),
  );
  const breathe = 64 * p ** 3 * (1 - p) ** 3;
  return {
    x: a.x + Math.sin(p * Math.PI * 2) * breathe * 3,
    y: 1080 + breathe * (index % 2 ? 5 : -5),
    zoom: 1 + 0.014 * breathe,
  };
};
export const darkAt = (time: number, scenes: SceneSpec[]) => {
  const tr = transitionAt(time, scenes);
  if (tr)
    return mix(
      scenes[tr.index].theme === "dark" ? 1 : 0,
      scenes[tr.index + 1].theme === "dark" ? 1 : 0,
      tr.progress,
    );
  return scenes[activeScene(time, scenes)].theme === "dark" ? 1 : 0;
};
export const backgroundAt = (dark: number) =>
  interpolateColors(dark, [0, 1], [C.cream, "#0C233E"]);
export const inkAt = (dark: number) => (dark > 0.54 ? C.cream : C.ink);
export const beat = (seconds: number) => {
  const p = (((seconds * 1.25) % 1) + 1) % 1;
  const bump = (c: number, w: number) => {
    const d = Math.abs(p - c);
    return Math.exp(-((Math.min(d, 1 - d) / w) ** 2));
  };
  return { phase: p, impulse: bump(0.15, 0.08) + 0.4 * bump(0.36, 0.1) };
};

// Scale staged actions with scene duration while keeping ambient movement continuous.
const nominalDuration = {
  hook: 10,
  brain: 12,
  attention: 12,
  mood: 12,
  appetite: 12,
  health: 12,
  rest: 12,
  closing: 8,
};
export const sceneTime = (scene: SceneSpec, time: number) => {
  const duration = scene.end - scene.start;
  const local = time - scene.start;
  return duration === nominalDuration[scene.kind] ? local : local * nominalDuration[scene.kind] / duration;
};
export const sceneMoment = (scene: SceneSpec, localSeconds: number) => {
  const duration = scene.end - scene.start;
  return scene.start + (duration === nominalDuration[scene.kind] ? localSeconds : localSeconds * duration / nominalDuration[scene.kind]);
};
