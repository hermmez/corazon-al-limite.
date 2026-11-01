import React from "react";
import type { SceneProps } from "../../video-2d/types";
import { AnimatedCharacter, Tag } from "../../video-2d/Visuals";
import { PulseRings } from "../../video-2d/Effects";
import { C, ramp, sceneTime, sceneMoment } from "../../video-2d/motion";
export const Closing: React.FC<SceneProps> = ({ scene, time }) => {
  const t = sceneTime(scene, time);
  return (
    <>
      <PulseRings x={540} y={1060} radius={310} time={time} opacity={0.6} />
      <AnimatedCharacter
        asset={t < 4.6 ? scene.assets.character : scene.assets.alternate}
        alternate={t < 4.6 ? scene.assets.alternate : scene.assets.resolve}
        blend={t < 4.6 ? ramp(t, 2.4, 2.6) : ramp(t, 5.4, 5.6)}
        width={550}
        time={time}
      />
      <Tag
        text={scene.callouts[0]}
        x={135}
        y={600}
        time={time}
        start={sceneMoment(scene, 0.7)}
        color={C.teal}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <circle
            key={i}
            cx={540 + Math.cos((i * Math.PI) / 5 + time * 0.07) * 335}
            cy={1060 + Math.sin((i * Math.PI) / 5 + time * 0.07) * 335}
            r={3 + (i % 3)}
            fill={i % 2 ? C.gold : C.teal}
            opacity={0.3 + Math.sin(time * 2 + i) * 0.15}
          />
        ))}
      </svg>
    </>
  );
};
