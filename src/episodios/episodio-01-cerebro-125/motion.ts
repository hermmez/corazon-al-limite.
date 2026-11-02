import { Easing, interpolate, spring } from "remotion";
import timeline from "./timeline.json";
import captions from "./captions.json";
export const spokenTime = (scene: number, word: string, fallback: number) => {
  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  const s = timeline.scenes[scene];
  const w = captions.find(
    (c) =>
      c.startMs >= s.start * 1000 &&
      c.startMs < s.end * 1000 &&
      norm(c.text) === norm(word),
  );
  return w ? w.startMs / 1000 : fallback;
};
export { C } from "../episodio-01-cerebro/primitives";
export const ease = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;
export const p = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], ease);
export const lift = (age: number, fps: number) =>
  spring({
    frame: age * fps,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.28 * fps),
  });
export const sceneAt = (time: number) =>
  timeline.scenes.findIndex((s) => time >= s.start && time < s.end);
export const activeEvent = (time: number) =>
  [...timeline.events].reverse().find((e) => e.start <= time) ??
  timeline.events[0];
export const cueTime = (scene: number, action: number) =>
  timeline.events.find((e) => e.scene === scene && e.action === action)
    ?.start ?? timeline.scenes[scene].start;
export const cueProgress = (
  time: number,
  scene: number,
  action: number,
  duration = 0.34,
) => p(time, cueTime(scene, action), cueTime(scene, action) + duration);
export const sceneProgress = (time: number, scene: number) =>
  p(time, timeline.scenes[scene].start, timeline.scenes[scene].end);
