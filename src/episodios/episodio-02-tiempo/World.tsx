import React from "react";
import { AbsoluteFill } from "remotion";
import { C, p, cueTime, cueProgress as cp, spokenTime } from "./motion";
import timeline from "./timeline.json";
import {
  Art,
  Calendar,
  Character,
  ClockFace,
  MiniScene,
} from "./VisualPrimitives";

const mix = (a: number, b: number, n: number) => a + (b - a) * n;
const Surface: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);
const label = (
  x: number,
  y: number,
  text: string,
  color: string = C.cream,
  size = 28,
) => (
  <text x={x} y={y} fontSize={size} fontWeight="800" fill={color}>
    {text}
  </text>
);
const Trace: React.FC<{
  d: string;
  progress: number;
  color?: string;
  width?: number;
}> = ({ d, progress, color = C.teal, width = 6 }) => (
  <>
    <path d={d} fill="none" stroke={color} strokeWidth={width} opacity=".12" />
    <path
      d={d}
      pathLength="1"
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${progress} 1`}
    />
  </>
);
const at = (
  time: number,
  scene: number,
  word: string,
  fallback: number,
  duration = 0.4,
) =>
  p(
    time,
    spokenTime(scene, word, fallback),
    spokenTime(scene, word, fallback) + duration,
  );
const days = ["L", "M", "M", "J", "V", "S", "D"];
const colors = [C.teal, C.gold, C.coral, "#7CA8DE", C.teal, C.coral, C.gold];
const MiniLabel: React.FC<{
  x: number;
  y: number;
  width: number;
  text: string;
  dark?: boolean;
}> = ({ x, y, width, text, dark = true }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      boxSizing: "border-box",
      padding: "8px 12px",
      borderRadius: 12,
      background: dark ? C.navy : C.cream,
      color: dark ? C.gold : C.ink,
      fontSize: 25,
      fontWeight: 800,
      textAlign: "center",
    }}
  >
    {text}
  </div>
);

const Opening: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const start = timeline.scenes[0].start,
    local = time - start;
  // Three-second replaceable shaded clock opening. This is authored vector
  // geometry, not a generated photorealistic clip or a claim of delivered 3D.
  const turn = p(local, 2.35, 2.95),
    dec = cp(time, 0, 4, 0.32);
  const fastTime = local + local * local * 0.19;
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - turn,
          transformOrigin: "50% 48%",
          scale: 1 + 0.09 * p(local, 0, 0.3),
          rotate: `${mix(-13, -5, p(local, 0, 1.3))}deg`,
        }}
      >
        <ClockFace
          time={fastTime}
          x={540}
          y={920}
          radius={270}
          speed={128 + local * 36}
          depth
          dark
        />
        <Surface>
          <ellipse cx="540" cy="1210" rx="250" ry="17" fill="#00000033" />
          {label(335, 635, "¿DÓNDE SE FUE EL AÑO?", C.gold, 30)}
        </Surface>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: turn,
          translate: `${(1 - turn) * 90}px 0`,
          scale: 0.94 + 0.06 * turn,
          transformOrigin: "60% 50%",
        }}
      >
        <Character
          pose={action < 4 ? "surprised" : "thinking"}
          time={time}
          x={250}
          y={1000}
          width={350}
          age={local - 2.35}
        />
        <Calendar
          x={470}
          y={735}
          width={440}
          height={430}
          month={dec > 0.5 ? "DICIEMBRE" : "VACACIONES"}
          progress={Math.min(1, (local - 2.35) * 1.1)}
          highlight={Math.min(6, Math.max(0, Math.floor((local - 2.5) * 5)))}
          dark
        />
        <ClockFace time={local} x={795} y={675} radius={64} speed={280} dark />
        <Surface>
          <path
            d="M470 735Q620 580 795 675"
            fill="none"
            stroke={C.gold}
            strokeWidth="4"
            strokeDasharray="7 9"
            opacity={1 - dec}
          />
          <rect
            x="500"
            y="1080"
            width="380"
            height="76"
            rx="18"
            fill={C.coral}
            opacity={dec}
          />
          <g opacity={dec}>
            {label(550, 1131, "¡YA ES DICIEMBRE!", C.navy, 30)}
          </g>
          <g opacity={cp(time, 0, 5, 0.2)}>
            <circle
              cx="330"
              cy="730"
              r="65"
              fill={C.navy}
              stroke={C.gold}
              strokeWidth="3"
            />
            {label(308, 753, "?", C.gold, 67)}
          </g>
        </Surface>
      </div>
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 635,
          width: 260,
          height: 185,
          opacity: cp(time, 0, 1, 0.22) * (1 - turn),
          rotate: "-8deg",
          scale: 0.8 + 0.2 * cp(time, 0, 1, 0.3),
        }}
      >
        <MiniScene
          kind="beach"
          x={0}
          y={0}
          width={260}
          height={185}
          progress={cp(time, 0, 1, 0.7)}
          time={time}
        />
      </div>
      <Surface>
        <path
          d={`M${90 + local * 245} 600l135 640`}
          stroke={C.cream}
          strokeWidth="16"
          opacity={0.17 * (1 - turn)}
          fill="none"
        />
      </Surface>
    </>
  );
};

const ConstantDay: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const brain = cp(time, 1, 2, 0.42),
    live = cp(time, 1, 3, 0.32),
    remember = cp(time, 1, 4, 0.32),
    many = cp(time, 1, 5, 0.35);
  const dayWord = spokenTime(1, "días", cueTime(1, 0) + 1),
    hourWord = spokenTime(1, "horas", cueTime(1, 1) + 0.6),
    dayBuild = Math.max(
      0,
      Math.min(1, (time - dayWord) / (hourWord + 0.15 - dayWord)),
    ),
    hourFocus = at(time, 1, "horas", cueTime(1, 1) + 0.6, 0.34),
    ordinary = at(time, 1, "días", dayWord, 0.2),
    strange = at(time, 1, "extraño", cueTime(1, 0) + 0.2, 0.2);
  return (
    <>
      <Character
        pose={
          action < 3
            ? strange > 0.3 && ordinary < 0.3
              ? "surprised"
              : "explaining"
            : "point"
        }
        time={time}
        x={240}
        y={1010}
        width={340}
        age={time - cueTime(1, 0)}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - brain,
          scale: 1 + 0.08 * hourFocus,
          transformOrigin: "61% 48%",
        }}
      >
        <Surface>
          {[...Array(24)].map((_, i) => {
            const a = ((i * 15 - 89) * Math.PI) / 180,
              b = ((i * 15 - 76) * Math.PI) / 180;
            const d = `M${650 + Math.cos(a) * 252} ${920 + Math.sin(a) * 252}A252 252 0 0 1 ${650 + Math.cos(b) * 252} ${920 + Math.sin(b) * 252}L${650 + Math.cos(b) * 210} ${920 + Math.sin(b) * 210}A210 210 0 0 0 ${650 + Math.cos(a) * 210} ${920 + Math.sin(a) * 210}Z`;
            return (
              <path
                key={i}
                d={d}
                fill={i < 12 ? C.gold : C.teal}
                opacity={Math.max(0.08, Math.min(1, (dayBuild - i / 24) * 24))}
              />
            );
          })}
        </Surface>
        <ClockFace
          time={time - cueTime(1, 0)}
          x={650}
          y={920}
          radius={220}
          speed={12}
          dark
        />
        <Surface>
          <g opacity={dayBuild}>
            <circle cx="650" cy="728" r="24" fill={C.gold} />
            <path
              d="M646 1098A27 27 0 1 0 671 1140A30 30 0 0 1 646 1098"
              fill={C.teal}
            />
          </g>
        </Surface>
      </div>
      <Surface>
        <g opacity={cp(time, 1, 1, 0.2) * (1 - brain)}>
          {[...Array(24)].map((_, i) => (
            <path
              key={i}
              d="M650 676v21"
              stroke={i % 6 ? C.teal : C.gold}
              strokeWidth={i % 6 ? 5 : 9}
              transform={`rotate(${i * 15} 650 920)`}
              opacity={p(
                time,
                cueTime(1, 1) + i * 0.023,
                cueTime(1, 1) + i * 0.023 + 0.15,
              )}
            />
          ))}
          {label(537, 978, "24 HORAS", C.gold, 42)}
        </g>
      </Surface>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: brain,
          scale: 0.84 + 0.16 * brain,
          transformOrigin: "66% 48%",
        }}
      >
        <Art
          src="anatomia/01_cerebro_completo.png"
          x={670}
          y={850 - mix(0, 50, remember)}
          width={410}
        />
        <ClockFace time={time} x={875} y={680} radius={57} speed={12} dark />
        <Surface>
          <Trace
            d="M340 790C450 650 470 730 550 790"
            progress={live}
            color={C.gold}
          />
          <g opacity={live}>
            {label(460, 685, "VIVE", C.teal, 34)}
            <circle
              cx="510"
              cy="780"
              r={20 + 40 * live}
              stroke={C.teal}
              strokeWidth="4"
              fill="none"
              opacity={1 - live * 0.75}
            />
          </g>
          <Trace
            d="M690 945C650 1015 570 1005 535 1080"
            progress={remember}
            color={C.coral}
          />
          <g opacity={remember}>{label(675, 1018, "RECUERDA", C.coral, 30)}</g>
        </Surface>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 460 + i * 123,
              top: 1070,
              width: 112,
              height: 120,
              borderRadius: 15,
              background: C.cream,
              overflow: "hidden",
              opacity: p(
                time,
                cueTime(1, 4) + i * 0.13,
                cueTime(1, 4) + i * 0.13 + 0.3,
              ),
              translate: `0 ${(1 - p(time, cueTime(1, 4) + i * 0.13, cueTime(1, 4) + i * 0.13 + 0.3)) * 45}px`,
            }}
          >
            <MiniScene
              kind={(["home", "mountain", "learn"] as const)[i]}
              x={6}
              y={6}
              width={100}
              height={88}
              progress={1}
            />
            <div
              style={{
                textAlign: "center",
                color: C.ink,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              {["UN DÍA", "UN LUGAR", "UNA IDEA"][i]}
            </div>
          </div>
        ))}
      </div>
      <Surface>
        <g opacity={many}>
          {["ATENCIÓN", "RUTINA", "NOVEDAD", "MEMORIA"].map((w, i) => (
            <g key={w}>
              <rect
                x={125 + i * 201}
                y="590"
                width="180"
                height="48"
                rx="14"
                fill={i % 2 ? C.gold : C.teal}
                opacity={p(
                  time,
                  cueTime(1, 5) + i * 0.09,
                  cueTime(1, 5) + i * 0.09 + 0.25,
                )}
              />
              {label(139 + i * 201, 623, w, C.navy, 22)}
            </g>
          ))}
        </g>
      </Surface>
    </>
  );
};

const Discovery: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const friends = cp(time, 2, 3, 0.46),
    places = cp(time, 2, 4, 0.46),
    milestones = cp(time, 2, 5, 0.45);
  const exploring = p(
    time,
    cueTime(2, 4),
    spokenTime(2, "visto", cueTime(2, 4) + 1.2) + 0.24,
  );
  const slide = friends + places;
  const schoolBuild =
    0.25 * at(time, 2, "niño", cueTime(2, 0) + 0.6, 0.45) +
    0.25 * cp(time, 2, 1, 0.45) +
    0.25 * at(time, 2, "nuevas", cueTime(2, 1) + 0.8, 0.45) +
    0.25 * cp(time, 2, 2, 0.45);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 95,
          top: 625,
          width: 830,
          height: 600,
          overflow: "hidden",
          borderRadius: 38,
          border: "3px solid #79B7B1",
          background: "#DCEFE7",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -slide * 760,
            top: 0,
            width: 2350,
            height: 600,
          }}
        >
          <MiniScene
            kind="school"
            x={0}
            y={0}
            width={830}
            height={600}
            progress={schoolBuild}
            time={time}
          />
          <MiniScene
            kind="friends"
            x={760}
            y={0}
            width={830}
            height={600}
            progress={friends}
            time={time}
          />
          <MiniScene
            kind="mountain"
            x={1520}
            y={0}
            width={830}
            height={600}
            progress={exploring}
            time={time}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(0deg,#F7EDDA70,transparent 60%)",
          }}
        />
      </div>
      <Character
        pose={
          action < 3
            ? schoolBuild > 0.55
              ? "point"
              : "neutral"
            : action < 4
              ? "happy"
              : "walking"
        }
        time={time}
        x={270 + places * 100}
        y={1045}
        width={285}
        age={time - cueTime(2, 0)}
      />
      <Surface>
        <g opacity={1 - milestones}>
          {label(
            150,
            680,
            action < 3
              ? "PRIMERA ESCUELA"
              : action < 4
                ? "NUEVOS AMIGOS"
                : "LUGARES POR DESCUBRIR",
            C.ink,
            30,
          )}
        </g>
        <Trace
          d="M250 1170C390 1030 470 1170 640 1070S780 1050 840 930"
          progress={cp(time, 2, 1, 0.9)}
          color={C.coral}
          width={8}
        />
        <g opacity={milestones}>
          {[0, 1, 2].map((i) => (
            <g
              key={i}
              opacity={p(
                time,
                cueTime(2, 5) + i * 0.15,
                cueTime(2, 5) + i * 0.15 + 0.3,
              )}
            >
              <circle
                cx={500 + i * 140}
                cy={795 + i * 90}
                r="32"
                fill={colors[i]}
              />
              {label(489 + i * 140, 806 + i * 90, String(i + 1), C.navy, 28)}
            </g>
          ))}
          <rect
            x="420"
            y="1120"
            width="445"
            height="66"
            rx="20"
            fill={C.navy}
          />
          {label(450, 1163, "RECUERDOS CON HITOS", C.gold, 29)}
        </g>
      </Surface>
    </>
  );
};

const Routine: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const wake = cp(time, 3, 1, 0.52),
    work = cp(time, 3, 2, 0.5),
    home = cp(time, 3, 3, 0.5),
    memory =
      0.45 * cp(time, 3, 4, 0.45) +
      0.55 * at(time, 3, "menos", cueTime(3, 4) + 1.1, 0.55),
    variation = cp(time, 3, 5, 0.45);
  const memoryFocus = cp(time, 3, 4, 0.36),
    fewer = at(time, 3, "menos", cueTime(3, 4) + 1, 0.4),
    details = at(time, 3, "detalles", cueTime(3, 4) + 1.4, 0.38),
    distinctive = at(time, 3, "distintivos", cueTime(3, 4) + 1.9, 0.32);
  const sameDays = at(time, 3, "parecen", cueTime(3, 0) + 1.8, 0.45);
  const start = timeline.scenes[3].start;
  const repeatAt = spokenTime(3, "repetir", cueTime(3, 3) + 0.7);
  const loop = p(time, repeatAt, repeatAt + 1.0);
  let x = 235 + work * 350 - home * 185,
    y = 1015;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 660,
          width: 810,
          height: 430,
          overflow: "hidden",
          borderRadius: 32,
          border: "3px solid #88B6AE",
          background: "#DAEAE2",
          opacity: 1 - 0.92 * memoryFocus,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -work * 600 - home * 680,
            top: 0,
            width: 2050,
            height: 430,
          }}
        >
          <Art
            src="escenarios/01_dormitorio.png"
            x={310}
            y={210}
            width={650}
            height={480}
          />
          <MiniScene
            kind="office"
            x={610}
            y={0}
            width={680}
            height={430}
            progress={work}
            time={time}
          />
          <Art
            src="escenarios/03_sala.png"
            x={1580}
            y={215}
            width={650}
            height={470}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(247,237,218,${0.25 - 0.1 * wake})`,
          }}
        />
        <MiniLabel
          x={20}
          y={18}
          width={210}
          text={
            action === 0
              ? "DÍAS PARECIDOS"
              : action < 2
                ? "DESPERTAR"
                : action < 3
                  ? "TRABAJAR"
                  : "VOLVER A CASA"
          }
        />
      </div>
      <Character
        pose={
          action === 0
            ? sameDays > 0.25
              ? "thinking"
              : "neutral"
            : action < 2
              ? "tired"
              : action < 4
                ? "walking"
                : "thinking"
        }
        time={time}
        x={x}
        y={y}
        width={310}
        age={time - cueTime(3, Math.min(action, 4))}
        opacity={1 - memoryFocus}
      />
      <ClockFace
        time={(time - start) * (0.6 + loop * 1.4)}
        x={825}
        y={750}
        radius={74}
        speed={80}
        dark={false}
      />
      <Surface>
        <g opacity={memoryFocus}>
          {label(205, 710, "DETALLES EN LA MEMORIA", C.ink, 36)}
          <Trace
            d="M200 1100Q530 1010 800 1100"
            progress={details}
            color={C.coral}
            width={8}
          />
        </g>
        <Trace d="M200 1138H820" progress={wake} color="#94B5AC" width={8} />
        {days.map((d, i) => {
          const enter = p(time, start + i * 0.09, start + i * 0.09 + 0.25),
            compress = memory * (1 - variation * 0.65);
          return (
            <g
              key={i}
              opacity={enter}
              transform={`translate(${155 + i * 102 - memoryFocus * 35 + fewer * (250 - i * 72) * (1 - variation * 0.6)} ${1120 - memoryFocus * 300 + (1 - sameDays) * (i % 2 ? 18 : -18)}) scale(${1 + memoryFocus * 0.35 + details * 0.15} ${1 + memoryFocus * 0.85 + details * 0.3})`}
            >
              <rect
                width={84}
                height="98"
                rx="13"
                fill={
                  i === Math.min(6, Math.floor(loop * 6)) ? C.teal : C.cream
                }
                stroke={i === 6 && distinctive > 0.1 ? C.coral : "#88B6AE"}
                strokeWidth={i === 6 ? 3 + 4 * distinctive : 3}
              />
              {label(29, 35, d, C.ink, 22)}
              <path
                d="M20 57h44M20 70h44"
                stroke={variation && i % 2 ? C.coral : C.teal}
                strokeWidth="7"
                opacity={1 - distinctive * 0.6 + variation * 0.6}
              />
              {variation > 0 && i % 2 === 0 && (
                <circle cx="65" cy="18" r={10 * variation} fill={colors[i]} />
              )}
            </g>
          );
        })}
        <g opacity={variation}>
          <rect x="270" y="585" width="530" height="58" rx="18" fill={C.navy} />
          {label(304, 625, "NO OCURRE IGUAL EN TODOS", C.gold, 28)}
        </g>
      </Surface>
    </>
  );
};

