import React from "react";
import { Img, staticFile, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { p } from "./motion";

const POSES = {
  surprised: "11_sorprendido.png",
  tired: "05_cansado.png",
  explaining: "02_explicando.png",
} as const;
export const Character: React.FC<{
  pose: keyof typeof POSES;
  time: number;
  x: number;
  y: number;
  width: number;
  generated?: boolean;
}> = ({ pose, time, x, y, width, generated = false }) => {
  const { fps } = useVideoConfig();
  const src = staticFile(`imagenes/personajes/${POSES[pose]}`);
  const blinkAt = pose === "tired" ? 6.28 : 8.96;
  const blink = Math.max(0, 1 - Math.abs(time - blinkAt) / 0.075);
  const eyes =
    pose === "tired"
      ? [[520, 185]]
      : [
          [455, 185],
          [535, 177],
        ];
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - width * 0.75,
        width,
        height: width * 1.5,
        transformOrigin: "50% 67%",
        rotate: `${Math.sin(time * 1.8) * 0.48}deg`,
        scale: `1 ${1 + Math.sin(time * 2.1) * 0.005}`,
        translate: `0 ${Math.sin(time * 1.8) * 3}px`,
      }}
    >
      {generated ? (
        <>
          <Video
            src={staticFile(
              "piloto10s/video/personaje_higgsfield_original.mp4",
            )}
            muted
            trimBefore={0.5 * fps}
            premountFor={fps}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              maskImage: `url("${src}")`,
              maskSize: "100% 100%",
              maskMode: "alpha",
              maskRepeat: "no-repeat",
            }}
          />
          {/* Lock the original mouth independently of the generated idle motion. */}
          <Img
            src={src}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              clipPath: "ellipse(3.4% 2.5% at 50.1% 18.4%)",
            }}
          />
        </>
      ) : (
        <>
          <Img
            src={src}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
          <svg
            viewBox="0 0 1024 1536"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: blink,
            }}
            aria-hidden
          >
            {eyes.map(([cx, cy]) => (
              <g key={cx}>
                <ellipse cx={cx} cy={cy} rx="34" ry="24" fill="#FFA362" />
                <path
                  d={`M${cx - 29} ${cy} Q${cx} ${cy + 13} ${cx + 29} ${cy - 2}`}
                  stroke="#5C3021"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>
        </>
      )}
    </div>
  );
};
