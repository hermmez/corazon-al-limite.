import { Episodio02Tiempo } from "./episodios/episodio-02-tiempo";
import { Episodio05EmergenciaNuclear } from "./episodios/episodio-05-emergencia-nuclear";
import { Episodio04SinDormir, BedroomScene, AttentionScene, MicrosleepScene, RoadScene, FunctionsScene, CoffeeScene, PerceptionScene, ClosingScene } from "./episodios/episodio-04-sin-dormir";
import React from "react";
import { Episodio01Cerebro as Episodio01CerebroAprobado } from "./episodios/episodio-01-cerebro";
import { Episodio01Cerebro125 } from "./episodios/episodio-01-cerebro-125";
import paceTimeline from "./episodios/episodio-01-cerebro-125/timeline.json";
import { Composition, Folder } from "remotion";
import { CorazonPiloto10s } from "./Piloto10s";
import { PrimerVideoSueno, calculateSuenoMetadata } from "./PrimerVideoSueno";
import { DemoProfesional2DFluida } from "./DemoProfesional2DFluida";
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
      <Composition id="Episodio02Tiempo" component={Episodio02Tiempo} durationInFrames={2100} fps={30} width={1080} height={1920} />
      <Composition id="Episodio05EmergenciaNuclear" component={Episodio05EmergenciaNuclear} durationInFrames={2100} fps={30} width={1080} height={1920} />
      <Composition id="Episodio04SinDormir" component={Episodio04SinDormir} durationInFrames={2100} fps={30} width={1080} height={1920} />
      <Folder name="Episodio04-Escenas">
        <Composition id="Ep04Noche" component={BedroomScene} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="Ep04Atencion" component={AttentionScene} durationInFrames={270} fps={30} width={1080} height={1920} />
        <Composition id="Ep04Microsuenos" component={MicrosleepScene} durationInFrames={270} fps={30} width={1080} height={1920} />
        <Composition id="Ep04Carretera" component={RoadScene} durationInFrames={270} fps={30} width={1080} height={1920} />
        <Composition id="Ep04Funciones" component={FunctionsScene} durationInFrames={270} fps={30} width={1080} height={1920} />
        <Composition id="Ep04Cafeina" component={CoffeeScene} durationInFrames={270} fps={30} width={1080} height={1920} />
        <Composition id="Ep04Percepcion" component={PerceptionScene} durationInFrames={270} fps={30} width={1080} height={1920} />
        <Composition id="Ep04Cierre" component={ClosingScene} durationInFrames={240} fps={30} width={1080} height={1920} />
      </Folder>
      <Composition id="Episodio01Cerebro" component={paceTimeline.audioReady ? Episodio01Cerebro125 : Episodio01CerebroAprobado} durationInFrames={2100} fps={30} width={1080} height={1920} />
      <Composition id="Episodio01Cerebro125" component={Episodio01Cerebro125} durationInFrames={2100} fps={30} width={1080} height={1920} />
      <Composition id="Episodio01CerebroAprobado" component={Episodio01CerebroAprobado} durationInFrames={2100} fps={30} width={1080} height={1920} />
      <Composition id="CorazonPiloto10s" component={CorazonPiloto10s} durationInFrames={300} fps={30} width={1080} height={1920} />
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
      <Composition
        id="DemoProfesional2DFluida"
        component={DemoProfesional2DFluida}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{startAtSeconds: 0}}
      />
      <Folder name="DemoProfesional2DFluida-Escenas">
        <Composition id="DemoProfesional2DFluida-Miedo" component={DemoProfesional2DFluida} durationInFrames={210} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 0}} />
        <Composition id="DemoProfesional2DFluida-Cerebro" component={DemoProfesional2DFluida} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 7}} />
        <Composition id="DemoProfesional2DFluida-Corazon" component={DemoProfesional2DFluida} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 15}} />
        <Composition id="DemoProfesional2DFluida-Respuesta" component={DemoProfesional2DFluida} durationInFrames={210} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 23}} />
      </Folder>
      <Composition id="PrimerVideoSueno" component={PrimerVideoSueno} durationInFrames={2700} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 0, narrationManifest: "voz/primer-video-sueno/manifest.json", narrationTiming: "extend"}} calculateMetadata={calculateSuenoMetadata} />
      <Composition id="PruebaVozElevenLabs" component={PrimerVideoSueno} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 0, narrationManifest: "voz/prueba/manifest.json", narrationTiming: "audio", voiceTest: true}} calculateMetadata={calculateSuenoMetadata} />
      <Folder name="PrimerVideoSueno-Escenas">
        <Composition id="Sueno-01-Gancho" component={PrimerVideoSueno} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 0}} />
        <Composition id="Sueno-02-Cerebro" component={PrimerVideoSueno} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 10}} />
        <Composition id="Sueno-03-Atencion" component={PrimerVideoSueno} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 22}} />
        <Composition id="Sueno-04-Animo" component={PrimerVideoSueno} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 34}} />
        <Composition id="Sueno-05-Apetito" component={PrimerVideoSueno} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 46}} />
        <Composition id="Sueno-06-Salud" component={PrimerVideoSueno} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 58}} />
        <Composition id="Sueno-07-Descanso" component={PrimerVideoSueno} durationInFrames={360} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 70}} />
        <Composition id="Sueno-08-Cierre" component={PrimerVideoSueno} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{startAtSeconds: 82}} />
      </Folder>
    </>
  );
};
