import React from "react";
import type { SceneProps } from "../../video-2d/types";
import { Illustration, Tag } from "../../video-2d/Visuals";
import { ParticleRoute, PulseRings } from "../../video-2d/Effects";
import {
  C,
  beat,
  mix,
  ramp,
  sceneTime,
  sceneMoment,
} from "../../video-2d/motion";
export const Health: React.FC<SceneProps> = ({ scene, time }) => {
  const t = sceneTime(scene, time),
    pair = ramp(t, 3.5, 5.6),
    pulse = beat(t);
  const q = (((time * 0.45) % 1) + 1) % 1;
  return (
    <>
      <PulseRings
        x={mix(540, 310, pair)}
        y={1040}
        radius={240}
        color={C.coral}
        time={time}
        opacity={0.6}
      />
      <Illustration
        asset={scene.assets.focus}
        x={mix(540, 310, pair)}
        y={1040}
        width={mix(650, 400, pair)}
        time={time}
        pulse={pulse.impulse * 0.047}
      />
      <Illustration
        asset={scene.assets.vessels}
        x={mix(1450, 735, pair)}
        y={1035}
        width={520}
        time={time}
        pulse={pulse.impulse * 0.01}
      />
      <ParticleRoute
        time={time}
        path="M 445 1040 Q 550 940 660 1040"
        points={[
          [445, 1040],
          [550, 990],
          [660, 1040],
        ]}
        color={C.coral}
        opacity={pair}
      />
      <Illustration
        asset={scene.assets.cell}
        x={mix(445, 660, q)}
        y={1040 - Math.sin(q * Math.PI) * 50}
        width={70}
        time={time}
        opacity={Math.sin(q * Math.PI) ** 2 * pair}
        float={0}
      />
      <Illustration
        asset={scene.assets.molecule}
        x={200}
        y={1340}
        width={150}
        time={time}
        opacity={ramp(t, 7, 8)}
      />
      <Tag
        text={scene.callouts[0]}
        x={110}
        y={1370}
        time={time}
        start={sceneMoment(scene, 5.6)}
        color={C.coral}
      />
    </>
  );
};
