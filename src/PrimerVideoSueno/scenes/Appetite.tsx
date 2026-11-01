import React from "react";
import type { SceneProps } from "../../video-2d/types";
import {
  AnimatedCharacter,
  Illustration,
  Room,
  Tag,
} from "../../video-2d/Visuals";
import { ParticleRoute, PulseRings } from "../../video-2d/Effects";
import { C, ramp, mix, sceneTime, sceneMoment } from "../../video-2d/motion";
export const Appetite: React.FC<SceneProps> = ({ scene, time }) => {
  const t = sceneTime(scene, time),
    person = ramp(t, 4.1, 6.4);
  return (
    <>
      <Room asset={scene.assets.background} time={time} opacity={0.48} />
      <PulseRings
        x={mix(540, 730, person)}
        y={1000}
        radius={230}
        time={time}
        opacity={0.45}
      />
      <Illustration
        asset={scene.assets.focus}
        x={mix(540, 720, person)}
        y={mix(1040, 940, person)}
        width={mix(650, 430, person)}
        time={time}
        float={5}
      />
      <AnimatedCharacter
        asset={scene.assets.character}
        x={mix(-400, 340, person)}
        y={1085}
        width={425}
        time={time}
      />
      <ParticleRoute
        time={time}
        path="M 700 1080 Q 600 1170 420 1060"
        points={[
          [700, 1080],
          [590, 1130],
          [420, 1060],
        ]}
        opacity={person}
      />
      <Illustration
        asset={scene.assets.molecule}
        x={820}
        y={1320}
        width={140}
        time={time}
        opacity={ramp(t, 8, 8.8)}
        rotate={Math.sin(time * 0.3) * 5}
      />
      <Tag
        text={scene.callouts[0]}
        x={120}
        y={1360}
        time={time}
        start={sceneMoment(scene, 1.8)}
        color={C.teal}
      />
    </>
  );
};
