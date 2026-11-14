import React from "react";
import { Composition } from "remotion";
import { CorazonAlLimite } from "./CorazonAlLimite";
import { UnDiaVasAExtranar } from './episodios/un-dia-vas-a-extranar-este-momento/Episode';
import { Scene1 } from './episodios/un-dia-vas-a-extranar-este-momento/Scene1';
import { Scene2 } from './episodios/un-dia-vas-a-extranar-este-momento/Scene2';
import { Scene3 } from './episodios/un-dia-vas-a-extranar-este-momento/Scene3';
import { Scene4 } from './episodios/un-dia-vas-a-extranar-este-momento/Scene4';
import { Scene5 } from './episodios/un-dia-vas-a-extranar-este-momento/Scene5';
import { Scene6 } from './episodios/un-dia-vas-a-extranar-este-momento/Scene6';
import { Scene7 } from './episodios/un-dia-vas-a-extranar-este-momento/Scene7';

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
      <Composition id="UnDiaVasAExtranarEsteMomento" component={UnDiaVasAExtranar} durationInFrames={2100} fps={30} width={1080} height={1920}/>
      <Composition id="EsaLlamada" component={Scene1} durationInFrames={210} fps={30} width={1080} height={1920}/>
      <Composition id="DespuesHablamos" component={Scene2} durationInFrames={300} fps={30} width={1080} height={1920}/>
      <Composition id="LaUltimaVez" component={Scene3} durationInFrames={300} fps={30} width={1080} height={1920}/>
      <Composition id="PerseguirElFuturo" component={Scene4} durationInFrames={330} fps={30} width={1080} height={1920}/>
      <Composition id="TodaviaPuedes" component={Scene5} durationInFrames={330} fps={30} width={1080} height={1920}/>
      <Composition id="VolverAEstar" component={Scene6} durationInFrames={330} fps={30} width={1080} height={1920}/>
      <Composition id="EraSuficiente" component={Scene7} durationInFrames={300} fps={30} width={1080} height={1920}/>
    </>
  );
};
