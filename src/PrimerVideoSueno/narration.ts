import { staticFile, type CalculateMetadataFunction } from "remotion";
import scriptJson from "./script.json";
import { loadStoryScript } from "../video-2d/script";
import { syncNarrationScript } from "../video-2d/narration";
import type { NarrationManifest, PrimerVideoProps } from "../video-2d/types";

export const calculateSuenoMetadata: CalculateMetadataFunction<PrimerVideoProps> = async ({ props, abortSignal }) => {
  const base = loadStoryScript(scriptJson);
  const source = props.narrationManifest;
  let resolvedScript = base;
  if (source) {
    if (!/^voz\/[a-zA-Z0-9_/-]+\/manifest\.json$/.test(source) || source.split("/").includes(".."))
      throw new Error("Selecciona un manifiesto dentro de public/voz");
    const response = await fetch(staticFile(source), { signal: abortSignal });
    if (!response.ok) throw new Error("Falta el manifiesto de voz. Descarga y extrae el artefacto de Actions en el proyecto.");
    resolvedScript = syncNarrationScript(base, await response.json() as NarrationManifest, {
      timing: props.narrationTiming ?? "extend", voiceTest: props.voiceTest,
    });
  }
  return {
    durationInFrames: Math.round(resolvedScript.durationSeconds * base.fps),
    props: { ...props, resolvedScript },
  };
};
