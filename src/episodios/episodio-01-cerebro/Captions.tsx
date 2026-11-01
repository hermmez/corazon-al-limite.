import React, { useMemo } from "react";
import { type Caption } from "@remotion/captions";
import { spring } from "remotion";
import { C } from "./primitives";
import aligned from "./captions.json";
type Word = Caption & { pageBreakAfter?: boolean };

// Input comes from acoustic word alignment. No text-length timing fallback.
export const EpisodeCaptions: React.FC<{ time: number }> = ({ time }) => {
  const groups = useMemo(() => {
    const result: Word[][] = [];
    let group: Word[] = [];
    for (const word of aligned as Word[]) {
      group.push(word);
      if (word.pageBreakAfter) {
        result.push(group);
        group = [];
      }
    }
    return result;
  }, []);
  const words = groups.find(
    (g, i) =>
      time * 1000 >= g[0].startMs &&
      time * 1000 <
        Math.min(
          g[g.length - 1].endMs + 220,
          groups[i + 1]?.[0].startMs ?? 70000,
        ),
  );
  if (!words) return null;
  const enter = spring({
    frame: (time - words[0].startMs / 1000) * 30,
    fps: 30,
    config: { damping: 200 },
    durationInFrames: 7,
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
        translate: `0 ${(1 - enter) * 12}px`,
        opacity: 0.7 + 0.3 * enter,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          maxWidth: 850,
          padding: "19px 26px 23px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 12px",
          borderRadius: 23,
          background: C.navy,
          boxShadow: "0 8px 26px #07132125",
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1.18,
          textAlign: "center",
          letterSpacing: -1.1,
          color: "white",
        }}
      >
        {words.map((word, i) => {
          const active =
            time * 1000 >= word.startMs && time * 1000 < word.endMs;
          const important =
            /cerebr|dolor|nocicept|migraña|meninges|nerv|anestesia|despiert|médic/.test(
              word.text.toLowerCase(),
            );
          return (
            <span
              key={i}
              style={{
                color: active ? (important ? C.gold : C.coral) : "#FFF9EF",
                textShadow: "0 2px 3px #0003",
                scale: active ? "1.025" : "1",
              }}
            >
              {word.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};
