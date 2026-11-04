import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import chapters from "./chapters.json";

const C = {
  navy: "#071321",
  ink: "#10283b",
  cream: "#f7f0e1",
  teal: "#35c5c9",
  coral: "#ff6d75",
  gold: "#ffd06d",
  blue: "#91bdff",
};

const image = (path: string) => staticFile(`imagenes/${path}`);
const episodeImage = (path: string) => staticFile(`episodio-04/ilustraciones/${path}`);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const Actor: React.FC<{
  file: string;
  local: number;
  left?: number;
  width?: number;
  bottom?: number;
  scale?: number;
}> = ({ file, local, left = 430, width = 630, bottom = 340, scale = 1 }) => {
  const { fps } = useVideoConfig();
  const enter = spring({ frame: Math.max(0, local * fps), fps, config: { damping: 18, stiffness: 100 } });
  const breathe = 1 + Math.sin(local * 2.2) * 0.003;
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width,
        height: width * 1.5,
        transformOrigin: "50% 96%",
        transform: `translateY(${(1 - enter) * 56}px) scale(${scale * breathe})`,
        filter: "drop-shadow(0 28px 36px #0006)",
      }}
    >
      <Img src={image(`personajes/${file}`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode; top?: number; color?: string; size?: number; width?: number }> = ({
  children,
  top = 300,
  color = C.cream,
  size = 54,
  width = 850,
}) => (
  <div style={{ position: "absolute", left: 74, top, width, color, fontSize: size, fontWeight: 850, lineHeight: 1.02, letterSpacing: -1.8, textShadow: "0 4px 18px #0008" }}>
    {children}
  </div>
);

const ChapterTag: React.FC<{ text: string; local: number; color?: string }> = ({ text, local, color = C.teal }) => {
  const opacity = interpolate(local, [0, 0.2, 1.65, 1.95], [0, 1, 1, 0], clamp);
  const rise = interpolate(local, [0, 0.28], [18, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 78, top: 212, opacity, transform: `translateY(${rise}px)`, color, fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>
      {text}
    </div>
  );
};

const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 86, left: 78, color: "#e9f2ed", fontSize: 19, fontWeight: 800, letterSpacing: 4, opacity: 0.78 }}>
    CORAZÓN AL LÍMITE
  </div>
);

