import React from "react";
import { Composition, Folder } from "remotion";
import { Prueba2D } from "./Prueba2D";
import { Presentacion } from "./Prueba2D/Presentacion";
import { Cansancio } from "./Prueba2D/Cansancio";
import { Cerebro } from "./Prueba2D/Cerebro";
import { Recuperacion } from "./Prueba2D/Recuperacion";
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
      <Composition
        id="Prueba2D"
        component={Prueba2D}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Prueba2D-Escenas">
        <Composition id="Prueba2D-Introduccion" component={Presentacion} durationInFrames={222} fps={30} width={1080} height={1920} />
        <Composition id="Prueba2D-Cansancio" component={Cansancio} durationInFrames={252} fps={30} width={1080} height={1920} />
        <Composition id="Prueba2D-Cerebro" component={Cerebro} durationInFrames={252} fps={30} width={1080} height={1920} />
        <Composition id="Prueba2D-Descanso" component={Recuperacion} durationInFrames={210} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};