const RichWeek: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const build = cp(time, 4, 1, 0.4),
    rich = cp(time, 4, 2, 0.7),
    expand = cp(time, 4, 3, 0.52),
    recollect = cp(time, 4, 4, 0.5),
    retrospect = cp(time, 4, 5, 0.4);
  return (
    <>
      <Surface>
        {label(120, 650, "DOS SEMANAS · SIETE DÍAS CADA UNA", C.cream, 28)}
        {label(120, 734, "RUTINA", C.teal, 27)}
        {label(120, 954, "NOVEDAD", C.gold, 27)}
        <path d="M120 786H905" stroke={C.teal} strokeWidth="3" opacity=".3" />
        <path d="M120 1007H905" stroke={C.gold} strokeWidth="3" opacity=".3" />
        <g opacity={retrospect}>
          <rect
            x="270"
            y="1140"
            width="490"
            height="61"
            rx="18"
            fill={C.gold}
          />
          {label(318, 1182, "AL MIRAR HACIA ATRÁS", C.navy, 30)}
        </g>
      </Surface>
      {days.map((d, i) => {
        const row = p(
            time,
            cueTime(4, 1) + i * 0.08,
            cueTime(4, 1) + i * 0.08 + 0.35,
          ),
          enrich = p(
            time,
            cueTime(4, 2) + i * 0.14,
            cueTime(4, 2) + i * 0.14 + 0.42,
          );
        const x = 125 + i * 111;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: 770,
                width: 96,
                height: 115,
                background: "#183D4C",
                border: `2px solid ${C.teal}`,
                borderRadius: 16,
                opacity: row,
                translate: `0 ${(1 - row) * 30}px`,
              }}
            >
              <div
                style={{
                  color: C.cream,
                  fontWeight: 800,
                  fontSize: 22,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {d}
              </div>
              <div
                style={{
                  width: 48,
                  height: 9,
                  background: C.teal,
                  borderRadius: 4,
                  margin: "16px auto 0",
                }}
              />
              <div
                style={{
                  width: 48,
                  height: 9,
                  background: C.teal,
                  borderRadius: 4,
                  margin: "9px auto 0",
                  opacity: 0.45,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: x - expand * 15 + expand * i * 3,
                top: 985 - expand * 28 - recollect * (i % 2) * 24,
                width: 96,
                height: 132,
                background: enrich > 0 ? colors[i] : "#183D4C",
                border: `2px solid ${colors[i]}`,
                borderRadius: 16,
                overflow: "hidden",
                opacity: row,
                scale: 0.94 + enrich * 0.06,
                rotate: `${(i % 2 ? 1 : -1) * recollect * 4}deg`,
                transformOrigin: "50% 50%",
              }}
            >
              <div
                style={{
                  color: enrich > 0 ? C.navy : C.cream,
                  fontWeight: 800,
                  fontSize: 22,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {d}
              </div>
              <div style={{ opacity: enrich, position: "absolute", inset: 0 }}>
                <MiniScene
                  kind={
                    (
                      [
                        "learn",
                        "mountain",
                        "friends",
                        "route",
                        "school",
                        "beach",
                        "activity",
                      ] as const
                    )[i]
                  }
                  x={5}
                  y={39}
                  width={82}
                  height={77}
                  progress={enrich}
                />
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <Surface>
        <Trace
          d="M140 1130C320 1080 630 1170 890 1080"
          progress={recollect}
          color={C.gold}
          width={7}
        />
      </Surface>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - build }}>
        <ClockFace time={time} x={540} y={900} radius={150} dark speed={12} />
      </div>
      <Surface>
        <g opacity={expand}>
          <path
            d="M140 920v-10h740v10"
            fill="none"
            stroke={C.gold}
            strokeWidth="4"
          />
          <path
            d="M140 920l14-14M140 920l14 14M880 920l-14-14M880 920l-14 14"
            stroke={C.gold}
            strokeWidth="4"
            fill="none"
          />
        </g>
      </Surface>
    </>
  );
};

const TwoPerspectives: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const waiting = cp(time, 5, 1, 0.4),
    during = cp(time, 5, 2, 0.35),
    attention = cp(time, 5, 3, 0.35),
    recall = cp(time, 5, 4, 0.55),
    distinct = cp(time, 5, 5, 0.4);
  const start = timeline.scenes[5].start;
  const caution = at(time, 5, "siempre", start + 1.1, 0.34),
    whileLiving = at(time, 5, "Mientras", cueTime(5, 2) - 0.5, 0.34),
    focus = caution * (1 - whileLiving),
    clockX = 370 - 70 * focus - 30 * attention,
    clockY = 815 - 25 * focus + 5 * attention,
    clockRadius = 80 + 55 * focus + 25 * attention;
  return (
    <>
      <Surface>
        <rect
          x="100"
          y="660"
          width="400"
          height="540"
          rx="34"
          fill="#17394D"
          stroke={attention > 0.5 ? C.gold : C.teal}
          strokeWidth="3"
        />
        <rect
          x="525"
          y="660"
          width="400"
          height="540"
          rx="34"
          fill="#183E4A"
          stroke={C.gold}
          strokeWidth="3"
        />
        {label(127, 709, "MIENTRAS LO VIVES", C.teal, 27)}
        {label(553, 709, "AL RECORDARLO", C.gold, 27)}
        <path
          d="M510 760v380"
          stroke={C.cream}
          strokeWidth="2"
          strokeDasharray="7 10"
          opacity=".3"
        />
      </Surface>
      <Character
        pose={action < 1 ? "seated" : action < 3 ? "thinking" : "point"}
        time={time}
        x={285 - 40 * focus}
        y={1020 + 45 * focus}
        width={230 - 40 * focus}
        age={time - start}
      />
      <ClockFace
        time={time - start}
        x={clockX}
        y={clockY}
        radius={clockRadius}
        speed={12}
        dark
      />
      <Surface>
        <Trace
          d="M150 735H435"
          progress={at(time, 5, "significa", start + 0.4, 0.45)}
          color={C.teal}
          width={6}
        />
        <g opacity={caution * (1 - whileLiving)}>
          <rect
            x="155"
            y="1150"
            width="290"
            height="39"
            rx="12"
            fill={C.gold}
          />
          {label(187, 1178, "NO SIEMPRE MÁS LENTO", C.navy, 22)}
        </g>
        <Trace d="M275 920Q265 810 330 815" progress={waiting} color={C.teal} />
        <g opacity={attention}>
          <ellipse
            cx={clockX}
            cy={clockY}
            rx={clockRadius + 15}
            ry={clockRadius + 15}
            fill="none"
            stroke={C.coral}
            strokeWidth="7"
          />
          <path
            d={`M275 913L${clockX - 32} ${clockY + 38}`}
            fill="none"
            stroke={C.coral}
            strokeWidth="8"
          />
          {label(146, 1168, "ATENCIÓN AL RELOJ", C.coral, 25)}
        </g>
        <g opacity={during}>
          <path d="M150 740h285" stroke={C.teal} strokeWidth="5" />
          {label(148, 762, "", C.teal)}
        </g>
      </Surface>
      <div
        style={{
          position: "absolute",
          left: 552,
          top: 762,
          width: 348,
          height: 300,
          overflow: "hidden",
          borderRadius: 20,
        }}
      >
        <MiniScene
          kind="mountain"
          x={-recall * 55}
          y={0}
          width={410}
          height={300}
          progress={0.65 + recall * 0.35}
          time={time}
        />
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 205,
            width: 145,
            height: 87,
            borderRadius: 12,
            background: C.cream,
            border: `3px solid ${C.gold}`,
            rotate: `${-8 + recall * 13}deg`,
            scale: 0.8 + 0.2 * recall,
            opacity: recall,
          }}
        >
          <MiniScene
            kind="beach"
            x={5}
            y={4}
            width={130}
            height={75}
            progress={1}
          />
        </div>
      </div>
      <Surface>
        <Trace
          d="M580 1120C620 1010 770 1090 845 970"
          progress={recall}
          color={C.gold}
        />
        <g opacity={recall}>
          {label(570, 1165, "RECONSTRUIR EL VIAJE", C.gold, 25)}
        </g>
        <g opacity={distinct}>
          <rect
            x="160"
            y="585"
            width="705"
            height="55"
            rx="17"
            fill={C.cream}
          />
          {label(205, 623, "DOS PERSPECTIVAS DISTINTAS", C.ink, 30)}
        </g>
      </Surface>
    </>
  );
};

