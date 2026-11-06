import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {createServer} from "node:http";
import {bundle} from "@remotion/bundler";

export const output = path.resolve("output/episodio-06-emergencia");
export const compositionId = "Episodio06MochilaEmergencia";
export const target = path.resolve("../../outputs/episodio06_FINAL_GRADY_70s.mp4");
const sourceDir = "src/episodios/episodio-06-mochila-emergencia";
const illustrationDir = "episodio-06/ilustraciones";
const manifest = path.join("public", illustrationDir, "manifest.json");
const sourceFiles = ["src/Root.tsx", "src/episodios/episodio-04-sin-dormir/visuals.tsx", "src/episodios/episodio-05-emergencia-nuclear/visuals.tsx", manifest,
  ...fs.readdirSync(sourceDir).filter(f=>/\.(ts|tsx|json)$/.test(f) && !["RECURSOS_PLAN.json","production.json"].includes(f)).map(f=>path.join(sourceDir,f))];
const previous = ["imagenes/escenarios/02_cocina.png", ...["01_neutral.png","04_pensando.png","12_preocupado.png"].map(f=>"imagenes/personajes/"+f),
  "episodio-04/ilustraciones/automovil-teal-vista-trasera.png", ...["ciudad-avenida.png","edificio-concreto.png","provisiones-selladas.png","radio-emergencia.png"].map(f=>"episodio-05/ilustraciones/"+f)];

export const fingerprint = () => {
  const hash = createHash("sha256");
  for (const file of sourceFiles) hash.update(file).update(fs.readFileSync(file));
  return hash.digest("hex");
};

export const prepareBundle = async () => {
  const directory=path.join(output,"revision-interna/bundle");
  const emptyPublic=path.join(output,"revision-interna/empty-public");
  const stamp=path.join(directory,"fingerprint.json");
  const current=fingerprint();
  if(!fs.existsSync(path.join(directory,"index.html")) || !fs.existsSync(stamp) || JSON.parse(fs.readFileSync(stamp,"utf8")).fingerprint!==current) {
    fs.mkdirSync(emptyPublic,{recursive:true});
    await bundle({entryPoint:path.resolve("src/index.ts"),outDir:directory,publicDir:emptyPublic,enableCaching:false});
    fs.writeFileSync(stamp,JSON.stringify({fingerprint:current})+"\n");
  }
  const data=JSON.parse(fs.readFileSync(manifest,"utf8"));
  const images=data.assets.map(({file})=>`${illustrationDir}/${file}`.replaceAll("\\","/"));
  const media=new Set([...previous,...images]);
  // The local renderer reads the approved source files directly. This avoids a
  // second disk copy of every illustration on the Windows production machine.
  const types={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".json":"application/json",".wasm":"application/wasm",".woff2":"font/woff2"};
  const server=createServer((request,response)=>{
    let name;
    try { name=decodeURIComponent(new URL(request.url,"http://127.0.0.1").pathname).slice(1); }
    catch { response.writeHead(400).end(); return; }
    let file;
    if(name.startsWith("public/")) {
      const relative=name.slice(7);
      if(media.has(relative)) file=path.resolve("public",relative);
    } else {
      const candidate=path.resolve(directory,name||"index.html");
      if(candidate.startsWith(directory+path.sep)) file=candidate;
    }
    const info=file ? fs.statSync(file,{throwIfNoEntry:false}) : null;
    if(!info?.isFile()) { response.writeHead(404).end(); return; }
    response.writeHead(200,{"content-type":types[path.extname(file)]??"application/octet-stream","content-length":info.size});
    if(request.method==="HEAD") {response.end(); return;}
    const stream=fs.createReadStream(file);
    stream.on("error",()=>response.destroy());
    stream.pipe(response);
  });
  await new Promise((resolve,reject)=>{server.once("error",reject);server.listen(0,"127.0.0.1",resolve);});
  const address=server.address();
  assert.ok(address && typeof address==="object");
  return {serveUrl:`http://127.0.0.1:${address.port}`,close:()=>server.close()};
};
