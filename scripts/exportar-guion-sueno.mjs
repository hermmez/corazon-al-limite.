import fs from "node:fs";
import { createTikTokStyleCaptions } from "@remotion/captions";
const script = JSON.parse(
  fs.readFileSync("src/PrimerVideoSueno/script.json", "utf8"),
);
fs.mkdirSync("out", { recursive: true });
const stamp = (ms) => {
  ms = Math.round(ms);
  return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
};
const captions = [];
let i = 1;
for (const scene of script.scenes) {
  const { pages } = createTikTokStyleCaptions({
    captions: scene.captions,
    combineTokensWithinMilliseconds: 100000,
  });
  for (const page of pages)
    captions.push(
      `${i++}\n${stamp(scene.start * 1000 + page.startMs)} --> ${stamp(scene.start * 1000 + page.startMs + page.durationMs)}\n${page.text.trim()}\n`,
    );
}
fs.writeFileSync("out/primer-video-sueno-subtitulos.srt", captions.join("\n"));
fs.writeFileSync(
  "out/primer-video-sueno-guion-es-MX.txt",
  `${script.title}\nEspañol mexicano (es-MX) · Voz pendiente · Tiempos de subtítulos estimados, sin transcripción de audio.\n\n` +
    script.scenes
      .map((s) => `${s.start}–${s.end} s · ${s.label}\n${s.narration.text}`)
      .join("\n\n") +
    "\n",
);
console.log("Guion y SRT exportados. No se generó audio.");
