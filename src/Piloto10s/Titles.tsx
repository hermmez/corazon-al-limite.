import React from "react";
import { spring, useVideoConfig } from "remotion";
import { C, p } from "./motion";

export const SceneTitle: React.FC<{
  time: number;
  start: number;
  end: number;
  label: string;
  lines: string[];
  sizes: number[];
  accent: string;
  dark?: boolean;
  note?: string;
}> = ({
  time,
  start,
  end,
  label,
  lines,
  sizes,
  accent,
  dark = false,
  note,
}) => {
  const { fps } = useVideoConfig();
  const exit = 1 - p(time, end - 0.13, end);
  return (
    <div
      style={{
        position: "absolute",
        left: 86,
        top: 210,
        width: 850,
        color: dark ? C.cream : C.ink,
        clipPath: `inset(0 0 ${(1 - exit) * 100}% 0)`,
      }}
    >
      <div
        style={{
          fontSize: 23,
          fontWeight: 800,
          letterSpacing: 3.5,
          marginBottom: 36,
          color: dark ? C.teal : "#39726D",
          opacity: p(time, start, start + 0.16),
        }}
      >
        {label}
      </div>
      {lines.map((line, i) => {
        const enter = spring({
          frame: (time - start - i * 0.055) * fps,
          fps,
          config: { damping: 200 },
          durationInFrames: Math.round(0.42 * fps),
        });
        return (
          <div
            key={line}
            style={{ overflow: "hidden", height: sizes[i] * 1.08 }}
          >
            <div
              style={{
                fontSize: sizes[i],
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: -3,
                whiteSpace: "nowrap",
                translate: `0 ${(1 - enter) * 110}%`,
                color: i === lines.length - 1 ? accent : undefined,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
      {note && (
        <div
          style={{
            marginTop: 23,
            fontSize: 25,
            lineHeight: 1.35,
            fontWeight: 700,
            letterSpacing: 1,
            opacity: p(time, start + 0.18, start + 0.42),
            color: dark ? "#FFF4E0CC" : "#35515F",
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
};
