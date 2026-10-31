import React from "react";
import { Img, staticFile } from "remotion";
import { MaskedText } from "./Shared";
import { C, heartBeat, ramp, windowOpacity } from "./motion";

export const HeartLayer: React.FC<{ time: number }> = ({ time }) => {
  const { phase, impulse } = heartBeat(time);
  const opacity = windowOpacity(time, 15.1, 16.5, 23.1, 24.2);
  const returnToBody = ramp(time, 22.1, 24.1);
  const size = 450 * (1 - returnToBody * 0.7);
  const cy = 1180 - returnToBody * 180;
  return (
    <div style={{ opacity }}>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <circle
          cx="575"
          cy={cy}
          r={240 + phase * 90}
          fill="none"
          stroke={C.coral}
          strokeWidth="3"
          opacity={(1 - phase) * 0.4 * (1 - returnToBody)}
        />
        <circle
          cx="575"
          cy={cy}
          r={235 + impulse * 12}
          fill={C.coral}
          opacity=".07"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle
            key={i}
            cx={575 + Math.cos((i * Math.PI) / 4 + time * 0.12) * 265}
            cy={cy + Math.sin((i * Math.PI) / 4 + time * 0.12) * 265}
            r="4"
            fill={i % 2 ? C.coral : C.gold}
            opacity=".65"
          />
        ))}
      </svg>
      <Img
        src={staticFile("imagenes/anatomia/03_corazon_humano.png")}
        style={{
          position: "absolute",
          width: size,
          height: size,
          left: 575 - size / 2,
          top: cy - size / 2,
          objectFit: "contain",
          scale: 1 + impulse * 0.065,
          rotate: `${-4 + Math.sin(time * 1.2) * 1.5}deg`,
        }}
      />
    </div>
  );
};

export const HeartCopy: React.FC<{ time: number }> = ({ time }) => {
  const visible = windowOpacity(time, 16.6, 17.2, 22.1, 22.8);
  const speed = 1.4 + ramp(time, 16, 22) * 0.9;
  const points = Array.from({ length: 180 }, (_, i) => {
    const x = 96 + i * 4.3;
    const phase = (((i / 34 - time * speed) % 1) + 1) % 1;
    const peak =
      Math.exp(-(((phase - 0.42) / 0.035) ** 2)) * -55 +
      Math.exp(-(((phase - 0.48) / 0.03) ** 2)) * 28;
    return `${i ? "L" : "M"} ${x} ${1550 + Math.sin(phase * Math.PI * 2) * 4 + peak}`;
  }).join(" ");
  return (
    <>
      <MaskedText
        time={time}
        start={15.1}
        end={23.15}
        lines={["Tu corazón", "comienza a latir", "más rápido."]}
        accent={C.coral}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0, opacity: visible }}
      >
        <text
          x="96"
          y="1465"
          fill={C.coral}
          fontSize="27"
          fontWeight="800"
          letterSpacing="3"
        >
          RITMO EN AUMENTO
        </text>
        <path
          d="M 96 1550 H 870"
          stroke={C.cream}
          strokeWidth="1"
          opacity=".15"
        />
        <path
          d={points}
          fill="none"
          stroke={C.coral}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
};
