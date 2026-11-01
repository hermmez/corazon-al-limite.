import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  cancelRender,
  staticFile,
} from "remotion";
import { Brand, Camera2D, PilotBackground } from "./Stage";
import {
  HookScene,
  ExplanationScene,
  ConsequenceScene,
  ClosingScene,
} from "./Scenes";
import { Heart } from "./Anatomy";
import { SceneTitle } from "./Titles";
import { NarrationAndSound } from "./Soundtrack";
import { C } from "./motion";

const usePilotFont = () => {
  const [handle] = useState(() => delayRender("Manrope local"));
  useEffect(() => {
    const font = new FontFace(
      "Pilot Manrope",
      `url("${staticFile("piloto10s/fonts/Manrope[wght].ttf")}")`,
      { weight: "200 800" },
    );
    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch(cancelRender);
  }, [handle]);
};
export const CorazonPiloto10s: React.FC = () => {
  usePilotFont();
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig(),
    time = frame / fps;
  return (
    <AbsoluteFill
      style={{
        fontFamily: '"Pilot Manrope",sans-serif',
        overflow: "hidden",
        background: C.navy,
      }}
    >
      <PilotBackground time={time} />
      <Camera2D time={time}>
        <Sequence
          name="01 · Gancho / reacción"
          from={0}
          durationInFrames={Math.round(2.4 * fps)}
          premountFor={fps}
        >
          <HookScene time={time} />
        </Sequence>
        <Sequence
          name="02 · Circulación"
          from={Math.round(1.8 * fps)}
          durationInFrames={Math.round(3.6 * fps)}
          premountFor={fps}
        >
          <ExplanationScene time={time} />
        </Sequence>
        <Sequence
          name="03 · Descanso insuficiente"
          from={Math.round(4.8 * fps)}
          durationInFrames={Math.round(3.5 * fps)}
          premountFor={fps}
        >
          <ConsequenceScene time={time} />
        </Sequence>
        <Sequence
          name="04 · Cierre"
          from={Math.round(7.75 * fps)}
          durationInFrames={Math.round(2.25 * fps)}
          premountFor={fps}
        >
          <ClosingScene time={time} />
        </Sequence>
        <Heart time={time} />
      </Camera2D>
      <Sequence
        name="Gancho · texto"
        durationInFrames={2 * fps}
        premountFor={fps}
      >
        <SceneTitle
          time={time}
          start={0}
          end={2}
          label="EL SUEÑO Y TU CORAZÓN"
          lines={["¿DUERMES", "POCO?"]}
          sizes={[140, 155]}
          accent={C.coral}
          dark
        />
      </Sequence>
      <Sequence
        name="Presión · texto"
        from={2 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <SceneTitle
          time={time}
          start={2}
          end={5}
          label="CUANDO SE VUELVE UN HÁBITO"
          lines={["PRESIÓN", "ARTERIAL ↑"]}
          sizes={[120, 111]}
          accent={C.coral}
          note="PUEDE ELEVARSE"
        />
      </Sequence>
      <Sequence
        name="Riesgo · texto"
        from={5 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <SceneTitle
          time={time}
          start={5}
          end={8}
          label="DORMIR POCO DE FORMA HABITUAL"
          lines={["MAYOR RIESGO", "CARDIOVASCULAR"]}
          sizes={[85, 69]}
          accent="#CE514B"
        />
      </Sequence>
      <Sequence
        name="Descanso · texto"
        from={8 * fps}
        durationInFrames={2 * fps}
        premountFor={fps}
      >
        <SceneTitle
          time={time}
          start={8}
          end={10.15}
          label="DALE TIEMPO PARA RECUPERARSE"
          lines={["TU CORAZÓN", "NECESITA", "DESCANSO"]}
          sizes={[91, 99, 108]}
          accent="#078579"
        />
      </Sequence>
      <Brand time={time} />
      <Sequence
        name="Locución / música / efectos / subtítulos"
        durationInFrames={10 * fps}
        premountFor={fps}
      >
        <NarrationAndSound time={time} />
      </Sequence>
    </AbsoluteFill>
  );
};
