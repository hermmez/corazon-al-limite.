import React from "react";
import { AbsoluteFill } from "remotion";
import { C, p, cueTime, spokenTime, cueProgress as cp } from "./motion";
import timeline from "./timeline.json";
import { Art } from "./VisualPrimitives";
import {
  Actor,
  Environment,
  WallClock,
  CalendarProp,
  Desk,
  BookProp,
  PathTrace,
  Sign,
  Surface,
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

const VacationWindow: React.FC<{ progress: number }> = ({ progress }) => (
  <Surface style={{ opacity: progress }}>
    <defs>
      <clipPath id="story-vacation-window">
        <path d="M20 465H315V1010H20Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#story-vacation-window)">
      <rect x="20" y="465" width="295" height="545" fill="#A9DEDF" />
      <circle cx="245" cy="570" r="47" fill={C.gold} />
      <path d="M20 825Q170 780 315 830V1010H20Z" fill={C.teal} />
      <path d="M20 935Q185 890 315 950V1010H20Z" fill="#E5CA96" />
      <path
        d="M55 840Q165 805 290 845"
        fill="none"
        stroke={C.cream}
        strokeWidth="11"
      />
      <path
        d="M95 935Q110 770 83 670M83 670Q40 625 12 679M83 670Q150 610 173 671M83 670Q136 700 150 747"
        stroke="#368F7E"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
      />
    </g>
    <path
      d="M20 465H315V1010H20ZM167 465V1010M20 740H315"
      fill="none"
      stroke="#936E4F"
      strokeWidth="17"
    />
  </Surface>
);
const CalendarLeaves: React.FC<{
  time: number;
  start: number;
  x?: number;
  y?: number;
}> = ({ time, start, x = 765, y = 780 }) => (
  <Surface>
    {[0, 1, 2].map((i) => {
      const f = p(time, start + i * 0.17, start + i * 0.17 + 0.48);
      return (
        <g
          key={i}
          opacity={(f > 0 ? 1 : 0) * (1 - f)}
          transform={`translate(${x + f * 145} ${y - f * 240}) rotate(${f * 65})`}
        >
          <path
            d="M-75-45H75V65H-75Z"
            fill={C.cream}
            stroke="#A77F61"
            strokeWidth="4"
          />
          <path d="M-75-45H75V-15H-75Z" fill={C.coral} />
          <text
            x="0"
            y="35"
            textAnchor="middle"
            fontSize="41"
            fontWeight="800"
            fill={C.ink}
          >
            {i + 1}
          </text>
        </g>
      );
    })}
  </Surface>
);
const Bus: React.FC<{ progress: number }> = ({ progress }) => {
  const x = -1090 + progress * 2400;
  return (
    <Surface>
      <g transform={`translate(${x} 970)`}>
        <path
          d="M20 0H900Q980 0 980 95V345H0V75Q0 0 20 0Z"
          fill="#318F8E"
          stroke="#224D5A"
          strokeWidth="10"
        />
        <path
          d="M30 42H920V190H30Z"
          fill="#B3DAD7"
          stroke="#224D5A"
          strokeWidth="8"
        />
        {[170, 360, 550, 740].map((a) => (
          <path key={a} d={`M${a} 42V190`} stroke="#224D5A" strokeWidth="10" />
        ))}
        <path d="M0 255H980" stroke={C.gold} strokeWidth="18" />
        <path
          d="M815 195H940V337H815Z"
          fill="#265C68"
          stroke="#224D5A"
          strokeWidth="6"
        />
        {[185, 780].map((a) => (
          <g
            key={a}
            transform={`translate(${a} 345) rotate(${progress * 900})`}
          >
            <circle r="65" fill={C.navy} />
            <circle r="35" fill="#9BC4BE" />
            <path d="M-28 0h56M0-28V28" stroke="#406B72" strokeWidth="8" />
          </g>
        ))}
      </g>
    </Surface>
  );
};

export const StoryScene0: React.FC<Props> = ({ time, action }) => {
  const local = time - timeline.scenes[0].start,
    vacation = cp(time, 0, 1, 0.4),
    eyes = cp(time, 0, 3, 0.26),
    december = cp(time, 0, 4, 0.3),
    question = cp(time, 0, 5, 0.35);
  const x = 480 - 45 * vacation + 35 * december;
  const clockPhase =
    local < 3 ? 70 * local + 35 * local * local : 525 + (local - 3) * 12;
  return (
    <AbsoluteFill>
      <Environment
        kind="bedroom"
        time={time}
        pan={-18 * vacation + 20 * question}
        zoom={1.015 + 0.025 * december}
        light={0.14 * eyes}
      />
      <VacationWindow progress={vacation * (1 - eyes)} />
      <WallClock
        time={clockPhase}
        x={835}
        y={535}
        radius={108}
        depth={local < 3}
        speed={1}
      />
      <CalendarProp
        time={time}
        x={730}
        y={730}
        width={215}
        month={
          december > 0.2 ? "DICIEMBRE" : eyes > 0.5 ? "NOVIEMBRE" : "JULIO"
        }
        progress={0.8 + 0.2 * vacation}
      />
      <CalendarLeaves time={time} start={cueTime(0, 3)} x={830} y={820} />
      <Actor
        pose={
          action === 0
            ? "tired"
            : action === 1
              ? "happy"
              : action === 2
                ? "thinking"
                : action === 3
                  ? "yawning"
                  : action === 4
                    ? "surprised"
                    : "confused"
        }
        time={time}
        x={x}
        feetY={1400}
        width={525}
        age={10}
      />
      <Surface>
        <g opacity={december * (1 - question)}>
          <path
            d="M670 865Q665 765 710 770"
            stroke={C.gold}
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M700 757l17 14-20 10"
            stroke={C.gold}
            strokeWidth="6"
            fill="none"
          />
        </g>
        <g opacity={question}>
          <path
            d="M605 720q55-65 90-10q25 39-24 60v40"
            stroke={C.gold}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="672" cy="837" r="7" fill={C.gold} />
        </g>
      </Surface>
    </AbsoluteFill>
  );
};

export const StoryScene1: React.FC<Props> = ({ time, action }) => {
  const start = timeline.scenes[1].start,
    day = at(time, 1, "días", start + 1, 0.45),
    bus = at(time, 1, "siguen", start + 1.3, 1.15),
    brain = cp(time, 1, 2, 0.28) * (1 - cp(time, 1, 4, 0.32)),
    live = cp(time, 1, 3, 0.36),
    remember = cp(time, 1, 4, 0.42),
    many = cp(time, 1, 5, 0.4);
  return (
    <AbsoluteFill>
      <Environment
        kind="street"
        time={time}
        pan={-45 * day + 42 * remember}
        zoom={1 + 0.02 * live}
        light={day * 0.16}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: remember * 0.75,
          clipPath: `inset(0 ${(1 - remember) * 100}% 0 0)`,
        }}
      >
        <Environment kind="living" time={time} pan={15} light={0.1} />
      </div>
      <Bus progress={bus} />
      <WallClock
        time={time}
        x={835}
        y={600}
        radius={90}
        speed={12}
        opacity={1 - brain}
      />
      <Actor
        pose={
          action < 2
            ? "walking"
            : action < 3
              ? "explaining"
              : action < 4
                ? "point"
                : action < 5
                  ? "thinking"
                  : "explaining"
        }
        time={time}
        x={420 + day * 70 - remember * 25}
        feetY={1400}
        width={510}
        walking={action < 2 && bus < 0.9}
        age={time - start}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: brain,
          scale: 0.8 + 0.2 * brain,
          transformOrigin: "76% 35%",
        }}
      >
        <Art
          src="anatomia/01_cerebro_completo.png"
          x={810}
          y={700}
          width={240}
        />
        <Surface>
          <PathTrace
            d="M560 775Q690 615 735 705"
            progress={cp(time, 1, 2, 0.45)}
            color={C.gold}
            width={7}
          />
        </Surface>
      </div>
      <Surface>
        <g opacity={day * (1 - remember)}>
          <path
            d="M135 810H285V1010H135Z"
            fill={C.cream}
            stroke="#547D76"
            strokeWidth="8"
          />
          <text
            x="210"
            y="895"
            fill={C.ink}
            textAnchor="middle"
            fontSize="48"
            fontWeight="800"
          >
            24
          </text>
          <text
            x="210"
            y="949"
            fill={C.ink}
            textAnchor="middle"
            fontSize="31"
            fontWeight="800"
          >
            HORAS
          </text>
          <path d="M210 1010v350" stroke="#547D76" strokeWidth="14" />
        </g>
        <g opacity={many}>
          <path
            d="M650 1080Q795 1005 900 1120"
            fill="none"
            stroke={C.teal}
            strokeWidth="8"
          />
          <circle cx="650" cy="1080" r="13" fill={C.gold} />
          <circle cx="780" cy="1060" r="13" fill={C.coral} />
          <circle cx="900" cy="1120" r="13" fill={C.gold} />
        </g>
      </Surface>
    </AbsoluteFill>
  );
};

