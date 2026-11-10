import React from "react";
import {Img, staticFile} from "remotion";

const art = "episodio-14/ilustraciones/";
const exterior = staticFile(art + "silbato-exterior-aprobado.png");
const section = staticFile(art + "silbato-corte-aprobado.png");
const width = 939;
const height = 1675;
const anchorX = 470;
const anchorY = 1185;
const foot = [586, 1605] as const;
const layer = {position: "absolute", inset: 0, width, height} as const;

type Pose = {x: number; y: number; scale: number; tilt: number; widthFactor: number};

export const project = (pose: Pose, x: number, y: number) => {
  const dx = x - anchorX;
  const dy = y - anchorY;
  const angle = pose.tilt * Math.PI / 180;
  return [
    pose.x + pose.scale * pose.widthFactor * (dx * Math.cos(angle) - dy * Math.sin(angle)),
    pose.y + pose.scale * (dx * Math.sin(angle) + dy * Math.cos(angle)),
  ] as const;
};

export const plantedPose = (x: number, ground: number, scale: number, tilt: number, widthFactor = 1): Pose => {
  const pose = {x, y: 0, scale, tilt, widthFactor};
  return {...pose, y: ground - project(pose, ...foot)[1]};
};

const inlet = "M251 105 C269 225 293 368 319 460 C345 551 367 601 383 677 C399 739 414 791 440 835";
const chamber = "M466 845 C495 827 525 811 556 818 C594 826 618 864 607 902 C595 941 553 949 526 927 C509 913 501 894 506 879";
const outlet = "M441 892 C412 925 397 968 404 1022 C418 1102 463 1160 511 1204 C554 1241 604 1263 643 1282 Q679 1300 712 1320";

const Aire: React.FC<{time: number; flow: number; cavities: number}> = ({time, flow, cavities}) => {
  const jet = (path: string, speed: number, opacity: number) =>
    <path d={path} pathLength={1} fill="none" stroke="#e5ffe9" strokeWidth={8} strokeLinecap="round"
      strokeDasharray=".026 .222" strokeDashoffset={-(time * speed) % 1} opacity={opacity} />;
  return <svg width={width} height={height} viewBox={"0 0 " + width + " " + height} style={{...layer, opacity: flow, pointerEvents: "none"}}>
    {jet(inlet, .69, .87)}
    <g opacity={cavities}>
      {jet(chamber, -.56, .76)}
      {jet(outlet, .72, .89)}
      <ellipse cx="452" cy="864" rx={26 + Math.sin(time * 9) * 8} ry={17 + Math.cos(time * 10) * 4}
        fill="none" stroke="#e3f9d6" strokeWidth="4.3" opacity={.38 + .31 * Math.sin(time * 4.8) ** 2} />
    </g>
  </svg>;
};

export const SilbatoAprobado: React.FC<{
  pose: Pose; opacity: number; neck: number; face: number; cut: number; cavities: number; flow: number; time: number;
}> = ({pose, opacity, neck, face, cut, cavities, flow, time}) => {
  if (opacity < .001) return null;
  const above = 1 - neck;
  const baseShape = above > .001
    ? "polygon(0 " + 42 * above + "%, 16% " + 38 * above + "%, 25% " + 34 * above + "%, 42% " + 28 * above +
      "%, 61% " + 30 * above + "%, 82% " + 38 * above + "%, 100% " + 46 * above + "%, 100% 100%, 0 100%)"
    : undefined;
  const cutDepth = 48 + 52 * cavities;
  const cutMask = cavities > .995 ? undefined
    : "linear-gradient(180deg, #000 " + (cutDepth - 7) + "%, transparent " + cutDepth + "%)";
  const showClay = face < .999 && (cut < .999 || cavities < .995);
  return <div style={{
    position: "absolute", left: pose.x, top: pose.y, opacity, pointerEvents: "none", transformOrigin: "0 0",
    transform: "scale(" + (pose.scale * pose.widthFactor) + "," + pose.scale + ") rotate(" + pose.tilt + "deg)",
  }}>
    <div style={{position: "absolute", left: -anchorX, top: -anchorY, width, height}}>
      {showClay && <div style={{
        ...layer, clipPath: baseShape, maskImage: "url(" + exterior + ")", maskSize: "100% 100%",
        background: "radial-gradient(ellipse at 26% 35%, #e9a071 0%, #c57550 41%, #9b5139 68%, #66362f 100%)",
      }}>
        <svg width={width} height={height} style={layer} viewBox={"0 0 " + width + " " + height}>
          <defs>
            <pattern id="e14porosMolde" width="95" height="109" patternUnits="userSpaceOnUse">
              <path d="m11 8 9 3 -5 4 -7 -3z m32 26 8 -4 2 4 -6 3z m24 -16 6 2 -1 5 -5 -2z m-48 47 12 -3 -3 7 -8 1z m39 -5 8 2 -2 5 -8 -4z m19 32 11 -2 -4 6 -7 2z m-68 0 7 -3 2 5 -5 2z"
                fill="#753f32" opacity=".31" />
              <path d="m8 19 9 3 m31 15 7 -4 m17 -9 6 2 m-44 49 9 -4 m32 4 7 2 m-68 26 7 -3"
                fill="none" stroke="#f5ba83" opacity=".54" strokeWidth="1.8" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#e14porosMolde)" />
          <path d="M68 909 Q143 798 287 771 T597 795 M78 945 Q179 856 299 835 M99 1071 Q192 994 289 982 M174 1232 Q241 1193 332 1164 M196 1280 Q317 1266 413 1205 M263 1451 Q387 1525 552 1526 M311 1501 Q407 1569 579 1562"
            fill="none" stroke="#f4ad78" opacity=".52" strokeWidth="5.4" strokeLinecap="round" />
          <path d="M109 1030 Q186 955 299 928 M194 1210 Q235 1188 268 1174 M631 1274 Q753 1199 804 1076 M367 1541 Q497 1602 669 1569"
            fill="none" stroke="#6b382d" opacity=".61" strokeWidth="4.2" strokeLinecap="round" />
        </svg>
      </div>}
      {cut > .001 && face < .999 && <div style={{...layer, opacity: cut, maskImage: cutMask}}>
        <Img src={section} style={layer} />
        <Aire time={time} flow={flow} cavities={cavities} />
      </div>}
      {face > .001 && <Img src={exterior} style={{
        ...layer, clipPath: face >= .999 ? undefined : "inset(0 0 0 " + 100 * (1 - face) + "%)",
      }} />}
    </div>
  </div>;
};
