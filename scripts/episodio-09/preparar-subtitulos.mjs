// Guía temporal para animación SIN voz. No representa una alineación real.
import {readFileSync,writeFileSync} from 'node:fs';
const {scenes}=JSON.parse(readFileSync('docs/episodio-09/narracion.json','utf8'));
const captions=[];
for(const scene of scenes){
 const words=scene.text.split(/\s+/);let chunks=[];let line=[];
 for(const word of words){
  if([...line,word].join(' ').length>64||line.length>=10){chunks.push(line.join(' '));line=[];}
  line.push(word);
 }
 if(line.length)chunks.push(line.join(' '));
 const weights=chunks.map(t=>t.length);const total=weights.reduce((a,b)=>a+b,0);
 let pos=scene.start*1000+100;
 for(let i=0;i<chunks.length;i++){
  const duration=(scene.end*1000-scene.start*1000-180)*weights[i]/total;
  const all=chunks[i].split(' ');let best=1,score=Infinity;
  for(let j=1;j<all.length;j++){const a=all.slice(0,j).join(' '),b=all.slice(j).join(' ');const n=Math.max(a.length,b.length)+Math.abs(a.length-b.length)*.2;if(n<score){score=n;best=j;}}
  const text=chunks[i].length>33?all.slice(0,best).join(' ')+'\n'+all.slice(best).join(' '):chunks[i];
  captions.push({text,startMs:Math.round(pos),endMs:Math.round(pos+duration),timestampMs:null,confidence:null,scene:scene.number});pos+=duration;
 }
}
writeFileSync('src/episodio09/captions.json',JSON.stringify(captions,null,2)+'\n');
console.log(`${captions.length} subtítulos provisionales, máximo dos líneas.`);
