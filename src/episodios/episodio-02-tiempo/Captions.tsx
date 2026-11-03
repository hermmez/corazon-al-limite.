import React, { useMemo } from "react";
import { type Caption } from "@remotion/captions";
import { spring, useVideoConfig } from "remotion";
import { C, lift } from "./motion";
import aligned from "./captions.json";
export const CaptionsTiempo: React.FC<{ time: number }> = ({ time }) => {
  const { fps } = useVideoConfig();
  const groups = useMemo(() => {
    const all: Caption[][] = [];
    let g: Caption[] = [];
    for (const w of aligned as Caption[]) {
      g.push(w);
      if (w.pageBreakAfter) {
        all.push(g);
        g = [];
      }
    }
    return all;
  }, []);
  const g = groups.find(
    (g, i) =>
      time * 1000 >= g[0].startMs &&
      time * 1000 <
        Math.min(
          g[g.length - 1].endMs + 110,
          groups[i + 1]?.[0].startMs ?? 70000,
        ),
  );
  if (!g) return null;
  const enter = spring({
    frame: (time - g[0].startMs / 1000) * fps,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.18 * fps),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 86,
        top: 1480,
        width: 850,
        display: "flex",
        justifyContent: "center",
        translate: `0 ${(1 - enter) * 8}px`,
        opacity: 0.8 + 0.2 * enter,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          maxWidth: 850,
          padding: "17px 24px 21px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 12px",
          borderRadius: 23,
          background: C.navy,
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1.18,
          textAlign: "center",
          letterSpacing: -1.1,
          color: "white",
          boxShadow: "0 7px 24px #07132120",
        }}
      >
        {g.map((w, i) => {
          const active = time * 1000 >= w.startMs && time * 1000 < w.endMs;
          const important =
            /tiempo|recuerd|reloj|diciembre|nueva|memoria|atención|vive|experiencia|perspectiva|disting/.test(
              w.text.toLowerCase(),
            );
          return (
            <span
              key={i}
              style={{
                color: active ? (important ? C.gold : C.coral) : "#FFF9EF",
                textShadow: "0 2px 2px #0003",
              }}
            >
              {w.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};
