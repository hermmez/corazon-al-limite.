import React, {useMemo} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Shape,
  TubeGeometry,
  Vector3,
} from "three";

const TRANSITION_FRAMES = 16;
const SCENE_DURATIONS = [352, 352, 352, 352, 352, 352, 352, 348] as const;

const scenes = [
  {title: "¿Y SI TU CORAZÓN\nDEJARA DE LATIR?", subtitle: "Tu cuerpo depende de cada latido.", time: "00:00", accent: "#ff526b", mode: "heart"},
  {title: "EL RITMO SE\nINTERRUMPE", subtitle: "El corazón deja de impulsar sangre temporalmente.", time: "00:11", accent: "#ff465f", mode: "heart"},
  {title: "LA SANGRE\nPIERDE IMPULSO", subtitle: "La circulación puede disminuir.", time: "00:22", accent: "#e94b62", mode: "flow"},
  {title: "TU CEREBRO\nLO NOTA", subtitle: "Es uno de los órganos más sensibles a la falta de oxígeno.", time: "00:33", accent: "#ff6681", mode: "brain"},
  {title: "¿TE DESMAYARÍAS\nAL INSTANTE?", subtitle: "No necesariamente. Depende de la duración y la causa.", time: "00:44", accent: "#ff6677", mode: "brain"},
  {title: "CINCO SEGUNDOS\nNO SON LO MISMO", subtitle: "Una pausa breve no equivale a un paro cardíaco.", time: "00:55", accent: "#f56a70", mode: "compare"},
  {title: "CADA SEGUNDO\nIMPORTA", subtitle: "Ante un colapso: emergencias, RCP y un DEA.", time: "01:06", accent: "#ff5366", mode: "response"},
  {title: "TU CORAZÓN\nNO DESCANSA", subtitle: "Cuídalo. Tu vida depende de él.", time: "01:17", accent: "#ff7180", mode: "heart"},
] as const;

const makeTube = (points: [number, number, number][], radius: number) =>
  new TubeGeometry(
    new CatmullRomCurve3(points.map((point) => new Vector3(...point))),
    48,
    radius,
    10,
    false,
  );

const createHeartShape = () => {
  const shape = new Shape();
  shape.moveTo(0, -0.92);
  shape.bezierCurveTo(-0.24, -0.68, -1.18, -0.06, -1.08, 0.62);
  shape.bezierCurveTo(-0.98, 1.24, -0.24, 1.22, 0, 0.62);
  shape.bezierCurveTo(0.24, 1.22, 0.98, 1.24, 1.08, 0.62);
  shape.bezierCurveTo(1.18, -0.06, 0.24, -0.68, 0, -0.92);
  return new ExtrudeGeometry(shape, {
    depth: 0.34,
    steps: 2,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.07,
    bevelThickness: 0.08,
  });
};

