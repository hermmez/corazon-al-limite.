import React from "react";
import { CharacterPose, MaskedText, SceneCaption } from "./Shared";
import { C, ramp } from "./motion";

export const ResponseCharacter: React.FC<{ time: number }> = ({ time }) => {
  const visible = ramp(time, 23.25, 24.3);
  const breathe = ramp(time, 25.2, 25.55);
  const explain = ramp(time, 27.65, 28.05);
  const cycle = ((time - 23) / 1.5) % 1;
  return (
    <div style={{ opacity: visible }}>
      <CharacterPose
        pose="12_preocupado"
        opacity={1 - breathe}
        time={time}
        tension={1}
      />
      <CharacterPose
        pose="20_respirando"
        opacity={breathe * (1 - explain)}
        time={time}
        tension={0.7}
      />
      <CharacterPose pose="02_explicando" opacity={explain} time={time} />
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
        {[0, 1].map((i) => (
          <ellipse
            key={i}
            cx="535"
            cy="970"
            rx={140 + ((cycle + i * 0.5) % 1) * 100}
            ry={85 + ((cycle + i * 0.5) % 1) * 60}
            fill="none"
            stroke={C.teal}
            strokeWidth="3"
            opacity={(1 - ((cycle + i * 0.5) % 1)) * 0.7 * (1 - explain)}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M 700 ${825 + i * 30} q 40 -25 75 0 t 75 0`}
            fill="none"
            stroke={C.teal}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="25 80"
            strokeDashoffset={-time * 70}
            opacity={breathe * (1 - explain) * 0.8}
          />
        ))}
        <path
          d="m 315 930 -28 15 20 30 -28 16 m 470 -61 28 15 -20 30 28 16"
          fill="none"
          stroke={C.coral}
          strokeWidth="6"
          strokeLinecap="round"
          opacity={1 - ramp(time, 25.3, 27)}
        />
      </svg>
    </div>
  );
};
export const ResponseCopy: React.FC<{ time: number }> = ({ time }) => (
  <>
    <MaskedText
      time={time}
      start={23.15}
      end={30.8}
      lines={["Tu cuerpo se", "prepara para", "reaccionar."]}
      accent={C.teal}
    />
    <SceneCaption top={1610} time={time} start={24.2} end={27.7} color={C.ink}>
      Respiración más rápida · Tensión muscular
    </SceneCaption>
    <SceneCaption top={1610} time={time} start={28} end={31} color={C.ink}>
      Una respuesta automática de protección.
    </SceneCaption>
  </>
);
