import React from "react";
import type { SceneProps } from "../../video-2d/types";
import { Illustration, Tag } from "../../video-2d/Visuals";
import {
  NeuralSignals,
  ParticleRoute,
  PulseRings,
} from "../../video-2d/Effects";
import { C, ramp, sceneTime, sceneMoment } from "../../video-2d/motion";
export const Brain: React.FC<SceneProps> = ({ scene, time }) => {
  const t = sceneTime(scene, time),
    neuron = ramp(t, 3.7, 5.7),
    synapse = ramp(t, 7.9, 9.8);
  return (
    <>
      <div style={{ translate: `${-900 * neuron}px 0` }}>
        <PulseRings x={540} y={1050} time={time} radius={285} />
        <Illustration
          asset={scene.assets.focus}
          x={540}
          y={1050}
          width={650}
          time={time}
          pulse={Math.sin(time * 2.2) * 0.004}
        />
        <NeuralSignals time={time} start={sceneMoment(scene, 0.5)} />
      </div>
      <div
        style={{ translate: `${900 * (1 - neuron)}px ${-1000 * synapse}px` }}
      >
        <Illustration
          asset={scene.assets.neuron}
          x={540}
          y={1040}
          width={640}
          time={time}
        />
        <ParticleRoute
          time={time}
          path="M 350 845 Q 465 880 540 1035 T 725 1260"
          points={[
            [350, 845],
            [540, 1035],
            [725, 1260],
          ]}
        />
      </div>
      <div style={{ translate: `0 ${1000 * (1 - synapse)}px` }}>
        <Illustration
          asset={scene.assets.synapse}
          x={540}
          y={1040}
          width={680}
          time={time}
        />
        <ParticleRoute
          time={time}
          path="M 420 930 Q 540 1030 655 1130"
          points={[
            [420, 930],
            [540, 1030],
            [655, 1130],
          ]}
          color={C.gold}
        />
      </div>
      {t < 4.3 ? (
        <Tag
          text={scene.callouts[0]}
          x={145}
          y={1370}
          time={time}
          start={sceneMoment(scene, 1.4)}
          color={C.gold}
        />
      ) : t < 8.4 ? (
        <Tag
          text={scene.callouts[1]}
          x={180}
          y={1370}
          time={time}
          start={sceneMoment(scene, 5.7)}
          color={C.gold}
        />
      ) : (
        <Tag
          text={scene.callouts[2]}
          x={130}
          y={1370}
          time={time}
          start={sceneMoment(scene, 9.6)}
          color={C.gold}
        />
      )}
    </>
  );
};
