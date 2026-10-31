import React from "react";
import { Composition, Folder } from "remotion";
import { DemoProfesional2D } from "./DemoProfesional2D";
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
      <Composition
        id="DemoProfesional2D"
        component={DemoProfesional2D}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{startAtSeconds: 0}}
      />
      <Folder name="DemoProfesional2D-Escenas">
        <Composition id="DemoProfesional2D-Miedo" component={DemoProfesional2D} durationInFrames={210} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 0}} />
        <Composition id="DemoProfesional2D-Cerebro" component={DemoProfesional2D} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 7}} />
        <Composition id="DemoProfesional2D-Corazon" component={DemoProfesional2D} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 15}} />
        <Composition id="DemoProfesional2D-Respuesta" component={DemoProfesional2D} durationInFrames={210} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 23}} />
      </Folder>
    </>
  );
};