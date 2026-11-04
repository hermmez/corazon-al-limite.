import { Easing, interpolate } from "remotion";

export const C = {
  ink: "#112C47",
  cream: "#FFF4E0",
  teal: "#21CCB8",
  coral: "#FF746C",
  gold: "#FFD364",
};
export const smooth = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.65, 0, 0.25, 1),
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

// Shared world coordinates: the signal and camera follow precisely the same curve.
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
export const signalPath = "M 540 740 C 800 790 380 1110 575 1180";

export const cameraAt = (time: number) => {
  const enter = ramp(time, 5.7, 8.3);
  const travel = ramp(time, 13.6, 17);
  const exit = ramp(time, 22.1, 24.5);
  const point = signalPoint(travel);
  return {
    x: interpolate(exit, [0, 1], [point.x, 540]),
    y: interpolate(
      exit,
      [0, 1],
      [interpolate(enter, [0, 1], [1100, point.y]), 1100],
    ),
    zoom: interpolate(
      exit,
      [0, 1],
      [interpolate(travel, [0, 1], [1 + enter * 0.8, 1.6]), 1],
    ),
  };
};
export const heartBeat = (time: number) => {
  const elapsed = Math.max(0, time - 15);
  const phase = (elapsed * 1.3 + 0.065 * elapsed ** 2) % 1;
  const impulse =
    Math.exp(-(((phase - 0.12) / 0.07) ** 2)) +
    0.4 * Math.exp(-(((phase - 0.32) / 0.085) ** 2));
  return { phase, impulse };
};
