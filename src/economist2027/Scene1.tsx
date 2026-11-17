import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SVG, Backdrop, Cover, Missile, Flame, C, ease, lerp } from "./Art";
export const Scene1 = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps;
  return (
    <>
      <SVG>
        <Backdrop t={t} />
      </SVG>
      <Cover t={t} />
      <SVG>
        <g opacity={1 - ease(t, 5.3, 6)}>
          <Missile
            t={t}
            x={lerp(t, 0, 2.5, 340, 990)}
            y={lerp(t, 0, 2.5, 1230, 340)}
            s={0.85}
            angle={38}
          />
        </g>
        <g opacity={ease(t, 0.9, 1.2) * (1 - ease(t, 4.3, 4.9))}>
          <Flame t={t} x={190} y={1170} s={1.4} />
          <Flame t={t + 0.4} x={270} y={1210} s={0.8} />
        </g>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${220 + i * 15} 1130V${970 - i * 35}L${450 + i * 50} ${850 - i * 20}V750`}
            stroke={C.teal}
            strokeWidth={7}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - ease(t, 1.6 + i * 0.1, 2.5 + i * 0.15)}
            opacity={1 - ease(t, 4.5, 5)}
          />
        ))}
      </SVG>
      <Img
        src={staticFile("imagenes/anatomia/01_cerebro_completo.png")}
        style={{
          position: "absolute",
          width: 460,
          left: 320,
          top: 660,
          opacity: ease(t, 2.42, 2.62) * (1 - ease(t, 4.1, 4.6)),
          clipPath: `circle(${ease(t, 2.42, 2.62) * 72}% at 50% 50%)`,
        }}
      />
      <SVG>
        <circle
          cx={540 + Math.sin(t * 2) * 17}
          cy={lerp(t, 5.3, 7.8, 860, 550)}
          r={lerp(t, 5.3, 7.8, 110, 180)}
          stroke={C.teal}
          strokeWidth="6"
          opacity={ease(t, 4.3, 4.6)}
          strokeDasharray="34 14"
          strokeDashoffset={-t * 35}
        />
        {t > 5 && (
          <Missile
            t={t}
            x={lerp(t, 5, 8, -240, 1280)}
            y={1420}
            s={0.45}
            angle={65}
          />
        )}
      </SVG>
    </>
  );
};
