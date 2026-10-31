import React from "react";
import { Img, staticFile } from "remotion";
import { MaskedText, SceneCaption } from "./Shared";
import {
  C,
  ramp,
  signalPath,
  signalAtDistance,
  travelProgress,
  windowOpacity,
} from "./motion";

export const BrainLayer: React.FC<{ time: number }> = ({ time }) => {
  const departure = travelProgress(time);
  if (time >= 18) return null;
  const activation = ramp(time, 7.9, 10.2);
  return (
    <div
      style={{
        translate: `${Math.sin(time * 0.7) * 1.5}px ${-110 * departure}px`,
      }}
    >
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {[0, 1, 2].map((i) => {
          const phase = (((time * 0.5 + i / 3) % 1) + 1) % 1;
          return (
            <circle
              key={i}
              cx="540"
              cy="740"
              r={180 + phase * 140}
              fill="none"
              stroke={C.teal}
              strokeWidth="2"
              opacity={Math.sin(Math.PI * phase) ** 2 * 0.25 * activation}
            />
          );
        })}
      </svg>
      <Img
        src={staticFile("imagenes/anatomia/01_cerebro_completo.png")}
        style={{
          position: "absolute",
          width: 430,
          height: 430,
          left: 325,
          top: 525,
          objectFit: "contain",
          scale: 0.4 + ramp(time, 6.4, 8.3) * 0.6 + Math.sin(time * 2) * 0.004,
          rotate: `${Math.sin(time * 0.8) * 0.9}deg`,
        }}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M 405 725 Q 460 590 530 665 T 650 710 M 440 790 Q 505 700 625 790 M 530 665 550 820"
          fill="none"
          stroke={C.gold}
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - activation}
          opacity=".85"
        />
        {[
          [405, 725],
          [470, 660],
          [530, 665],
          [595, 675],
          [650, 710],
          [440, 790],
          [550, 750],
          [625, 790],
        ].map(([x, y], i) => (
          <g key={i} opacity={activation}>
            <circle
              cx={x}
              cy={y}
              r={5 + (Math.sin(time * 6 + i) + 1) * 2}
              fill={C.cream}
            />
            <circle
              cx={x}
              cy={y}
              r={12 + (Math.sin(time * 6 + i) + 1) * 3}
              fill="none"
              stroke={C.gold}
              strokeWidth="1.5"
              opacity=".5"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export const TravellingSignal: React.FC<{ time: number }> = ({ time }) => {
  const progress = travelProgress(time);
  const visible = windowOpacity(time, 13.15, 13.45, 17.3, 18);
  return (
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", inset: 0, opacity: visible }}
    >
      <path
        d={signalPath}
        fill="none"
        stroke={C.teal}
        strokeWidth="3"
        opacity=".2"
      />
      <path
        d={signalPath}
        fill="none"
        stroke={C.gold}
        strokeWidth="5"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - progress}
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const p = signalAtDistance(Math.max(0, progress - i * 0.035));
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 14 : 8 - i}
            fill={C.cream}
            opacity={1 - i * 0.18}
          />
        );
      })}
      <circle
        cx={signalAtDistance(progress).x}
        cy={signalAtDistance(progress).y}
        r="27"
        fill="none"
        stroke={C.gold}
        strokeWidth="2"
      />
    </svg>
  );
};
export const BrainCopy: React.FC<{ time: number }> = ({ time }) => (
  <>
    <MaskedText
      time={time}
      start={7.15}
      end={15}
      lines={["Tu cerebro activa", "una señal", "de alerta."]}
      accent={C.gold}
    />
    <SceneCaption time={time} start={9} end={13.5}>
      <span style={{ color: C.gold }}>DETECTA</span>　→　ACTIVA　→　ENVÍA
    </SceneCaption>
  </>
);
