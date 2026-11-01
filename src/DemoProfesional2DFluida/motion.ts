import { interpolate, interpolateColors } from "remotion";

// Approved palette and spatial anchors are unchanged.
export const C = {
  ink: "#112C47",
  cream: "#FFF4E0",
  teal: "#21CCB8",
  coral: "#FF746C",
  gold: "#FFD364",
};
const minimumJerk = (p: number) => p * p * p * (10 + p * (-15 + 6 * p));
export const smooth = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: minimumJerk,
} as const;
export const ramp = (time: number, from: number, to: number) =>
  interpolate(time, [from, to], [0, 1], smooth);
export const windowOpacity = (
  time: number,
  enter: number,
  full: number,
  leave: number,
  gone: number,
) => ramp(time, enter, full) * (1 - ramp(time, leave, gone));
export const signalPath = "M 540 740 C 800 790 380 1110 575 1180";
export const signalPoint = (p: number) => {
  const q = 1 - p;
  return {
    x:
      q ** 3 * 540 + 3 * q ** 2 * p * 800 + 3 * q * p ** 2 * 380 + p ** 3 * 575,
    y:
      q ** 3 * 740 +
      3 * q ** 2 * p * 790 +
      3 * q * p ** 2 * 1110 +
      p ** 3 * 1180,
  };
};

// Reparameterize the approved curve by distance: bends no longer cause speed spikes.
const samples = Array.from({ length: 2049 }, (_, index) =>
  signalPoint(index / 2048),
);
const distances = [0];
for (let i = 1; i < samples.length; i++)
  distances.push(
    distances[i - 1] +
      Math.hypot(
        samples[i].x - samples[i - 1].x,
        samples[i].y - samples[i - 1].y,
      ),
  );
const length = distances[distances.length - 1];
export const signalAtDistance = (progress: number) => {
  const target = Math.max(0, Math.min(1, progress)) * length;
  let low = 0;
  let high = distances.length - 1;
  while (low + 1 < high) {
    const mid = (low + high) >> 1;
    if (distances[mid] < target) low = mid;
    else high = mid;
  }
  const p =
    (low + (target - distances[low]) / (distances[high] - distances[low])) /
    2048;
  return signalPoint(p);
};
export const travelProgress = (time: number) => ramp(time, 13.4, 17.1);
export const returnProgress = (time: number) => ramp(time, 22, 24.65);
export const headRadius = (time: number) =>
  260 * ramp(time, 6.4, 7.55) + 1200 * ramp(time, 7.4, 8.4);
export const heartCenter = (time: number) => ({
  x: 575,
  y: 1180 - returnProgress(time) * 180,
});
export const bodyRadius = (time: number) => 1300 * ramp(time, 22.35, 24.1);

export const cameraAt = (time: number) => {
  const enter = ramp(time, 5.3, 8.4);
  const travel = travelProgress(time);
  const exit = returnProgress(time);
  const lead = 0.025 * Math.sin(Math.PI * travel) ** 2;
  const point = signalAtDistance(travel + lead);
  const drift =
    Math.sin(((time - 8.4) * Math.PI) / 5) ** 2 *
    windowOpacity(time, 8.4, 9.2, 12.6, 13.4);
  return {
    x: interpolate(exit, [0, 1], [point.x, 540]),
    y:
      interpolate(
        exit,
        [0, 1],
        [interpolate(enter, [0, 1], [1100, point.y]) + drift * 2, 1100],
      ) -
      70 * Math.sin(Math.PI * exit) ** 2,
    zoom: interpolate(
      exit,
      [0, 1],
      [interpolate(travel, [0, 1], [1 + enter * 0.8 + drift * 0.006, 1.6]), 1],
    ),
  };
};
export const heartPhase = (time: number) => {
  const elapsed = Math.max(0, time - 15);
  return elapsed * 1.3 + 0.065 * elapsed ** 2;
};
export const heartBeat = (time: number) => {
  const phase = heartPhase(time) % 1;
  const bump = (center: number, width: number) => {
    const distance = Math.abs(phase - center);
    return Math.exp(-((Math.min(distance, 1 - distance) / width) ** 2));
  };
  return { phase, impulse: bump(0.12, 0.07) + 0.4 * bump(0.32, 0.085) };
};

// During a background transition choose the more legible approved ink;
// blending opposite inks would make text and background meet at the same gray.
export const readableInk = (dark: number) => {
  const luminance = (rgb: number[]) =>
    rgb
      .map((channel) => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      })
      .reduce(
        (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
        0,
      );
  const rgb = interpolateColors(dark, [0, 1], [C.cream, "#0C233E"])
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map(Number);
  const bg = luminance(rgb);
  const navy = luminance([17, 44, 71]);
  const cream = luminance([255, 244, 224]);
  const contrast = (ink: number) =>
    (Math.max(bg, ink) + 0.05) / (Math.min(bg, ink) + 0.05);
  return contrast(navy) >= contrast(cream) ? C.ink : C.cream;
};
