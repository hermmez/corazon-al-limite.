import React from "react";
import {
  AbsoluteFill,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FearCharacter, FearCopy } from "./DemoProfesional2DFluida/ElMiedo";
import {
  BrainLayer,
  BrainCopy,
  TravellingSignal,
} from "./DemoProfesional2DFluida/ElCerebro";
import { HeartLayer, HeartCopy } from "./DemoProfesional2DFluida/ElCorazon";
import {
  ResponseCharacter,
  ResponseCopy,
} from "./DemoProfesional2DFluida/LaRespuesta";
import {
  C,
  cameraAt,
  ramp,
  headRadius,
  bodyRadius,
  heartCenter,
  readableInk,
} from "./DemoProfesional2DFluida/motion";

import { SpatialMask } from "./DemoProfesional2DFluida/SpatialMask";

export type DemoFluidaProps = { startAtSeconds: number };
export const DemoProfesional2DFluida: React.FC<DemoFluidaProps> = ({
  startAtSeconds = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps + startAtSeconds;
  const camera = cameraAt(time);
  const dark = ramp(time, 6.4, 8.2) * (1 - ramp(time, 22.6, 24.4));
  const ink = readableInk(dark);
  const chapter =
    time < 7
      ? "01 · EL MIEDO"
      : time < 15
        ? "02 · EL CEREBRO"
        : time < 23
          ? "03 · EL CORAZÓN"
          : "04 · LA RESPUESTA";
  return (
    <AbsoluteFill
      style={{
        background: interpolateColors(dark, [0, 1], [C.cream, "#0C233E"]),
        color: ink,
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Distant, middle and foreground layers move at different speeds. */}
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <circle
          cx={900 - (camera.x - 540) * 0.1}
          cy={1060 - (camera.y - 1100) * 0.1}
          r={590 + (camera.zoom - 1) * 30}
          fill={interpolateColors(dark, [0, 1], ["#E1EFE1", "#163F56"])}
        />
        <circle
          cx="-100"
          cy={1500 - (camera.y - 1100) * 0.3}
          r="450"
          fill={interpolateColors(dark, [0, 1], ["#FFDEB9", "#1B3152"])}
        />
        <path
          d={`M -100 ${800 - (camera.y - 1100) * 0.18} Q 500 500 1180 860 M -50 1300 Q 700 ${1850 - (camera.y - 1100) * 0.3} 1200 1100`}
          fill="none"
          stroke={C.teal}
          strokeWidth="2"
          opacity=".15"
        />
        {Array.from({ length: 28 }, (_, i) => (
          <circle
            key={i}
            cx={((i * 191) % 1080) - (camera.x - 540) * 0.18}
            cy={
              ((i * 283) % 1920) -
              (camera.y - 1100) * 0.18 +
              Math.sin(time * 0.6 + i) * 9
            }
            r={2 + (i % 3)}
            fill={i % 3 === 0 ? C.coral : C.teal}
            opacity=".22"
          />
        ))}
        <path
          d="M 80 670 h 38 M 80 670 v 38 M 910 1620 h -38 M 910 1620 v -38"
          fill="none"
          stroke={ink}
          strokeWidth="3"
          opacity=".18"
        />
      </svg>
      {/* One persistent world and one camera: no scene cuts or repeated fades. */}
      <AbsoluteFill
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 590px, black 665px, black 1600px, transparent 1685px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 1080,
            height: 1920,
            transformOrigin: "0 0",
            transform: `translate(540px, 1080px) scale(${camera.zoom}) translate(${-camera.x}px, ${-camera.y}px)`,
          }}
        >
          <SpatialMask radius={headRadius(time)} invert>
            <FearCharacter time={time} />
          </SpatialMask>
          <SpatialMask radius={headRadius(time) * (1 - ramp(time, 16.8, 18.2))}>
            <BrainLayer time={time} />
          </SpatialMask>
          <SpatialMask scan={ramp(time, 14.2, 15.7)}>
            <SpatialMask
              center={heartCenter(time)}
              radius={bodyRadius(time)}
              invert
            >
              <HeartLayer time={time} />
            </SpatialMask>
          </SpatialMask>
          <TravellingSignal time={time} />
          <SpatialMask center={heartCenter(time)} radius={bodyRadius(time)}>
            <ResponseCharacter time={time} />
          </SpatialMask>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 112,
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: 4,
        }}
      >
        CORAZÓN AL LÍMITE
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 182,
          fontSize: 27,
          letterSpacing: 3,
          fontWeight: 700,
          color: dark > 0.5 ? C.teal : "#3D7276",
        }}
      >
        {chapter}
      </div>
      <div
        style={{
          position: "absolute",
          left: 835,
          top: 105,
          width: 70,
          height: 70,
          border: `2px solid ${ink}`,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        {time < 7 ? "01" : time < 15 ? "02" : time < 23 ? "03" : "04"}
      </div>
      <FearCopy time={time} />
      <BrainCopy time={time} />
      <HeartCopy time={time} />
      <ResponseCopy time={time} />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 1715,
          width: 790,
          fontSize: 23,
          letterSpacing: 2,
          display: "flex",
          justifyContent: "space-between",
          opacity: 0.65,
        }}
      >
        <span>EL MIEDO POR DENTRO</span>
        <span>
          {Math.min(30, Math.floor(time)).toString().padStart(2, "0")} / 30
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 1680,
          width: 790,
          height: 4,
          background: dark > 0.5 ? "#FFF4E022" : "#112C4722",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(1, time / (30 - 1 / fps)) * 100}%`,
            background: C.teal,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
