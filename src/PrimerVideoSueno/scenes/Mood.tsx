import React from "react";
import type { SceneProps } from "../../video-2d/types";
import { AnimatedCharacter, Room, Tag } from "../../video-2d/Visuals";
import { C, ramp, sceneTime, sceneMoment } from "../../video-2d/motion";
export const Mood: React.FC<SceneProps> = ({ scene, time }) => {
  const t = sceneTime(scene, time);
  const pose =
    t < 3.3
      ? scene.assets.character
      : t < 6.3
        ? scene.assets.alternate
        : scene.assets.reaction;
  const alternate =
    t < 3.3
      ? scene.assets.alternate
      : t < 6.3
        ? scene.assets.reaction
        : scene.assets.resolve;
  const blend =
    t < 3.3
      ? ramp(t, 2.9, 3.15)
      : t < 6.3
        ? ramp(t, 5.9, 6.15)
        : ramp(t, 9, 9.25);
  return (
    <>
      <Room asset={scene.assets.background} time={time} opacity={0.5} />
      <AnimatedCharacter
        asset={pose}
        alternate={alternate}
        blend={blend}
        time={time}
        width={550}
        intensity={1.15}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d="m 0 0 30 -15 -12 32 30 -12"
            transform={`translate(${240 + i * 300} ${790 + (i % 2) * 330}) rotate(${Math.sin(time * 1.7 + i) * 6})`}
            stroke={C.coral}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity={0.45 + Math.sin(time * 2 + i) * 0.2}
          />
        ))}
      </svg>
      <Tag
        text={scene.callouts[0]}
        x={96}
        y={1325}
        time={time}
        start={sceneMoment(scene, 5.7)}
        color={C.coral}
      />
    </>
  );
};
