import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, p } from "./motion";
import {
  Calendar,
  CharacterPose,
  ClockFace,
  CHARACTER_ASSETS,
} from "./VisualPrimitives";

export type StoryPose =
  | CharacterPose
  | "running"
  | "yawning"
  | "greeting"
  | "confused";
const POSES: Record<StoryPose, string> = {
  ...CHARACTER_ASSETS,
  running: "22_corriendo.png",
  yawning: "18_bostezando.png",
  greeting: "06_saludando.png",
  confused: "15_confundido.png",
};
export const Surface: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <svg
    width="1080"
    height="1920"
    style={{ position: "absolute", inset: 0, ...style }}
  >
    {children}
  </svg>
);
export const PathTrace: React.FC<{
  d: string;
  progress: number;
  color?: string;
  width?: number;
}> = ({ d, progress, color = C.gold, width = 7 }) => (
  <path
    d={d}
    pathLength="1"
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeDasharray={`${Math.max(0, Math.min(1, progress))} 1`}
  />
);
export const Sign: React.FC<{
  x: number;
  y: number;
  text: string;
  size?: number;
  color?: string;
  width?: number;
}> = ({ x, y, text, size = 36, color = C.ink, width = 700 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      color,
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.15,
    }}
  >
    {text}
  </div>
);

