import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import scriptJson from "./PrimerVideoSueno/script.json";
import { loadStoryScript } from "./video-2d/script";
import { Backdrop, Camera2D, FlowBridge, HeroTitle } from "./video-2d/Visuals";
import { DynamicSubtitles, NarrationTrack } from "./video-2d/Subtitles";
import { C, cameraAt, darkAt, inkAt } from "./video-2d/motion";
import { Hook } from "./PrimerVideoSueno/scenes/Hook";
import { Brain } from "./PrimerVideoSueno/scenes/Brain";
import { Attention } from "./PrimerVideoSueno/scenes/Attention";
import { Mood } from "./PrimerVideoSueno/scenes/Mood";
import { Appetite } from "./PrimerVideoSueno/scenes/Appetite";
import { Health } from "./PrimerVideoSueno/scenes/Health";
import { Rest } from "./PrimerVideoSueno/scenes/Rest";
import { Closing } from "./PrimerVideoSueno/scenes/Closing";
import type { PrimerVideoProps, StoryScript } from "./video-2d/types";
export { calculateSuenoMetadata } from "./PrimerVideoSueno/narration";
export const sleepScript = loadStoryScript(scriptJson);
export type { PrimerVideoProps } from "./video-2d/types";
const StoryClip: React.FC<{
  index: number;
  time: number;
  startAtSeconds: number;
  children: React.ReactNode;
  script: StoryScript;
}> = ({ index, time, startAtSeconds, children, script }) => {
  const { fps } = useVideoConfig();
  const scene = script.scenes[index];
  return (
    <Sequence
      name={scene.label}
      from={Math.round((scene.start - startAtSeconds) * fps) - Math.round(1.2 * fps)}
      durationInFrames={Math.round((scene.end - scene.start) * fps) + Math.round(2.4 * fps)}
      premountFor={fps}
    >
      <Camera2D index={index} camera={cameraAt(time, script.scenes)}>
        {children}
      </Camera2D>
      <Sequence
        name="Guion, subtítulos y voz futura"
        from={1.2 * fps}
        durationInFrames={Math.round((scene.end - scene.start) * fps)}
        premountFor={fps}
      >
        <HeroTitle
          scene={scene}
          local={time - scene.start}
          dark={darkAt(time, script.scenes)}
        />
        <DynamicSubtitles scene={scene} />
        <NarrationTrack scene={scene} />
      </Sequence>
    </Sequence>
  );
};
export const PrimerVideoSueno: React.FC<PrimerVideoProps> = ({
  startAtSeconds = 0,
  resolvedScript = sleepScript,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps + startAtSeconds;
  const duration = resolvedScript.durationSeconds;
  const camera = cameraAt(time, resolvedScript.scenes),
    dark = darkAt(time, resolvedScript.scenes);
  const s = resolvedScript.scenes;
  return (
    <AbsoluteFill
      style={{
        fontFamily: "Arial, sans-serif",
        color: inkAt(dark),
        overflow: "hidden",
        background: C.cream,
      }}
    >
      <Backdrop time={time} dark={dark} camera={camera} />
      <StoryClip index={0} time={time} startAtSeconds={startAtSeconds} script={resolvedScript}>
        <Hook scene={s[0]} time={time} />
      </StoryClip>
      {s[1] && <StoryClip index={1} time={time} startAtSeconds={startAtSeconds} script={resolvedScript}>
        <Brain scene={s[1]} time={time} />
      </StoryClip>}
      {s[2] && <StoryClip index={2} time={time} startAtSeconds={startAtSeconds} script={resolvedScript}>
        <Attention scene={s[2]} time={time} />
      </StoryClip>}
      {s[3] && <StoryClip index={3} time={time} startAtSeconds={startAtSeconds} script={resolvedScript}>
        <Mood scene={s[3]} time={time} />
      </StoryClip>}
      {s[4] && <StoryClip index={4} time={time} startAtSeconds={startAtSeconds} script={resolvedScript}>
        <Appetite scene={s[4]} time={time} />
      </StoryClip>}
      {s[5] && <StoryClip index={5} time={time} startAtSeconds={startAtSeconds} script={resolvedScript}>
        <Health scene={s[5]} time={time} />
      </StoryClip>}
      {s[6] && <StoryClip index={6} time={time} startAtSeconds={startAtSeconds} script={resolvedScript}>
        <Rest scene={s[6]} time={time} />
      </StoryClip>}
      {s[7] && <StoryClip index={7} time={time} startAtSeconds={startAtSeconds} script={resolvedScript}>
        <Closing scene={s[7]} time={time} />
      </StoryClip>}
      <FlowBridge time={time} scenes={s} camera={camera} />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 107,
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: 4,
        }}
      >
        CORAZÓN AL LÍMITE
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 1728,
          width: 820,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 23,
          letterSpacing: 2,
          opacity: 0.7,
        }}
      >
        <span>{resolvedScript.shortTitle}</span>
        <span>
          {Math.min(duration, Math.floor(time)).toString().padStart(2, "0")} / {duration}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 1700,
          width: 820,
          height: 4,
          background: dark > 0.5 ? "#fff4e022" : "#112c4722",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(1, time / (duration - 1 / fps)) * 100}%`,
            background: C.teal,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
