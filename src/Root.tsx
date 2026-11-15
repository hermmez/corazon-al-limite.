import React from "react";
import { Composition } from "remotion";
import { CorazonAlLimite } from "./CorazonAlLimite";
import {CarneMexico2027} from './episodios/carne-mexico-2027/Episode';
import {MeatHook} from './episodios/carne-mexico-2027/Scene1';
import {MeatForecasts} from './episodios/carne-mexico-2027/Scene2';
import {ProductionCosts} from './episodios/carne-mexico-2027/Scene3';
import {RouteSecurity} from './episodios/carne-mexico-2027/Scene4';
import {InternationalSupply} from './episodios/carne-mexico-2027/Scene5';
import {PriceExample} from './episodios/carne-mexico-2027/Scene6';
import {ForecastAndQuestion} from './episodios/carne-mexico-2027/Scene7';

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
      <Composition id="CarneMexico2027" component={CarneMexico2027} durationInFrames={2100} fps={30} width={1080} height={1920}/>
      <Composition id="CarneGancho" component={MeatHook} durationInFrames={210} fps={30} width={1080} height={1920}/>
      <Composition id="CarneProyecciones" component={MeatForecasts} durationInFrames={300} fps={30} width={1080} height={1920}/>
      <Composition id="CarneCostos" component={ProductionCosts} durationInFrames={300} fps={30} width={1080} height={1920}/>
      <Composition id="CarneSeguridad" component={RouteSecurity} durationInFrames={300} fps={30} width={1080} height={1920}/>
      <Composition id="CarneOferta" component={InternationalSupply} durationInFrames={300} fps={30} width={1080} height={1920}/>
      <Composition id="CarneEjemplo" component={PriceExample} durationInFrames={330} fps={30} width={1080} height={1920}/>
      <Composition id="CarnePregunta" component={ForecastAndQuestion} durationInFrames={360} fps={30} width={1080} height={1920}/>
    </>
  );
};
