import React from "react";
import { AbsoluteFill } from "remotion";
import { C, p, cueTime, spokenTime, cueProgress as cp } from "./motion";
import timeline from "./timeline.json";
import {
  Environment,
  Actor,
  WallClock,
  CalendarProp,
  Desk,
  BookProp,
  PathTrace,
  Sign,
} from "./StoryPrimitives";

type Props = { time: number; action: number };
const at = (
  time: number,
  scene: number,
  word: string,
  fallback: number,
  duration = 0.38,
) =>
  p(
    time,
    spokenTime(scene, word, fallback),
    spokenTime(scene, word, fallback) + duration,
  );
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

// A physical notebook, pencil and bottle recur in the following scenes. They
// belong to the protagonist's day; they are not memory cards or a chart.
const Pencil: React.FC<{
  x: number;
  y: number;
  progress?: number;
  angle?: number;
}> = ({ x, y, progress = 1, angle = -25 }) => (
  <Svg>
    <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={progress}>
      <path
        d="M-8-72H8V66L0 85L-8 66Z"
        fill={C.gold}
        stroke={C.navy}
        strokeWidth="3"
      />
      <path d="M-8 66H8L0 85Z" fill="#DEC3A4" stroke={C.navy} strokeWidth="2" />
      <path d="M0 79v6" stroke={C.navy} strokeWidth="4" />
      <path d="M-8-72H8V-56H-8Z" fill={C.coral} />
    </g>
  </Svg>
);
const Bottle: React.FC<{
  x: number;
  y: number;
  progress?: number;
  scale?: number;
}> = ({ x, y, progress = 1, scale = 1 }) => (
  <Svg>
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={progress}>
      <path
        d="M-20-82H20V-60Q35-52 35-30V67Q35 82 20 82H-20Q-35 82-35 67V-30Q-35-52-20-60Z"
        fill="#63C8BA"
        stroke={C.navy}
        strokeWidth="4"
      />
      <rect x="-23" y="-92" width="46" height="22" rx="6" fill={C.navy} />
      <path d="M-20-15H20V42H-20Z" fill={C.cream} opacity=".65" />
      <path
        d="M-15-48v92"
        fill="none"
        stroke={C.cream}
        strokeWidth="7"
        strokeLinecap="round"
        opacity=".5"
      />
    </g>
  </Svg>
);
const BusStop: React.FC<{ progress: number }> = ({ progress }) => (
  <Svg>
    <g opacity={progress}>
      <path d="M165 655V1400" stroke="#365C65" strokeWidth="17" />
      <path
        d="M105 660H242V805H105Z"
        fill={C.cream}
        stroke="#365C65"
        strokeWidth="8"
      />
      <path
        d="M131 705h85v53h-85Z"
        fill={C.teal}
        stroke={C.navy}
        strokeWidth="4"
      />
      <path
        d="M140 705v-14h67v14M141 758v11M205 758v11"
        fill="none"
        stroke={C.navy}
        strokeWidth="6"
      />
      <path d="M132 738h82" stroke={C.navy} strokeWidth="3" />
      <text
        x="174"
        y="792"
        textAnchor="middle"
        fill={C.navy}
        fontSize="20"
        fontWeight="800"
      >
        PARADA
      </text>
      <path
        d="M118 1400h94"
        stroke="#365C65"
        strokeWidth="20"
        strokeLinecap="round"
      />
    </g>
  </Svg>
);
const CoffeeTable: React.FC<{ y: number; progress?: number }> = ({
  y,
  progress = 1,
}) => (
  <Svg>
    <g transform={`translate(0 ${y})`} opacity={progress}>
      <ellipse cx="565" cy="71" rx="345" ry="35" fill="#102C4320" />
      <path d="M270 7l-20 115M830 7l20 115" stroke="#805B47" strokeWidth="24" />
      <path
        d="M219-20Q565-57 900-20L885 17Q565 50 235 16Z"
        fill="#B98C64"
        stroke="#805B47"
        strokeWidth="6"
      />
      <path
        d="M248-17Q565-45 870-17"
        fill="none"
        stroke="#F1CF9D"
        strokeWidth="6"
        opacity=".7"
      />
    </g>
  </Svg>
);
const WindowView: React.FC<{ progress: number; pan: number }> = ({
  progress,
  pan,
}) => (
  <Svg>
    <defs>
      <clipPath id="story-week-window">
        <path d="M660 455H1025V905H660Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#story-week-window)">
      <rect x="660" y="455" width="365" height="450" fill="#A4DCD5" />
      <g transform={`translate(${-pan * 55} 0)`}>
        <circle cx="940" cy="550" r="49" fill={C.gold} />
        <path d="M610 857L815 570L1005 860Z" fill="#478D88" />
        <path d="M795 596L753 680L816 652L854 690Z" fill={C.cream} />
        <path d="M790 900L1015 640L1180 900Z" fill="#2D716F" />
        <path d="M630 852Q825 805 1040 860V930H630Z" fill="#9DBF91" />
        <path
          d="M780 920Q930 850 867 813T945 728"
          pathLength="1"
          stroke={C.gold}
          strokeWidth="10"
          fill="none"
          strokeDasharray={`${progress} 1`}
        />
      </g>
    </g>
    <path
      d="M660 455H1025V905H660ZM842 455V905M660 688H1025"
      fill="none"
      stroke="#32666A"
      strokeWidth="15"
    />
    <path
      d={`M660 455H${835 - 135 * progress}V925H660ZM${850 + 145 * progress} 455H1040V925H${850 + 145 * progress}Z`}
      fill="#147E7E"
      opacity=".92"
    />
    <path
      d="M645 452H1044"
      stroke="#775940"
      strokeWidth="16"
      strokeLinecap="round"
    />
  </Svg>
);

