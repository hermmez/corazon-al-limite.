import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  SVG,
  Backdrop,
  Coin,
  Bottle,
  Rocket,
  Cloud,
  C,
  ease,
  lerp,
} from "./Art";
import { Earth } from "./Maps";
export const Scene6 = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps;
  return (
    <SVG>
      <Backdrop t={t} space={t > 7} />
      <g opacity={1 - ease(t, 3.1, 3.5)}>
        <path d="M150 500V1250H930" stroke="#779e9c" strokeWidth="5" />
        {[0, 1, 2, 3, 4].map((i) => {
          const height = lerp(
            t,
            1.8,
            3.1,
            170 + i * 72 + Math.sin(t * 1.7 + i) * 90,
            100,
          );
          return (
            <g key={i}>
              <rect
                x={lerp(t, 1.8, 3.1, 230 + i * 128, 490 + (i % 2) * 35)}
                y={lerp(t, 1.8, 3.1, 1230 - height, 1000 - i * 50)}
                width={lerp(t, 1.8, 3.1, 75, 100)}
                height={height}
                rx={ease(t, 1.8, 3.1) * 50}
                fill={i % 2 ? C.teal : C.coral}
              />
              <path
                d={`M${246 + i * 128} ${1240 - height}V1195`}
                stroke={C.cream}
                strokeWidth="5"
                opacity=".25"
              />
            </g>
          );
        })}
        <path
          d={`M180 1030Q390 ${700 + Math.sin(t * 2) * 100} 510 950T910 650`}
          stroke={C.gold}
          strokeWidth="11"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity={ease(t, 1.9, 2.6)}>
            <Coin
              t={t + i * 0.3}
              x={lerp(t, 2, 3.3, 265 + i * 128, 540 + (i % 2) * 35)}
              y={lerp(t, 2, 3.3, 870 + (i % 2) * 130, 1050 - i * 50)}
              s={0.7}
            />
          </g>
        ))}
      </g>
      <g opacity={ease(t, 3.1, 3.45) * (1 - ease(t, 5.3, 5.8))}>
        <Bottle t={t - 3.1} x={540} y={950} s={1.65} />
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            transform={`translate(${lerp(t, 3.7, 5, 540, 300 + i * 230)} ${lerp(t, 3.7, 5, 830, 700 + (i % 2) * 130)}) rotate(${t * 40 + i * 50})`}
            opacity={ease(t, 3.7, 4.3)}
          >
            <rect
              x="-50"
              y="-21"
              width="100"
              height="42"
              rx="21"
              fill={C.cream}
            />
            <path d="M0 -21H29Q50 -21 50 0T29 21H0Z" fill={C.coral} />
          </g>
        ))}
      </g>
      <g opacity={ease(t, 5.3, 5.7) * (1 - ease(t, 8.4, 8.9))}>
        <Rocket
          t={t}
          x={540 + Math.sin(t * 4) * 2}
          y={lerp(t, 5.7, 8.9, 1050, -320)}
          s={1.2}
        />
        {[0, 1, 2].map((i) => (
          <Cloud
            key={i}
            x={220 + i * 350}
            y={lerp(t, 6, 9, 1200 + i * 130, 2100 + i * 130)}
            s={1.5}
            t={t}
          />
        ))}
      </g>
      <g opacity={ease(t, 8.2, 8.7)}>
        <Earth
          t={t - 8}
          y={lerp(t, 8.2, 10, 1570, 990)}
          r={lerp(t, 8.2, 11, 660, 355)}
        />
      </g>
    </SVG>
  );
};
