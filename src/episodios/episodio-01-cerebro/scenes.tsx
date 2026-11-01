import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { ASSETS, EPISODE } from "./config";
import {
  Actor,
  Art,
  Card,
  C,
  ease,
  Layer,
  mix,
  Orbit,
  p,
  pop,
  Signals,
} from "./primitives";

// One brain actor travels between shots instead of being replaced at each cut.
const keys = [
  0, 0.65, 2.6, 4.9, 5.8, 12.4, 13.5, 21.5, 22.8, 32.4, 34.2, 40.5, 43, 63.6,
  65, 69.97,
];
const track = (t: number, values: number[]) =>
  interpolate(t, keys, values, ease);
export const BrainActor: React.FC<{ time: number }> = ({ time }) => {
  const x = track(
    time,
    [
      550, 540, 540, 660, 680, 665, 540, 520, 520, 520, 715, 715, 760, 680, 670,
      660,
    ],
  );
  const y = track(
    time,
    [
      1000, 1000, 975, 1000, 960, 925, 740, 880, 990, 990, 805, 800, 850, 1000,
      1025, 1030,
    ],
  );
  const width = track(
    time,
    [
      1150, 760, 730, 530, 510, 530, 230, 300, 500, 500, 285, 290, 180, 450,
      490, 510,
    ],
  );
  const opacity =
    1 -
    p(time, 12.6, 13.3) +
    p(time, 21.55, 22.5) * (1 - p(time, 39, 40.3)) +
    p(time, 63.6, 64.5);
  const wobble = Math.sin(time * 1.4) * 1.1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, opacity) }}>
      <Orbit
        time={time}
        x={x}
        y={y}
        r={width * 0.52}
        opacity={time < 13 || time > 64 ? 0.65 : 0.16}
      />
      <Art
        asset="brain"
        x={x}
        y={y + Math.sin(time * 1.7) * 5}
        width={width * (1 + Math.sin(time * 2.2) * 0.006)}
        rotate={wobble}
      />
      {time < 3 && EPISODE.introVideoSrc && (
        <Video
          src={staticFile(EPISODE.introVideoSrc)}
          muted
          style={{
            position: "absolute",
            left: 80,
            top: 570,
            width: 920,
            height: 850,
            objectFit: "cover",
            borderRadius: 80,
            opacity: 1 - p(time, 2.4, 3),
          }}
        />
      )}
      {time < 4.5 && (
        <svg width="1080" height="1920" style={{ position: "absolute" }}>
          <circle
            cx={x}
            cy={y}
            r={mix(130, 710, p(time, 0.12, 1.4))}
            fill="none"
            stroke={C.gold}
            strokeWidth={mix(12, 1, p(time, 0.12, 1.4))}
            opacity={(1 - p(time, 0.35, 1.4)) * 0.8}
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const Opening: React.FC<{ time: number }> = ({ time }) => (
  <>
    <Layer time={time} start={0} end={5} mode="iris">
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 1360,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 4,
          color: C.teal,
          opacity: p(time, 0.6, 1.2) * (1 - p(time, 3.4, 4)),
        }}
      >
        UNA PARADOJA DE TU CUERPO
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <g
          opacity={p(time, 0.7, 1.4) * (1 - p(time, 3.8, 4.5))}
          stroke={C.cream}
          strokeWidth="2"
        >
          <path
            d="M120 680v-70h70 M890 610h70v70 M120 1260v70h70 M960 1260v70h-70"
            fill="none"
          />
          <path d="M130 760h60 M920 1210h40" />
        </g>
      </svg>
    </Layer>
    <Layer time={time} start={3.8} end={13} mode="follow">
      <Actor
        pose={time < 6.8 ? "surprised" : "explaining"}
        time={time}
        x={230 + Math.sin(time * 0.4) * 10}
        y={1030}
        width={460}
      />
      <Signals
        time={time}
        start={5}
        color={C.coral}
        opacity={p(time, 5.3, 6)}
        paths={[
          "M270 790C370 680 470 700 570 810",
          "M570 1120C500 1220 390 1260 280 1160",
        ]}
      />
      <Card x={492} y={1270} width={425} opacity={p(time, 6, 6.5)}>
        <span style={{ color: "#C34D4C" }}>SIN NOCICEPTORES</span>
        <div style={{ fontSize: 23, fontWeight: 600, marginTop: 8 }}>
          En el tejido cerebral.
        </div>
      </Card>
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 640,
          color: C.ink,
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: 2,
          opacity: p(time, 7.5, 8),
        }}
      >
        SEÑALES EN TODO EL CUERPO
      </div>
    </Layer>
  </>
);

