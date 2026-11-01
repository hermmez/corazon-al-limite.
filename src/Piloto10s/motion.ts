import { Easing, interpolate } from "remotion";
export const C = {
  ink: "#102C43",
  navy: "#0C2035",
  cream: "#FFF4E0",
  teal: "#24C8BA",
  coral: "#FF786B",
  gold: "#FFD56A",
};
export const ease = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;
export const p = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], ease);
export const mix = (a: number, b: number, u: number) => a + (b - a) * u;
export const beat = (t: number) => {
  const phase = (((t - 2.2) % 0.85) + 0.85) % 0.85;
  return (
    Math.exp(-Math.pow(phase / 0.085, 2)) +
    0.28 * Math.exp(-Math.pow((phase - 0.14) / 0.065, 2))
  );
};
export const heartPose = (t: number) => {
  const reveal = p(t, 1.48, 2.32),
    split = p(t, 4.8, 5.38),
    close = p(t, 7.72, 8.34);
  return {
    x: mix(mix(mix(565, 540, reveal), 747, split), 765, close),
    y: mix(mix(mix(890, 1045, reveal), 1050, split), 1100, close),
    width: mix(mix(mix(54, 610, reveal), 360, split), 260, close),
    opacity: p(t, 1.45, 1.62),
  };
};