const NewRoute: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const decision = cp(time, 6, 1, 0.4),
    learn = cp(time, 6, 2, 0.55),
    route = cp(time, 6, 3, 0.5),
    place = cp(time, 6, 4, 0.55),
    activity = cp(time, 6, 5, 0.5);
  const life = at(time, 6, "vida", cueTime(6, 0) + 0.6, 0.55),
    lessAutomatic = at(time, 6, "menos", cueTime(6, 1) - 0.35, 0.4),
    cycle = life * (1 - decision),
    introWalk = life * (1 - learn);
  const x =
      270 +
      introWalk * 65 +
      learn * 40 +
      route * 240 +
      place * 210 -
      activity * 260,
    y = 1030 - learn * 180 + route * 80 - place * 100 + activity * 270;
  return (
    <>
      <Surface>
        <rect
          x="105"
          y="640"
          width="810"
          height="580"
          rx="38"
          fill="#DAEEE3"
          stroke="#8DBBB1"
          strokeWidth="3"
        />
        <path
          d="M175 1090C410 1005 545 1180 840 1080"
          fill="none"
          stroke="#9ABDAE"
          strokeWidth="45"
          strokeLinecap="round"
        />
        <path
          d="M175 1090C410 1005 545 1180 840 1080"
          pathLength="1"
          fill="none"
          stroke={C.cream}
          strokeWidth="5"
          strokeDasharray=".02 .03"
        />
        <Trace
          d="M230 1070L300 815Q420 745 540 880Q660 930 785 785L540 1120"
          progress={
            decision * 0.18 +
            learn * 0.18 +
            route * 0.2 +
            place * 0.2 +
            activity * 0.24
          }
          color={C.coral}
          width={10}
        />
        <g opacity={decision}>
          <circle cx="540" cy="880" r="47" fill={C.gold} />
          <path
            d="M520 895l20-28 20 28M540 867v45"
            stroke={C.navy}
            strokeWidth="5"
            fill="none"
          />
        </g>
      </Surface>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: cycle,
          scale: 1 + 0.12 * lessAutomatic,
          transformOrigin: "50% 48%",
        }}
      >
        <Surface>
          <Trace
            d="M420 775C675 670 820 880 680 1060C555 1180 320 1060 420 775"
            progress={life * (1 - lessAutomatic * 0.35)}
            color="#658F89"
            width={15}
          />
        </Surface>
        {(
          [
            [355, 720, "home"],
            [655, 805, "office"],
            [490, 1010, "home"],
          ] as const
        ).map(([left, top, kind], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top,
              width: 170,
              height: 125,
              opacity: at(
                time,
                6,
                "vida",
                cueTime(6, 0) + 0.6 + i * 0.15,
                0.45,
              ),
              translate: `${lessAutomatic * (i % 2 ? -50 : 50)}px 0`,
              scale: 1 - 0.22 * lessAutomatic,
            }}
          >
            <MiniScene
              kind={kind}
              x={0}
              y={0}
              width={170}
              height={125}
              progress={1}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 145,
          top: 685,
          width: 265,
          height: 185,
          opacity: learn,
          translate: `${(1 - learn) * -60}px 0`,
        }}
      >
        <MiniScene
          kind="learn"
          x={0}
          y={0}
          width={265}
          height={185}
          progress={learn}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 690,
          width: 240,
          height: 215,
          opacity: place,
          clipPath: `inset(0 ${(1 - place) * 100}% 0 0)`,
        }}
      >
        <MiniScene
          kind="mountain"
          x={-place * 20}
          y={0}
          width={270}
          height={215}
          progress={place}
          time={time}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 405,
          top: 995,
          width: 230,
          height: 190,
          opacity: activity,
          scale: 0.7 + 0.3 * activity,
          transformOrigin: "50% 50%",
        }}
      >
        <MiniScene
          kind="activity"
          x={0}
          y={0}
          width={230}
          height={190}
          progress={activity}
        />
      </div>
      <Character
        pose={
          action === 0
            ? life > 0.3
              ? "walking"
              : "neutral"
            : action < 2
              ? "point"
              : action < 5
                ? "walking"
                : "happy"
        }
        time={time}
        x={x}
        y={Math.min(1090, y)}
        width={200}
        age={time - cueTime(6, Math.min(action, 5))}
      />
      <Surface>
        <g opacity={learn}>{label(158, 910, "APRENDE", C.ink, 25)}</g>
        <g opacity={route}>
          {label(444, 1015, "OTRA RUTA", C.ink, 25)}
          <Trace
            d="M450 1000L540 880L645 975"
            progress={route}
            color={C.teal}
            width={9}
          />
        </g>
        <g opacity={place}>{label(660, 942, "OTRO LUGAR", C.ink, 25)}</g>
        <g opacity={activity}>
          {label(385, 1220, "UNA NUEVA ACTIVIDAD", C.ink, 25)}
        </g>
      </Surface>
    </>
  );
};

