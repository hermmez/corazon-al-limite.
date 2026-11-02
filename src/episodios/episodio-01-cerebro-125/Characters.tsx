import React from "react";
import { Img, staticFile, useVideoConfig } from "remotion";
import { lift } from "./motion";
const POSES = {
  surprised: "11_sorprendido.png",
  explaining: "02_explicando.png",
  headache: "29_dolor_cabeza.png",
  confused: "15_confundido.png",
  neutral: "01_neutral.png",
  point: "08_senalando_arriba.png",
  hands: "26_levantando_brazos.png",
};
export const Character125: React.FC<{
  pose: keyof typeof POSES;
  time: number;
  x: number;
  y: number;
  width: number;
  age: number;
}> = ({ pose, time, x, y, width, age }) => {
  const { fps } = useVideoConfig(),
    enter = lift(age, fps),
    breath = 1 + Math.sin(time * 2.5) * 0.002;
  const blink =
    pose === "neutral" || pose === "explaining"
      ? Math.max(0, 1 - Math.abs(((time + 0.4) % 3.44) - 1.8) / 0.065)
      : 0;
  const eyes =
    pose === "explaining"
      ? [
          [455, 191],
          [535, 183],
        ]
      : [
          [449, 190],
          [538, 187],
        ];
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - width * 0.75,
        width,
        height: width * 1.5,
        transformOrigin: "50% 100%",
        scale: `${0.94 + 0.06 * enter} ${(0.94 + 0.06 * enter) * breath}`,
        translate: `${(1 - enter) * 35}px 0`,
        rotate: `${(1 - enter) * -2}deg`,
      }}
    >
      <Img
        src={staticFile(`imagenes/personajes/${POSES[pose]}`)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <svg
        viewBox="0 0 1024 1536"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: blink,
        }}
      >
        {eyes.map(([cx, cy]) => (
          <g key={cx}>
            <ellipse cx={cx} cy={cy} rx="26" ry="25" fill="#FFB273" />
            <path
              d={`M${cx - 24} ${cy}q24 12 48 0`}
              fill="none"
              stroke="#5C3021"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};
