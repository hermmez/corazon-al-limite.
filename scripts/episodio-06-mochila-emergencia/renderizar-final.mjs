import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {spawn, execFileSync} from "node:child_process";
import {compositionId, fingerprint, output as out, prepareBundle, target} from "./bundle.mjs";
import {openBrowser, renderFrames, selectComposition} from "@remotion/renderer";

// Final export with the approved Grady narration and measured caption timing.
// AAC is calibrated before capture and copied without a second audio encoding.
// PNG sin pérdida -> pipe -> una sola codificación H.264; no almacena 2100 PNG.
const count = 2100;
assert.ok(Number.isInteger(count) && count > 0 && count <= 2100);
const ffmpeg = process.env.FFMPEG_PATH;
assert.ok(ffmpeg && fs.existsSync(ffmpeg), "Configurar FFMPEG_PATH con un FFmpeg funcional");
const ffprobe = path.join(path.dirname(ffmpeg), process.platform === "win32" ? "ffprobe.exe" : "ffprobe");
assert.ok(fs.existsSync(ffprobe), "Falta FFprobe junto a FFmpeg");
execFileSync(ffmpeg, ["-version"], {windowsHide: true});
const audio = path.resolve("output/episodio-06-emergencia/narracion_grady_192k.m4a");
assert.ok(fs.existsSync(audio));
const calibration = JSON.parse(fs.readFileSync(path.join(out, "aac-calibracion.json"), "utf8"));
assert.ok(calibration.measuredBitrate >= 188000 && calibration.measuredBitrate <= 196000);
assert.ok(!fs.existsSync(target), "El render final existente se conserva; revisar antes de reemplazar");
fs.mkdirSync(path.dirname(target), {recursive: true});
const workingFile = path.join(out, "revision-interna/episodio06-en-proceso.mp4");
assert.ok(!fs.existsSync(workingFile), "Revisar el archivo de una exportación interrumpida");
const volume = fs.statfsSync(path.dirname(target));
assert.ok(volume.bavail*volume.bsize >= 135_000_000, "Hace falta espacio libre para el navegador y el MP4");
const {serveUrl,close} = await prepareBundle();
const browser = await openBrowser("chrome");
let child;
try {
  const composition = await selectComposition({serveUrl, id: compositionId, browserInstance: browser, inputProps: {externalAudio: true}});
  assert.equal(composition.props.externalAudio, true);
  assert.deepEqual([composition.width, composition.height, composition.fps, composition.durationInFrames], [1080, 1920, 30, 2100]);
  child = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-vcodec", "png", "-framerate", "30", "-i", "pipe:0", "-i", audio, "-map", "0:v:0", "-map", "1:a:0", "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p", "-c:v", "libx264", "-profile:v", "high", "-preset", "medium", "-crf", "18", "-threads", "2", "-r", "30", "-frames:v", String(count), "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-c:a", "copy", "-t", "70", "-movflags", "+faststart", "-map_metadata", "-1", workingFile], {windowsHide: true, stdio: ["pipe", "ignore", "pipe"]});
  let errors = "";
  child.stdin.on("error", () => {});
  child.stderr.on("data", (data) => { errors = (errors + data).slice(-10000); });
  const exited = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg ${code}: ${errors}`)));
  });
  // Evitar un rechazo sin consumidor durante la captura si el codificador falla.
  exited.catch(() => {});
  let written = 0;
  const started = Date.now();
  await renderFrames({serveUrl, composition, puppeteerInstance: browser, concurrency: 1, imageFormat: "png", outputDir: null, inputProps: {externalAudio: true}, frameRange: [0, count - 1], muted: true, disableSharedMemoryCapture: true,
    onFrameBuffer: async (buffer, frame) => {
      assert.equal(frame, written, "Los fotogramas deben entrar al codificador en orden");
      await new Promise((resolve, reject) => child.stdin.write(buffer, (error) => error ? reject(new Error(`${error.message}; FFmpeg: ${errors}`)) : resolve()));
      written++;
    },
    onFrameUpdate: (frames) => { if (frames % 120 === 0 || frames === count) console.log(`Captura ${frames}/${count} · ${((Date.now() - started) / 1000).toFixed(1)} s`); },
  });
  assert.equal(written, count);
  child.stdin.end();
  await exited;
  const probe = JSON.parse(execFileSync(ffprobe, ["-v", "error", "-show_streams", "-show_format", "-of", "json", workingFile], {encoding: "utf8", windowsHide: true}));
  const video = probe.streams.find((s) => s.codec_type === "video");
  assert.deepEqual([video.width, video.height, video.r_frame_rate, video.nb_frames, video.pix_fmt, video.profile], [1080, 1920, "30/1", String(count), "yuv420p", "High"]);
  assert.equal(Number(probe.format.duration), count / 30);
  const timestamps = JSON.parse(execFileSync(ffprobe, ["-v", "error", "-select_streams", "v:0", "-show_frames", "-show_entries", "frame=best_effort_timestamp_time", "-of", "json", workingFile], {encoding: "utf8", windowsHide: true, maxBuffer: 4 * 1024 * 1024})).frames;
  assert.equal(timestamps.length, count);
  assert.ok(timestamps.every((f, i) => Math.abs(Number(f.best_effort_timestamp_time) - i / 30) < 0.00001), "Los tiempos de presentación deben conservar 30 FPS constantes");
  assert.equal(video.color_space, "bt709");
  const sound = probe.streams.filter((s) => s.codec_type === "audio");
  assert.equal(sound.length, 1);
  assert.equal(sound[0].codec_name, "aac");
  assert.equal(sound[0].sample_rate, "48000");
  assert.ok(Math.abs(Number(sound[0].duration) - 70) < 0.001);
  assert.ok(Number(sound[0].bit_rate) >= 180000 && Number(sound[0].bit_rate) <= 200000);
  execFileSync(ffmpeg, ["-v", "error", "-xerror", "-i", workingFile, "-f", "null", "-"], {windowsHide: true});
  const bytes = fs.readFileSync(workingFile);
  const atoms = [];
  for (let offset = 0; offset + 8 <= bytes.length;) {
    const small = bytes.readUInt32BE(offset);
    const size = small === 1 ? Number(bytes.readBigUInt64BE(offset + 8)) : small === 0 ? bytes.length - offset : small;
    assert.ok(size >= 8);
    atoms.push({type: bytes.toString("ascii", offset + 4, offset + 8), offset, size});
    offset += size;
  }
  const faststart = atoms.find((a) => a.type === "moov").offset < atoms.find((a) => a.type === "mdat").offset;
  assert.ok(faststart);
  fs.renameSync(workingFile, target);
  const report = {status: "passed-final-grady", file: path.basename(target), width: video.width, height: video.height, fps: video.r_frame_rate, frames: Number(video.nb_frames), duration: Number(probe.format.duration), codec: video.codec_name, profile: video.profile, pixelFormat: video.pix_fmt, colorSpace: video.color_space, faststart, fullDecode: true, frameTimestampsChecked: timestamps.length, constantFpsVerified: true, audioTracks: 1, audioCodec: sound[0].codec_name, audioSampleRate: Number(sound[0].sample_rate), audioBitrate: Number(sound[0].bit_rate), audioBitrateTarget: 192000, audioEncoderBitrate: calibration.encoderBitrate, audioDuration: Number(sound[0].duration), voice: "Grady", provider: "Higgsfield", model: "elevenlabs_v4", voiceId: "e2a2d2e6-9ed2-59cd-82af-feaa27f8a678", voiceApproved: true, captionsAligned: true, captionTimingSource: "measured Spanish acoustic alignment mapped through pause edits and pitch-preserving tempo", narrationTempo: 1.0883829450161997, paidGenerations: 1, authorizedCredits: 5.75, pngPipeSingleEncode: true, sourceFingerprint: fingerprint(), sha256: createHash("sha256").update(bytes).digest("hex")};
  fs.writeFileSync(path.join(out, "render-verificado.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report));
} finally {
  close();
  child?.stdin?.destroy();
  if (child && child.exitCode === null) child.kill();
  await Promise.race([browser.close({silent: true}), new Promise((resolve) => setTimeout(resolve, 5000))]);
}
process.exit(0);