export const Actor: React.FC<{
  pose: StoryPose;
  time: number;
  x: number;
  feetY?: number;
  width?: number;
  age?: number;
  walking?: boolean;
  opacity?: number;
  flip?: boolean;
}> = ({
  pose,
  time,
  x,
  feetY = 1390,
  width = 500,
  age = 100,
  walking = false,
  opacity = 1,
  flip = false,
}) => {
  const step = walking
    ? Math.abs(Math.sin(time * (pose === "running" ? 14 : 9)))
    : 0;
  const enter = p(age, 0, 0.24),
    breath = 1 + Math.sin(time * 2.5) * 0.002;
  const blink =
    pose === "neutral" || pose === "explaining"
      ? Math.max(0, 1 - Math.abs(((time + 0.4) % 3.44) - 1.8) / 0.065)
      : 0;
  const eyes =
    pose === "explaining"
      ? [
          [455, 191],
          [535, 183],
        ]
      : [
          [449, 190],
          [538, 187],
        ];
  return (
    <>
      <Surface style={{ opacity }}>
        <ellipse
          cx={x}
          cy={feetY + 7}
          rx={width * (0.23 - 0.025 * step)}
          ry={width * 0.035}
          fill="#102C43"
          opacity=".19"
        />
      </Surface>
      <div
        style={{
          position: "absolute",
          left: x - width / 2,
          top: feetY - width * 1.39 - step * 5,
          width,
          height: width * 1.5,
          opacity,
          transformOrigin: "50% 94%",
          translate: `${(1 - enter) * 35}px 0`,
          rotate: `${walking ? Math.sin(time * 9) * 0.6 : 0}deg`,
          scale: `${(flip ? -1 : 1) * (0.97 + 0.03 * enter)} ${(0.97 + 0.03 * enter) * breath}`,
        }}
      >
        <Img
          src={staticFile(`imagenes/personajes/${POSES[pose]}`)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        <svg
          viewBox="0 0 1024 1536"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: blink,
          }}
        >
          {eyes.map(([cx, cy]) => (
            <g key={cx}>
              <ellipse cx={cx} cy={cy} rx="26" ry="25" fill="#FFB273" />
              <path
                d={`M${cx - 24} ${cy}q24 12 48 0`}
                stroke="#5C3021"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
};

export type EnvironmentKind =
  | "bedroom"
  | "living"
  | "kitchen"
  | "street"
  | "school"
  | "office"
  | "park"
  | "travel";
export const Environment: React.FC<{
  kind: EnvironmentKind;
  time: number;
  pan?: number;
  zoom?: number;
  light?: number;
  progress?: number;
}> = ({ kind, time, pan = 0, zoom = 1, light = 0, progress = 1 }) => {
  const room = kind === "bedroom" || kind === "living" || kind === "kitchen";
  const file =
    kind === "bedroom"
      ? "01_dormitorio.png"
      : kind === "living"
        ? "03_sala.png"
        : "02_cocina.png";
  return (
    <AbsoluteFill
      style={{ background: room ? "#E7D4AF" : "#D0E8DF", overflow: "hidden" }}
    >
      {room ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "50% 53%",
              scale: zoom,
              translate: `${pan}px 0`,
            }}
          >
            <Img
              src={staticFile(`imagenes/escenarios/${file}`)}
              style={
                kind === "bedroom"
                  ? {
                      position: "absolute",
                      left: -210,
                      top: -5,
                      width: 1500,
                      height: 1500,
                      objectFit: "contain",
                    }
                  : {
                      position: "absolute",
                      inset: 0,
                      width: 1080,
                      height: 1920,
                      objectFit: "cover",
                    }
              }
            />
          </div>
          <Surface>
            <path
              d={`M${150 + pan * 0.3} 400L${580 + pan * 0.6} 1460H${40 + pan * 0.4}Z`}
              fill="#FFEC9A"
              opacity={0.13 * (1 - light)}
            />
            <rect
              width="1080"
              height="1920"
              fill="#123348"
              opacity={light * 0.3}
            />
          </Surface>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 57%",
            scale: zoom,
          }}
        >
          <Surface>
            <defs>
              <linearGradient id={`sky-${kind}`} x2="0" y2="1">
                <stop stopColor={light > 0.4 ? "#7C9DBB" : "#BCE9E3"} />
                <stop
                  offset="1"
                  stopColor={light > 0.4 ? "#F5CE94" : "#E8F3DA"}
                />
              </linearGradient>
            </defs>
            <rect width="1080" height="1920" fill={`url(#sky-${kind})`} />
            <g transform={`translate(${pan * 0.16} 0)`}>
              <circle cx="840" cy="440" r="74" fill={C.gold} opacity=".75" />
              <path
                d="M-80 490Q70 430 180 490T440 480M720 570Q860 495 1040 560T1240 540"
                stroke="#FFF9E9"
                strokeWidth="34"
                strokeLinecap="round"
                fill="none"
                opacity=".7"
              />
            </g>
            {kind === "park" || kind === "travel" ? (
              <>
                <g transform={`translate(${pan * 0.32} 0)`}>
                  <path d="M-150 1190L230 500L700 1190Z" fill="#78B5A1" />
                  <path d="M80 780L230 500L390 770L245 700Z" fill="#F4F6DC" />
                  <path d="M430 1240L890 565L1250 1240Z" fill="#3A8D85" />
                  <path d="M740 790L890 565L1010 780L900 725Z" fill="#EAF4DE" />
                </g>
                <path
                  d="M-80 1210Q250 1070 520 1210T1170 1170V1920H-80Z"
                  fill="#8BC6A3"
                />
                {kind === "travel" ? (
                  <path
                    d="M300 1160Q600 1080 1080 1200V1490Q550 1380 0 1510V1330Z"
                    fill="#43B3AE"
                  />
                ) : (
                  <path
                    d="M270 1920Q690 1440 465 1325T640 1040"
                    fill="none"
                    stroke="#E5D2A6"
                    strokeWidth="165"
                  />
                )}
                <g transform={`translate(${pan * 0.72} 0)`}>
                  {[80, 995].map((x, i) => (
                    <g key={x}>
                      <path
                        d={`M${x} 780V1420`}
                        stroke="#7D624B"
                        strokeWidth="34"
                      />
                      <circle
                        cx={x}
                        cy={760 + i * 85}
                        r="170"
                        fill={i ? "#2E8977" : "#479B7E"}
                      />
                      <circle
                        cx={x - 80}
                        cy={850 + i * 35}
                        r="125"
                        fill="#62AC87"
                      />
                    </g>
                  ))}
                </g>
                <path
                  d="M680 1250h310M710 1290h250M725 1290v115M945 1290v115"
                  stroke="#997B55"
                  strokeWidth="25"
                  fill="none"
                />
              </>
            ) : kind === "school" ? (
              <>
                <g
                  transform={`translate(${pan * 0.35} ${25 * (1 - progress)})`}
                >
                  <path
                    d="M70 670L535 380L1010 670Z"
                    fill={C.coral}
                    stroke={C.ink}
                    strokeWidth="8"
                  />
                  <path
                    d="M135 670H945V1210H135Z"
                    fill="#F3DFAD"
                    stroke="#A78365"
                    strokeWidth="8"
                  />
                  <path
                    d="M460 885H635V1210H460Z"
                    fill="#4EAA9E"
                    stroke={C.ink}
                    strokeWidth="7"
                  />
                  {[210, 715].map((x) => (
                    <g key={x}>
                      <rect
                        x={x}
                        y="760"
                        width="155"
                        height="205"
                        fill="#A7DDDD"
                        stroke="#8D765A"
                        strokeWidth="9"
                      />
                      <path
                        d={`M${x + 77} 760V965M${x} 860h155`}
                        stroke="#8D765A"
                        strokeWidth="7"
                      />
                    </g>
                  ))}
                  <text
                    x="540"
                    y="660"
                    textAnchor="middle"
                    fontSize="52"
                    fontWeight="800"
                    fill={C.ink}
                  >
                    ESCUELA
                  </text>
                  <path
                    d="M538 382V275h180v85H538"
                    stroke={C.ink}
                    strokeWidth="6"
                    fill={C.teal}
                  />
                  <path
                    d="M130 1220H950M90 1250H990"
                    stroke="#BCA47D"
                    strokeWidth="27"
                  />
                </g>
                <path d="M0 1315H1080V1920H0Z" fill="#D7CEB4" />
                <g transform={`translate(${pan * 0.8} 0)`}>
                  <path
                    d="M80 1260V795M1000 1260V795"
                    stroke="#487F75"
                    strokeWidth="24"
                  />
                  <path
                    d={`M80 840L${80 - 180 * progress} 830V1250H80M1000 840L${1000 + 180 * progress} 830V1250H1000`}
                    stroke="#487F75"
                    strokeWidth="9"
                    fill="none"
                  />
                </g>
              </>
            ) : kind === "office" ? (
              <>
                <rect x="0" y="340" width="1080" height="1100" fill="#E0E8DA" />
                <g transform={`translate(${pan * 0.28} 0)`}>
                  <rect
                    x="60"
                    y="485"
                    width="560"
                    height="630"
                    fill="#ACDAD8"
                    stroke="#6B9493"
                    strokeWidth="14"
                  />
                  {[100, 260, 410].map((x, i) => (
                    <g key={x}>
                      <rect
                        x={x}
                        y={710 - i * 65}
                        width="135"
                        height={405 + i * 65}
                        fill={["#83AAA9", "#67918F", "#94B8AF"][i]}
                      />
                      {[0, 1, 2, 3].map((r) => (
                        <path
                          key={r}
                          d={`M${x + 15} ${760 - i * 65 + r * 70}h105`}
                          stroke="#CCE5D4"
                          strokeWidth="14"
                        />
                      ))}
                    </g>
                  ))}
                  <path
                    d="M340 485v630M60 800h560"
                    stroke="#6B9493"
                    strokeWidth="13"
                  />
                </g>
                <path d="M0 1300H1080V1920H0Z" fill="#B4C9B7" />
                <path
                  d="M840 875h220v520H840Z"
                  fill="#93B6AD"
                  stroke="#547E77"
                  strokeWidth="8"
                />
                {[920, 1055, 1190].map((y) => (
                  <g key={y}>
                    <path
                      d={`M860 ${y}h180v100H860Z`}
                      fill="#B7CDB9"
                      stroke="#547E77"
                      strokeWidth="5"
                    />
                    <path
                      d={`M925 ${y + 27}h50`}
                      stroke={C.navy}
                      strokeWidth="7"
                    />
                  </g>
                ))}
              </>
            ) : (
              <>
                <g transform={`translate(${pan * 0.23} 0)`}>
                  {[-180, 140, 500, 870].map((x, i) => (
                    <g key={x}>
                      <rect
                        x={x}
                        y={500 + (i % 2) * 115}
                        width="310"
                        height="735"
                        fill={["#91B9B2", "#B2CCB6", "#6F9D9A", "#94BDB2"][i]}
                      />
                      {[0, 1, 2, 3].flatMap((r) =>
                        [0, 1, 2].map((c) => (
                          <rect
                            key={`${r}-${c}`}
                            x={x + 38 + c * 82}
                            y={550 + (i % 2) * 115 + r * 130}
                            width="45"
                            height="65"
                            fill="#DDEACF"
                            opacity=".8"
                          />
                        )),
                      )}
                    </g>
                  ))}
                </g>
                <path d="M0 1210H1080V1920H0Z" fill="#A7BDB0" />
                <path d="M0 1400H1080V1920H0Z" fill="#6A8F88" />
                <path
                  d="M0 1480H1080"
                  stroke="#ECDEAC"
                  strokeWidth="18"
                  strokeDasharray="110 65"
                />
                <g transform={`translate(${pan * 0.65} 0)`}>
                  <path
                    d="M750 1240V765h300v475"
                    fill="#D6E7DB33"
                    stroke="#597E78"
                    strokeWidth="13"
                  />
                  <path d="M700 770h390" stroke="#597E78" strokeWidth="28" />
                  <path
                    d="M775 1165h240M800 1165v100M990 1165v100"
                    stroke="#9C805B"
                    strokeWidth="23"
                  />
                  <path
                    d="M160 1220V565h135"
                    stroke="#547D76"
                    strokeWidth="18"
                  />
                  <path
                    d="M295 565v75H180v-75"
                    fill={C.gold}
                    stroke="#547D76"
                    strokeWidth="9"
                  />
                </g>
              </>
            )}
          </Surface>
        </div>
      )}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(10,31,47,.70) 0%,rgba(10,31,47,.20) 20%,transparent 40%,transparent 68%,rgba(10,31,47,.34) 79%,#0C2035 94%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const WallClock: React.FC<{
  time: number;
  x: number;
  y: number;
  radius?: number;
  depth?: boolean;
  speed?: number;
  opacity?: number;
}> = ({ time, x, y, radius = 90, depth = false, speed = 12, opacity = 1 }) => (
  <div style={{ position: "absolute", inset: 0, opacity }}>
    <ClockFace
      time={time}
      x={x}
      y={y}
      radius={radius}
      depth={depth}
      speed={speed}
      dark={false}
    />
  </div>
);
export const CalendarProp: React.FC<{
  time: number;
  x: number;
  y: number;
  width?: number;
  month?: string;
  progress?: number;
  opacity?: number;
}> = ({
  time,
  x,
  y,
  width = 220,
  month = "DICIEMBRE",
  progress = 1,
  opacity = 1,
}) => (
  <div style={{ position: "absolute", inset: 0, opacity }}>
    <Calendar
      x={x}
      y={y}
      width={width}
      month={month}
      progress={progress}
      highlight={Math.floor(time) % 7}
      dark={false}
    />
  </div>
);
export const Desk: React.FC<{
  x: number;
  y: number;
  width?: number;
  progress?: number;
}> = ({ x, y, width = 760, progress = 1 }) => (
  <Surface>
    <g transform={`translate(${x - width / 2} ${y}) scale(${width / 760})`}>
      <path
        d="M0 0H760L715 75H35Z"
        fill="#C6A677"
        stroke="#735B45"
        strokeWidth="7"
      />
      <path d="M35 75H715V116H35Z" fill="#A88660" />
      <path d="M85 115V330M660 115V330" stroke="#6F6B59" strokeWidth="26" />
      <g opacity={progress}>
        <path d="M400-50H620L650-40H380Z" fill="#496D70" />
        <path
          d="M410-50L395-200H610L620-50Z"
          fill="#6D9996"
          stroke="#355F64"
          strokeWidth="8"
        />
        <path d="M424-180H585V-75H424Z" fill="#BAE0D5" />
        <path d="M445-150h115M445-120h75" stroke={C.teal} strokeWidth="13" />
      </g>
    </g>
  </Surface>
);
export const BookProp: React.FC<{
  x: number;
  y: number;
  width?: number;
  progress?: number;
}> = ({ x, y, width = 240, progress = 1 }) => (
  <Surface>
    <g transform={`translate(${x} ${y}) scale(${width / 240})`}>
      <path
        d="M-120-55Q-55-80 0-50Q65-80 120-55V62Q55 40 0 70Q-60 40-120 62Z"
        fill={C.cream}
        stroke={C.ink}
        strokeWidth="6"
      />
      <path d="M0-50V70" stroke={C.ink} strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M-97 ${-30 + i * 27}h72M25 ${-30 + i * 27}h72`}
          pathLength="1"
          stroke={i === 1 ? C.coral : C.teal}
          strokeWidth="7"
          strokeDasharray={`${Math.max(0, Math.min(1, progress * 3 - i * 0.4))} 1`}
          fill="none"
        />
      ))}
    </g>
  </Surface>
);