export const StoryScene4: React.FC<Props> = ({ time, action }) => {
  const start = timeline.scenes[4].start;
  const week = cp(time, 4, 1, 0.42),
    novelty = cp(time, 4, 2, 0.45),
    length = cp(time, 4, 3, 0.46),
    recall = cp(time, 4, 4, 0.4),
    retrospect = cp(time, 4, 5, 0.4);
  const page = at(time, 4, "nuevas", cueTime(4, 2) + 0.45, 0.35);
  const actorX = 430 + novelty * 65 - recall * 30;
  const closer = at(time, 4, "Hablamos", cueTime(4, 5) - 1.4, 0.28),
    turn = at(time, 4, "duración", cueTime(4, 5) - 0.8, 0.5),
    previousDetail = at(time, 4, "mirar", cueTime(4, 5), 0.28),
    rememberedSun = at(time, 4, "atrás", cueTime(4, 5) + 0.3, 0.25);
  const edge = 120 * (1 - 2 * turn),
    lift = Math.sin(turn * Math.PI) * 58;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ scale: 1 + 0.14 * closer, transformOrigin: "535px 1100px" }}
      >
        <Environment
          kind="living"
          time={time}
          pan={-12 + novelty * 22}
          zoom={1 + 0.025 * length}
          light={0.12 + 0.1 * recall}
        />
        <WindowView
          progress={novelty * 0.55 + length * 0.45}
          pan={length + recall * 0.4}
        />
        <WallClock time={time} x={820} y={390} radius={82} speed={12} />
        <CalendarProp
          time={time}
          x={105}
          y={530}
          width={185}
          month="ESTA SEMANA"
          progress={week}
        />
        <Actor
          pose={
            closer > 0.35
              ? "thinking"
              : action < 1
                ? "thinking"
                : action < 2
                  ? "idea"
                  : action < 4
                    ? "point"
                    : action < 5
                      ? "happy"
                      : "thinking"
          }
          time={time}
          x={actorX}
          feetY={1410}
          width={500 + length * 15}
          age={time - start}
        />
        <Desk x={535} y={1160} width={850} progress={1} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            translate: `${-novelty * 100 + recall * 40}px ${-week * 15}px`,
            rotate: `${-6 + novelty * 9 - page * 5}deg`,
            transformOrigin: "620px 1110px",
          }}
        >
          <BookProp
            x={640}
            y={1110}
            width={315}
            progress={week * 0.45 + novelty * 0.35 + page * 0.2}
          />
          <Svg>
            <g transform="translate(640 1110) scale(1.3125)">
              <g opacity={previousDetail}>
                <rect
                  x="14"
                  y="-44"
                  width="98"
                  height="94"
                  rx="4"
                  fill={C.cream}
                />
                <path
                  d="M23 21L48-7L71 20L91-18L111 20"
                  fill="none"
                  stroke={C.teal}
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                <path
                  d="M26 38Q65 23 105 38"
                  fill="none"
                  stroke={C.coral}
                  strokeWidth="4"
                />
                <circle cx="76" cy="-30" r={10 * rememberedSun} fill={C.gold} />
              </g>
              {turn > 0 && turn < 1 && (
                <g>
                  <path
                    d={`M0-50Q${edge * 0.45} ${-65 - lift} ${edge} ${-55 - lift * 0.45}L${edge} ${62 - lift * 0.2}Q${edge * 0.4} ${45 - lift * 0.3} 0 70Z`}
                    fill={C.cream}
                    stroke={C.ink}
                    strokeWidth="4"
                  />
                  <path
                    d={`M${edge * 0.2} ${-28 - lift * 0.35}L${edge * 0.78} ${-30 - lift * 0.35}M${edge * 0.2} ${-5 - lift * 0.35}L${edge * 0.78} ${-7 - lift * 0.35}`}
                    stroke={C.teal}
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>
          </Svg>
        </div>
        <Pencil
          x={730 - novelty * 70}
          y={1090 - week * 35}
          progress={1}
          angle={-35 + page * 32}
        />
        <Bottle
          x={235 + novelty * 20}
          y={1100 - week * 9}
          scale={0.7}
          progress={novelty}
        />
        <Svg>
          <g opacity={week * (1 - novelty)}>
            <path
              d="M365 1125l45-34 53 16"
              fill="none"
              stroke={C.coral}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
          <g opacity={retrospect}>
            <path
              d="M285 1035Q320 966 391 1000"
              fill="none"
              stroke={C.gold}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M380 985l14 15-22 4"
              fill="none"
              stroke={C.gold}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        </Svg>
      </AbsoluteFill>
      {retrospect > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 430,
            padding: "10px 16px",
            borderRadius: 11,
            background: "#0C2035E8",
            fontSize: 37,
            fontWeight: 800,
            color: C.cream,
          }}
        >
          AL RECORDARLA
        </div>
      )}
    </AbsoluteFill>
  );
};