export const Migraine: React.FC<{ time: number }> = ({ time }) => {
  const reveal = p(time, 13.3, 14.2),
    phase = (time - 14.1) % 1.55;
  return (
    <Layer time={time} start={13} end={22} mode="iris" origin="50% 44%">
      <Art
        asset="room"
        x={550}
        y={1040}
        width={730}
        height={900}
        opacity={0.1}
        rotate={Math.sin(time * 0.3) * 0.4}
      />
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 650,
          width: 780,
          height: 780,
          borderRadius: "50%",
          background: C.coral,
          opacity: 0.045 + 0.025 * Math.sin(time * 2.8),
        }}
      />
      <Actor
        pose={time < 15.4 ? "confused" : "headache"}
        time={time}
        x={510 + Math.sin(time * 0.8) * 4}
        y={1020}
        width={570}
        tilt={Math.sin(time * 1.2) * 0.6}
      />
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="512"
            cy="700"
            r={78 + ((phase + i * 0.5 + 1.55) % 1.55) * 88}
            fill="none"
            stroke={C.coral}
            strokeWidth="4"
            opacity={
              reveal * (1 - ((phase + i * 0.5 + 1.55) % 1.55) / 1.55) * 0.55
            }
          />
        ))}
        <g
          transform={`translate(800 ${800 + Math.sin(time * 1.8) * 10}) rotate(${Math.sin(time) * 4})`}
        >
          <circle r="66" fill={C.navy} />
          <text
            y="26"
            textAnchor="middle"
            fontSize="83"
            fontWeight="800"
            fill={C.gold}
          >
            ?
          </text>
        </g>
      </svg>
      <Card
        x={142}
        y={1305}
        width={750}
        accent={C.coral}
        opacity={p(time, 17, 17.6)}
      >
        No es solo un asunto de vasos sanguíneos.
        <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>
          La migraña implica mecanismos neurológicos complejos.
        </div>
      </Card>
    </Layer>
  );
};

const shell =
  "M260 210 C215 100 310 38 422 65 C535 13 683 52 711 141 C828 171 865 298 799 383 C858 475 775 581 657 580 C604 668 450 664 396 606 C278 641 181 550 211 452 C139 364 162 245 260 210Z";
export const LayersOfHead: React.FC<{ time: number }> = ({ time }) => {
  const layer = p(time, 22.4, 23.5),
    men = p(time, 24.2, 25.1),
    vess = p(time, 27.5, 28.5);
  return (
    <Layer time={time} start={22} end={33} mode="follow">
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <defs>
          <mask id="brain-shell-mask">
            <rect width="1080" height="1920" fill="black" />
            <path d={shell} transform="translate(10 575)" fill="white" />
          </mask>
        </defs>
        <g
          transform={`translate(${10 + (1 - layer) * 50} 575) scale(${mix(1.05, 1, layer)})`}
        >
          <path
            d={shell}
            fill="#FFF4E00C"
            stroke="#FFF4E0"
            strokeWidth="28"
            opacity=".85"
          />
          <path
            d={shell}
            transform="translate(50 37) scale(.9)"
            fill="#FF786B10"
            stroke={C.coral}
            strokeWidth="18"
            opacity={men}
          />
          <path
            d={shell}
            transform="translate(76 56) scale(.85)"
            fill="none"
            stroke={C.gold}
            strokeWidth="4"
            opacity={men * 0.7}
            strokeDasharray="8 8"
          />
        </g>
        <g
          opacity={vess}
          mask="url(#brain-shell-mask)"
          fill="none"
          stroke={C.coral}
          strokeWidth="7"
          strokeLinecap="round"
        >
          <path d="M200 890C290 810 250 770 340 730S530 710 560 670 M320 750L290 690 M430 712L435 650 M770 940C870 860 740 790 780 720 M815 860L900 810 M260 1090C280 1200 410 1190 450 1250 M700 1170L765 1240" />
        </g>
        <g stroke={C.cream} strokeWidth="2" fill="none" opacity={layer}>
          <path d="M210 710L155 665H90" />
          <circle cx="210" cy="710" r="7" fill={C.cream} />
        </g>
        <g stroke={C.coral} strokeWidth="2" fill="none" opacity={men}>
          <path d="M769 785L827 710H935" />
          <circle cx="769" cy="785" r="7" fill={C.coral} />
        </g>
        <g stroke={C.coral} strokeWidth="2" fill="none" opacity={vess}>
          <path d="M780 1090L824 1190H940" />
          <circle cx="780" cy="1090" r="7" fill={C.coral} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 615,
          color: C.cream,
          fontSize: 29,
          fontWeight: 800,
          opacity: layer,
        }}
      >
        CRÁNEO
      </div>
      <div
        style={{
          position: "absolute",
          left: 754,
          top: 652,
          color: C.coral,
          fontSize: 29,
          fontWeight: 800,
          opacity: men,
        }}
      >
        MENINGES
      </div>
      <div
        style={{
          position: "absolute",
          left: 770,
          top: 1210,
          color: C.coral,
          fontSize: 29,
          fontWeight: 800,
          opacity: vess,
        }}
      >
        VASOS
      </div>
      <Card x={128} y={1325} width={760} dark accent={C.coral} opacity={men}>
        <span style={{ color: C.gold }}>
          Estas estructuras sí pueden sentir dolor.
        </span>
        <div style={{ fontSize: 22, fontWeight: 600, marginTop: 7 }}>
          Esquema simplificado. También hay estructuras sensibles fuera del
          cráneo.
        </div>
      </Card>
    </Layer>
  );
};

