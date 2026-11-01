import fs from "node:fs";
const file = "src/PrimerVideoSueno/script.json";
const script = JSON.parse(fs.readFileSync(file, "utf8"));
let updated = 0;
for (const scene of script.scenes) {
  if (scene.narration.src) continue; // Preserve timing associated with real recordings.
  const words = scene.narration.text.trim().split(/\s+/);
  const weights = words.map(
    (w) =>
      Math.max(3, w.replace(/[¿?.,]/g, "").length) + (/[.,?]$/.test(w) ? 2 : 0),
  );
  const total = weights.reduce((a, b) => a + b, 0),
    available = (scene.end - scene.start) * 1000 - 350;
  let cursor = 150;
  scene.captions = words.map((word, index) => {
    const end = cursor + (available * weights[index]) / total;
    const caption = {
      text: (index ? " " : "") + word,
      startMs: Math.round(cursor),
      endMs: Math.round(end),
      timestampMs: null,
      confidence: null,
      pageBreakAfter: (index + 1) % 5 === 0 || index === words.length - 1,
    };
    cursor = end;
    return caption;
  });
  scene.captionTiming = "estimated_from_script_not_audio";
  updated++;
}
if (process.argv.includes("--check")) {
  const original = JSON.parse(fs.readFileSync(file, "utf8"));
  for (let i = 0; i < script.scenes.length; i++) {
    const a = original.scenes[i].captions,
      b = script.scenes[i].captions;
    if (
      a.length !== b.length ||
      a.some(
        (c, j) =>
          c.text !== b[j].text ||
          Math.abs(c.startMs - b[j].startMs) > 1 ||
          Math.abs(c.endMs - b[j].endMs) > 1,
      )
    )
      throw new Error(`Regenera subtítulos de ${script.scenes[i].id}`);
  }
  console.log("Estimaciones verificadas; no se modificó el JSON.");
} else {
  fs.writeFileSync(file, JSON.stringify(script, null, 2) + "\n");
  console.log(
    `Subtítulos estimados actualizados: ${updated} escenas. No se generó audio.`,
  );
}
