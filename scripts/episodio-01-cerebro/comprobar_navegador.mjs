import fs from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import assert from "node:assert/strict";
import { openBrowser } from "@remotion/renderer";

const files = {
  "/": "reproducir.html",
  "/episodio_01_cerebro_70s.mp4": "episodio_01_cerebro_70s.mp4",
  "/miniatura_vertical.jpg": "miniatura_vertical.jpg",
};
const server = createServer((req, res) => {
  const name = files[req.url];
  if (!name) {
    res.writeHead(404);
    res.end();
    return;
  }
  const file = path.resolve("output/episodio-01-cerebro", name),
    size = fs.statSync(file).size;
  const type = name.endsWith("mp4")
    ? "video/mp4"
    : name.endsWith("jpg")
      ? "image/jpeg"
      : "text/html; charset=utf-8";
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const start = range ? Number(range[1]) : 0,
    end = range && range[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
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
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Tiempo de reproducción agotado")),
        90000,
      );
      video.addEventListener(
        "error",
        () => {
          clearTimeout(timer);
          reject(new Error(video.error?.message ?? "Error de video"));
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
      video.muted = true;
      video.play().catch(reject);
    });
    const q = video.getVideoPlaybackQuality();
    return {
      ended: video.ended,
      duration: video.duration,
      currentTime: video.currentTime,
      width: video.videoWidth,
      height: video.videoHeight,
      totalVideoFrames: q.totalVideoFrames,
      droppedVideoFrames: q.droppedVideoFrames,
      audioDecodedBytes: video.webkitAudioDecodedByteCount ?? null,
      mediaError: video.error?.message ?? null,
    };
  });
  assert.equal(result.ended, true);
  assert.equal(result.duration, 70);
  assert.equal(result.width, 1080);
  assert.equal(result.height, 1920);
  assert.equal(result.mediaError, null);
  assert.ok(result.totalVideoFrames >= 2099);
  fs.writeFileSync(
    "output/episodio-01-cerebro/reproduccion_navegador.json",
    JSON.stringify(
      {
        status: "passed",
        engine: "Chromium HTML5 video",
        playbackRate: 1,
        autoplayMutedForTest: true,
        ...result,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(JSON.stringify(result));
} finally {
  await browser.close({ silent: true });
  server.close();
}
