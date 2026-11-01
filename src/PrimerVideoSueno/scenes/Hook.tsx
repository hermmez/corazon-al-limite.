import React from "react";
import type { SceneProps } from "../../video-2d/types";
import { AnimatedCharacter, Illustration, Room } from "../../video-2d/Visuals";
import { PulseRings } from "../../video-2d/Effects";
import { C, ramp, sceneTime, sceneMoment } from "../../video-2d/motion";
export const Hook: React.FC<SceneProps> = ({ scene, time }) => {
  const t = sceneTime(scene, time),
    focus = ramp(t, 6.7, 9.3);
  return (
    <>
      <Room asset={scene.assets.background} time={time} />
      <AnimatedCharacter
        asset={scene.assets.character}
        alternate={scene.assets.alternate}
        blend={ramp(t, 3, 3.2)}
        time={time}
        width={520}
        y={1060}
      />
      <div style={{ opacity: focus }}>
        <Illustration
          asset={scene.assets.focus}
          x={720}
          y={820}
          width={170 + focus * 110}
          time={time}
          float={2}
        />
        <svg
          width="1080"
          height="1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d="M 555 815 Q 620 740 690 815"
            fill="none"
            stroke={C.gold}
            strokeWidth="5"
            strokeDasharray="8 10"
            strokeDashoffset={-time * 25}
          />
        </svg>
      </div>
      <PulseRings x={540} y={1050} radius={300} time={time} opacity={0.15} />
    </>
  );
};
