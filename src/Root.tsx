import React from "react";
import { Composition } from "remotion";
import { CorazonAlLimite } from "./CorazonAlLimite";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CorazonAlLimite"
        component={CorazonAlLimite}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};