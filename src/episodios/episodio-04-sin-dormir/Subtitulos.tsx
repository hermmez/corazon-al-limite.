import React from "react";
import type {Caption} from "@remotion/captions";
import {useCurrentFrame, useVideoConfig} from "remotion";
import captions from "./captions.json";
import timeline from "./timeline.json";

const pages: {text: string; startMs: number; endMs: number}[] = [];
let group: Caption[] = [];
for (const caption of captions as Caption[]) {
  group.push(caption);
  if (caption.pageBreakAfter) {
    pages.push({text: group.map(word => word.text).join("").trim(), startMs: group[0].startMs, endMs: group[group.length - 1].endMs});
    group = [];
  }
}

// A single continuous voice track spans the eight scenes. Each caption group
// follows its scene's parent sequence and the measured global audio timeline.
export const Subtitulos: React.FC<{sceneId: number}> = ({sceneId}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const window = timeline.sceneWindows[sceneId];
  const time = (window.startFrame + frame) * 1000 / fps;
  const page = pages.find(item => item.startMs >= window.start * 1000 - 1 && item.startMs < window.end * 1000 && time >= item.startMs && time < item.endMs);
  if (!page) return null;
  return <div style={{position: "absolute", left: 76, top: sceneId === 3 ? 520 : 320, width: 928, color: "#fff4dc", fontFamily: "Arial, sans-serif", fontSize: 44, fontWeight: 700, lineHeight: 1.16, textAlign: "center", textWrap: "balance", WebkitTextStroke: "1px #071321", paintOrder: "stroke fill", textShadow: "0 3px 5px #071321, 0 0 12px #071321", pointerEvents: "none"}}>{page.text}</div>;
};
