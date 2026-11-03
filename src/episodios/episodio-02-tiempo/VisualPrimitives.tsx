import React, { useId } from "react";
import { Img, staticFile, useVideoConfig } from "remotion";
import { C, lift } from "./motion";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export const Art: React.FC<{
  src: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  opacity?: number;
  scale?: number;
}> = ({ src, x, y, width, height = width, opacity = 1, scale = 1 }) => (
  <Img
    src={staticFile(`imagenes/${src}`)}
    style={{
      position: "absolute",
      left: x - width / 2,
      top: y - height / 2,
      width,
      height,
      objectFit: "contain",
      opacity,
      scale,
    }}
  />
);

export type CharacterPose =
  | "neutral"
  | "explaining"
  | "surprised"
  | "happy"
  | "walking"
  | "seated"
  | "thinking"
  | "idea"
  | "point"
  | "tired"
  | "sleeping"
  | "hands";
export const CHARACTER_ASSETS: Record<CharacterPose, string> = {
  neutral: "01_neutral.png",
  explaining: "02_explicando.png",
  surprised: "11_sorprendido.png",
  happy: "13_feliz.png",
  walking: "21_caminando.png",
  seated: "27_sentado.png",
  thinking: "04_pensando.png",
  idea: "10_idea.png",
  point: "08_senalando_arriba.png",
  tired: "05_cansado.png",
  sleeping: "23_durmiendo.png",
  hands: "26_levantando_brazos.png",
};