export const StoryScene5: React.FC<Props> = ({ time, action }) => {
  const start = timeline.scenes[5].start;
  const waiting = cp(time, 5, 1, 0.38),
    present = cp(time, 5, 2, 0.4),
    attention = cp(time, 5, 3, 0.35),
    journey = cp(time, 5, 4, 0.55),
    perspectives = cp(time, 5, 5, 0.4);
  const always = at(time, 5, "siempre", start + 1, 0.34),
    whileLiving = at(time, 5, "Mientras", cueTime(5, 2) - 0.4, 0.34);
  const focus = always * (1 - whileLiving),
    actorX = 465 + journey * 70;
  return (
    <AbsoluteFill>
      <Environment
        kind="street"
        time={time}
        pan={-8 + focus * 15}
        zoom={1 + 0.025 * focus}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${(1 - journey) * 100}% 0 0)`,
          translate: `${(1 - journey) * 100}px 0`,
        }}
      >
        <Environment
          kind="travel"
          time={time}
          pan={journey * 90 + perspectives * 35}
          zoom={1.02}
          light={0.06}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - journey,
          translate: `${-journey * 160}px 0`,
        }}
      >
        <BusStop progress={1} />
      </div>
      <WallClock
        time={time}
        x={810 - focus * 35}
        y={655 + focus * 15}
        radius={98 + focus * 38 + attention * 12}
        speed={12}
        opacity={1 - journey}
      />
      <Actor
        pose={
          action < 1
            ? "neutral"
            : action < 2
              ? "tired"
              : action < 3
                ? "thinking"
                : action < 4
                  ? "point"
                  : "happy"
        }
        time={time}
        x={actorX}
        feetY={1400}
        width={500 + focus * 20}
        age={time - start}
      />
      <div style={{ position: "absolute", inset: 0, opacity: journey }}>
        <Bottle x={actorX + 190} y={910} scale={0.85} progress={journey} />
        <BookProp
          x={actorX - 190}
          y={925}
          width={205}
          progress={0.3 + journey * 0.7}
        />
      </div>
      <Svg>
        <g opacity={attention * (1 - journey)}>
          <path
            d={`M${actorX + 37} 790L775 670L778 725Z`}
            fill={C.gold}
            opacity=".13"
          />
          <PathTrace
            d={`M${actorX + 37} 790Q680 615 775 685`}
            progress={attention}
            color={C.gold}
            width={6}
          />
          <circle
            cx={810 - focus * 35}
            cy={655 + focus * 15}
            r={120 + focus * 38}
            fill="none"
            stroke={C.gold}
            strokeWidth="5"
          />
        </g>
        <g opacity={waiting * (1 - present)}>
          <path
            d="M315 1310h265"
            stroke={C.coral}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      </Svg>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 420,
          width: "max-content",
          maxWidth: 850,
          padding: "12px 18px",
          borderRadius: 12,
          background: "#0C2035E8",
          color: journey > 0.5 ? C.gold : C.cream,
          fontSize: 40,
          fontWeight: 800,
          lineHeight: 1.1,
          boxShadow: "0 3px 14px #07132120",
        }}
      >
        {journey > 0.5 ? "AL RECORDARLO" : "MIENTRAS OCURRE"}
      </div>
    </AbsoluteFill>
  );
};

export const StoryScene6: React.FC<Props> = ({ time, action }) => {
  const start = timeline.scenes[6].start;
  const decision = cp(time, 6, 1, 0.36),
    learn = cp(time, 6, 2, 0.42),
    route = cp(time, 6, 3, 0.48),
    park = cp(time, 6, 4, 0.5),
    activity = cp(time, 6, 5, 0.42);
  const life = at(time, 6, "vida", start + 0.6, 0.4),
    less = at(time, 6, "menos", cueTime(6, 1) - 0.3, 0.36);
  const actorX = 345 + life * 40 + route * 255 - park * 100;
  return (
    <AbsoluteFill>
      <Environment kind="street" time={time} pan={route * 115} zoom={1} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${(1 - park) * 100}% 0 0)`,
          translate: `${(1 - park) * 110}px 0`,
        }}
      >
        <Environment
          kind="park"
          time={time}
          pan={park * 60 + activity * 18}
          zoom={1.015}
        />
      </div>
      <Svg>
        <g opacity={1 - park}>
          <path d="M815 765V1395" stroke="#80634A" strokeWidth="18" />
          <path
            d="M700 790H940L980 835L940 880H700Z"
            fill={C.teal}
            stroke={C.navy}
            strokeWidth="5"
          />
          <text
            x="830"
            y="850"
            textAnchor="middle"
            fontSize="30"
            fontWeight="800"
            fill={C.cream}
          >
            PARQUE
          </text>
          <path
            d="M815 925H620L585 963L620 1000H815Z"
            fill="#9CABA2"
            stroke={C.navy}
            strokeWidth="4"
            opacity={1 - less * 0.6}
          />
          <text
            x="709"
            y="976"
            textAnchor="middle"
            fontSize="23"
            fontWeight="800"
            fill={C.navy}
          >
            LO DE SIEMPRE
          </text>
        </g>
        <PathTrace
          d="M270 1425Q380 1310 525 1390Q675 1440 840 1240"
          progress={decision * 0.25 + route * 0.6 + park * 0.15}
          color={C.gold}
          width={19}
        />
      </Svg>
      <Actor
        pose={
          action < 1
            ? life > 0.3
              ? "walking"
              : "thinking"
            : action < 2
              ? "point"
              : action < 3
                ? "seated"
                : action < 5
                  ? "walking"
                  : "hands"
        }
        time={time}
        x={actorX}
        feetY={1400}
        width={500}
        walking={(action === 0 && life > 0.3) || (action >= 3 && action < 5)}
        age={time - start}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: learn * (1 - route),
          translate: `${(1 - learn) * -30}px ${-learn * 25}px`,
        }}
      >
        <BookProp x={actorX + 60} y={1105} width={340} progress={learn} />
        <Pencil
          x={actorX + 165}
          y={1070}
          progress={learn}
          angle={-25 + learn * 18}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: park }}>
        <Bottle x={actorX + 205} y={1330} scale={0.85} />
      </div>
      <Svg>
        <g opacity={activity}>
          <path
            d="M390 1350Q540 1280 710 1350"
            fill="none"
            stroke={C.teal}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M425 1280l-28-30M680 1260l35-30"
            stroke={C.gold}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

