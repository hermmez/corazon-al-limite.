import type { Caption } from "@remotion/captions";
import type { AssetKey } from "./assets";
export type SceneSpec = {
  id: string;
  label: string;
  kind:
    | "hook"
    | "brain"
    | "attention"
    | "mood"
    | "appetite"
    | "health"
    | "rest"
    | "closing";
  start: number;
  end: number;
  headline: string[];
  callouts: string[];
  accent: "coral" | "gold" | "teal";
  theme: "light" | "dark";
  assets: Record<string, AssetKey>;
  narration: {
    text: string;
    locale: string;
    src: string | null;
    offsetSeconds?: number;
    startSeconds?: number;
    durationSeconds?: number;
    status: string;
  };
  captionTiming: string;
  captions: Caption[];
};
export type StoryScript = {
  title: string;
  shortTitle: string;
  fps: number;
  durationSeconds: number;
  scenes: SceneSpec[];
};
export type SceneProps = { scene: SceneSpec; time: number };
export type NarrationClip = {
  sceneId: string;
  text: string;
  src: string;
  offsetSeconds: number;
  durationSeconds: number;
  audioDurationSeconds: number;
  sha256: string;
  captionTiming: string;
  captions: Caption[];
};
export type NarrationManifest = {
  schemaVersion: number;
  status: "pending" | "partial" | "generated";
  mode: "prueba" | "episodio";
  leadInSeconds: number;
  tailSeconds: number;
  clips: NarrationClip[];
};
export type PrimerVideoProps = {
  startAtSeconds: number;
  narrationManifest?: string | null;
  narrationTiming?: "extend" | "audio";
  voiceTest?: boolean;
  resolvedScript?: StoryScript;
};
