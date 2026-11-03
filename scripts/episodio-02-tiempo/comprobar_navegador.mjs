import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import assert from "node:assert/strict";
import { openBrowser } from "@remotion/renderer";

const out = "output/episodio-02-tiempo";
const videoFile = "episodio_02_tiempo_70s.mp4";
assert.ok(fs.existsSync(path.join(out, videoFile)), "Falta el MP4 final.");
const sha256 = createHash("sha256")
  .update(fs.readFileSync(path.join(out, videoFile)))
  .digest("hex");
const files = {
  "/": "reproducir.html",
  [`/${videoFile}`]: videoFile,
  "/miniatura_vertical.jpg": "miniatura_vertical.jpg",
};
const server = createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }
  const name = files[req.url];
  if (!name) {
    res.writeHead(404);
    res.end();
    return;
  }
  const file = path.resolve(out, name);
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  const size = fs.statSync(file).size;
  const type = name.endsWith("mp4")
    ? "video/mp4"
    : name.endsWith("jpg")
      ? "image/jpeg"
      : "text/html; charset=utf-8";
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const start = range ? Number(range[1]) : 0;
  const end =
    range && range[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
  if (start > end || start >= size) {
    res.writeHead(416, { "Content-Range": `bytes */${size}` });
    res.end();
    return;
  }
  res.writeHead(range ? 206 : 200, {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    ...(range ? { "Content-Range": `bytes ${start}-${end}/${size}` } : {}),
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  fs.createReadStream(file, { start, end }).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const browser = await openBrowser("chrome", {
  browserExecutable: fs.existsSync("/usr/bin/chromium")
    ? "/usr/bin/chromium"
    : undefined,
  logLevel: "error",
});
try {
  const page = await browser.newPage({
    context: () => null,
    logLevel: "error",
    indent: false,
    pageIndex: 0,
    onBrowserLog: null,
    onLog: () => {},
  });
  await page.goto({ url: `http://127.0.0.1:${address.port}/`, timeout: 20000 });
  const result = await page.evaluate(async () => {
    const video = document.querySelector("video");
    if (!video) throw new Error("No se encontró el reproductor.");
    video.playbackRate = 1;
    const observed = [];
    let previous = -1;
    video.addEventListener("timeupdate", () => {
      const second = Math.floor(video.currentTime);
      if (second !== previous) {
        observed.push({ second, currentTime: video.currentTime });
        previous = second;
      }
    });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Reproducción completa excedió 90 segundos.")),
        90000,
      );
      video.addEventListener(
        "error",
        () => {
          clearTimeout(timer);
          reject(new Error(video.error?.message ?? "Error multimedia"));
        },
        { once: true },
      );
      video.addEventListener(
        "ended",
        () => {
          clearTimeout(timer);
          resolve(true);
        },
        { once: true },
      );
      video.muted = true; // Autoplay test; audible presence is checked separately against AAC.
      video.play().catch(reject);
    });
    const quality = video.getVideoPlaybackQuality();
    return {
      ended: video.ended,
      duration: video.duration,
      currentTime: video.currentTime,
      width: video.videoWidth,
      height: video.videoHeight,
      totalVideoFrames: quality.totalVideoFrames,
      droppedVideoFrames: quality.droppedVideoFrames,
      audioDecodedBytes: video.webkitAudioDecodedByteCount ?? null,
      mediaError: video.error?.message ?? null,
      observedSeconds: observed,
    };
  });
  assert.equal(result.ended, true);
  assert.equal(result.duration, 70);
  assert.equal(result.width, 1080);
  assert.equal(result.height, 1920);
  assert.equal(result.mediaError, null);
  assert.ok(result.totalVideoFrames >= 2099);
  if (result.audioDecodedBytes !== null)
    assert.ok(
      result.audioDecodedBytes > 0,
      "El navegador no decodificó la pista AAC.",
    );
  const report = {
    status: "passed",
    engine: "Chromium HTML5 video",
    file: `${out}/${videoFile}`,
    sha256,
    playbackRate: 1,
    autoplayMutedForTest: true,
    note: "La prueba verifica reproducción/decodificación; la presencia y posición de la voz se verifica mediante correlación de audio separada.",
    ...result,
    validatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    `${out}/reproduccion_navegador.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      status: report.status,
      duration: result.duration,
      ended: result.ended,
      totalVideoFrames: result.totalVideoFrames,
      droppedVideoFrames: result.droppedVideoFrames,
      audioDecodedBytes: result.audioDecodedBytes,
    }),
  );
} finally {
  await browser.close({ silent: true });
  server.close();
}
