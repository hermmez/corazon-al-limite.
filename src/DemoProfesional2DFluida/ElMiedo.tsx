import React from "react";
import { spring, useVideoConfig } from "remotion";
import { CharacterPose, MaskedText, SceneCaption } from "./Shared";
import { C, ramp } from "./motion";

export const FearCharacter: React.FC<{ time: number }> = ({ time }) => {
  const { fps } = useVideoConfig();
  const entrance = spring({
    frame: time * fps,
    fps,
    config: { damping: 20, stiffness: 85 },
  });
  const reaction = spring({
    frame: (time - 2.8) * fps,
    fps,
    config: { damping: 20, stiffness: 165 },
  });
  const surprise = ramp(time, 2.8, 2.97);
  const opacity = ramp(time, 0, 0.45);
  return (
    <div
      style={{
        opacity,
        translate: `${(1 - entrance) * 270 + Math.sin(time * 21) * Math.exp(-Math.max(0, time - 2.8) * 4) * surprise * 6}px 0`,
        scale: 1 + Math.max(0, reaction - 1) * 0.08,
        transformOrigin: "540px 1500px",
      }}
    >
      <CharacterPose pose="01_neutral" opacity={1 - surprise} time={time} />
      <CharacterPose
        pose="11_sorprendido"
        opacity={surprise}
        time={time}
        tension={surprise}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <ellipse
          cx="540"
          cy="1600"
          rx="215"
          ry="25"
          fill={C.ink}
          opacity=".1"
        />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${810 + i * 37} ${720 - i * 24} q 75 85 0 170`}
            fill="none"
            stroke={C.coral}
            strokeWidth={7 - i}
            strokeLinecap="round"
            opacity={
              ramp(time, 2.3 + i * 0.12, 2.65 + i * 0.12) *
              (1 - ramp(time, 3.3, 4.1))
            }
          />
        ))}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d="M 0 0 5 -30"
            transform={`translate(${400 + i * 140} ${670 - (i % 2) * 30}) rotate(${i * 30 - 30})`}
            stroke={C.gold}
            strokeWidth="9"
            strokeLinecap="round"
            opacity={ramp(time, 2.8, 3) * (1 - ramp(time, 4, 4.8))}
          />
        ))}
      </svg>
    </div>
  );
};
export const FearCopy: React.FC<{ time: number }> = ({ time }) => (
  <>
    <MaskedText
      time={time}
      start={0.3}
      end={7}
      lines={["¿Qué pasa en", "tu cuerpo cuando", "sientes miedo?"]}
      accent={C.coral}
    />
    <SceneCaption top={1610} time={time} start={3.3} end={5.8}>
      Algo inesperado. Tu cuerpo lo nota.
    </SceneCaption>
  </>
);