export const NeuralJourney: React.FC<{ time: number }> = ({ time }) => {
  const zoom = p(time, 38.3, 40.1),
    travel = p(time, 33.5, 38.5);
  return (
    <Layer time={time} start={33} end={44} mode="follow">
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 655,
          width: 850,
          height: 670,
          borderRadius: 60,
          border: "2px solid #24C8BA33",
          background: "#12334866",
          overflow: "hidden",
        }}
      >
        <Art
          asset="nerves"
          x={640 - zoom * 95}
          y={340}
          width={485}
          height={690}
          opacity={1 - zoom * 0.95}
        />
        <Art
          asset="neuron"
          x={260 - zoom * 120}
          y={340}
          width={370}
          rotate={Math.sin(time) * 2}
          opacity={1 - zoom}
        />
        <Art
          asset="synapse"
          x={460}
          y={350}
          width={mix(100, 590, zoom)}
          rotate={Math.sin(time * 0.8) * 0.5}
          opacity={zoom}
        />
      </div>
      <Signals
        time={time}
        start={33}
        opacity={1 - zoom}
        paths={[
          "M160 1100C200 1020 280 1170 360 1030S460 820 580 800S660 730 710 760",
          "M170 1000C270 920 340 1100 400 950S570 710 710 770",
        ]}
      />
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <path
          d="M170 1110C260 1190 420 1120 490 940S590 750 720 770"
          pathLength="1"
          stroke={C.gold}
          strokeWidth="3"
          fill="none"
          strokeDasharray={`${travel} 1`}
          opacity={1 - zoom}
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx={470 + i * 28 + Math.sin(time * 2 + i) * 9}
            cy={990 - ((time * 70 + i * 55) % 210)}
            r="7"
            fill={i % 2 ? C.gold : C.teal}
            opacity={zoom * 0.8}
          />
        ))}
      </svg>
      <Card x={130} y={1338} width={760} dark accent={C.gold}>
        <div style={{ color: C.gold }}>
          {zoom < 0.5
            ? "SEÑAL → VÍAS NERVIOSAS → CEREBRO"
            : "CONEXIONES ENTRE NEURONAS"}
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>
          {zoom < 0.5
            ? "El dolor es una experiencia que el sistema nervioso procesa."
            : "Representación del proceso; no es un mapa clínico."}
        </div>
      </Card>
    </Layer>
  );
};

const Monitor: React.FC<{
  time: number;
  x: number;
  y: number;
  scale?: number;
}> = ({ time, x, y, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 290,
      height: 220,
      transform: `scale(${scale})`,
      transformOrigin: "50% 50%",
    }}
  >
    <svg width="290" height="220" viewBox="0 0 290 220">
      <rect
        x="0"
        y="0"
        width="290"
        height="185"
        rx="23"
        fill={C.navy}
        stroke="#4E8590"
        strokeWidth="7"
      />
      <path
        d="M125 185v25M165 185v25M100 214h90"
        stroke="#4E8590"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <defs>
        <clipPath id="monitor-clip">
          <rect x="13" y="45" width="264" height="80" />
        </clipPath>
      </defs>
      <g clipPath="url(#monitor-clip)">
        <path
          d="M-250 88h70l8-7 9 15 11-46 14 76 12-38h160l8-7 9 15 11-46 14 76 12-38h160l8-7 9 15 11-46 14 76 12-38h140"
          stroke={C.teal}
          strokeWidth="4"
          fill="none"
          transform={`translate(${(time * 55) % 280} 0)`}
        />
      </g>
      <text x="22" y="30" fill={C.cream} fontSize="15" fontWeight="800">
        MONITOREO CONTINUO
      </text>
      <text x="24" y="153" fill={C.teal} fontSize="18" fontWeight="700">
        EQUIPO MÉDICO PRESENTE
      </text>
      <circle
        cx="262"
        cy="22"
        r="5"
        fill={C.teal}
        opacity={0.5 + 0.5 * Math.sin(time * 3)}
      />
    </svg>
  </div>
);

