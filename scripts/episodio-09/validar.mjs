import assert from 'node:assert/strict';
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const base='dfd156762fae47a61374c4c6b138f85bdd2ef542';
const originals=execFileSync('git',['ls-tree','-r','--name-only',base],{encoding:'utf8'}).trim().split('\n');
let preserved=0;
for(const path of originals){
 if(['package.json','src/Root.tsx'].includes(path))continue;
 assert(existsSync(path),`Archivo original eliminado: ${path}`);
 const original=execFileSync('git',['show',`${base}:${path}`],{maxBuffer:30*1024*1024});
 assert(readFileSync(path).equals(original),`Archivo original modificado: ${path}`);preserved++;
}
const root=readFileSync('src/Root.tsx','utf8');
const originalRoot=execFileSync('git',['show',`${base}:src/Root.tsx`],{encoding:'utf8'});
assert.equal(root.replace('import { Episode09Registrations } from "./episodio09/Registrations";\n','').replace('      <Episode09Registrations />\n',''),originalRoot,'La composición anterior debe quedar idéntica.');
const script=JSON.parse(readFileSync('docs/episodio-09/narracion.json','utf8'));
const captions=JSON.parse(readFileSync('src/episodio09/captions.json','utf8'));
const normalize=s=>s.toLowerCase().replace(/\s+/g,' ').trim();
assert.equal(normalize(captions.map(c=>c.text).join(' ')),normalize(script.scenes.map(s=>s.text).join(' ')));
let last=0;
for(const c of captions){
 assert(c.startMs>=last&&c.endMs>c.startMs&&c.endMs<=70000);
 assert(c.text.split('\n').length<=2&&c.text.split('\n').every(l=>l.length<=43));
 const s=script.scenes[c.scene-1];assert(c.startMs>=s.start*1000&&c.endMs<=s.end*1000);last=c.endMs;
}
const art=JSON.parse(readFileSync('docs/episodio-09/recursos.json','utf8'));
for(const a of art.files){assert(existsSync(a.path));assert.equal(createHash('sha256').update(readFileSync(a.path)).digest('hex'),a.sha256);}
const report={originalCommit:base,originalFilesPreserved:preserved,previousCompositionUnchanged:true,sceneCount:script.scenes.length,frames:2100,fps:30,durationSeconds:70,captionCount:captions.length,captionTextMatchesOfficialScript:true,captionLinesMaximum:2,newAssetsVerified:art.files.length,audio:JSON.parse(readFileSync('src/episodio09/audio-manifest.json','utf8'))};
writeFileSync('docs/episodio-09/validacion.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