const NightRoom: React.FC<{ time: number; darker: number; top?: number }> = ({ time, darker, top = 370 }) => (
  <>
    <AbsoluteFill style={{ background: "#193247", overflow: "hidden" }}>
      <Img src={image("escenarios/01_dormitorio.png")} style={{ position: "absolute", width: 1230, height: 1230, left: -75, top, objectFit: "contain", translate: `${interpolate(time % 8, [0, 2, 4, 6, 8], [0, -8, 0, 8, 0])}px 0px` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, #061522${Math.round(75 + darker * 90).toString(16)} 0%, #07132166 48%, #06121be8 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "#071321", opacity: darker * 0.66 }} />
    </AbsoluteFill>
  </>
);

const Clock: React.FC<{ local: number; color?: string }> = ({ local, color = C.gold }) => {
  const { fps } = useVideoConfig();
  const turn = spring({ frame: local * fps, fps, config: { damping: 80, stiffness: 22 } });
  const hours = Math.min(24, Math.floor(Math.max(0, local) * 3));
  return (
    <svg width="270" height="270" viewBox="0 0 270 270" style={{ position: "absolute", right: 82, top: 240, filter: "drop-shadow(0 14px 30px #0008)" }}>
      <circle cx="135" cy="135" r="112" fill="#10283bdd" stroke="#f7f0e144" strokeWidth="3" />
      <circle cx="135" cy="135" r="92" fill="none" stroke="#f7f0e133" strokeWidth="10" />
      <circle cx="135" cy="135" r="92" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${Math.max(0.08, turn) * 578} 578`} transform="rotate(-90 135 135)" />
      <path d="M135 135L135 76M135 135L181 150" stroke={C.cream} strokeWidth="8" strokeLinecap="round" transform={`rotate(${Math.sin(local * 2) * 11} 135 135)`} />
      <circle cx="135" cy="135" r="9" fill={C.coral} />
      <text x="135" y="226" textAnchor="middle" fill={C.cream} fontSize="24" fontWeight="800">{String(hours).padStart(2, "0")}:00</text>
    </svg>
  );
};

const FocusGraph: React.FC<{ local: number }> = ({ local }) => {
  return (
    <div style={{ position: "absolute", left: 90, top: 1140, width: 900, height: 520, background: "#0a2033ee", borderRadius: 32, overflow: "hidden" }}>
      <Img src={image("ciencia/02_sinapsis_neuronal.png")} style={{ position: "absolute", right: 0, top: 15, width: 500, height: 500, objectFit: "contain", translate: `0px ${interpolate(local, [0, 2, 4, 6, 9], [24, 0, -10, 0, 0], clamp)}px` }} />
      <div style={{ position: "absolute", left: 34, top: 65, width: 330, color: C.cream, fontSize: 38, fontWeight: 800, lineHeight: 1.15 }}>{local < 3 ? "ATENCIÓN" : local < 6 ? "REACCIÓN" : "ERRORES"}</div>
      <div style={{ position: "absolute", left: 34, top: 210, width: 330, color: C.gold, fontSize: 30, lineHeight: 1.25 }}>{local < 3 ? "Concentrarse puede costar más" : local < 6 ? "Responder puede llevar más tiempo" : "El desempeño puede cambiar"}</div>
      <div style={{ position: "absolute", left: 34, bottom: 26, color: "#b4c9d0", fontSize: 21 }}>Ilustración educativa · sin datos medidos</div>
    </div>
  );
};

const MicrosleepVisual: React.FC<{ local: number }> = ({ local }) => {
  const blink = [3.5, 5.7, 7.4].some((center) => Math.abs(local - center) < 0.13);
  return (
    <>
      <Actor file={blink ? "05_cansado.png" : "01_neutral.png"} local={local} left={505} width={510} bottom={255} />
      <div style={{ position: "absolute", left: 70, top: 820, width: 495, height: 650, borderRadius: 34, background: "#081927ee", overflow: "hidden" }}>
        <Img src={image("anatomia/01_cerebro_completo.png")} style={{ width: 470, height: 470, objectFit: "contain", opacity: blink ? 0.55 : 1, translate: `0px ${interpolate(local, [0, 2, 4, 6, 9], [25, 0, -12, 0, 0], clamp)}px` }} />
        <div style={{ position: "absolute", left: 28, right: 28, bottom: 65, color: blink ? C.coral : C.gold, fontSize: 30, lineHeight: 1.15, fontWeight: 800 }}>{local < 3 ? "PARECE DESPIERTO" : local < 6 ? "PUEDE HABER UN LAPSO" : "NO HAY UNA HORA EXACTA"}</div>
        <div style={{ position: "absolute", left: 28, bottom: 25, color: "#b4c9d0", fontSize: 20 }}>Representación ilustrativa</div>
      </div>
    </>
  );
};

const Road: React.FC<{ local: number }> = ({ local }) => {
  const drift = (local * 190) % 260;
  const response = interpolate(local, [0, 2, 3.6, 4.3, 5.7, 7, 9], [0, 0, 30, 30, 0, 0, 0], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 180, width: 900, height: 1600, overflow: "hidden", borderRadius: 26 }}>
        <Img src={episodeImage("carretera-nocturna-sin-vehiculo.png")} style={{ width: 900, height: 1600, objectFit: "cover" }} />
        <svg width="900" height="1600" viewBox="0 0 900 1600" style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2, 3, 4].map((n) => {
            const y = 770 + ((n * 210 + drift) % 830);
            return <path key={n} d={`M450 ${y}v${22 + (y - 770) * 0.06}`} stroke="#f7e5ab" strokeWidth={3 + (y - 770) * 0.012} opacity=".8" />;
          })}
        </svg>
        <Img src={episodeImage("automovil-teal-vista-trasera.png")} style={{ position: "absolute", top: 900, left: 155, width: 590, height: 504, objectFit: "contain", translate: `${response}px ${Math.sin(local * 9) * 1.4}px`, rotate: `${response * 0.018}deg` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 430, background: "linear-gradient(#071321ed,#07132100)" }} />
        <div style={{ position: "absolute", left: 40, top: 590, width: 500, color: C.gold, fontSize: 33, lineHeight: 1.15, fontWeight: 850, textShadow: "0 3px 14px #000" }}>{local < 2 ? "LA CARRETERA SIGUE" : local < 4 ? "UN LAPSO SIN RESPONDER" : local < 6 ? "INFORMACIÓN QUE SE PIERDE" : "CON SUEÑO, EVITA MANEJAR"}</div>
      </div>
    </>
  );
};

const Effects: React.FC<{ local: number }> = ({ local }) => {
  const labels = ["MEMORIA", "DECISIONES", "EMOCIONES"];
  const colors = [C.teal, C.gold, C.coral];
  const current = Math.min(2, Math.floor(local / 2));
  return (
    <>
      <Img src={image("anatomia/01_cerebro_completo.png")} style={{ position: "absolute", width: 830, height: 830, left: 125, top: 390, objectFit: "contain", transform: `scale(${1 + Math.sin(local * 1.6) * 0.025})`, filter: "drop-shadow(0 18px 38px #0008)" }} />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2].map((n) => <path key={n} d={`M${220 + n * 300} 1110 C${170 + n * 320} 1280,${300 + n * 280} 1290,${250 + n * 310} 1440`} fill="none" stroke={colors[n]} strokeWidth={current === n ? 10 : 3} opacity={current === n ? 0.95 : 0.24} strokeDasharray="12 20" />)}
      </svg>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 340, display: "flex", justifyContent: "space-between", gap: 14 }}>
        {labels.map((label, n) => <div key={label} style={{ flex: 1, padding: "24px 18px", textAlign: "center", borderRadius: 24, color: current === n ? C.navy : C.cream, background: current === n ? colors[n] : "#0a2033e8", border: `2px solid ${colors[n]}66`, fontSize: 21, fontWeight: 850, letterSpacing: 1.5, transform: `translateY(${current === n ? -16 : 0}px)` }}>{label}</div>)}
      </div>
    </>
  );
};

const Coffee: React.FC<{ local: number }> = ({ local }) => (
  <>
    <Img src={episodeImage("taza-cafe-con-plato.png")} style={{ position: "absolute", left: 65, top: 675, width: 560, height: 560, objectFit: "contain", translate: `0px ${interpolate(local, [0, 1, 3, 5, 7, 9], [45, 0, 0, 15, 15, 15], clamp)}px` }} />
    <Img src={image("anatomia/01_cerebro_completo.png")} style={{ position: "absolute", left: 575, top: 630, width: 420, height: 420, objectFit: "contain", opacity: interpolate(local, [0, 1.5, 2.5], [0, 0, 1], clamp) }} />
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2].map((n) => <path key={n} d={`M${250 + n * 60} 770 C${220 + n * 60} 700,${300 + n * 50} 690,${260 + n * 60} 590`} fill="none" stroke="#fff2d7" strokeWidth="5" strokeLinecap="round" opacity={0.28 + 0.15 * Math.sin(local * 2 + n)} />)}
      <path d="M610 1110 C690 1140 805 1140 920 1080 M895 1075L925 1075L917 1105" fill="none" stroke={C.gold} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${interpolate(local, [2, 4], [0, 400], clamp)} 400`} />
    </svg>
    <div style={{ position: "absolute", left: 590, top: 1200, width: 410, color: C.gold, fontSize: 34, fontWeight: 800, lineHeight: 1.15 }}>{local < 5 ? "ALERTA TEMPORAL" : "NO REEMPLAZA EL SUEÑO"}</div>
    <div style={{ position: "absolute", left: 650, top: 1420, width: 320, color: C.cream, fontSize: 28, lineHeight: 1.2 }}>Tu cuerpo sigue necesitando descansar.</div>
  </>
);

const SplitPerception: React.FC<{ local: number }> = ({ local }) => {
  const { fps } = useVideoConfig();
  const delay = spring({ frame: local * fps, fps, config: { damping: 26, stiffness: 74 } });
  const response = Math.min(1, Math.max(0, (local - 2.6) / 1.7));
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 530, width: 448, height: 960, borderRadius: 34, background: "#11304add", border: "1px solid #ffffff36", padding: "36px 30px", boxSizing: "border-box" }}>
        <div style={{ color: C.teal, fontSize: 22, fontWeight: 850, letterSpacing: 2 }}>CÓMO TE SIENTES</div>
        <div style={{ color: C.cream, fontSize: 45, fontWeight: 800, marginTop: 90, lineHeight: 1.04 }}>“Creo que voy bien”</div>
        <Img src={image(`personajes/${local < 4 ? "01_neutral.png" : "15_confundido.png"}`)} style={{ position: "absolute", left: 62, top: 270, width: 320, height: 480, objectFit: "contain", rotate: `${interpolate(local, [3.7, 4, 4.3], [0, -2, 0], clamp)}deg`, transformOrigin: "50% 100%" }} />
        <div style={{ position: "absolute", left: 30, bottom: 65, color: "#b8cbd2", fontSize: 24 }}>sensación subjetiva</div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 530, width: 448, height: 960, borderRadius: 34, background: "#191e31ee", border: "1px solid #ffffff36", padding: "36px 30px", boxSizing: "border-box", transform: `translateY(${(1 - delay) * 35}px)` }}>
        <div style={{ color: C.coral, fontSize: 22, fontWeight: 850, letterSpacing: 2 }}>TIEMPO DE RESPUESTA</div>
        <Img src={image("anatomia/01_cerebro_completo.png")} style={{ position: "absolute", top: 120, left: 35, width: 375, height: 375, objectFit: "contain" }} />
        <div style={{ position: "relative", marginTop: 440, height: 190, borderBottom: "3px solid #e7f4ee66", borderLeft: "3px solid #e7f4ee66" }}>
          <div style={{ position: "absolute", left: 32 + response * 125, top: 38, width: 94, height: 94, borderRadius: "50%", background: "#ffd06d2a", border: `5px solid ${C.gold}`, transform: `scale(${1 + Math.sin(local * 4) * 0.08})` }} />
          <div style={{ position: "absolute", left: 62, top: 64, width: 22, height: 22, borderRadius: "50%", background: C.cream }} />
        </div>
        <div style={{ color: "#b8cbd2", fontSize: 24, marginTop: 25 }}>respuesta ilustrativa</div>
        <div style={{ color: "#b8cbd2", fontSize: 20, marginTop: 18 }}>Sin datos ni umbral medido</div>
      </div>
      <div style={{ position: "absolute", top: 1550, left: 92, width: 896, textAlign: "center", color: C.gold, fontSize: 32, fontWeight: 850, letterSpacing: 1.4 }}>SENTIRTE DESPIERTO NO GARANTIZA EL MISMO RENDIMIENTO</div>
    </>
  );
};

