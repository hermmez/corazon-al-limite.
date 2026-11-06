import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
import {bundle} from "@remotion/bundler";
export const output = path.resolve("output/episodio-05-nuclear");
export const compositionId = "Episodio05EmergenciaNuclear";
const files = ["src/Root.tsx", ...["index.tsx", "visuals.tsx", "scenes.tsx", "Subtitulos.tsx", "timeline.json", "captions.json"].map(file => "src/episodios/episodio-05-emergencia-nuclear/" + file), "public/episodio-05/ilustraciones/manifest.json"];
export const fingerprint = () => {
  const hash = createHash("sha256");
  for (const file of files) hash.update(file).update(fs.readFileSync(file));
  return hash.digest("hex");
};
export const prepareBundle = async () => {
  const directory = path.join(output, "revision-interna/bundle");
  const stamp = path.join(output, "revision-interna/bundle-fingerprint.json");
  const current = fingerprint();
  if (fs.existsSync(path.join(directory, "index.html")) && fs.existsSync(stamp) && JSON.parse(fs.readFileSync(stamp, "utf8")).fingerprint === current) return directory;
  const result = await bundle({entryPoint: path.resolve("src/index.ts"), outDir: directory, publicDir: path.join(output, "revision-interna/public"), enableCaching: false});
  fs.writeFileSync(stamp, JSON.stringify({fingerprint: current}) + "\n");
  return result;
};
