import React from "react";
import { Audio } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";
import { PilotCaptions } from "./Captions";
import type { Caption } from "@remotion/captions";
export const NarrationAndSound: React.FC<{ time: number; masterSrc?: string; captions?: Caption[] }> = ({ time, masterSrc = "piloto10s/audio/mezcla_master.wav", captions }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio
        src={staticFile(masterSrc)}
        premountFor={fps}
      />
      <PilotCaptions time={time} captions={captions} />
    </>
  );
};
