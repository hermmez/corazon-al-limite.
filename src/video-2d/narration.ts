import type { NarrationManifest, StoryScript } from "./types";
import { loadStoryScript } from "./script";

// No API credentials or SDK code enter the Remotion/browser bundle.
export const syncNarrationScript = (
  original: StoryScript,
  manifest: NarrationManifest,
  options: { timing?: "extend" | "audio"; voiceTest?: boolean } = {},
): StoryScript => {
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.clips) ||
      !["pending", "partial", "generated"].includes(manifest.status))
    throw new Error("Manifiesto de voz inválido");
  for (const n of [manifest.leadInSeconds, manifest.tailSeconds])
    if (!Number.isFinite(n) || n < 0 || n > 5) throw new Error("Márgenes de voz inválidos");
  const ids = new Set<string>();
  for (const clip of manifest.clips) {
    const scene = original.scenes.find((s) => s.id === clip.sceneId);
    if (!scene || ids.has(clip.sceneId) || scene.narration.text !== clip.text)
      throw new Error("La narración no corresponde al guion actual");
    ids.add(clip.sceneId);
    if (!/^voz\/[a-zA-Z0-9_./-]+\.mp3$/.test(clip.src) || clip.src.split("/").some((p) => p === ".." || p === "."))
      throw new Error("La voz debe ser un MP3 local dentro de public/voz");
    if (![clip.offsetSeconds, clip.durationSeconds, clip.audioDurationSeconds].every(Number.isFinite) ||
        clip.offsetSeconds < 0 || clip.durationSeconds <= 0 ||
        clip.offsetSeconds + clip.durationSeconds > clip.audioDurationSeconds + 0.002)
      throw new Error("Intervalo de voz inválido");
    if (!Array.isArray(clip.captions) || !clip.captions.length ||
        clip.captions.map((c) => c.text).join("").trim() !== clip.text ||
        clip.captions.some((c) => !Number.isFinite(c.startMs) || !Number.isFinite(c.endMs) || c.startMs < 0 || c.endMs > clip.durationSeconds * 1000 + 1))
      throw new Error("Subtítulos fuera del audio real");
  }
  const result: StoryScript = JSON.parse(JSON.stringify(original));
  if (options.voiceTest) {
    const count = Math.max(1, manifest.clips.length);
    if (manifest.clips.some((c, i) => c.sceneId !== original.scenes[i]?.id))
      throw new Error("La prueba requiere escenas iniciales contiguas del guion");
    result.scenes = result.scenes.slice(0, count);
  }
  const leadFrames = Math.round(manifest.leadInSeconds * original.fps);
  let cursor = 0;
  result.scenes = result.scenes.map((scene) => {
    const nominal = scene.end - scene.start;
    const clip = manifest.clips.find((c) => c.sceneId === scene.id);
    if (clip) {
      const requiredFrames = leadFrames + Math.ceil(clip.durationSeconds * original.fps) + Math.ceil(manifest.tailSeconds * original.fps);
      const durationFrames = Math.max(3 * original.fps, requiredFrames,
        options.timing === "audio" ? 0 : Math.round(nominal * original.fps));
      scene.narration = {
        ...scene.narration, src: clip.src, offsetSeconds: clip.offsetSeconds,
        durationSeconds: clip.durationSeconds, startSeconds: leadFrames / original.fps,
        status: "generated",
      };
      scene.captionTiming = clip.captionTiming;
      scene.captions = clip.captions.map((c) => ({
        ...c, startMs: c.startMs + leadFrames / original.fps * 1000,
        endMs: c.endMs + leadFrames / original.fps * 1000,
        timestampMs: c.timestampMs === null ? null : c.timestampMs + leadFrames / original.fps * 1000,
      }));
      scene.start = cursor / original.fps;
      cursor += durationFrames;
    } else {
      scene.start = cursor / original.fps;
      cursor += Math.round(nominal * original.fps);
    }
    scene.end = cursor / original.fps;
    return scene;
  });
  result.durationSeconds = cursor / original.fps;
  return loadStoryScript(result);
};
