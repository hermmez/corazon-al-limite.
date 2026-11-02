import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { LayersOfHead } from "../episodio-01-cerebro/scenes";
import { Art } from "../episodio-01-cerebro/primitives";
import { Character125 } from "./Characters";
import {
  C,
  cueProgress as cp,
  cueTime,
  ease,
  lift,
  p,
  spokenTime,
} from "./motion";
import chapters from "./chapters.json";
import timeline from "./timeline.json";

const Image: React.FC<{
  src: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  scale?: number;
  opacity?: number;
}> = ({ src, x, y, width, height = width, scale = 1, opacity = 1 }) => (
  <Img
    src={staticFile(`imagenes/${src}`)}
    style={{
      position: "absolute",
      left: x - width / 2,
      top: y - height / 2,
      width,
      height,
      objectFit: "contain",
      scale,
      opacity,
    }}
  />
);
const Trace: React.FC<{
  d: string;
  progress: number;
  color?: string;
  width?: number;
}> = ({ d, progress, color = C.gold, width = 7 }) => (
  <>
    <path d={d} stroke={color} strokeWidth={width} opacity=".15" fill="none" />
    <path
      d={d}
      pathLength="1"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      strokeDasharray={`${progress} 1`}
    />
  </>
);
const label = (x: number, y: number, text: string, color: string = C.teal) => (
  <text x={x} y={y} fill={color} fontSize="29" fontWeight="800">
    {text}
  </text>
);

export const TravelingBrain: React.FC<{
  time: number;
  scene: number;
  action: number;
}> = ({ time, scene, action }) => {
  const { fps } = useVideoConfig(),
    s = timeline.scenes[scene],
    age = time - s.start;
  const targets = [
    [650, 995, 550],
    [705, 970, 470],
    [520, 985, 495],
    [690, 1000, 310],
    [540, 790, 220],
    [680, 980, 300],
    [680, 980, 300],
    [670, 980, 505],
  ];
  const previous = targets[Math.max(0, scene - 1)],
    target = targets[scene];
  let k = p(age, 0, 0.4);
  let [x, y, w] = target.map((v, i) => previous[i] + (v - previous[i]) * k);
  if (scene === 0) {
    const zoom = lift(time, fps);
    w = 1120 - (1120 - 750) * zoom;
    w += (550 - w) * cp(time, 0, 2, 0.42);
    x = 540 + 110 * cp(time, 0, 2, 0.42);
    y = 980;
  }
  const opacity =
    scene === 3 || scene === 5 || scene === 6
      ? 0
      : scene === 4
        ? 1 - cp(time, 4, 3, 0.4)
        : 1;
  const previousStep = action === 0 ? 0 : action % 2 === 0 ? -1 : 1,
    nextStep = action % 2 === 0 ? 1 : -1;
  const step =
    scene === 2
      ? 0
      : previousStep +
        (nextStep - previousStep) * cp(time, scene, Math.min(5, action), 0.25);
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <svg width="1080" height="1920">
        <ellipse
          cx={x}
          cy={y}
          rx={w * 0.54}
          ry={w * 0.43}
          stroke={C.teal}
          opacity=".22"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={`M${x - w * 0.48} ${y + w * 0.24}Q${x} ${y + w * 0.54} ${x + w * 0.52} ${y - w * 0.22}`}
          pathLength="1"
          stroke={C.gold}
          strokeWidth="3"
          opacity=".65"
          fill="none"
          strokeDasharray={`${p(age, 0.1, 1.5)} 1`}
        />
      </svg>
      <Art
        asset="brain"
        x={x + step * 6}
        y={y - step * 4}
        width={w * (1 + 0.012 * step)}
      />
    </div>
  );
};

