import React from "react";
import { registerRoot, Composition, Folder } from "remotion";
import { RemotionRoot } from "../Root";
import { Economist2027 } from "./Economist2027";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";
import { Scene6 } from "./Scene6";
import { Scene7 } from "./Scene7";
const EpisodeRoot = () => (
  <>
    <RemotionRoot />
    <Composition
      id="Economist2027"
      component={Economist2027}
      durationInFrames={2100}
      fps={30}
      width={1080}
      height={1920}
    />
    <Folder name="Economist-2027-Escenas">
      <Composition
        id="Economist2027-Escena1"
        component={Scene1}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Economist2027-Escena2"
        component={Scene2}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Economist2027-Escena3"
        component={Scene3}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Economist2027-Escena4"
        component={Scene4}
        durationInFrames={330}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Economist2027-Escena5"
        component={Scene5}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Economist2027-Escena6"
        component={Scene6}
        durationInFrames={330}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Economist2027-Escena7"
        component={Scene7}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </Folder>
  </>
);
registerRoot(EpisodeRoot);
