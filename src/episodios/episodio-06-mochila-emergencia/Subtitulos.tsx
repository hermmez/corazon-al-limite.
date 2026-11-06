import React from "react";
import type {Caption} from "@remotion/captions";
import {interpolate} from "remotion";
import {clamp} from "../episodio-04-sin-dormir/visuals";
import captions from "./captions.json";
import {useLocalSeconds, windows} from "./timing";

type Page = {scene: number; words: Caption[]};
const pages: Page[] = [];
let words: Caption[] = [];
for (const caption of captions as Caption[]) {
  words.push(caption);
  if (caption.pageBreakAfter) {
    const scene = windows.findIndex(window => words[0].startMs >= Math.round(window.start * 1000) && words[0].startMs < Math.round(window.end * 1000));
    pages.push({scene, words});
    words = [];
  }
}

export const Subtitulos: React.FC<{scene: number}> = ({scene}) => {
  const time = (useLocalSeconds() + windows[scene].start) * 1000;
  const page = pages.find(p => p.scene === scene && time >= p.words[0].startMs && time < p.words[p.words.length - 1].endMs);
  if (!page) return null;
  const entrance = interpolate(time - page.words[0].startMs, [0, 80], [0, 1], clamp);
  return <div style={{position:"absolute", left:80, top:128, width:920, fontFamily:"Arial, sans-serif", fontSize:50, lineHeight:1.14, textAlign:"center", fontWeight:800, color:"#fff5dc", WebkitTextStroke:"1.5px #071521", paintOrder:"stroke fill", textShadow:"0 3px 9px #071521, 0 0 24px #071521", textWrap:"balance", whiteSpace:"pre-wrap", opacity:.7+.3*entrance, translate:`0px ${7*(1-entrance)}px`}}>
    {page.words.map((word, i) => <span key={i} style={{opacity:time >= word.startMs ? 1 : 0}}>{word.text}</span>)}
  </div>;
};
