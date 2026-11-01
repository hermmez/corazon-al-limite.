import React from "react";
import type { SceneProps } from "../../video-2d/types";
import { AnimatedCharacter, Room } from "../../video-2d/Visuals";
import { Clock } from "../../video-2d/Effects";
import { C, ramp, sceneTime, sceneMoment } from "../../video-2d/motion";
export const Rest: React.FC<SceneProps> = ({ scene, time }) => {
  const t = sceneTime(scene, time);
  return (
    <>
      <Room asset={scene.assets.background} time={time} opacity={0.86} />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 600,
          width: 900,
          height: 900,
          borderRadius: 48,
          background: C.ink,
          opacity: 0.16 * (1 - ramp(t, 5, 10)),
        }}
      />
      <AnimatedCharacter
        asset={scene.assets.character}
        x={540}
        y={1145}
        width={825}
        time={time}
        intensity={0.6}
      />
      <Clock time={time} start={sceneMoment(scene, 0.5)} />
      <div
        style={{
          position: "absolute",
          left: 145,
          top: 720,
          background: C.teal,
          borderRadius: 30,
          padding: "20px 32px",
          color: C.ink,
          scale: 0.9 + ramp(t, 0.4, 1.3) * 0.1,
        }}
      >
        <div
          style={{
            fontSize: 110,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: -4,
          }}
        >
          {scene.callouts[0]}
        </div>
        <div
          style={{
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: 4,
            marginTop: 10,
          }}
        >
          {scene.callouts[1]}
        </div>
      </div>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {[0, 1, 2].map((i) => {
          const phase = (((t / 3 + i * 0.3) % 1) + 1) % 1;
          return (
            <text
              key={i}
              x={245 + phase * 95}
              y={990 - phase * 160}
              fontSize={35 + i * 8}
              fontWeight="800"
              fill={C.cream}
              opacity={Math.sin(phase * Math.PI) ** 2}
            >
              z
            </text>
          );
        })}
      </svg>
    </>
  );
};
