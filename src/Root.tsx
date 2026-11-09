import React from "react";
import { Composition } from "remotion";
import { Episodio12Fusible } from "./episodios/episodio-12-fusible";
import { Episode09Registrations } from "./episodio09/Registrations";
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
      <Episode09Registrations />
      <Composition id="Episodio12Fusible" component={Episodio12Fusible} durationInFrames={2100} fps={30} width={1080} height={1920} />
    </>
  );
};