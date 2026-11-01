import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { VoiceError } from "./catalogo.mjs";

export const sha256 = (data) => createHash("sha256").update(data).digest("hex");
export const assertAudioTools = () => {
  for (const tool of ["ffprobe", "ffmpeg"])
    try { execFileSync(tool, ["-version"], { stdio: "ignore" }); }
    catch { throw new VoiceError(`Instala ${tool} antes de generar voz. No se realizó ninguna síntesis.`); }
};
export const probeAudio = async (file) => {
  let data;
  try {
    data = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", file], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
    execFileSync("ffmpeg", ["-v", "error", "-xerror", "-i", file, "-f", "null", "-"], { stdio: ["ignore", "pipe", "pipe"] });
  } catch { throw new VoiceError("El MP3 no pasa la decodificación. Se conserva el archivo y no se reintenta la síntesis."); }
  const durationSeconds = Number(data.format.duration);
  if (data.streams.length !== 1 || data.streams[0].codec_name !== "mp3" || !Number.isFinite(durationSeconds) || durationSeconds <= 0)
    throw new VoiceError("El archivo recibido no es un MP3 con duración válida.");
  const buffer = await fs.readFile(file);
  return { durationSeconds, bytes: buffer.length, sha256: sha256(buffer), sampleRate: Number(data.streams[0].sample_rate), channels: data.streams[0].channels };
};
