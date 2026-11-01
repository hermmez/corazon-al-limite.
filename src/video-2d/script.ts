import { ASSETS } from "./assets";
import type { StoryScript } from "./types";
export const loadStoryScript = (input: unknown): StoryScript => {
  const script = input as StoryScript;
  if (
    !script ||
    !Array.isArray(script.scenes) ||
    !Number.isFinite(script.durationSeconds) ||
    script.durationSeconds <= 0
  )
    throw new Error("Guion inválido");
  let previous = 0;
  for (const scene of script.scenes) {
    if (
      !["hook", "brain", "attention", "mood", "appetite", "health", "rest", "closing"].includes(scene.kind)
    )
      throw new Error(`Tipo de escena inválido: ${scene.id}`);
    if (
      !Array.isArray(scene.callouts) ||
      scene.callouts.some((text) => typeof text !== "string")
    )
      throw new Error(`Rótulos inválidos: ${scene.id}`);
    if (
      scene.narration.offsetSeconds !== undefined &&
      (!Number.isFinite(scene.narration.offsetSeconds) ||
        scene.narration.offsetSeconds < 0)
    )
      throw new Error(`Punto de entrada de voz inválido: ${scene.id}`);

    if (
      !scene.id ||
      !Array.isArray(scene.headline) ||
      scene.start !== previous ||
      scene.end <= scene.start
    )
      throw new Error(`Tiempos o título inválidos: ${scene.id}`);
    if (
      !["light", "dark"].includes(scene.theme) ||
      !["coral", "gold", "teal"].includes(scene.accent)
    )
      throw new Error(`Tema inválido: ${scene.id}`);
    for (const asset of Object.values(scene.assets))
      if (!(asset in ASSETS))
        throw new Error(`Ilustración inexistente: ${asset}`);
    let captionEnd = 0;
    for (const caption of scene.captions) {
      if (
        typeof caption.text !== "string" ||
        caption.startMs < captionEnd ||
        caption.endMs <= caption.startMs ||
        caption.endMs > (scene.end - scene.start) * 1000
      )
        throw new Error(`Subtítulo fuera de tiempo: ${scene.id}`);
      captionEnd = caption.endMs;
    }
    if (
      scene.captions
        .map((c) => c.text)
        .join("")
        .trim() !== scene.narration.text
    )
      throw new Error(
        `El texto de subtítulos no coincide con la narración: ${scene.id}`,
      );
    previous = scene.end;
  }
  if (previous !== script.durationSeconds)
    throw new Error("La duración del guion no coincide con su última escena");
  return script;
};