const HeartModel: React.FC<{frame: number}> = ({frame}) => {
  const heart = useMemo(createHeartShape, []);
  const aorta = useMemo(
    () => makeTube([[0, 0.56, 0.12], [0, 1.12, 0.12], [0.2, 1.46, 0.12], [0.64, 1.46, 0.12], [0.82, 1.22, 0.12]], 0.13),
    [],
  );
  const venaCava = useMemo(() => makeTube([[-0.48, 1.48, -0.04], [-0.48, 0.82, -0.04], [-0.42, 0.56, -0.04]], 0.12), []);
  const coronaryA = useMemo(() => makeTube([[-0.08, 0.48, 0.43], [-0.38, 0.28, 0.46], [-0.52, -0.05, 0.45], [-0.35, -0.39, 0.42]], 0.025), []);
  const coronaryB = useMemo(() => makeTube([[-0.34, 0.24, 0.46], [0.12, 0.1, 0.46], [0.36, -0.12, 0.45], [0.42, -0.4, 0.41]], 0.023), []);
  const beat = 1 + Math.pow(Math.max(0, Math.sin((frame % 36) * Math.PI / 18)), 5) * 0.075;

  return (
    <group position={[0, 0.5, 0]} rotation={[0.05 + Math.sin(frame / 150) * 0.04, Math.sin(frame / 95) * 0.18, Math.sin(frame / 120) * 0.025]} scale={beat * 0.46}>
      <mesh geometry={heart} position={[0, 0, -0.18]} castShadow>
        <meshPhysicalMaterial color="#a91432" roughness={0.28} metalness={0.05} clearcoat={0.9} clearcoatRoughness={0.22} />
      </mesh>
      <mesh geometry={aorta} castShadow>
        <meshPhysicalMaterial color="#d8364b" roughness={0.26} clearcoat={0.8} />
      </mesh>
      <mesh geometry={venaCava} castShadow>
        <meshPhysicalMaterial color="#315d9a" roughness={0.32} clearcoat={0.72} />
      </mesh>
      <mesh geometry={coronaryA}>
        <meshStandardMaterial color="#ff8a91" roughness={0.38} emissive="#4b0612" emissiveIntensity={0.4} />
      </mesh>
      <mesh geometry={coronaryB}>
        <meshStandardMaterial color="#ff9ca2" roughness={0.38} emissive="#4b0612" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
};

const BrainHemisphere: React.FC<{side: -1 | 1; frame: number}> = ({side, frame}) => {
  const grooves = useMemo(() => {
    const paths: [number, number, number][][] = [
      [[-0.63, 0.42, 0.38], [-0.52, 0.62, 0.42], [-0.28, 0.68, 0.44], [-0.14, 0.5, 0.47]],
      [[-0.66, 0.12, 0.43], [-0.46, 0.28, 0.48], [-0.25, 0.23, 0.51], [-0.12, 0.38, 0.49]],
      [[-0.58, -0.18, 0.42], [-0.39, -0.02, 0.5], [-0.22, -0.12, 0.5], [-0.12, 0.02, 0.49]],
      [[-0.42, -0.45, 0.36], [-0.35, -0.25, 0.48], [-0.2, -0.34, 0.47], [-0.12, -0.2, 0.47]],
    ];
    return paths.map((path) => makeTube(path.map(([x, y, z]) => [x * side, y, z] as [number, number, number]), 0.018));
  }, [side]);
  return (
    <group position={[side * 0.36, 0.02, 0]} rotation={[0.04, side * -0.08 + Math.sin(frame / 130) * 0.04, side * 0.08]}>
      <mesh scale={[0.68, 0.84, 0.53]} castShadow>
        <sphereGeometry args={[1, 40, 40]} />
        <meshPhysicalMaterial color={side === -1 ? "#dc7184" : "#c85269"} roughness={0.43} clearcoat={0.55} clearcoatRoughness={0.34} />
      </mesh>
      {grooves.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshStandardMaterial color="#763344" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const BrainModel: React.FC<{frame: number}> = ({frame}) => (
  <group position={[0, 0.5, 0]} scale={0.62} rotation={[0.04, Math.sin(frame / 115) * 0.14, -0.04]}>
    <BrainHemisphere side={-1} frame={frame} />
    <BrainHemisphere side={1} frame={frame} />
    <mesh position={[0, 0, 0.08]} scale={[0.04, 0.68, 0.46]}>
      <sphereGeometry args={[1, 20, 20]} />
      <meshStandardMaterial color="#763344" roughness={0.7} />
    </mesh>
  </group>
);

const SceneArt: React.FC<{sceneIndex: number}> = ({sceneIndex}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const mode = scenes[sceneIndex].mode;
  const cameraZ = interpolate(frame, [0, 351], [6.25, 5.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.65, 0.24, 1),
  });
  const dust = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < 90; i++) {
      const angle = i * 2.399963;
      const radius = 0.55 + ((i * 37) % 100) / 50;
      positions.push(Math.cos(angle) * radius, (((i * 53) % 100) / 50) - 1, -0.8 - ((i * 19) % 100) / 60);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);
  const cameraX = Math.sin(frame / 180) * 0.18 + (sceneIndex === 3 || sceneIndex === 4 ? 0.12 : 0);
  const cameraY = Math.cos(frame / 190) * 0.1;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      orthographic={false}
      camera={{position: [cameraX, cameraY + 0.08, cameraZ], fov: 36}}
      gl={{antialias: true, alpha: true}}
      dpr={[1, 1]}
      style={{position: "absolute", inset: 0}}
    >
      <ambientLight intensity={0.62} />
      <directionalLight color="#ffe1e3" intensity={2.3} position={[-3, 4, 5]} />
      <pointLight color={scenes[sceneIndex].accent} intensity={62} distance={9} position={[2.4, 1.4, 2.3]} />
      <pointLight color="#385e9a" intensity={34} distance={8} position={[-2.5, -1.4, 1.1]} />
      <mesh position={[0, 0, -1.55]}>
        <torusGeometry args={[1.5, 0.008, 8, 120]} />
        <meshBasicMaterial color={scenes[sceneIndex].accent} transparent opacity={0.36} />
      </mesh>
      <points geometry={dust} rotation={[frame * 0.0008, frame * 0.0015, 0]}>
        <pointsMaterial color="#ffd1d5" transparent opacity={0.55} size={0.014} sizeAttenuation />
      </points>
      {(mode === "brain" ? <BrainModel frame={frame} /> : <HeartModel frame={frame} />)}
      {(mode === "flow" || mode === "response") && Array.from({length: 12}).map((_, i) => {
        const angle = frame * 0.035 + i * Math.PI / 6;
        const radius = 1.55 + (i % 3) * 0.1;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.64, 0.05]} scale={[0.045, 0.075, 0.045]} rotation={[0, 0, angle]}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshPhysicalMaterial color={i % 3 === 0 ? "#83b9dc" : "#ff485e"} roughness={0.24} clearcoat={0.8} />
          </mesh>
        );
      })}
      {mode === "compare" && <mesh position={[0, 0, -0.2]}><torusGeometry args={[1.85, 0.012, 8, 100]} /><meshBasicMaterial color="#f1d4d7" transparent opacity={0.36} /></mesh>}
    </ThreeCanvas>
  );
};

