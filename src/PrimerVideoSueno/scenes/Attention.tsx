import React from "react";
import type { SceneProps } from "../../video-2d/types";
import { AnimatedCharacter, Room, Tag } from "../../video-2d/Visuals";
import { C, ramp, sceneTime, sceneMoment } from "../../video-2d/motion";
export const Attention: React.FC<SceneProps> = ({ scene, time }) => {
  const t = sceneTime(scene, time),
    second = t >= 6.3;
  const x = 540 + Math.sin(t * 0.9) * 310,
    y = 980 + Math.cos(t * 0.9) * 170;
  return (
    <>
      <Room asset={scene.assets.background} time={time} opacity={0.53} />
      <AnimatedCharacter
        asset={second ? scene.assets.alternate : scene.assets.character}
        alternate={second ? scene.assets.reaction : scene.assets.alternate}
        blend={second ? ramp(t, 8.5, 8.7) : ramp(t, 5.8, 6.1)}
        time={time}
        width={540}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d={`M 540 820 Q 720 710 ${x} ${y}`}
          fill="none"
          stroke={C.gold}
          strokeWidth="4"
          strokeDasharray="9 12"
          opacity=".85"
        />
        <circle cx={x} cy={y} r="37" fill={C.gold} />
        <circle
          cx={x}
          cy={y}
          r="56"
          fill="none"
          stroke={C.coral}
          strokeWidth="4"
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={200 + i * 310}
            cy={880 + (i % 2) * 320}
            r="30"
            fill="none"
            stroke={C.ink}
            strokeWidth="3"
            strokeDasharray="5 8"
            opacity=".2"
          />
        ))}
      </svg>
      <Tag
        text={scene.callouts[0]}
        x={96}
        y={1325}
        time={time}
        start={sceneMoment(scene, 2)}
        color={C.gold}
      />
    </>
  );
};
