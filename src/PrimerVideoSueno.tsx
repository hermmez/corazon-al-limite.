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
export const sleepScript = loadStoryScript(scriptJson);
export type PrimerVideoProps = { startAtSeconds: number };
const StoryClip: React.FC<{
  index: number;
  time: number;
  startAtSeconds: number;
  children: React.ReactNode;
}> = ({ index, time, startAtSeconds, children }) => {
  const { fps } = useVideoConfig();
  const scene = sleepScript.scenes[index];
  return (
    <Sequence
      name={scene.label}
      from={(scene.start - startAtSeconds - 1.2) * fps}
      durationInFrames={(scene.end - scene.start + 2.4) * fps}
      premountFor={fps}
    >
      <Camera2D index={index} camera={cameraAt(time, sleepScript.scenes)}>
        {children}
      </Camera2D>
      <Sequence
        name="Guion, subtítulos y voz futura"
        from={1.2 * fps}
        durationInFrames={(scene.end - scene.start) * fps}
        premountFor={fps}
      >
        <HeroTitle
          scene={scene}
          local={time - scene.start}
          dark={darkAt(time, sleepScript.scenes)}
        />
        <DynamicSubtitles scene={scene} />
        <NarrationTrack scene={scene} />
      </Sequence>
    </Sequence>
  );
};
export const PrimerVideoSueno: React.FC<PrimerVideoProps> = ({
  startAtSeconds = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps + startAtSeconds;
  const duration = sleepScript.durationSeconds;
  const camera = cameraAt(time, sleepScript.scenes),
    dark = darkAt(time, sleepScript.scenes);
  const s = sleepScript.scenes;
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
      <StoryClip index={0} time={time} startAtSeconds={startAtSeconds}>
        <Hook scene={s[0]} time={time} />
      </StoryClip>
      <StoryClip index={1} time={time} startAtSeconds={startAtSeconds}>
        <Brain scene={s[1]} time={time} />
      </StoryClip>
      <StoryClip index={2} time={time} startAtSeconds={startAtSeconds}>
        <Attention scene={s[2]} time={time} />
      </StoryClip>
      <StoryClip index={3} time={time} startAtSeconds={startAtSeconds}>
        <Mood scene={s[3]} time={time} />
      </StoryClip>
      <StoryClip index={4} time={time} startAtSeconds={startAtSeconds}>
        <Appetite scene={s[4]} time={time} />
      </StoryClip>
      <StoryClip index={5} time={time} startAtSeconds={startAtSeconds}>
        <Health scene={s[5]} time={time} />
      </StoryClip>
      <StoryClip index={6} time={time} startAtSeconds={startAtSeconds}>
        <Rest scene={s[6]} time={time} />
      </StoryClip>
      <StoryClip index={7} time={time} startAtSeconds={startAtSeconds}>
        <Closing scene={s[7]} time={time} />
      </StoryClip>
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
        <span>{sleepScript.shortTitle}</span>
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
