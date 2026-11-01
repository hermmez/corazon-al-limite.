import React, { useId } from "react";

// Invisible SVG masks work in the same world coordinates as the camera and art.
export const SpatialMask: React.FC<{
  children: React.ReactNode;
  center?: { x: number; y: number };
  radius?: number;
  invert?: boolean;
  scan?: number;
}> = ({
  children,
  center = { x: 540, y: 740 },
  radius = 0,
  invert = false,
  scan,
}) => {
  const id = `fluid-mask-${useId().replace(/:/g, "")}`;
  return (
    <svg
      width="1080"
      height="1920"
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={`${id}-edge`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1={920 + 560 * (scan ?? 0) - 28}
          y2={920 + 560 * (scan ?? 0)}
        >
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask
          id={id}
          x="0"
          y="0"
          width="1080"
          height="1920"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "luminance" }}
        >
          <rect width="1080" height="1920" fill={invert ? "white" : "black"} />
          {scan === undefined ? (
            <circle
              cx={center.x}
              cy={center.y}
              r={Math.max(0, radius)}
              fill={invert ? "black" : "white"}
            />
          ) : (
            <rect
              x="0"
              width="1080"
              height={scan >= 1 ? 1920 : 560 * Math.max(0, Math.min(1, scan))}
              y={scan >= 1 ? 0 : 920}
              fill={scan >= 1 ? "white" : `url(#${id}-edge)`}
            />
          )}
        </mask>
      </defs>
      <foreignObject
        x="0"
        y="0"
        width="1080"
        height="1920"
        mask={`url(#${id})`}
      >
        <div style={{ position: "relative", width: 1080, height: 1920 }}>
          {children}
        </div>
      </foreignObject>
    </svg>
  );
};
