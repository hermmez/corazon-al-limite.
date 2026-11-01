import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { VoiceError, clientFromEnvironment, fetchCatalog, isMexicanMale, readJson, reportError, safeApiDiagnostic, writeJson } from "./voz/catalogo.mjs";
import { alignmentToCaptions, splitAlignedScenes } from "./voz/alineacion.mjs";
import { assertAudioTools, probeAudio, sha256 } from "./voz/audio.mjs";

const exists = async (file) => { try { await fs.access(file); return true; } catch { return false; } };
export const requestFingerprint = (config, text, context = {}) => sha256(JSON.stringify({
  voiceId: config.voiceId, modelId: config.modelId, outputFormat: config.outputFormat,
  voiceSettings: config.voiceSettings, text, ...context,
}));

export const generateNarration = async ({ mode = "prueba", confirmFull = false, configPath = "config/elevenlabs.json", voiceId } = {}) => {
  const config = await readJson(configPath);
  config.voiceId = voiceId || config.voiceId;
  if (!["prueba", "episodio"].includes(mode)) throw new VoiceError("Modo inválido: usa prueba o episodio.");
  if (!config.voiceId || !/^[a-zA-Z0-9_-]{10,100}$/.test(config.voiceId))
    throw new VoiceError("Selecciona un voiceId real en config/elevenlabs.json después de consultar las voces.");
  if (config.locale !== "es-MX" || !config.outputFormat.startsWith("mp3_"))
    throw new VoiceError("La configuración debe usar es-MX y salida MP3.");
  const script = await readJson(config.script);
  const testScenes = config.testSceneIds.map((id) => {
    const scene = script.scenes.find((s) => s.id === id);
    if (!scene) throw new VoiceError(`No existe la escena de prueba ${id}.`);
    return scene;
  });
  const testText = testScenes.map((s) => s.narration.text).join(" ");
  if (testText.length > config.testMaxCharacters || testText.length > 300)
    throw new VoiceError("La prueba supera 300 caracteres; reduce el texto antes de consumir créditos.");
  if (mode === "episodio") {
    if (!confirmFull) throw new VoiceError("El episodio completo requiere --confirm-full. Ejecuta y revisa primero la prueba breve.");
    const proof = await readJson("public/voz/prueba/manifest.json").catch(() => null);
    if (proof?.status !== "generated" || proof?.testFingerprint !== requestFingerprint(config, testText) ||
        proof.clips?.length !== testScenes.length || proof.clips.some((c, i) => c.text !== testScenes[i].narration.text))
      throw new VoiceError("Falta una prueba real validada con esta voz, modelo y ajustes. Genera primero la muestra.");
    for (const clip of proof.clips) {
      const audio = await probeAudio(path.join("public", clip.src));
      if (audio.sha256 !== clip.sha256) throw new VoiceError("La prueba de voz cambió: no se autoriza el episodio completo.");
    }
  }
  assertAudioTools();
  const output = path.join("public", "voz", mode === "prueba" ? "prueba" : "primer-video-sueno");
  await fs.mkdir(output, { recursive: true });
  const groups = mode === "prueba" ? [testScenes] : script.scenes.map((s) => [s]);
  if (groups.flat().some((s) => !s.narration.text.trim()) || groups.flat().reduce((n, s) => n + s.narration.text.length, 0) > 10000)
    throw new VoiceError("Guion vacío o superior a 10000 caracteres; revisa el consumo antes de generar.");
  const manifest = {
    schemaVersion: 1, status: "partial", mode, locale: config.locale,
    voiceId: config.voiceId, voiceName: config.voiceName, modelId: config.modelId,
    voiceSettings: config.voiceSettings, outputFormat: config.outputFormat,
    leadInSeconds: config.leadInSeconds, tailSeconds: config.tailSeconds,
    testFingerprint: requestFingerprint(config, testText),
    generatedAt: new Date().toISOString(),
    clips: [],
  };
  let client, catalog, resolvedVoiceId = config.voiceId, paidRequests = 0, cacheHits = 0;
  for (let i = 0; i < groups.length; i++) {
    const scenes = groups[i], text = scenes.map((s) => s.narration.text).join(" ");
    const context = mode === "episodio" ? {
      previousText: script.scenes[i - 1]?.narration.text,
      nextText: script.scenes[i + 1]?.narration.text,
    } : {};
    const fingerprint = requestFingerprint(config, text, context);
    const stem = path.join(output, `narracion-${fingerprint.slice(0, 20)}`);
    const mp3 = stem + ".mp3", alignmentFile = stem + ".alignment.json";
    let alignment;
    if (await exists(mp3)) {
      if (!await exists(alignmentFile)) throw new VoiceError("Existe un MP3 sin alineación; se conserva y se evita repetir una petición de pago.");
      const saved = await readJson(alignmentFile);
      if (saved.fingerprint !== fingerprint) throw new VoiceError("La caché no corresponde al guion y ajustes actuales.");
      if (saved.audioSha256 !== sha256(await fs.readFile(mp3)))
        throw new VoiceError("El audio de la caché cambió; no se regenerará automáticamente.");
      alignment = saved.alignment;
      cacheHits++;
    } else {
      if (!client) {
        client = clientFromEnvironment();
        catalog = await fetchCatalog(client);
        await writeJson("out/elevenlabs-voces.json", catalog);
        const selected = catalog.voices.find((v) => v.voiceId === config.voiceId);
        if (!selected || !isMexicanMale(selected))
          throw new VoiceError("La voz elegida no está disponible con metadatos masculinos de México. Consulta voces y selecciona otra; no se usará una alternativa automática.");
        manifest.voiceName = selected.name;
        manifest.voiceEvidence = { gender: selected.gender, language: selected.language, locale: selected.locale, accent: selected.accent };
        if (!selected.addedToAccount) {
          console.log("Preparando acceso a la voz de biblioteca; todavía no se solicita síntesis.");
          try {
            const added = await client.voices.share(selected.publicOwnerId, selected.voiceId, { newName: selected.name }, { maxRetries: 0 });
            resolvedVoiceId = added.voiceId;
          } catch (error) {
            await writeJson(`out/elevenlabs-${mode}-error.json`, { status: "blocked", stage: "library_voice_access", ...safeApiDiagnostic(error), generatedAudio: false });
            throw error;
          }
        }
        manifest.resolvedVoiceId = resolvedVoiceId;
      }
      console.log(`Solicitando síntesis de ${text.length} caracteres; sin reintentos automáticos.`);
      let response;
      try { response = await client.textToSpeech.convertWithTimestamps(resolvedVoiceId, {
        text, modelId: config.modelId, outputFormat: config.outputFormat,
        voiceSettings: config.voiceSettings,
        ...(config.modelId === "eleven_multilingual_v2" ? {} : { languageCode: "es" }),
        ...context,
      }, { maxRetries: 0, timeoutInSeconds: 180 }); }
      catch (error) {
        await writeJson(`out/elevenlabs-${mode}-error.json`, { status: "blocked", stage: "text_to_speech", ...safeApiDiagnostic(error), generatedAudio: false });
        throw error;
      }
      paidRequests++;
      if (!response.audioBase64) throw new VoiceError("ElevenLabs no devolvió audio. No se reintenta automáticamente.");
      // Save the paid result BEFORE validating alignment, so failures never cause
      // an automatic second synthesis or overwrite an existing recording.
      const bytes = Buffer.from(response.audioBase64, "base64");
      await fs.writeFile(mp3, bytes, { flag: "wx" });
      alignment = response.alignment;
      await writeJson(alignmentFile, { fingerprint, audioSha256: sha256(bytes), alignment, normalizedAlignment: response.normalizedAlignment });
    }
    const audio = await probeAudio(mp3);
    const captions = alignmentToCaptions(text, alignment);
    const src = path.relative("public", mp3).split(path.sep).join("/");
    manifest.clips.push(...splitAlignedScenes(scenes, captions, { ...audio, src }));
    await writeJson(path.join(output, "manifest.json"), manifest);
  }
  manifest.status = "generated";
  await writeJson(path.join(output, "manifest.json"), manifest);
  await writeJson(path.join(output, "voice-config.json"), { ...config, voiceId: manifest.resolvedVoiceId ?? config.voiceId });
  const files = [...new Set(manifest.clips.map((c) => c.src))];
  const report = {
    status: "generated_and_decoded", mode, voiceId: manifest.voiceId, voiceName: manifest.voiceName,
    modelId: config.modelId, paidRequests, cacheHits,
    files, totalAudioSeconds: manifest.clips.reduce((n, c) => n + c.durationSeconds, 0),
    captions: "elevenlabs_character_alignment", manifest: path.join(output, "manifest.json"),
  };
  await writeJson(`out/elevenlabs-${mode}-resultado.json`, report);
  console.log(JSON.stringify(report, null, 2));
  return report;
};

if (process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href) {
  try {
    const { values } = parseArgs({ options: {
      mode: { type: "string", default: "prueba" },
      config: { type: "string", default: "config/elevenlabs.json" },
      "voice-id": { type: "string" },
      "confirm-full": { type: "boolean", default: false },
    }});
    await generateNarration({ mode: values.mode, configPath: values.config, voiceId: values["voice-id"] || process.env.ELEVENLABS_VOICE_ID, confirmFull: values["confirm-full"] });
  } catch (error) { reportError(error); }
}