const Opening: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => (
  <>
    <div
      style={{ position: "absolute", inset: 0, opacity: cp(time, 0, 2, 0.25) }}
    >
      <Character125
        pose={action < 4 ? "surprised" : "point"}
        time={time}
        x={220}
        y={1040}
        width={450}
        age={time - cueTime(0, Math.min(action, 4))}
      />
    </div>
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <circle
        cx="560"
        cy="980"
        r={80 + cp(time, 0, 0, 0.6) * 600}
        stroke={C.gold}
        strokeWidth="5"
        fill="none"
        opacity={(1 - cp(time, 0, 0, 0.6)) * 0.8}
      />
      <g opacity={cp(time, 0, 1)} transform="translate(790 740)">
        <circle r="65" fill={C.navy} stroke={C.coral} strokeWidth="4" />
        <path
          d="M-24-24L24 24M24-24L-24 24"
          stroke={C.coral}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
      <Trace
        d="M300 790C390 700 475 725 540 820"
        progress={cp(time, 0, 4, 0.55)}
      />
      <Trace
        d="M790 780Q900 1000 790 1170"
        progress={cp(time, 0, 3, 0.55)}
        color={C.coral}
      />
      <g opacity={cp(time, 0, 5)}>
        <ellipse
          cx="240"
          cy="760"
          rx="93"
          ry="110"
          stroke={C.coral}
          strokeWidth="6"
          fill="none"
        />
        {label(340, 740, "LA CLAVE ESTÁ ALREDEDOR", C.gold)}
      </g>
    </svg>
  </>
);

const Sensors: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => (
  <>
    <Image
      src="anatomia/19_piel_corte_transversal.png"
      x={260}
      y={1010}
      width={370}
      scale={0.78 + 0.22 * cp(time, 1, 2)}
      opacity={cp(time, 1, 2)}
    />
    <div
      style={{ position: "absolute", inset: 0, opacity: 1 - cp(time, 1, 2) }}
    >
      <Character125
        pose={action < 2 ? "explaining" : "point"}
        time={time}
        x={215}
        y={1085}
        width={380}
        age={time - cueTime(1, Math.min(1, action))}
      />
    </div>
    {action >= 2 && (
      <div
        style={{
          position: "absolute",
          left: 85,
          top: 650,
          width: 385,
          height: 580,
          borderRadius: 35,
          background: C.cream,
          clipPath: `inset(${(1 - cp(time, 1, 2)) * 100}% 0 0)`,
        }}
      >
        <Image
          src="anatomia/19_piel_corte_transversal.png"
          x={190}
          y={300}
          width={380}
        />
      </div>
    )}
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      {label(560, 680, "TEJIDO CEREBRAL", C.ink)}
      <g opacity={cp(time, 1, 1)}>
        <path
          d="M580 780L840 1190M840 780L580 1190"
          stroke={C.coral}
          strokeWidth="8"
          opacity=".65"
        />
        <rect x="550" y="1170" width="370" height="55" rx="18" fill={C.navy} />
        {label(575, 1207, "SIN NOCICEPTORES", C.gold)}
      </g>
      <g opacity={cp(time, 1, 3)}>
        <circle cx="270" cy="1000" r="27" fill={C.coral} />
        {label(100, 1180, "SENSOR EN OTRO TEJIDO", C.ink)}
      </g>
      <Trace
        d="M295 1000C410 1010 430 840 545 900"
        progress={cp(time, 1, 4, 0.6)}
        color={C.coral}
      />
      <g opacity={cp(time, 1, 5)}>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={540 + i * 34 + cp(time, 1, 5, 0.6) * 70}
            y={912 - i * 15}
            width="12"
            height="24"
            rx="4"
            fill={C.gold}
          />
        ))}
        {label(518, 745, "RECIBE E INTERPRETA", C.ink)}
      </g>
    </svg>
  </>
);

const SensitiveLayers: React.FC<{ time: number; scene: number }> = ({
  time,
  scene,
}) => {
  const s = timeline.scenes[scene];
  const old = interpolate(
    time,
    [
      s.start,
      cueTime(2, 1),
      cueTime(2, 2),
      cueTime(2, 3),
      cueTime(2, 4),
      s.end,
    ],
    [22.6, 24.2, 25.1, 27.5, 28.5, 32.5],
    ease,
  );
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: "inset(0 0 680px 0)",
        }}
      >
        <LayersOfHead time={old} />
      </div>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <Trace
          d="M155 960Q180 640 520 640Q850 640 890 960Q850 1230 520 1230Q180 1230 155 960"
          progress={p(
            time,
            spokenTime(2, "cabeza", cueTime(2, 4) + 0.55),
            spokenTime(2, "cabeza", cueTime(2, 4) + 0.55) + 0.6,
          )}
          color={C.teal}
          width={5}
        />
        <Trace
          d="M310 700Q520 590 750 780"
          progress={cp(time, 2, 2, 0.7)}
          color={C.coral}
        />
        <Trace d="M760 820Q900 1000 720 1180" progress={cp(time, 2, 5, 0.65)} />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={760 - cp(time, 2, 5, 0.65) * i * 55}
            cy={1060 + cp(time, 2, 5, 0.65) * i * 25}
            r="8"
            fill={C.gold}
            opacity={cp(time, 2, 5)}
          />
        ))}
      </svg>
    </>
  );
};