export const Character: React.FC<{
  pose: CharacterPose;
  time: number;
  x: number;
  y: number;
  width: number;
  age?: number;
  opacity?: number;
}> = ({ pose, time, x, y, width, age = 100, opacity = 1 }) => {
  const { fps } = useVideoConfig();
  const entrance = lift(age, fps);
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
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - width * 0.75,
        width,
        height: width * 1.5,
        opacity,
        transformOrigin: "50% 100%",
        scale: `${0.94 + 0.06 * entrance} ${(0.94 + 0.06 * entrance) * (1 + 0.002 * Math.sin(time * 2.5))}`,
        translate: `${(1 - entrance) * 28}px 0`,
        rotate: `${(1 - entrance) * -1.8}deg`,
      }}
    >
      <Img
        src={staticFile(`imagenes/personajes/${CHARACTER_ASSETS[pose]}`)}
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
              fill="none"
              stroke="#5C3021"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export const ClockFace: React.FC<{
  time: number;
  x: number;
  y: number;
  radius: number;
  progress?: number;
  depth?: boolean;
  speed?: number;
  dark?: boolean;
}> = ({
  time,
  x,
  y,
  radius,
  progress = 1,
  depth = false,
  speed = 35,
  dark = true,
}) => {
  const uid = useId().replace(/:/g, "");
  const k = clamp(progress);
  const minute = time * speed;
  const hour = minute / 12 + 36;
  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
      }}
    >
      <svg
        viewBox="-220 -220 440 440"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`rim-${uid}`} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#EFF4ED" />
            <stop offset=".23" stopColor="#6F949E" />
            <stop offset=".48" stopColor="#E9F0DF" />
            <stop offset=".7" stopColor="#315467" />
            <stop offset="1" stopColor="#9EB8BB" />
          </linearGradient>
          <radialGradient id={`face-${uid}`} cx="35%" cy="27%">
            <stop stopColor={dark ? "#214659" : "#FFFFF3"} />
            <stop offset="1" stopColor={dark ? C.navy : "#E6E9DB"} />
          </radialGradient>
        </defs>
        {depth && (
          <ellipse
            cx="10"
            cy="21"
            rx="202"
            ry="195"
            fill="#03101A"
            opacity=".4"
          />
        )}
        <circle r="205" fill={depth ? `url(#rim-${uid})` : C.teal} />
        <circle
          r="191"
          fill={depth ? `url(#face-${uid})` : dark ? C.navy : C.cream}
          stroke={depth ? "#375D6A" : C.teal}
          strokeWidth="4"
        />
        {[...Array(60)].map((_, i) => (
          <path
            key={i}
            d={i % 5 === 0 ? "M0-164V-181" : "M0-173V-181"}
            transform={`rotate(${i * 6})`}
            stroke={dark ? C.cream : C.ink}
            strokeWidth={i % 5 === 0 ? 4 : 2}
            opacity={i / 60 <= k ? (i % 5 === 0 ? 1 : 0.45) : 0.13}
          />
        ))}
        {[12, 3, 6, 9].map((n, i) => (
          <text
            key={n}
            x={[0, 143, 0, -143][i]}
            y={[-125, 10, 146, 10][i]}
            textAnchor="middle"
            fill={dark ? C.cream : C.ink}
            fontSize="32"
            fontWeight="800"
          >
            {n}
          </text>
        ))}
        <g transform={`rotate(${hour})`}>
          <path
            d="M0 16V-96"
            fill="none"
            stroke={dark ? C.cream : C.ink}
            strokeWidth="13"
            strokeLinecap="round"
          />
        </g>
        <g transform={`rotate(${minute})`}>
          <path
            d="M0 24V-145"
            fill="none"
            stroke={C.gold}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
        <g transform={`rotate(${minute * 2.3})`}>
          <path
            d="M0 37V-160"
            fill="none"
            stroke={C.coral}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <circle r="13" fill={C.coral} />
        <circle r="5" fill={C.cream} />
        {depth && (
          <path
            d="M-151-136A202 202 0 0 1 124-162"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            opacity=".64"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};

export const Calendar: React.FC<{
  x: number;
  y: number;
  width: number;
  height?: number;
  progress?: number;
  month?: string;
  highlight?: number;
  dark?: boolean;
  variant?: "plain" | "rich";
}> = ({
  x,
  y,
  width,
  height = width * 0.78,
  progress = 1,
  month = "DICIEMBRE",
  highlight = 0,
  dark = false,
  variant = "plain",
}) => {
  const k = clamp(progress);
  const fill = dark ? "#173C50" : C.cream;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height }}>
      <svg
        viewBox="0 0 420 330"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <rect
          x="5"
          y="12"
          width="410"
          height="310"
          rx="27"
          fill="#071C30"
          opacity=".15"
        />
        <rect
          x="0"
          y="0"
          width="410"
          height="310"
          rx="24"
          fill={fill}
          stroke={dark ? C.teal : "#AFCBC2"}
          strokeWidth="3"
        />
        <path d="M24 0H386Q410 0 410 24V70H0V24Q0 0 24 0" fill={C.coral} />
        <text
          x="205"
          y="46"
          textAnchor="middle"
          fontSize="29"
          fontWeight="800"
          fill={C.navy}
        >
          {month}
        </text>
        {[84, 325].map((a) => (
          <path
            key={a}
            d={`M${a}-12V16`}
            stroke={dark ? C.cream : C.navy}
            strokeWidth="9"
            strokeLinecap="round"
          />
        ))}
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <text
            key={i}
            x={35 + i * 56}
            y="102"
            textAnchor="middle"
            fill={dark ? C.cream : C.ink}
            opacity=".65"
            fontSize="17"
            fontWeight="800"
          >
            {d}
          </text>
        ))}
        {[...Array(31)].map((_, i) => {
          const col = i % 7,
            row = Math.floor(i / 7),
            cx = 35 + col * 56,
            cy = 128 + row * 35;
          const reveal = clamp((k - i / 42) * 4);
          const active = col === ((highlight % 7) + 7) % 7;
          return (
            <g key={i} opacity={0.18 + 0.82 * reveal}>
              {active && (
                <rect
                  x={cx - 22}
                  y={cy - 20}
                  width="44"
                  height="30"
                  rx="9"
                  fill={
                    variant === "rich"
                      ? [C.teal, C.gold, C.coral][row % 3]
                      : C.teal
                  }
                  opacity=".32"
                />
              )}
              <text
                x={cx}
                y={cy}
                fill={dark ? C.cream : C.ink}
                textAnchor="middle"
                fontSize="20"
                fontWeight={active ? 800 : 600}
              >
                {i + 1}
              </text>
              {variant === "rich" && i % 3 !== 2 && (
                <path
                  d={`M${cx - 12} ${cy + 6}h24`}
                  stroke={[C.coral, C.teal, C.gold][i % 3]}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export type MiniSceneKind =
  | "beach"
  | "school"
  | "friends"
  | "mountain"
  | "home"
  | "office"
  | "route"
  | "learn"
  | "activity";
export const MiniScene: React.FC<{
  kind: MiniSceneKind;
  progress?: number;
  time?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}> = ({ kind, progress = 1, time = 0, x, y, width, height }) => {
  const k = clamp(progress);
  const uid = useId().replace(/:/g, "");
  const q = (a: number, b: number, c: number, t: number) =>
    (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  const routeT = k < 0.5 ? k * 2 : (k - 0.5) * 2;
  const routePoint =
    k < 0.5
      ? [q(40, 170, 218, routeT), q(256, 143, 195, routeT)]
      : [q(218, 266, 380, routeT), q(195, 247, 144, routeT)];
  const line = {
    stroke: C.ink,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        overflow: "hidden",
        borderRadius: 24,
        background: "#D5ECE4",
        border: "2px solid #24C8BA55",
      }}
    >
      <svg
        viewBox="0 0 420 300"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={`scene-${uid}`}>
            <rect width="420" height="300" rx="20" />
          </clipPath>
        </defs>
        <g clipPath={`url(#scene-${uid})`}>
          <rect width="420" height="300" fill="#E7F0DF" />
          {(kind === "beach" || kind === "mountain" || kind === "route") && (
            <>
              <rect width="420" height="210" fill="#B8E9DF" />
              <circle
                cx={300 - 40 * (1 - k)}
                cy={64 + 15 * (1 - k)}
                r="30"
                fill={C.gold}
              />
              <path
                d={`M-20 75Q15 40 60 62T150 64M270 92Q310 60 358 82T450 84`}
                fill="none"
                stroke="#FFFBE9"
                strokeWidth="17"
                strokeLinecap="round"
                opacity=".65"
              />
            </>
          )}
          {kind === "beach" && (
            <>
              <path d="M0 162Q100 132 210 170T420 166V300H0Z" fill={C.teal} />
              <path d="M0 224Q100 192 220 229T420 215V300H0Z" fill="#F0D494" />
              <path
                d={`M${-30 + 36 * k} 183Q65 160 145 184T325 181T460 185`}
                fill="none"
                stroke="#E7FBEE"
                strokeWidth="8"
              />
              <path
                d="M72 240Q86 155 66 90"
                fill="none"
                stroke="#8B6450"
                strokeWidth="12"
              />
              <path
                d="M66 92Q24 60 12 98M66 92Q105 45 135 76M66 92Q110 95 124 126M66 92Q36 104 22 139"
                fill="none"
                stroke="#268F80"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path d="M225 246h98l-12-9h-75Z" fill={C.coral} />
            </>
          )}
          {kind === "mountain" && (
            <>
              <path d="M-30 265L117 67L250 264Z" fill="#5CA69D" />
              <path d="M111 74L59 151L121 126L158 148Z" fill="#FFF8E8" />
              <path d="M165 275L306 85L455 275Z" fill="#2B7E7E" />
              <path d="M305 86L257 152L302 137L341 148Z" fill="#FFF8E8" />
              <path d="M0 272Q150 230 225 265T420 260V300H0Z" fill="#9BCC9E" />
              <path
                d="M120 300Q265 238 201 210Q171 191 225 163"
                pathLength="1"
                stroke={C.gold}
                fill="none"
                strokeWidth="10"
                strokeDasharray={`${k} 1`}
              />
            </>
          )}
          {(kind === "school" || kind === "office" || kind === "home") && (
            <>
              <rect y="232" width="420" height="68" fill="#A2CDAF" />
              <path d="M0 268H420" stroke="#DCE5CA" strokeWidth="25" />
              <g
                transform={
                  kind === "school" ? undefined : `translate(0 ${40 * (1 - k)})`
                }
                opacity={kind === "school" ? 1 : 0.2 + 0.8 * k}
              >
                {kind === "school" ? (
                  <>
                    <path
                      d="M60 114L210 42L360 114Z"
                      transform={`translate(0 ${117 * (1 - clamp(k * 4))})`}
                      opacity={clamp(k * 4)}
                      fill={C.coral}
                      {...line}
                    />
                    <rect
                      x="78"
                      y={232 - 117 * clamp(k * 4)}
                      width="264"
                      height={117 * clamp(k * 4)}
                      rx="5"
                      fill="#F7DF9D"
                      {...line}
                    />
                    <rect
                      x="178"
                      y={232 - 81 * clamp((k - 0.5) * 4)}
                      width="64"
                      height={81 * clamp((k - 0.5) * 4)}
                      fill={C.teal}
                      {...line}
                    />
                    {[105, 275].map((a, i) => (
                      <g
                        key={a}
                        opacity={clamp((k - 0.25) * 4)}
                        transform={`translate(${(i === 0 ? -24 : 24) * (1 - clamp((k - 0.25) * 4))} 0)`}
                      >
                        <rect
                          x={a}
                          y="143"
                          width="42"
                          height="45"
                          rx="4"
                          fill="#B8E6E5"
                          {...line}
                        />
                        <path
                          d={`M${a + 21} 143v45M${a} 165h42`}
                          stroke={C.ink}
                          strokeWidth="2"
                        />
                      </g>
                    ))}
                    <g
                      opacity={clamp((k - 0.75) * 4)}
                      transform={`translate(0 ${20 * (1 - clamp((k - 0.75) * 4))})`}
                    >
                      <path d="M210 42V18h53v23h-53" fill={C.teal} {...line} />
                      <text
                        x="210"
                        y="106"
                        fill={C.ink}
                        textAnchor="middle"
                        fontSize="23"
                        fontWeight="800"
                      >
                        ESCUELA
                      </text>
                    </g>
                  </>
                ) : kind === "home" ? (
                  <>
                    <path
                      d="M67 142L209 42L351 142Z"
                      fill={C.coral}
                      {...line}
                    />
                    <path d="M93 139H325V236H93Z" fill="#F7DF9D" {...line} />
                    <rect
                      x="176"
                      y="160"
                      width="58"
                      height="76"
                      rx="4"
                      fill="#32B4A7"
                      {...line}
                    />
                    {[116, 259].map((a) => (
                      <rect
                        key={a}
                        x={a}
                        y="159"
                        width="38"
                        height="43"
                        rx="4"
                        fill="#B8E6E5"
                        {...line}
                      />
                    ))}
                    <path d="M210 236v64" stroke="#E5C99C" strokeWidth="42" />
                  </>
                ) : (
                  <>
                    <rect
                      x="96"
                      y="51"
                      width="228"
                      height="183"
                      rx="10"
                      fill="#94C4BF"
                      {...line}
                    />
                    {[0, 1, 2].flatMap((row) =>
                      [0, 1, 2, 3].map((col) => (
                        <rect
                          key={`${row}-${col}`}
                          x={119 + col * 48}
                          y={73 + row * 47}
                          width="30"
                          height="29"
                          rx="4"
                          fill={col === 2 && row === 1 ? C.gold : "#DDF3E7"}
                          {...line}
                        />
                      )),
                    )}
                    <path d="M188 234v-42h44v42" fill={C.navy} {...line} />
                  </>
                )}
              </g>
            </>
          )}
          {kind === "friends" && (
            <>
              <rect y="210" width="420" height="90" fill="#B3D6B6" />
              <path
                d="M75 190Q210 58 345 190"
                pathLength="1"
                stroke={C.teal}
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${k} 1`}
              />
              <path
                d="M75 190H345"
                pathLength="1"
                stroke={C.coral}
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${k} 1`}
              />
              {[
                [75, 190],
                [210, 75],
                [345, 190],
              ].map(([cx, cy], i) => (
                <g key={i} opacity={clamp(k * 3 - i * 0.5)}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="43"
                    fill={[C.teal, C.gold, C.coral][i]}
                    stroke={C.ink}
                    strokeWidth="4"
                  />
                  <path
                    d={`M${cx - 18} ${cy}h36M${cx} ${cy - 18}v36`}
                    stroke={C.ink}
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </g>
              ))}
              <text
                x="210"
                y="267"
                textAnchor="middle"
                fill={C.ink}
                fontSize="23"
                fontWeight="800"
              >
                NUEVAS CONEXIONES
              </text>
            </>
          )}
          {kind === "route" && (
            <>
              <path
                d="M-50 273Q70 170 164 230T420 180V310H-50Z"
                fill="#8CC5AB"
              />
              <path
                d="M40 256Q170 143 218 195T380 144"
                stroke="#E3DEC0"
                strokeWidth="35"
                fill="none"
              />
              <path
                d="M40 256Q170 143 218 195T380 144"
                pathLength="1"
                stroke={C.coral}
                strokeWidth="9"
                fill="none"
                strokeDasharray={`${k} 1`}
                strokeLinecap="round"
              />
              <g transform={`translate(${routePoint[0]} ${routePoint[1]})`}>
                <circle r="17" fill={C.gold} stroke={C.ink} strokeWidth="4" />
              </g>
              <path d="M328 148V76h49l-8 15 8 15h-49" fill={C.teal} {...line} />
            </>
          )}
          {kind === "learn" && (
            <>
              <path d="M36 226H384" stroke="#A6CFB7" strokeWidth="35" />
              <g transform={`translate(0 ${32 * (1 - k)})`}>
                <path
                  d="M76 78Q137 59 210 90Q280 59 344 78V223Q272 206 210 232Q140 206 76 223Z"
                  fill={C.cream}
                  {...line}
                />
                <path d="M210 90V232" stroke={C.ink} strokeWidth="4" />
                {[0, 1, 2, 3].map((i) => (
                  <g key={i} opacity={clamp(k * 4 - i * 0.5)}>
                    <path
                      d={`M100 ${111 + i * 24}h78M240 ${111 + i * 24}h78`}
                      stroke={i === 2 ? C.coral : C.teal}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </g>
                ))}
              </g>
              <path
                d="M303 242L361 176L372 186L314 252Z"
                fill={C.gold}
                {...line}
              />
            </>
          )}
          {kind === "activity" && (
            <>
              <rect y="220" width="420" height="80" fill="#B3D6B6" />
              <path
                d="M55 229Q115 100 186 155T353 110"
                pathLength="1"
                stroke={C.teal}
                fill="none"
                strokeWidth="10"
                strokeDasharray={`${k} 1`}
                strokeLinecap="round"
              />
              <circle
                cx={55 + 280 * k}
                cy={229 - 115 * k}
                r="30"
                fill={C.gold}
                stroke={C.ink}
                strokeWidth="4"
              />
              <g transform="translate(302 164)">
                <path
                  d="M0 0v91M-25 0h50M-30 91h60"
                  stroke={C.ink}
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M-43 5h86V-20h-86Z"
                  fill={C.coral}
                  stroke={C.ink}
                  strokeWidth="4"
                />
              </g>
              <path
                d="M49 268H251"
                stroke="#EDF1DC"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