const LastingMemories: React.FC<{ time: number; action: number }> = ({
  time,
  action,
}) => {
  const memories = cp(time, 7, 2, 0.55),
    days = cp(time, 7, 3, 0.55),
    question = cp(time, 7, 4, 0.32),
    year = cp(time, 7, 5, 0.5);
  const local = time - timeline.scenes[7].start;
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - year,
          scale: 1 - 0.14 * memories,
          transformOrigin: "64% 50%",
        }}
      >
        <ClockFace time={local} x={660} y={925} radius={220} speed={12} dark />
      </div>
      <Character
        pose={action < 4 ? "point" : "happy"}
        time={time}
        x={240}
        y={1030}
        width={330}
        age={time - cueTime(7, action < 4 ? 0 : 4)}
      />
      {[0, 1, 2, 3].map((i) => {
        const k = p(
            time,
            cueTime(7, 2) + i * 0.17,
            cueTime(7, 2) + i * 0.17 + 0.5,
          ),
          angle = ((i * 80 - 165) * Math.PI) / 180;
        const x = 650 + Math.cos(angle) * 235 * k,
          y = 935 + Math.sin(angle) * 210 * k;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 78,
              top: y - 62,
              width: 156,
              height: 125,
              borderRadius: 17,
              background: C.cream,
              border: `4px solid ${colors[i]}`,
              overflow: "hidden",
              opacity: k * (1 - year),
              rotate: `${(i % 2 ? -1 : 1) * 8 * k}deg`,
              scale: 0.5 + 0.5 * k,
            }}
          >
            <MiniScene
              kind={(["school", "mountain", "learn", "activity"] as const)[i]}
              x={5}
              y={4}
              width={138}
              height={105}
              progress={k}
            />
          </div>
        );
      })}
      <Surface>
        <Trace
          d="M400 1070C480 1060 520 1090 560 1050S750 920 800 810"
          progress={days}
          color={C.gold}
          width={7}
        />
        <g opacity={question}>
          <rect
            x="135"
            y="590"
            width="770"
            height="120"
            rx="26"
            fill={C.gold}
          />
          {label(200, 665, "¿A TI TAMBIÉN TE PASA?", C.navy, 43)}
        </g>
        <g opacity={memories * (1 - question)}>
          {label(400, 645, "DÍAS QUE SE DISTINGUEN", C.gold, 33)}
        </g>
      </Surface>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: year,
          scale: 0.86 + 0.14 * year,
          transformOrigin: "67% 51%",
        }}
      >
        <Calendar
          x={470}
          y={760}
          width={425}
          height={430}
          month="TU AÑO"
          progress={year}
          highlight={6}
          dark
          variant="rich"
        />
      </div>
    </>
  );
};

export const StoryWorld: React.FC<{
  time: number;
  scene: number;
  action: number;
}> = ({ time, scene, action }) => (
  <AbsoluteFill style={{ clipPath: "inset(565px 0 680px 0)" }}>
    {scene === 0 ? (
      <Opening time={time} action={action} />
    ) : scene === 1 ? (
      <ConstantDay time={time} action={action} />
    ) : scene === 2 ? (
      <Discovery time={time} action={action} />
    ) : scene === 3 ? (
      <Routine time={time} action={action} />
    ) : scene === 4 ? (
      <RichWeek time={time} action={action} />
    ) : scene === 5 ? (
      <TwoPerspectives time={time} action={action} />
    ) : scene === 6 ? (
      <NewRoute time={time} action={action} />
    ) : (
      <LastingMemories time={time} action={action} />
    )}
  </AbsoluteFill>
);
