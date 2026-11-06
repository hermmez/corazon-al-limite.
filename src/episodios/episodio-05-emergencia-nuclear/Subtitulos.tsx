import React from "react";
import type {Caption} from "@remotion/captions";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import captions from "./captions.json";
import timeline from "./timeline.json";
const pages: Caption[][] = [];
let group: Caption[] = [];
for (const caption of captions as Caption[]) {
  group.push(caption);
  if (caption.pageBreakAfter) { pages.push(group); group = []; }
}
export const Subtitulos: React.FC<{sceneId: number}> = ({sceneId}) => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig(), win = timeline.sceneWindows[sceneId];
  const ms = (frame + win.startFrame) * 1000 / fps;
  const page = pages.find(p => p[0].startMs >= win.start * 1000 - 1 && p[0].startMs < win.end * 1000 && ms >= p[0].startMs && ms < p[p.length - 1].endMs);
  if (!page) return null;
  const entry = interpolate(ms - page[0].startMs, [0, 75], [.7, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <div style={{position: "absolute", left: 80, top: 135, width: 920, fontFamily: "Arial, sans-serif", fontSize: 50, fontWeight: 800, lineHeight: 1.14, textAlign: "center", textWrap: "balance", color: "#fff4dc", WebkitTextStroke: "1.4px #071321", paintOrder: "stroke fill", textShadow: "0 3px 7px #071321,0 0 16px #071321", whiteSpace: "pre-wrap", opacity: entry, translate: "0px " + ((1 - entry) * 8) + "px"}}>
    {page.map((word, i) => <span key={i} style={{opacity: ms >= word.startMs ? 1 : 0}}>{word.text}</span>)}
  </div>;
};
