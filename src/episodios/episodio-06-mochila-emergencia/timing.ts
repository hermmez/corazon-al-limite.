import {useCurrentFrame, useVideoConfig} from "remotion";
import chapters from "./chapters.json";
import timeline from "./timeline.json";

export const windows = timeline.sceneWindows;
export const voiceReady: boolean = timeline.voiceReady;
export const useLocalSeconds = () => useCurrentFrame() / useVideoConfig().fps;

type SpokenWord = {word: string; start: number; end: number};
const spokenWords: SpokenWord[] = timeline.events;
const normalize = (word: string) => word.toLocaleLowerCase("es").replace(/[^\p{L}\p{N}]/gu, "");
let offset = 0;
const wordsByScene = chapters.map(({text}) => {
  const length = text.split(/\s+/).length;
  const segment = spokenWords.slice(offset, offset + length);
  offset += length;
  return segment;
});

export const cue = (scene: number, phrase: string, rehearsalTime: number) => {
  if (!voiceReady) return rehearsalTime;
  const target = phrase.split(/\s+/).map(normalize);
  const words = wordsByScene[scene];
  const index = words.findIndex((_, first) => target.every((token, n) => normalize(words[first + n]?.word ?? "") === token));
  if (index < 0) throw new Error(`Falta marca acústica en escena ${scene + 1}: ${phrase}`);
  return Math.max(0, words[index].start - windows[scene].start);
};

export const sceneLength = (scene: number) => windows[scene].end - windows[scene].start;
