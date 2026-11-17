import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SVG, Backdrop, Cover, Figure, Capitol, C, ease, lerp } from "./Art";
import { GeoMap } from "./Maps";
export const Scene2 = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps;
  return (
    <>
      <SVG>
        <Backdrop t={t} />
      </SVG>
      <div style={{ opacity: 1 - ease(t, 1.5, 2.2) }}>
        <Cover t={t} focus />
      </div>
      <SVG>
        <g opacity={ease(t, 1, 1.8) * (1 - ease(t, 4, 4.5))}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Figure
              key={i}
              t={t}
              x={170 + i * 182}
              y={740 + Math.sin(i) * 20}
              s={1.3}
              variant={i}
            />
          ))}
        </g>
        <g opacity={ease(t, 3.2, 3.8) * (1 - ease(t, 6, 6.5))}>
          <Capitol t={t - 3.2} />
        </g>
        <g opacity={ease(t, 3.8, 4.2) * (1 - ease(t, 6, 6.5))}>
          <Figure t={t} x={255} y={1180} s={1.1} variant={1} />
          <Figure t={t + 1} x={825} y={1180} s={1.1} variant={3} />
        </g>
        <g opacity={ease(t, 6, 6.5)}>
          <GeoMap t={t} y={670} h={620} />
          {[0, 1, 2].map((i) => (
            <g
              key={i}
              opacity=".2"
              transform={`translate(${lerp(t, 6, 10, -200, 350) + i * 380} 1050) scale(1.3)`}
            >
              <Figure t={t + i} x={0} y={0} s={1.4} variant={i} />
            </g>
          ))}
        </g>
        {t > 9.3 && (
          <path
            d={`M${lerp(t, 9.3, 10, -1200, 0)} 200Q${lerp(t, 9.3, 10, -600, 600)} ${300 + Math.sin(t * 4) * 70} ${lerp(t, 9.3, 10, 0, 1200)} 200V1700Q${lerp(t, 9.3, 10, -600, 600)} 1600 ${lerp(t, 9.3, 10, -1200, 0)} 1700Z`}
            fill={C.teal}
            stroke={C.tealDark}
            strokeWidth="10"
          />
        )}
      </SVG>
    </>
  );
};