const MigraineComplexity: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => (
  <>
    <Character125
      pose={action < 3 ? "confused" : "headache"}
      time={time}
      x={285}
      y={1020}
      width={470}
      age={time - cueTime(3, action < 3 ? 0 : 3)}
    />
    <div
      style={{
        position: "absolute",
        left: 510,
        top: 670,
        width: 425,
        height: 565,
        borderRadius: 38,
        background: "#E0EEE566",
        border: "2px solid #24C8BA44",
        overflow: "hidden",
      }}
    >
      {action < 2 ? (
        <Image
          src="anatomia/19_piel_corte_transversal.png"
          x={215}
          y={280}
          width={390}
          scale={0.88 + 0.47 * cp(time, 3, 1, 0.5)}
        />
      ) : action < 3 ? (
        <Image
          src="anatomia/16_sistema_muscular.png"
          x={215}
          y={280}
          width={430}
          height={550}
          scale={0.8 + 0.2 * cp(time, 3, 2)}
        />
      ) : action < 5 ? (
        <Image
          src="ciencia/15_vasos_sanguineos.png"
          x={215}
          y={280}
          width={380}
        />
      ) : (
        <Image
          src="ciencia/01_neurona.png"
          x={215}
          y={280}
          width={385}
          scale={0.8 + 0.2 * cp(time, 3, 5)}
        />
      )}
    </div>
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <Trace
        d="M300 720Q410 600 540 740"
        progress={cp(time, 3, 1, 0.4)}
        color={C.coral}
      />
      <g opacity={cp(time, 3, 3)}>
        <circle
          cx="290"
          cy="730"
          r={70 + cp(time, 3, 3, 0.6) * 40}
          stroke={C.coral}
          strokeWidth="5"
          fill="none"
        />
        {label(550, 650, "MIGRAÑA ≠ SOLO VASOS", C.ink)}
      </g>
      <g opacity={cp(time, 3, 4)}>
        <path
          d="M560 770L880 1140"
          stroke={C.coral}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
      <g opacity={cp(time, 3, 5)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <Trace
              d={`M650 940L${550 + i * 65} ${760 + (i % 2) * 340}`}
              progress={p(
                time,
                cueTime(3, 5) + i * 0.11,
                cueTime(3, 5) + i * 0.11 + 0.45,
              )}
              color={C.teal}
              width={4}
            />
            <circle
              cx={550 + i * 65}
              cy={760 + (i % 2) * 340}
              r="13"
              fill={C.gold}
            />
          </g>
        ))}
      </g>
    </svg>
  </>
);

