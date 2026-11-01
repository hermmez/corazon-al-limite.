import React, { useMemo } from "react";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { spring, useVideoConfig } from "remotion";
import { C } from "./motion";
import words from "./captions.json";

// Custom token renderer satisfies the requested heavy type and word emphasis.
// Timing remains the actual audio alignment in the standard Remotion Caption JSON.
export const PilotCaptions: React.FC<{ time: number; captions?: Caption[] }> = ({ time, captions = words as Caption[] }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: 100000,
      }).pages,
    [captions],
  );
  const page = pages.find(
    (pg, i) =>
      time * 1000 >= pg.startMs &&
      time * 1000 < (pages[i + 1]?.startMs ?? pg.startMs + pg.durationMs + 250),
  );
  if (!page) return null;
  const enter = spring({
    frame: (time - page.startMs / 1000) * fps,
    fps,
    config: { damping: 200 },
    durationInFrames: 7,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 86,
        top: 1476,
        width: 850,
        display: "flex",
        justifyContent: "center",
        translate: `0 ${(1 - enter) * 12}px`,
        opacity: 0.65 + 0.35 * enter,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          background: C.navy,
          borderRadius: 24,
          padding: "20px 26px 23px",
          boxShadow: "0 8px 25px #07132118",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0 12px",
          maxWidth: 850,
          fontSize: 57,
          lineHeight: 1.17,
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: -1.2,
          color: "white",
        }}
      >
        {page.tokens.map((token, i) => {
          const active =
            time * 1000 >= token.fromMs && time * 1000 < token.toMs;
          const important =
            /poco|habitual|presión|arterial|riesgo|cardiovascular|corazón|descanso/i.test(
              token.text,
            );
          return (
            <span
              key={i}
              style={{
                color: active ? (important ? C.gold : C.teal) : "#FFF9EF",
                textShadow: "0 2px 2px #0002",
                scale: active ? "1.025" : "1",
                transformOrigin: "50% 80%",
              }}
            >
              {token.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};