const SceneOverlay: React.FC<{sceneIndex: number}> = ({sceneIndex}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const scene = scenes[sceneIndex];
  const enter = interpolate(frame, [0, 24], [26, 0], {extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const textOpacity = interpolate(frame, [0, 14, 330, 352], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  const progress = (sceneIndex + interpolate(frame, [0, SCENE_DURATIONS[sceneIndex]], [0, 1], {extrapolateRight: "clamp"})) / 8;
  const pulseLine = Array.from({length: 25}, (_, i) => {
    const x = i * 42;
    const wave = Math.sin(i * 0.72 + frame * 0.08) * 5;
    const spike = (sceneIndex === 1 || sceneIndex === 5) && i === 12 ? -62 : 0;
    return `${i === 0 ? "M" : "L"} ${x} ${60 + wave + spike}`;
  }).join(" ");

  return (
    <AbsoluteFill style={{pointerEvents: "none", color: "#fff8f7", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden"}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 41%, ${scene.accent}27 0%, transparent 37%), linear-gradient(180deg, #10090d 0%, #160b10 48%, #070609 100%)`, mixBlendMode: "screen", opacity: 0.76}} />
      <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(0,0,0,.3), transparent 22%, transparent 78%, rgba(0,0,0,.3)), linear-gradient(180deg, rgba(0,0,0,.42), transparent 22%, transparent 48%, rgba(0,0,0,.18) 65%, rgba(0,0,0,.72))"}} />
      <div style={{position: "absolute", top: 112, left: 68, right: 68, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#f7c9ce", fontSize: 22, fontWeight: 700, letterSpacing: 4}}>
        <span>CIENCIA · SISTEMA CARDIOVASCULAR</span><span style={{color: scene.accent}}>{String(sceneIndex + 1).padStart(2, "0")} <span style={{color: "#7d6269"}}>/ 08</span></span>
      </div>
      <div style={{position: "absolute", top: 178, left: 68, right: 68, height: 2, background: "rgba(255,255,255,.14)"}}>
        <div style={{width: `${progress * 100}%`, height: "100%", background: scene.accent, boxShadow: `0 0 18px ${scene.accent}`}} />
      </div>
      <svg viewBox={`0 0 ${width} 120`} style={{position: "absolute", top: 678, left: 0, width: "100%", height: 120, opacity: sceneIndex === 1 || sceneIndex === 5 ? 0.48 : 0.18}}>
        <path d={pulseLine} transform="translate(15 0)" fill="none" stroke={scene.accent} strokeWidth="2" />
      </svg>
      {sceneIndex === 6 && (
        <div style={{position: "absolute", top: 890, left: 85, right: 85, display: "flex", justifyContent: "center", gap: 25, color: "#fff4f4", fontSize: 21, letterSpacing: 1, opacity: textOpacity}}>
          {["01  EMERGENCIAS", "02  RCP", "03  DEA"].map((item) => <span key={item} style={{border: "1px solid #ff718055", padding: "12px 15px", borderRadius: 3, background: "#220e15bb"}}>{item}</span>)}
        </div>
      )}
      {sceneIndex === 5 && (
        <div style={{position: "absolute", top: 862, left: 110, right: 110, display: "flex", justifyContent: "space-between", fontSize: 19, color: "#ffdfe2", letterSpacing: 1, opacity: textOpacity}}>
          <span>PAUSA BREVE</span><span style={{color: "#ff8190"}}>PARO CARDÍACO</span>
        </div>
      )}
      <div style={{position: "absolute", top: 1030, left: 78, right: 78, textAlign: "center", opacity: textOpacity, transform: `translateY(${enter}px)`}}>
        <div style={{height: 3, width: 74, margin: "0 auto 27px", background: scene.accent, boxShadow: `0 0 18px ${scene.accent}`}} />
        <div style={{fontSize: 69, fontWeight: 800, lineHeight: 1.08, letterSpacing: 1.2, whiteSpace: "pre-line", textShadow: "0 6px 30px #000, 0 2px 12px #000"}}>{scene.title}</div>
        <div style={{maxWidth: 850, margin: "30px auto 0", fontSize: 31, lineHeight: 1.38, fontWeight: 400, color: "#f3d9dc", textShadow: "0 3px 18px #000"}}>{scene.subtitle}</div>
      </div>
      <div style={{position: "absolute", bottom: 130, left: 68, right: 68, display: "flex", justifyContent: "space-between", color: "#d5b8be", fontSize: 19, letterSpacing: 2}}>
        <span>CORAZÓN AL LÍMITE</span><span>{scene.time} <span style={{color: "#735c62"}}>/ 01:30</span></span>
      </div>
      <div style={{position: "absolute", inset: 25, border: "1px solid rgba(255,220,225,.075)", boxShadow: "inset 0 0 55px rgba(0,0,0,.35)"}} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{sceneIndex: number}> = ({sceneIndex}) => (
  <AbsoluteFill>
    <SceneArt sceneIndex={sceneIndex} />
    <SceneOverlay sceneIndex={sceneIndex} />
  </AbsoluteFill>
);

export const CorazonAlLimite: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="01 · El latido" durationInFrames={SCENE_DURATIONS[0]} premountFor={fps}><Scene sceneIndex={0} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
      <TransitionSeries.Sequence name="02 · Ritmo interrumpido" durationInFrames={SCENE_DURATIONS[1]} premountFor={fps}><Scene sceneIndex={1} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
      <TransitionSeries.Sequence name="03 · Circulación" durationInFrames={SCENE_DURATIONS[2]} premountFor={fps}><Scene sceneIndex={2} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
      <TransitionSeries.Sequence name="04 · El cerebro" durationInFrames={SCENE_DURATIONS[3]} premountFor={fps}><Scene sceneIndex={3} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
      <TransitionSeries.Sequence name="05 · Pérdida de conciencia" durationInFrames={SCENE_DURATIONS[4]} premountFor={fps}><Scene sceneIndex={4} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
      <TransitionSeries.Sequence name="06 · Una pausa no es un paro" durationInFrames={SCENE_DURATIONS[5]} premountFor={fps}><Scene sceneIndex={5} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
      <TransitionSeries.Sequence name="07 · Respuesta" durationInFrames={SCENE_DURATIONS[6]} premountFor={fps}><Scene sceneIndex={6} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
      <TransitionSeries.Sequence name="08 · Cierre" durationInFrames={SCENE_DURATIONS[7]} premountFor={fps}><Scene sceneIndex={7} /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