export const StoryScene2: React.FC<Props> = ({ time, action }) => {
  const start = timeline.scenes[2].start,
    child = at(time, 2, "niño", start + 0.6, 0.42),
    experience = cp(time, 2, 1, 0.45),
    newness = at(time, 2, "nuevas", cueTime(2, 1) + 0.8, 0.35),
    school = cp(time, 2, 2, 0.42),
    friends = cp(time, 2, 3, 0.42),
    places = cp(time, 2, 4, 0.55),
    seen = at(time, 2, "visto", cueTime(2, 4) + 1.1, 0.35),
    discovery = cp(time, 2, 5, 0.4);
  const x = 390 + experience * 55 + friends * 35 + places * 100 - seen * 45;
  return (
    <AbsoluteFill>
      <Environment
        kind="school"
        time={time}
        pan={-50 * child - 60 * experience - 90 * friends - places * 210}
        zoom={1 + 0.02 * school}
        progress={child}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${(1 - places) * 1080}px 0`,
        }}
      >
        <Environment
          kind="park"
          time={time}
          pan={places * 80 + seen * 30}
          zoom={1.01}
        />
      </div>
      <Surface>
        <g opacity={friends * (1 - places)}>
          <path
            d="M780 1125l55-80 55 80-55 80Z"
            fill={C.gold}
            stroke={C.ink}
            strokeWidth="5"
          />
          <path
            d="M835 1205Q755 1250 730 1300"
            fill="none"
            stroke={C.coral}
            strokeWidth="5"
          />
          <path
            d="M170 1290h145M195 1320h100"
            fill="none"
            stroke="#E2A77D"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <text x="180" y="1250" fontSize="40" fontWeight="800" fill={C.coral}>
            ¡HOLA!
          </text>
        </g>
        <g opacity={seen}>
          <path d="M760 1030v340" stroke="#8A6D4F" strokeWidth="18" />
          <path
            d="M700 1035h200l35 37-35 37H700Z"
            fill={C.teal}
            stroke={C.ink}
            strokeWidth="5"
          />
          <text
            x="814"
            y="1085"
            textAnchor="middle"
            fontSize="26"
            fontWeight="800"
            fill={C.cream}
          >
            OTRO LUGAR
          </text>
        </g>
      </Surface>
      <Actor
        pose={
          action < 1
            ? "thinking"
            : action < 2
              ? "walking"
              : action < 3
                ? newness > 0.4
                  ? "surprised"
                  : "point"
                : action < 4
                  ? "greeting"
                  : action < 5
                    ? seen > 0.5
                      ? "point"
                      : "walking"
                    : "idea"
        }
        time={time}
        x={x}
        feetY={1400}
        width={510}
        walking={
          (action === 1 && experience < 0.9) || (action === 4 && seen < 0.5)
        }
        age={time - start}
      />
      <Surface>
        <path
          d="M0 0H1080V1920H0Z"
          fill={C.gold}
          opacity={0.055 * (1 - places)}
        />
        <g opacity={discovery}>
          <path
            d="M680 650l30-35M713 705h45M652 610l-4-40"
            stroke={C.gold}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
      </Surface>
    </AbsoluteFill>
  );
};

export const StoryScene3: React.FC<Props> = ({ time, action }) => {
  const start = timeline.scenes[3].start,
    wake = cp(time, 3, 1, 0.35),
    work = cp(time, 3, 2, 0.45),
    home = cp(time, 3, 3, 0.45),
    memory = cp(time, 3, 4, 0.4),
    fewer = at(time, 3, "menos", cueTime(3, 4) + 1, 0.35),
    details = at(time, 3, "detalles", cueTime(3, 4) + 1.4, 0.35),
    notEveryone = cp(time, 3, 5, 0.4);
  const repeat = at(time, 3, "repetir", cueTime(3, 3) + 0.6, 0.45),
    similar = at(time, 3, "parecen", start + 1.8, 0.35);
  const commute = (work > 0.01 && work < 0.95) || (home > 0.01 && home < 0.95);
  const actorX = 435 + wake * 55 - work * 30 + home * 20 - memory * 55;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${-work * 1080}px 0`,
        }}
      >
        <Environment
          kind="bedroom"
          time={time}
          pan={-35 * similar}
          zoom={1.01}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${(1 - work) * 1080 - home * 1080}px 0`,
        }}
      >
        <Environment kind="office" time={time} pan={-25 * work} zoom={1.01} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${(1 - home) * 1080}px 0`,
        }}
      >
        <Environment
          kind="living"
          time={time}
          pan={25 * repeat - 35 * details}
          zoom={1 + 0.035 * details}
          light={0.12 + 0.12 * memory}
        />
      </div>
      <WallClock
        time={time + repeat * 30}
        x={835}
        y={575}
        radius={95}
        speed={12}
      />
      <CalendarProp
        time={time + repeat * 4}
        x={125}
        y={680}
        width={200}
        month="OTRO DÍA"
        progress={0.8 + 0.2 * similar}
      />
      <CalendarLeaves
        time={time}
        start={spokenTime(3, "repetir", cueTime(3, 3) + 0.6)}
        x={230}
        y={780}
      />
      <Actor
        pose={
          commute
            ? "running"
            : action < 1
              ? similar > 0.4
                ? "thinking"
                : "tired"
              : action < 2
                ? "walking"
                : action < 3
                  ? "seated"
                  : action < 4
                    ? "walking"
                    : action < 5
                      ? fewer > 0.5
                        ? "confused"
                        : "thinking"
                      : "point"
        }
        time={time}
        x={actorX}
        feetY={1400}
        width={510}
        walking={
          commute ||
          (action === 1 && wake < 0.9) ||
          (action === 3 && home < 0.9)
        }
        age={time - start}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: work * (1 - home),
          translate: `${(1 - work) * 400 - home * 400}px 0`,
        }}
      >
        <Desk x={570} y={1180} width={840} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: memory,
          translate: `${(1 - memory) * 220}px 0`,
        }}
      >
        <Desk x={565} y={1250} width={800} progress={0} />
        <BookProp x={665} y={1185} width={285} progress={0.4 + 0.6 * details} />
        <Surface>
          <g opacity={notEveryone}>
            <path d="M840 1240v-83" stroke="#478F77" strokeWidth="8" />
            <path d="M810 1240h60l-10 55h-40Z" fill={C.teal} />
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={i}
                cx={840 + Math.cos((i * Math.PI * 2) / 5) * 23}
                cy={1145 + Math.sin((i * Math.PI * 2) / 5) * 23}
                rx="18"
                ry="13"
                fill={C.coral}
                transform={`rotate(${i * 72} 840 1145)`}
              />
            ))}
            <circle cx="840" cy="1145" r="12" fill={C.gold} />
          </g>
        </Surface>
      </div>
    </AbsoluteFill>
  );
};