export const StoryScene7: React.FC<Props> = ({ time, action }) => {
  const start = timeline.scenes[7].start;
  const clock = cp(time, 7, 1, 0.4),
    create = cp(time, 7, 2, 0.45),
    days = cp(time, 7, 3, 0.4),
    question = cp(time, 7, 4, 0.35),
    year = cp(time, 7, 5, 0.4);
  const actorX = 690 - p(time, start, start + 0.65) * 220 - question * 25;
  const placedBookX = (actorX - 120) * (1 - create) + 610 * create,
    placedBookY = 1140 + create * 45;
  return (
    <AbsoluteFill>
      <Environment
        kind="living"
        time={time}
        pan={-30 + clock * 20 + days * 12}
        zoom={1 + 0.018 * question}
        light={0.3}
      />
      <WallClock
        time={time}
        x={810}
        y={560}
        radius={100 + clock * 9}
        speed={12}
      />
      <Actor
        pose={
          action < 1
            ? "walking"
            : action < 2
              ? "point"
              : action < 4
                ? "explaining"
                : "happy"
        }
        time={time}
        x={actorX}
        feetY={1400}
        width={500}
        walking={action < 1}
        age={time - start}
      />
      <CoffeeTable y={1230} />
      <BookProp
        x={placedBookX}
        y={placedBookY}
        width={285 + days * 30}
        progress={create * 0.5 + days * 0.5}
      />
      <Pencil
        x={760 - create * 45}
        y={1135 + create * 15}
        progress={create}
        angle={-20 + days * 70}
      />
      <Bottle
        x={(actorX + 200) * (1 - create) + 815 * create}
        y={1170 - create * 10}
        progress={1}
        scale={0.8}
      />
      <Svg>
        <g opacity={days}>
          <path
            d="M443 1172Q610 1134 750 1160"
            stroke={C.gold}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M565 1045v36M598 1035v35M632 1045v31"
            stroke={C.coral}
            strokeWidth="5"
            strokeLinecap="round"
            opacity={1 - year * 0.6}
          />
        </g>
      </Svg>
      {year > 0.01 && (
        <Sign
          x={145}
          y={455}
          text="¿Y TU AÑO?"
          size={61}
          color={C.gold}
          width={790}
        />
      )}
    </AbsoluteFill>
  );
};