const Closing: React.FC<{ local: number }> = ({ local }) => (
  <>
    <NightRoom time={local} darker={0.45} top={550} />
    <Img src={episodeImage("personaje-descansando-en-cama.png")} style={{ position: "absolute", left: 40, top: 875, width: 1000, height: 667, objectFit: "contain" }} />
    <Img src={episodeImage("personaje-descansando-en-cama.png")} style={{ position: "absolute", left: 40, top: 875, width: 1000, height: 667, objectFit: "contain", clipPath: "polygon(38% 30%, 88% 22%, 88% 62%, 36% 60%)", scale: `1 ${1 + Math.sin(local * 1.7) * 0.004}`, transformOrigin: "60% 55%" }} />
    <div style={{ position: "absolute", left: 72, top: 540, width: 480, color: C.cream, fontSize: 47, lineHeight: 1.05, fontWeight: 850, textShadow: "0 4px 24px #0009" }}>Dormir no es perder el tiempo.</div>
    <div style={{ position: "absolute", left: 72, top: 710, width: 450, color: C.teal, fontSize: 30, lineHeight: 1.2, fontWeight: 750 }}>Es una necesidad biológica.</div>
    <div style={{ position: "absolute", left: 72, top: 1510, width: 870, padding: "24px 26px", color: C.navy, background: C.gold, borderRadius: 18, fontSize: 30, lineHeight: 1.12, fontWeight: 900, opacity: interpolate(local, [2, 2.4], [0, 1], clamp) }}>SI TIENES SUEÑO, EVITA MANEJAR.</div>
    <div style={{ position: "absolute", left: 72, top: 1680, width: 870, color: C.cream, fontSize: 37, lineHeight: 1.1, fontWeight: 850, textShadow: "0 3px 20px #000", opacity: interpolate(local, [4.5, 5], [0, 1], clamp) }}>¿Cuántas horas llevas despierto hoy?</div>
  </>
);

