import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./Art";
export type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};
export const Captions = ({
  captions,
  final = false,
}: {
  captions: Caption[];
  final?: boolean;
}) => {
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig(),
    now = (frame / fps) * 1000;
  const pages: Caption[][] = [];
  let page: Caption[] = [];
  for (const c of captions) {
    if (
      page.length &&
      (page.length >= 5 || c.startMs - page[page.length - 1].endMs > 350)
    ) {
      pages.push(page);
      page = [];
    }
    page.push(c);
    if (/[.?:]$/.test(c.text)) {
      pages.push(page);
      page = [];
    }
  }
  if (page.length) pages.push(page);
  const active = pages.find(
    (p) => now >= p[0].startMs - 50 && now <= p[p.length - 1].endMs + 100,
  );
  if (!active || (final && now > 7500)) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 1455,
        left: 95,
        right: 145,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "16px 25px",
          background: "rgba(13,30,41,.91)",
          borderRadius: 16,
          color: C.cream,
          fontFamily: "Arial, sans-serif",
          fontSize: 51,
          fontWeight: 700,
          lineHeight: 1.2,
          textAlign: "center",
          textShadow: "0 2px 4px #0005",
        }}
      >
        {active.map((c, i) => (
          <span
            key={i}
            style={{
              color: /2027|inteligencia|artificial|Taiwán|futuro/i.test(c.text)
                ? C.gold
                : C.cream,
            }}
          >
            {(i ? " " : "") + c.text.trim()}
          </span>
        ))}
      </div>
    </div>
  );
};
