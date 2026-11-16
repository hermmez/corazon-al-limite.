import React from "react";
import { Composition } from "remotion";
import { CorazonAlLimite } from "./CorazonAlLimite";
import {PezLunaOceanico} from './episodios/pez-luna-oceanico/Episode';
import {SunfishHook} from './episodios/pez-luna-oceanico/Scene1';
import {SunfishAnatomy} from './episodios/pez-luna-oceanico/Scene2';
import {SunfishSwimming} from './episodios/pez-luna-oceanico/Scene3';
import {SunfishDiving} from './episodios/pez-luna-oceanico/Scene4';
import {SunfishFeeding} from './episodios/pez-luna-oceanico/Scene5';
import {SunfishSurface} from './episodios/pez-luna-oceanico/Scene6';
import {SunfishQuestion} from './episodios/pez-luna-oceanico/Scene7';

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
      <Composition id="PezLunaOceanico" component={PezLunaOceanico} durationInFrames={2100} fps={30} width={1080} height={1920}/>
      <Composition id="PezLunaGancho" component={SunfishHook} durationInFrames={240} fps={30} width={1080} height={1920}/>
      <Composition id="PezLunaAnatomia" component={SunfishAnatomy} durationInFrames={330} fps={30} width={1080} height={1920}/>
      <Composition id="PezLunaNado" component={SunfishSwimming} durationInFrames={270} fps={30} width={1080} height={1920}/>
      <Composition id="PezLunaInmersion" component={SunfishDiving} durationInFrames={330} fps={30} width={1080} height={1920}/>
      <Composition id="PezLunaAlimentacion" component={SunfishFeeding} durationInFrames={300} fps={30} width={1080} height={1920}/>
      <Composition id="PezLunaSuperficie" component={SunfishSurface} durationInFrames={300} fps={30} width={1080} height={1920}/>
      <Composition id="PezLunaPregunta" component={SunfishQuestion} durationInFrames={330} fps={30} width={1080} height={1920}/>
    </>
  );
};
