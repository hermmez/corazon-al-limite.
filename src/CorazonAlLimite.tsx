
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const scenes = [
  {
    title: "¿Y SI TU CORAZÓN\nDEJARA DE LATIR?",
    subtitle: "Tu cuerpo depende de cada latido.",
    time: "00:00",
  },
  {
    title: "EL RITMO SE\nINTERRUMPE",
    subtitle: "El corazón deja de impulsar sangre temporalmente.",
    time: "00:11",
  },
  {
    title: "LA SANGRE\nPIERDE IMPULSO",
    subtitle: "La circulación puede disminuir.",
    time: "00:22",
  },
  {
    title: "TU CEREBRO\nLO NOTA",
    subtitle: "Es uno de los órganos más sensibles a la falta de oxígeno.",
    time: "00:33",
  },
  {
    title: "¿TE DESMAYARÍAS\nAL INSTANTE?",
    subtitle: "No necesariamente. Depende de la duración y la causa.",
    time: "00:44",
  },
  {
    title: "CINCO SEGUNDOS\nNO SON LO MISMO",
    subtitle: "Una pausa breve no equivale a un paro cardíaco.",
    time: "00:55",
  },
  {
    title: "CADA SEGUNDO\nIMPORTA",
    subtitle: "Ante un colapso: emergencias, RCP y un DEA.",
    time: "01:06",
  },
  {
    title: "TU CORAZÓN\nNO DESCANSA",
    subtitle: "Cuídalo. Tu vida depende de él.",
    time: "01:17",
  },
];

export const CorazonAlLimite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneDuration = 337.5;
  const sceneIndex = Math.min(
    7,
    Math.floor(frame / sceneDuration)
  );

  const scene = scenes[sceneIndex];
  const localFrame = frame - sceneIndex * sceneDuration;

  const pulse = 1 + Math.sin(frame * 0.16) * 0.07;
  const opacity = interpolate(
    localFrame,
    [0, 15, 300, 337.5],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const heartScale = pulse + Math.sin(frame * 0.04) * 0.025;
  const progress = frame / 2700;

  const seconds = Math.floor(frame / fps);
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #351018 0%, #10070b 48%, #030305 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.5))",
        }}
      />

      {Array.from({ length: 35 }).map((_, i) => {
        const x = (i * 137.5) % 1080;
        const y = (i * 251.3) % 1920;
        const size = 2 + (i % 4);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "#ff526d",
              opacity: 0.15 + Math.sin(frame * 0.03 + i) * 0.1,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          top: 100,
          left: 65,
          right: 65,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 25,
          letterSpacing: 5,
          color: "#ff8797",
          fontWeight: 700,
        }}
      >
        <span>CIENCIA EN 90 SEGUNDOS</span>
        <span>01 / 08</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 370,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 240,
          transform: `scale(${heartScale})`,
          filter: "drop-shadow(0 0 45px rgba(255,30,65,.65))",
        }}
      >
        ❤️
      </div>

      <div
        style={{
          position: "absolute",
          top: 690,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity,
          transform: `translateY(${interpolate(localFrame, [0, 20], [35, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        <div
          style={{
            fontSize: 75,
            fontWeight: 900,
            lineHeight: 1.12,
            whiteSpace: "pre-line",
            textShadow: "0 5px 25px rgba(0,0,0,.8)",
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            marginTop: 35,
            fontSize: 34,
            lineHeight: 1.4,
            color: "#f4cbd2",
          }}
        >
          {scene.subtitle}
        </div>
      </div>

      {sceneIndex === 3 && (
        <div
          style={{
            position: "absolute",
            top: 1230,
            width: "100%",
            textAlign: "center",
            fontSize: 160,
          }}
        >
          🧠
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 170,
          left: 65,
          right: 65,
          height: 5,
          background: "rgba(255,255,255,.2)",
          borderRadius: 10,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "#ff4966",
            borderRadius: 10,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 95,
          left: 65,
          right: 65,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 25,
          color: "#c8aeb3",
        }}
      >
        <span>CORAZÓN AL LÍMITE</span>
        <span>{time} / 01:30</span>
      </div>
    </AbsoluteFill>
  );
};
