import React from "react";
import { Composition } from "remotion";
import { CorazonAlLimite } from "./CorazonAlLimite";
import {UltimoCaballero} from './episodios/ultimo-caballero/Episode';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="UltimoCaballero" component={UltimoCaballero} durationInFrames={2100} fps={30} width={1080} height={1920}/>
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