export const Hospital: React.FC<{ time: number }> = ({ time }) => {
  const anest = p(time, 55, 56.5),
    shift = p(time, 54.4, 56.4) * -65;
  return (
    <Layer time={time} start={44} end={64} mode="follow">
      <div
        style={{
          position: "absolute",
          left: 85,
          top: 625,
          width: 850,
          height: 790,
          background: "#DAEBE5",
          borderRadius: 50,
          overflow: "hidden",
          border: "2px solid #9BBFB5",
        }}
      >
        <svg width="850" height="790">
          <rect x="0" y="510" width="850" height="280" fill="#B6D1C8" />
          <path d="M0 510H850" stroke="#9BBFB5" strokeWidth="3" />
          <rect x="35" y="55" width="175" height="290" rx="26" fill="#EFF7EF" />
          <path d="M121 55v290M35 190h175" stroke="#B6D1C8" strokeWidth="10" />
          <path
            d="M440 0v85M440 85h175"
            fill="none"
            stroke="#7A9F99"
            strokeWidth="12"
          />
          <ellipse
            cx="615"
            cy="108"
            rx="75"
            ry="30"
            fill="#FFF9E9"
            stroke="#7A9F99"
            strokeWidth="9"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateX(${shift}px)`,
          }}
        >
          <Actor pose="neutral" time={time} x={300} y={508} width={410} />
          <Actor pose="explaining" time={time} x={690} y={490} width={285} />
          <svg
            width="850"
            height="790"
            style={{ position: "absolute", inset: 0 }}
          >
            <path
              d="M90 620Q300 585 560 625L585 705H80Z"
              fill="#69BFB8"
              stroke="#357D80"
              strokeWidth="5"
            />
            <path
              d="M90 705H585V748H90Z"
              fill="#EFF7EF"
              stroke="#7A9F99"
              strokeWidth="5"
            />
            <path
              d="M120 749v30M550 749v30"
              stroke="#7A9F99"
              strokeWidth="12"
            />
            <path
              d="M666 360v55q24 20 47-2v-55"
              fill="none"
              stroke={C.navy}
              strokeWidth="5"
            />
            <circle cx="690" cy="422" r="12" fill={C.navy} />
            <rect
              x="647"
              y="448"
              width="80"
              height="25"
              rx="5"
              fill="#FFF9ED"
            />
            <text
              x="687"
              y="466"
              textAnchor="middle"
              fill={C.ink}
              fontSize="13"
              fontWeight="800"
            >
              EQUIPO
            </text>
            <g opacity={anest}>
              <circle
                cx="290"
                cy="266"
                r={83 + Math.sin(time * 2) * 3}
                fill="none"
                stroke={C.teal}
                strokeWidth="9"
                strokeDasharray="5 10"
              />
              <path
                d="M365 224L435 172H500"
                fill="none"
                stroke={C.teal}
                strokeWidth="3"
              />
            </g>
          </svg>
          <Monitor time={time} x={455} y={70} scale={0.87} />
          <div
            style={{
              position: "absolute",
              left: 125,
              top: 395,
              color: C.ink,
              fontSize: 24,
              fontWeight: 800,
              background: "#FFF4E0EE",
              padding: "10px 18px",
              borderRadius: 14,
            }}
          >
            PACIENTE DESPIERTO
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 131,
          top: 1362,
          fontSize: 23,
          fontWeight: 700,
          color: C.ink,
        }}
      >
        Ilustración conceptual · sin representar un procedimiento real
      </div>
      {time >= 55 && (
        <Card x={605} y={1110} width={290} accent={C.teal} opacity={anest}>
          <span style={{ color: "#08796F" }}>ANESTESIA</span>
          <div style={{ fontSize: 23, fontWeight: 600, marginTop: 7 }}>
            En las partes que sí sienten dolor.
          </div>
        </Card>
      )}
    </Layer>
  );
};

export const Closing: React.FC<{ time: number }> = ({ time }) => (
  <Layer time={time} start={64} end={71} mode="iris">
    <Actor pose="explaining" time={time} x={250} y={1070} width={480} />
    <Signals
      time={time}
      start={64}
      paths={["M330 860C430 770 475 780 555 860"]}
      opacity={0.65}
    />
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 1320,
        width: 770,
        display: "flex",
        gap: 18,
        alignItems: "center",
        color: C.gold,
        opacity: p(time, 65, 65.7),
        transform: `translateY(${mix(20, 0, pop(time, 65, 0.8))}px)`,
      }}
    >
      <span style={{ fontSize: 49, fontWeight: 800 }}>
        EL CEREBRO INTERPRETA.
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        left: 86,
        top: 1690,
        color: C.cream,
        opacity: p(time, 66, 66.6),
      }}
    >
      <div style={{ fontSize: 42, fontWeight: 800 }}>CORAZÓN AL LÍMITE</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 4,
          marginTop: 10,
          color: C.teal,
        }}
      >
        CIENCIA PARA CUIDARTE
      </div>
    </div>
  </Layer>
);
