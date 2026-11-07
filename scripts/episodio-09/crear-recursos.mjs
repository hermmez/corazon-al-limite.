// Ilustraciones vectoriales originales, por capas. Sin servicios ni créditos externos.
import {mkdirSync, writeFileSync} from 'node:fs';
const dest = 'public/episodio-09';
mkdirSync(dest, {recursive:true});
const defs = `<defs>
<linearGradient id="ceramic" x2="0" y2="1"><stop stop-color="#5a4935"/><stop offset=".18" stop-color="#f9df9a"/><stop offset=".36" stop-color="#fff1c6"/><stop offset=".61" stop-color="#c9a46d"/><stop offset=".9" stop-color="#73533d"/><stop offset="1" stop-color="#30262c"/></linearGradient>
<linearGradient id="brass" x2="0" y2="1"><stop stop-color="#3e3337"/><stop offset=".1" stop-color="#997345"/><stop offset=".23" stop-color="#fff4c6"/><stop offset=".34" stop-color="#d7b77c"/><stop offset=".57" stop-color="#ac7a41"/><stop offset=".73" stop-color="#edce90"/><stop offset="1" stop-color="#433336"/></linearGradient>
<linearGradient id="steel" x2="1" y2="1"><stop stop-color="#a9c6c7"/><stop offset=".22" stop-color="#f0f1df"/><stop offset=".4" stop-color="#647c8b"/><stop offset=".75" stop-color="#354d60"/><stop offset="1" stop-color="#142d42"/></linearGradient>
<linearGradient id="ivory" x2="1" y2="1"><stop stop-color="#fff4d0"/><stop offset=".5" stop-color="#d2c1a3"/><stop offset="1" stop-color="#7e8281"/></linearGradient>
<linearGradient id="plastic" x2="1" y2="1"><stop stop-color="#4c6571"/><stop offset=".5" stop-color="#182c3b"/><stop offset="1" stop-color="#07151f"/></linearGradient>
<linearGradient id="copper" x2="0" y2="1"><stop stop-color="#fff2c9"/><stop offset=".3" stop-color="#eeb177"/><stop offset=".6" stop-color="#9f492b"/><stop offset="1" stop-color="#582b26"/></linearGradient>
<filter id="shadow" x="-.3" y="-.3" width="1.6" height="1.6"><feDropShadow dx="6" dy="12" stdDeviation="8" flood-color="#010f1b" flood-opacity=".65"/></filter>
<pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12L12 0" stroke="#fff" opacity=".07"/></pattern>
<pattern id="grain" width="37" height="29" patternUnits="userSpaceOnUse"><path d="M4 9h3m14 12h2m8-16h2m-18 2h1" stroke="#ffe4a3" stroke-width="2" opacity=".2"/></pattern>
</defs>`;
const save=(name,w,h,body)=>writeFileSync(`${dest}/${name}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${body}</svg>`);
const screw=(x,y,r=13)=>`<g transform="translate(${x} ${y})"><circle r="${r}" fill="url(#steel)" stroke="#112635" stroke-width="3"/><path d="M-${r*.65} 3L${r*.65} -3" stroke="#102737" stroke-width="4"/><path d="M-${r*.6} 5L${r*.6} -1" stroke="#cde2dd" stroke-width="1"/></g>`;
const caps = `<g stroke="#32282b" stroke-width="4"><path d="M83 79Q62 80 62 112V249Q62 279 88 281L202 278V82Z" fill="url(#brass)"/><path d="M798 82V278L915 281Q940 278 940 250V110Q940 80 915 79Z" fill="url(#brass)"/></g>${[85,99,115,163,182,815,833,884,902,918].map(x=>`<path d="M${x} 89V272" stroke="#fff0b0" stroke-width="${x%2?2:4}" opacity=".22"/>`).join('')}<path d="M72 122H194M808 122H930" stroke="#fff9cf" opacity=".6" stroke-width="5"/><path d="M69 250H195M807 250H934" stroke="#4a3330" stroke-width="5" opacity=".6"/>`;
const shell=`<path d="M172 87Q500 73 831 87V273Q500 290 172 273Z" fill="url(#ceramic)" stroke="#352b29" stroke-width="4"/><path d="M186 112Q500 100 814 112" stroke="#fff8d6" stroke-width="8" opacity=".7"/><path d="M184 251Q500 265 814 251" stroke="#3c2f2a" stroke-width="7" opacity=".45"/><path d="M206 87V274M790 86V274" stroke="#86634a" stroke-width="3"/><path d="M230 95H770V269H230Z" fill="url(#grain)"/><g fill="#423933" font-family="Arial,sans-serif" text-anchor="middle"><text x="501" y="172" font-size="38" font-weight="bold" letter-spacing="5">FUSIBLE</text><text x="501" y="207" font-size="20" letter-spacing="3">DE CARTUCHO</text></g>`;
save('fusible-exterior',1000,360,`<g filter="url(#shadow)">${shell}${caps}</g>`);
save('fusible-carcasa',1000,360,shell);
save('fusible-terminales',1000,360,caps);
save('fusible-corte',1000,360,`<g filter="url(#shadow)"><path d="M172 87Q500 73 831 87V273Q500 290 172 273Z" fill="url(#ceramic)" stroke="#302c2b" stroke-width="4"/><path d="M201 130Q500 115 800 130V236Q500 247 201 236Z" fill="#1b2932" stroke="#f6d89c" stroke-width="10"/><path d="M211 140H790V226H211Z" fill="url(#grain)"/><path d="M211 228Q500 239 790 228" stroke="#ae7c48" stroke-width="4"/>${caps}<path d="M137 180H232M768 180H863" stroke="url(#copper)" stroke-width="23"/>${screw(219,180,9)}${screw(783,180,9)}</g>`);
save('elemento-metalico',1000,360,`<path d="M221 168H405L441 177H559L595 168H782V192H595L559 183H441L405 192H221Z" fill="url(#copper)" stroke="#642e23" stroke-width="2"/><path d="M231 170H405L443 178H555L595 170H772" fill="none" stroke="#fff7dc" stroke-width="2"/>`);
save('elemento-fundido',1000,360,`<path d="M221 168H405L451 177L468 180L447 188H405L391 192H221Z M779 168H595L553 176L538 180L557 188H595L610 192H779Z" fill="url(#copper)" stroke="#603a2d" stroke-width="2"/>`);
// Gabinete de interruptor de cuchillas. Ilustración conceptual, no guía de conexión.
let panel=`<g filter="url(#shadow)"><path d="M65 70L530 50L565 81V880L529 911L65 889Z" fill="url(#steel)" stroke="#0a202c" stroke-width="9"/><path d="M89 103H526V858H89Z" fill="url(#plastic)" stroke="#d2d3bb" stroke-width="4"/><path d="M105 119H510V837H105Z" fill="#2c3537"/><path d="M73 78H530M534 87V873" stroke="#d9e4d8" stroke-width="5" opacity=".6"/><path d="M61 320H30V555H61" fill="url(#steel)" stroke="#142c3e" stroke-width="5"/>`;
for(const x of [210,405]){
 panel+=`<path d="M${x} 0V148" stroke="#0c1d28" stroke-width="31"/><path d="M${x-6} 0V145" stroke="#ba8c65" stroke-width="6" opacity=".5"/><path d="M${x} 780V970" stroke="#101a22" stroke-width="32"/><path d="M${x+5} 788V970" stroke="#5c7b82" stroke-width="5"/>
 <path d="M${x-58} 160Q${x} 141 ${x+58} 160V326Q${x} 341 ${x-58} 326Z" fill="url(#ivory)" stroke="#122735" stroke-width="5"/>
 <path d="M${x-58} 605Q${x} 588 ${x+58} 605V790Q${x} 804 ${x-58} 790Z" fill="url(#ivory)" stroke="#122735" stroke-width="5"/>
 <path d="M${x-25} 181H${x+25}V284H${x-25}Z M${x-27} 634H${x+27}V775H${x-27}Z" fill="url(#brass)" stroke="#443b32" stroke-width="3"/>
 <path d="M${x-9} 280H${x+10}L${x+20} 428H${x-20}Z" fill="url(#copper)" stroke="#513523" stroke-width="3"/>
 <path d="M${x-33} 428H${x+33}V660H${x-33}Z" fill="url(#ceramic)" stroke="#3b312a" stroke-width="4"/>
 <path d="M${x-40} 419H${x+40}V459H${x-40}Z M${x-40} 627H${x+40}V671H${x-40}Z" fill="url(#brass)" stroke="#3a3130" stroke-width="3"/>
 <path d="M${x-17} 469V617" stroke="#fff0bb" stroke-width="6" opacity=".5"/>
 <text x="${x}" y="548" transform="rotate(-90 ${x} 548)" fill="#463b31" font-size="17" font-family="Arial" text-anchor="middle">FUSIBLE</text>
 ${screw(x,194)}${screw(x,749)}${screw(x-41,307,7)}${screw(x+40,770,7)}`;
}
panel+=`<path d="M192 297H426V330H192Z" fill="url(#plastic)" stroke="#0b1d2b" stroke-width="5"/><path d="M256 292L276 241H352L374 292Z" fill="url(#plastic)" stroke="#0c2332" stroke-width="5"/><path d="M275 247H351" stroke="#a2b3af" stroke-width="6"/><path d="M115 818H496" stroke="#5c6970" stroke-width="3"/>${screw(109,128,8)}${screw(500,128,8)}${screw(109,826,8)}${screw(500,826,8)}</g>`;
save('interruptor-cuchillas',600,980,panel);
// Termomagnético separado del mecanismo: la palanca se anima en Remotion.
let breaker=`<g filter="url(#shadow)"><path d="M124 91L390 59L465 125V771L401 832L118 803Z" fill="url(#ivory)" stroke="#182d3b" stroke-width="7"/><path d="M390 62L465 125V771L401 832Z" fill="#9f9e8c" stroke="#30424b" stroke-width="5"/><path d="M127 112L386 86L403 805L135 782Z" fill="#e4ddbd" stroke="#fff1d3" stroke-width="4"/><path d="M161 132H351V246H161Z M169 639H360V758H169Z" fill="url(#plastic)" stroke="#66716c" stroke-width="5"/><path d="M191 151H327V208H191Z M198 678H336V736H198Z" fill="url(#brass)"/>${screw(259,179,25)}${screw(267,709,25)}<path d="M161 291H358V570H161Z" fill="url(#plastic)" stroke="#87958c" stroke-width="5"/><path d="M185 310H335V555H185Z" fill="#0b1c2b"/><path d="M139 599H383" stroke="#8f9a8b" stroke-width="4"/>`;
for(let i=0;i<9;i++)breaker+=`<path d="M${414+i*4} ${165+i*5}V${682+i*5}" stroke="#5a6a69" stroke-width="2" opacity=".6"/>`;
breaker+=`<text x="259" y="275" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#233844">TERMOMAGNÉTICO</text><text x="261" y="626" font-family="Arial" font-size="20" fill="#45504a" text-anchor="middle">PROTECCIÓN</text></g>`;
save('termomagnetico-cuerpo',550,900,breaker);
save('termomagnetico-palanca',550,900,`<path d="M195 361L328 350L339 422L211 439Z" fill="#df5b37" stroke="#132a37" stroke-width="6"/><path d="M207 370L316 362L322 395L213 407Z" fill="#ffb36a"/><path d="M213 416L324 403" stroke="#7a302b" stroke-width="8"/>`);
// Conductor ilustrado: aislamiento seccionado, trenzas, cobre y reflejos.
save('conductor-corte',1100,350,`<g filter="url(#shadow)"><path d="M35 111Q380 55 739 109L812 150V248Q400 198 35 255Z" fill="url(#plastic)" stroke="#071b29" stroke-width="7"/><path d="M35 141Q380 89 740 139" fill="none" stroke="#8aabad" stroke-width="12" opacity=".6"/><path d="M743 109Q803 108 812 150V248Q751 263 722 211Z" fill="#071823" stroke="#728a83" stroke-width="4"/><path d="M760 159Q901 136 1061 178V224Q888 191 770 216Z" fill="url(#copper)" stroke="#512c21" stroke-width="4"/>${Array.from({length:13},(_,i)=>`<path d="M${767+i*22} 156Q${784+i*22} 185 ${767+i*22} 213" fill="none" stroke="#ffdb9f" stroke-width="3" opacity=".75"/>`).join('')}<path d="M52 235Q350 193 693 232" stroke="#020d18" stroke-width="8" opacity=".7"/></g>`);
save('alambre-advertencia',600,360,`<g filter="url(#shadow)"><path d="M100 263C90 135 256 72 336 126S344 284 475 97" fill="none" stroke="#243a46" stroke-width="29"/><path d="M100 263C90 135 256 72 336 126S344 284 475 97" fill="none" stroke="url(#copper)" stroke-width="18"/><path d="M99 258C97 139 252 80 333 130S344 280 475 99" fill="none" stroke="#ffdc9c" stroke-width="3"/></g>`);
// Lámpara con pantalla, foco y base, para el circuito doméstico.
save('lampara',300,420,`<g filter="url(#shadow)"><path d="M145 170H165V356H145Z" fill="url(#brass)" stroke="#2b3440" stroke-width="4"/><path d="M79 360Q150 320 223 360L232 381H69Z" fill="url(#plastic)" stroke="#122734" stroke-width="5"/><path d="M100 57H209L255 202Q154 227 52 202Z" fill="url(#ceramic)" stroke="#483b2f" stroke-width="5"/><path d="M107 68L76 194" stroke="#fff3bb" stroke-width="7" opacity=".7"/><path d="M55 203Q150 173 252 203Q149 232 55 203Z" fill="#fff5c6" stroke="#c38a4f" stroke-width="3"/></g>`);
console.log('14 recursos SVG originales guardados.');