export const Episodio04SinDormir: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const sceneIndex = Math.max(0, chapters.findIndex((chapter, i) => time >= chapter.start && (time < chapter.end || i === chapters.length - 1)));
  const chapter = chapters[sceneIndex];
  const local = Math.max(0, time - chapter.start);
  const beat = Math.min(3, Math.floor(local / 2.05));
  const fade = interpolate(local, [0, 0.22], [0, 1], clamp);
  const darkness = interpolate(local, [0, chapter.end - chapter.start], [0.35, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.navy, color: C.cream, overflow: "hidden", fontFamily: "Manrope, Arial, sans-serif" }}>
      {sceneIndex === 0 ? (
        <>
          <NightRoom time={time} darker={darkness} />
          <Actor file={beat < 2 ? "05_cansado.png" : "18_bostezando.png"} local={local} />
          <Clock local={local} />
          <ChapterTag text={chapter.kicker} local={local} />
          <Label top={302} size={55}>{chapter.titleLines[0]}<br />{chapter.titleLines[1]}</Label>
          <div style={{ position: "absolute", right: 97, top: 545, width: 238, textAlign: "center", color: C.cream, fontWeight: 800, fontSize: 24 }}>EL EFECTO<br />NO LLEGA IGUAL<br />PARA TODOS</div>
        </>
      ) : sceneIndex === 1 ? (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 58% 52%, #194a62 0%, #0b2237 48%, #071321 100%)" }} />
          <Img src={image("anatomia/01_cerebro_completo.png")} style={{ position: "absolute", width: 800, height: 760, left: 140, top: 385, objectFit: "contain", transform: `translateX(${Math.sin(local * 0.75) * 20}px) scale(${1 + Math.sin(local * 1.4) * 0.02})`, filter: "drop-shadow(0 16px 40px #0009)" }} />
          <FocusGraph local={local} />
          <ChapterTag text={chapter.kicker} local={local} />
          <Label top={300} size={50}>{chapter.title}</Label>
        </>
      ) : sceneIndex === 2 ? (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 38%, #283e55 0%, #10263b 43%, #071321 100%)" }} />
          <MicrosleepVisual local={local} />
          <ChapterTag text={chapter.kicker} local={local} color={C.coral} />
          <Label top={300} size={49}>{chapter.titleLines[0]}<br />{chapter.titleLines[1]}</Label>
          <div style={{ position: "absolute", left: 95, top: 1530, width: 490, color: C.gold, fontSize: 24, fontWeight: 750, letterSpacing: 2 }}>NO HAY UNA HORA ÚNICA</div>
        </>
      ) : sceneIndex === 3 ? (
        <>
          <Road local={local} />
          <ChapterTag text={chapter.kicker} local={local} color={C.coral} />
          <Label top={300} size={50}>{chapter.titleLines[0]}<br />{chapter.titleLines[1]}</Label>
          <div style={{ position: "absolute", top: 1490, left: 78, width: 920, color: C.cream, fontSize: 26, fontWeight: 750, textShadow: "0 3px 18px #000" }}>Un lapso sin responder puede ser peligroso al volante.</div>
        </>
      ) : sceneIndex === 4 ? (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, #234862 0%, #10283c 49%, #071321 100%)" }} />
          <Effects local={local} />
          <ChapterTag text={chapter.kicker} local={local} color={C.gold} />
          <Label top={300} size={48}>{chapter.titleLines[0]}<br />{chapter.titleLines[1]}</Label>
        </>
      ) : sceneIndex === 5 ? (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 28% 56%, #4d4b46 0%, #252a31 40%, #071321 100%)" }} />
          <Coffee local={local} />
          <ChapterTag text={chapter.kicker} local={local} color={C.gold} />
          <Label top={300} size={48}>{chapter.titleLines[0]}<br />{chapter.titleLines[1]}</Label>
        </>
      ) : sceneIndex === 6 ? (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1d3a4b 0%, #0e2336 54%, #071321 100%)" }} />
          <SplitPerception local={local} />
          <ChapterTag text={chapter.kicker} local={local} color={C.coral} />
          <Label top={300} size={48}>{chapter.titleLines[0]}<br />{chapter.titleLines[1]}</Label>
        </>
      ) : <Closing local={local} />}
      <div style={{ opacity: fade }}><Brand /></div>
      <div style={{ position: "absolute", left: 78, bottom: 40, color: "#94a8b4", fontSize: 18, letterSpacing: 1.5 }}>REVISIÓN VISUAL · VOZ Y SINCRONIZACIÓN PENDIENTES</div>
      {sceneIndex < 7 && <div style={{ position: "absolute", right: 78, bottom: 90, width: 170, height: 6, background: "#f7f0e14c", borderRadius: 8 }}><div style={{ height: "100%", width: `${(beat + ((local % 2.05) / 2.05)) * 25}%`, background: C.teal, borderRadius: 8 }} /></div>}
    </AbsoluteFill>
  );
};
