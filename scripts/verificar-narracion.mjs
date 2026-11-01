import path from "node:path";
import { parseArgs } from "node:util";
import { readJson, reportError, VoiceError, writeJson } from "./voz/catalogo.mjs";
import { assertAudioTools, probeAudio } from "./voz/audio.mjs";

try {
  const { values } = parseArgs({ options: { mode: { type: "string", default: "prueba" } } });
  if (!["prueba", "episodio"].includes(values.mode)) throw new VoiceError("Modo de verificación inválido.");
  const config = await readJson("config/elevenlabs.json");
  const script = await readJson(config.script);
  const file = `public/voz/${values.mode === "prueba" ? "prueba" : "primer-video-sueno"}/manifest.json`;
  const manifest = await readJson(file);
  const expectedIds = values.mode === "prueba" ? config.testSceneIds : script.scenes.map((s) => s.id);
  if (manifest.status !== "generated" || manifest.mode !== values.mode || manifest.locale !== "es-MX" ||
      manifest.clips.length !== expectedIds.length || manifest.clips.some((c, i) => c.sceneId !== expectedIds[i]))
    throw new VoiceError("Falta una generación real y completa para el modo solicitado.");
  assertAudioTools();
  const measured = new Map();
  for (const clip of manifest.clips) {
    if (!/^voz\/[a-zA-Z0-9_./-]+\.mp3$/.test(clip.src) || clip.src.split("/").some((p) => p === ".." || p === "."))
      throw new VoiceError("Ruta MP3 fuera de public/voz.");
    if (!measured.has(clip.src)) measured.set(clip.src, await probeAudio(path.join("public", clip.src)));
    const audio = measured.get(clip.src);
    const text = script.scenes.find((s) => s.id === clip.sceneId)?.narration.text;
    if (audio.sha256 !== clip.sha256 || Math.abs(audio.durationSeconds - clip.audioDurationSeconds) > 0.001 ||
        clip.offsetSeconds < 0 || clip.durationSeconds <= 0 || clip.offsetSeconds + clip.durationSeconds > audio.durationSeconds + 0.002)
      throw new VoiceError("El MP3 o sus intervalos no coinciden con el manifiesto.");
    if (clip.text !== text || clip.captions.map((c) => c.text).join("") !== text)
      throw new VoiceError("El guion y los subtítulos no coinciden con el texto generado.");
    let end = 0;
    for (const c of clip.captions) {
      if (!Number.isFinite(c.startMs) || !Number.isFinite(c.endMs) || c.startMs < end ||
          c.endMs <= c.startMs || c.endMs > clip.durationSeconds * 1000 + 1)
        throw new VoiceError("Subtítulos fuera de la duración real del audio.");
      end = c.endMs;
    }
  }
  const report = { status: "passed", mode: values.mode, manifest: file,
    voiceId: manifest.voiceId, voiceName: manifest.voiceName,
    totalAudioSeconds: [...measured.values()].reduce((n, a) => n + a.durationSeconds, 0),
    clips: manifest.clips.length,
    files: [...measured].map(([src, audio]) => ({ src, ...audio })),
    captions: "elevenlabs_character_alignment",
  };
  await writeJson(`out/elevenlabs-${values.mode}-verificacion.json`, report);
  console.log(JSON.stringify(report, null, 2));
} catch (error) { reportError(error); }
