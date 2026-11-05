import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {spawn, execFileSync} from "node:child_process";
import {bundle} from "@remotion/bundler";
import {openBrowser, renderFrames, selectComposition} from "@remotion/renderer";

// Exportación visual, sin locución: no convierte una voz provisional en oficial.
// PNG sin pérdida -> pipe -> una sola codificación H.264; no almacena 2100 PNG.
const count = Number(process.argv[2] ?? 2100);
assert.ok(Number.isInteger(count) && count > 0 && count <= 2100);
const ffmpeg = process.env.FFMPEG_PATH;
assert.ok(ffmpeg && fs.existsSync(ffmpeg), "Configurar FFMPEG_PATH con un FFmpeg funcional");
const ffprobe = path.join(path.dirname(ffmpeg), process.platform === "win32" ? "ffprobe.exe" : "ffprobe");
assert.ok(fs.existsSync(ffprobe), "Falta FFprobe junto a FFmpeg");
execFileSync(ffmpeg, ["-version"], {windowsHide: true});
const out = path.resolve("output/episodio-04-sueno");
const target = count === 2100 ? path.join(out, "episodio04_REVISION_VISUAL_SIN_VOZ.mp4") : path.join(out, "revision-interna", `prueba-${count}-frames.mp4`);
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), outDir: path.join(out, "revision-interna/bundle"), publicDir: path.join(out, "revision-interna/public"), enableCaching: false});
const browser = await openBrowser("chrome");
let child;
try {
  const composition = await selectComposition({serveUrl, id: "Episodio04SinDormir", browserInstance: browser});
  assert.deepEqual([composition.width, composition.height, composition.fps, composition.durationInFrames], [1080, 1920, 30, 2100]);
  child = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-vcodec", "png", "-framerate", "30", "-i", "pipe:0", "-an", "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p", "-c:v", "libx264", "-profile:v", "high", "-preset", "medium", "-crf", "18", "-threads", "2", "-r", "30", "-frames:v", String(count), "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-movflags", "+faststart", "-map_metadata", "-1", target], {windowsHide: true, stdio: ["pipe", "ignore", "pipe"]});
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
  await renderFrames({serveUrl, composition, puppeteerInstance: browser, concurrency: 1, imageFormat: "png", outputDir: null, inputProps: {}, frameRange: [0, count - 1], muted: true, disableSharedMemoryCapture: true,
    onFrameBuffer: async (buffer, frame) => {
      assert.equal(frame, written, "Los fotogramas deben entrar al codificador en orden");
      await new Promise((resolve, reject) => child.stdin.write(buffer, (error) => error ? reject(error) : resolve()));
      written++;
    },
    onFrameUpdate: (frames) => { if (frames % 120 === 0 || frames === count) console.log(`Captura ${frames}/${count} · ${((Date.now() - started) / 1000).toFixed(1)} s`); },
  });
  assert.equal(written, count);
  child.stdin.end();
  await exited;
  const probe = JSON.parse(execFileSync(ffprobe, ["-v", "error", "-show_streams", "-show_format", "-of", "json", target], {encoding: "utf8", windowsHide: true}));
  const video = probe.streams.find((s) => s.codec_type === "video");
  assert.deepEqual([video.width, video.height, video.r_frame_rate, video.nb_frames, video.pix_fmt, video.profile], [1080, 1920, "30/1", String(count), "yuv420p", "High"]);
  assert.equal(Number(probe.format.duration), count / 30);
  const timestamps = JSON.parse(execFileSync(ffprobe, ["-v", "error", "-select_streams", "v:0", "-show_frames", "-show_entries", "frame=best_effort_timestamp_time", "-of", "json", target], {encoding: "utf8", windowsHide: true, maxBuffer: 4 * 1024 * 1024})).frames;
  assert.equal(timestamps.length, count);
  assert.ok(timestamps.every((f, i) => Math.abs(Number(f.best_effort_timestamp_time) - i / 30) < 0.00001), "Los tiempos de presentación deben conservar 30 FPS constantes");
  assert.equal(video.color_space, "bt709");
  assert.equal(probe.streams.filter((s) => s.codec_type === "audio").length, 0);
  execFileSync(ffmpeg, ["-v", "error", "-xerror", "-i", target, "-f", "null", "-"], {windowsHide: true});
  const bytes = fs.readFileSync(target);
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
  const report = {status: "passed-visual-only", file: path.basename(target), width: video.width, height: video.height, fps: video.r_frame_rate, frames: Number(video.nb_frames), duration: Number(probe.format.duration), codec: video.codec_name, profile: video.profile, pixelFormat: video.pix_fmt, colorSpace: video.color_space, faststart, fullDecode: true, frameTimestampsChecked: timestamps.length, constantFpsVerified: true, audioTracks: 0, voiceApproved: false, captionsAligned: false, paidGenerations: 0, pngPipeSingleEncode: true, sha256: createHash("sha256").update(bytes).digest("hex")};
  fs.writeFileSync(target.replace(/\.mp4$/, ".json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report));
} finally {
  child?.stdin?.destroy();
  if (child && child.exitCode === null) child.kill();
  await Promise.race([browser.close({silent: true}), new Promise((resolve) => setTimeout(resolve, 5000))]);
}
process.exit(0);