const Trigeminal: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const paths = [
    "M760 740Q710 730 650 900",
    "M805 880Q720 850 650 900",
    "M745 1050Q690 1010 650 900",
  ];
  const s = timeline.scenes[4];
  const zoom = cp(time, 4, 3, 0.46);
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - zoom,
          scale: 1 + zoom * 0.1,
          transformOrigin: "56% 48%",
        }}
      >
        <svg width="1080" height="1920">
          <path
            d="M465 745Q590 610 705 745L740 815L800 855L762 892Q804 945 745 978L730 1100L555 1100L550 1030Q380 970 430 805Z"
            fill="#FFF4E00D"
            stroke={C.cream}
            strokeWidth="7"
          />
          {paths.map((d, i) => (
            <Trace
              key={i}
              d={d}
              progress={p(
                time,
                cueTime(4, 1) + i * 0.3,
                cueTime(4, 1) + i * 0.3 + 0.5,
              )}
              color={i % 2 ? C.teal : C.gold}
              width={10}
            />
          ))}
        </svg>
        <svg
          width="1080"
          height="1920"
          style={{ position: "absolute", inset: 0 }}
        >
          {paths.map((d, i) => (
            <g key={i}>
              <path
                d={d}
                pathLength="1"
                fill="none"
                stroke={C.coral}
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray=".08 .92"
                strokeDashoffset={-cp(time, 4, 2, 0.75) - i * 0.18}
                opacity={cp(time, 4, 2)}
              />
              <circle
                cx={[760, 805, 745][i]}
                cy={[740, 880, 1050][i]}
                r={16 + 8 * cp(time, 4, 1)}
                fill={C.teal}
                opacity={cp(time, 4, 1)}
              />
              <g
                opacity={p(
                  time,
                  cueTime(4, 1) + i * 0.3,
                  cueTime(4, 1) + i * 0.3 + 0.28,
                )}
              >
                {label(
                  [750, 824, 720][i],
                  [711, 916, 1130][i],
                  ["FRENTE", "MEJILLA", "MANDÍBULA"][i],
                  C.cream,
                )}
              </g>
            </g>
          ))}
          <g opacity={cp(time, 4, 1)}>
            {label(170, 760, "TRIGÉMINO", C.gold)}
            {label(160, 805, "TRES RAMAS", C.cream)}
          </g>
          <Trace
            d="M350 800L650 900"
            progress={cp(time, 4, 1)}
            color={C.teal}
          />
          <Trace
            d="M760 740Q850 880 745 1050"
            progress={p(
              time,
              spokenTime(4, "cara", cueTime(4, 2) + 0.65),
              spokenTime(4, "cara", cueTime(4, 2) + 0.65) + 0.6,
            )}
            color={C.teal}
            width={9}
          />
          <g
            opacity={p(
              time,
              spokenTime(4, "meninges", cueTime(4, 2) + 1.25),
              spokenTime(4, "meninges", cueTime(4, 2) + 1.25) + 0.35,
            )}
          >
            <ellipse
              cx="540"
              cy="790"
              rx="150"
              ry="130"
              fill="none"
              stroke={C.coral}
              strokeWidth="6"
            />
            <path d="M330 1020L420 920" stroke={C.coral} strokeWidth="3" />
            {label(150, 1040, "MENINGES", C.coral)}
          </g>
        </svg>
      </div>
      {zoom > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: zoom,
            scale: 0.86 + zoom * 0.14,
            transformOrigin: "50% 50%",
            clipPath: "inset(0 0 680px 0)",
          }}
        >
          <Image
            src="ciencia/02_sinapsis_neuronal.png"
            x={535}
            y={940}
            width={620}
          />
          <svg
            width="1080"
            height="1920"
            style={{ position: "absolute", inset: 0 }}
          >
            <g
              opacity={p(
                time,
                spokenTime(4, "sistema", cueTime(4, 3) + 0.6),
                spokenTime(4, "sistema", cueTime(4, 3) + 0.6) + 0.25,
              )}
            >
              {[
                "M170 810Q300 800 350 920L440 940",
                "M170 1060Q300 1050 350 920",
                "M350 920Q330 760 430 735",
              ].map((d, i) => (
                <Trace
                  key={d}
                  d={d}
                  progress={p(
                    time,
                    spokenTime(4, "sistema", cueTime(4, 3) + 0.6) + i * 0.18,
                    spokenTime(4, "sistema", cueTime(4, 3) + 0.6) +
                      i * 0.18 +
                      0.55,
                  )}
                  color={i === 1 ? C.coral : C.teal}
                  width={7}
                />
              ))}
              {[
                [170, 810],
                [170, 1060],
                [350, 920],
                [430, 735],
              ].map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={
                    12 +
                    12 *
                      p(
                        time,
                        spokenTime(4, "nervioso", cueTime(4, 3) + 1) + i * 0.14,
                        spokenTime(4, "nervioso", cueTime(4, 3) + 1) +
                          i * 0.14 +
                          0.3,
                      )
                  }
                  fill={i === 2 ? C.gold : C.teal}
                  opacity={p(
                    time,
                    spokenTime(4, "sistema", cueTime(4, 3) + 0.6) + i * 0.18,
                    spokenTime(4, "sistema", cueTime(4, 3) + 0.6) +
                      i * 0.18 +
                      0.3,
                  )}
                />
              ))}
              <path
                d="M170 810Q300 800 350 920L440 940"
                pathLength="1"
                fill="none"
                stroke={C.gold}
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray=".16 .84"
                strokeDashoffset={
                  -p(
                    time,
                    spokenTime(4, "cerebro", cueTime(4, 4) - 0.5),
                    spokenTime(4, "cerebro", cueTime(4, 4) - 0.5) + 0.7,
                  )
                }
                opacity={
                  p(
                    time,
                    spokenTime(4, "cerebro", cueTime(4, 4) - 0.5),
                    spokenTime(4, "cerebro", cueTime(4, 4) - 0.5) + 0.12,
                  ) *
                  (1 - p(time, cueTime(4, 4) + 0.3, cueTime(4, 4) + 0.8))
                }
              />
            </g>
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx={475 + i * 30}
                cy={
                  950 +
                  p(
                    time,
                    cueTime(4, 4) + i * 0.07,
                    cueTime(4, 4) + i * 0.07 + 0.65,
                  ) *
                    110
                }
                r="8"
                fill={i % 2 ? C.gold : C.teal}
                opacity={cp(time, 4, 4)}
              />
            ))}
          </svg>
        </div>
      )}
    </>
  );
};

