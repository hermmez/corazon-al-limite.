import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BasicCaptions } from "./basic-captions";
import { ramp } from "./motion";
import type { SceneSpec } from "./types";

export const DynamicSubtitles: React.FC<{ scene: SceneSpec }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const starts = scene.captions
    .filter((_, i) => i === 0 || scene.captions[i - 1].pageBreakAfter)
    .map((c) => c.startMs / 1000);
  const start = starts.filter((t) => t <= seconds).slice(-1)[0] ?? 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 1510,
        width: 820,
        translate: `0 ${(1 - ramp(seconds, start, start + 0.16)) * 12}px`,
      }}
    >
      <div
        style={{ width: 950, transform: "scale(0.86)", transformOrigin: "0 0" }}
      >
        <BasicCaptions
          width={950}
          premountFor={fps}
          combineTokensWithinMilliseconds={100000}
          captions={scene.captions}
        />
      </div>
    </div>
  );
};
export const NarrationTrack: React.FC<{ scene: SceneSpec }> = ({ scene }) => {
  const { fps } = useVideoConfig();
  return scene.narration.src ? (
    <Sequence from={Math.round((scene.narration.startSeconds ?? 0) * fps)} premountFor={fps}>
    <Audio
      src={staticFile(scene.narration.src)}
      trimBefore={Math.round((scene.narration.offsetSeconds ?? 0) * fps)}
      trimAfter={scene.narration.durationSeconds === undefined ? undefined : Math.round(((scene.narration.offsetSeconds ?? 0) + scene.narration.durationSeconds) * fps)}
      premountFor={fps}
    />
    </Sequence>
  ) : null;
};