const Medical: React.FC<{ time: number; scene: number; action: number }> = ({
  time,
  scene,
  action,
}) => {
  const start = timeline.scenes[5].start,
    local = time - start,
    ana = scene === 6;
  const hand = scene === 5 && action >= 4;
  const shift = ana ? -35 * cp(time, 6, 0, 0.34) : 0;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 85,
          top: 625,
          width: 850,
          height: 790,
          borderRadius: 50,
          background: "#DAEBE5",
          overflow: "hidden",
          border: "2px solid #9BBFB5",
        }}
      >
        <svg width="850" height="790">
          <rect y="510" width="850" height="280" fill="#B6D1C8" />
          <rect x="35" y="55" width="175" height="290" rx="26" fill="#EFF7EF" />
          <path d="M121 55v290M35 190h175" stroke="#B6D1C8" strokeWidth="10" />
          <path
            d="M440 0v85h175"
            stroke="#7A9F99"
            strokeWidth="12"
            fill="none"
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
          style={{ position: "absolute", inset: 0, translate: `${shift}px 0` }}
        >
          <Character125
            pose={hand ? "point" : "neutral"}
            time={time * 1.25}
            x={300}
            y={508}
            width={410}
            age={time - cueTime(scene, hand ? 4 : 0)}
          />
          <Character125
            pose="explaining"
            time={time * 1.25}
            x={690}
            y={490}
            width={285}
            age={local}
          />
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
            <g opacity={ana ? cp(time, 6, 1) : 0}>
              <ellipse
                cx="290"
                cy="266"
                rx="90"
                ry="105"
                fill="none"
                stroke={C.teal}
                strokeWidth="9"
                strokeDasharray="8 9"
              />
              <path
                d="M365 224L435 172H500"
                fill="none"
                stroke={C.teal}
                strokeWidth="3"
              />
            </g>
            <g opacity={!ana ? cp(time, 5, 1) : 0}>
              <path
                d="M235 205h-20v100h20M355 205h20v100h-20"
                fill="none"
                stroke={C.teal}
                strokeWidth="5"
              />
            </g>
          </svg>
          <div
            style={{
              position: "absolute",
              left: 455,
              top: 70,
              width: 290,
              height: 185,
              borderRadius: 23,
              background: C.navy,
              border: "7px solid #4E8590",
              overflow: "hidden",
            }}
          >
            <svg width="280" height="180">
              <text x="14" y="25" fill={C.cream} fontSize="15" fontWeight="800">
                MONITOREO CONTINUO
              </text>
              <g transform={`translate(${-((time - start) * 68.75) % 160} 0)`}>
                {[0, 1, 2, 3].map((i) => (
                  <path
                    key={i}
                    d={`M${i * 160} 90h70l8-7 9 15 11-46 14 76 12-38h36`}
                    fill="none"
                    stroke={C.teal}
                    strokeWidth="4"
                  />
                ))}
              </g>
              <text x="14" y="150" fill={C.teal} fontSize="17" fontWeight="700">
                EQUIPO MÉDICO PRESENTE
              </text>
            </svg>
          </div>
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
          left: 150,
          top: 690,
          width: 300,
          height: 315,
          borderRadius: 34,
          overflow: "hidden",
          border: `4px solid ${C.teal}`,
          background: C.cream,
          opacity: cp(time, scene, 1, 0.28) * (1 - cp(time, scene, 2, 0.28)),
          scale: 0.88 + 0.12 * cp(time, scene, 1, 0.28),
          transformOrigin: "50% 50%",
        }}
      >
        {ana ? (
          <Image
            src="anatomia/19_piel_corte_transversal.png"
            x={150}
            y={148}
            width={325}
          />
        ) : (
          <Img
            src={staticFile("imagenes/personajes/01_neutral.png")}
            style={{
              position: "absolute",
              left: -290,
              top: -10,
              width: 900,
              height: 1350,
              objectFit: "contain",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 5px",
            background: C.navy,
            color: C.gold,
            fontSize: 23,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          {ana ? "TEJIDO SENSIBLE" : "PACIENTE DESPIERTO"}
        </div>
      </div>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {scene === 5 && (
          <Trace
            d="M350 820C450 630 630 670 650 770"
            progress={p(
              time,
              spokenTime(5, "equipo", cueTime(5, 4) + 0.65),
              spokenTime(5, "equipo", cueTime(5, 4) + 0.65) + 0.65,
            )}
            color={C.teal}
            width={6}
          />
        )}
        {scene === 6 && (
          <Trace
            d="M530 690H838V895H530Z"
            progress={p(
              time,
              spokenTime(6, "continua", cueTime(6, 4) + 0.65),
              spokenTime(6, "continua", cueTime(6, 4) + 0.65) + 0.5,
            )}
            color={C.gold}
            width={7}
          />
        )}
        <g opacity={scene === 5 ? cp(time, 5, 2) : cp(time, 6, 5)}>
          <rect x="593" y="937" width="295" height="55" rx="16" fill={C.navy} />
          {label(614, 974, "CASO SELECCIONADO", C.gold)}
        </g>
        {!ana && action >= 3 && (
          <g opacity={cp(time, 5, 3)}>
            <rect
              x="95"
              y="635"
              width="385"
              height="102"
              rx="28"
              fill={C.navy}
            />
            <path d="M260 737l35 35v-35" fill={C.navy} />
            {label(
              120,
              698,
              action < 4 ? "RESPUESTA VERBAL" : "MUEVE UNA MANO",
              C.gold,
            )}
          </g>
        )}
        {ana && (
          <g>
            {[
              "ANESTESIA LOCAL",
              "TEJIDOS SENSIBLES",
              "VIGILANCIA CONTINUA",
            ].map((text, i) => (
              <g key={text} opacity={cp(time, 6, i + 2)}>
                <rect
                  x="550"
                  y={1055 + i * 50}
                  width="365"
                  height="43"
                  rx="12"
                  fill={C.navy}
                />
                <path
                  d={`M565 ${1076 + i * 50}l7 7 14-17`}
                  fill="none"
                  stroke={C.teal}
                  strokeWidth="4"
                />
                {label(600, 1083 + i * 50, text, C.cream)}
              </g>
            ))}
          </g>
        )}
      </svg>
    </>
  );
};

const Finale: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => (
  <>
    <Character125
      pose={action < 3 ? "explaining" : "point"}
      time={time}
      x={235}
      y={1040}
      width={445}
      age={time - cueTime(7, action < 3 ? 0 : 3)}
    />
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <Trace
        d="M320 780C400 680 485 720 550 840"
        progress={cp(time, 7, 1, 0.48)}
      />
      <g opacity={cp(time, 7, 3)}>
        <rect x="110" y="1160" width="800" height="72" rx="22" fill={C.navy} />
        {label(155, 1208, "INTERPRETAR ≠ TENER UN SENSOR", C.gold)}
      </g>
      <g opacity={cp(time, 7, 5)}>
        <ellipse
          cx="245"
          cy="735"
          rx="96"
          ry="112"
          stroke={C.coral}
          strokeWidth="6"
          fill="none"
        />
        <Trace
          d="M345 730Q465 710 540 835"
          progress={cp(time, 7, 5, 0.5)}
          color={C.coral}
        />
      </g>
    </svg>
  </>
);

export const StoryWorld: React.FC<{
  time: number;
  scene: number;
  action: number;
}> = ({ time, scene, action }) => {
  return (
    <AbsoluteFill style={{ clipPath: "inset(570px 0 480px 0)" }}>
      {scene === 0 ? (
        <Opening time={time} action={action} />
      ) : scene === 1 ? (
        <Sensors time={time} action={action} />
      ) : scene === 2 ? (
        <SensitiveLayers time={time} scene={scene} />
      ) : scene === 3 ? (
        <MigraineComplexity time={time} action={action} />
      ) : scene === 4 ? (
        <Trigeminal time={time} action={action} />
      ) : scene === 5 || scene === 6 ? (
        <Medical time={time} scene={scene} action={action} />
      ) : (
        <Finale time={time} action={action} />
      )}
    </AbsoluteFill>
  );
};
