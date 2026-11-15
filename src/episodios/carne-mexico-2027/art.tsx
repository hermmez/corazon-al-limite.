import React, {useId} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {countryPaths} from './geography';

export const EP='episodios/carne-mexico-2027/';
export const asset=(s:string)=>staticFile(EP+s);
export const clamp=(v:number)=>Math.min(1,Math.max(0,v));
export const p=(t:number,a:number,d=.45)=>{const v=clamp((t-a)/d);return v*v*(3-2*v);};
export const lerp=(a:number,b:number,v:number)=>a+(b-a)*v;
export const pulse=(t:number,a:number,d=.7)=>Math.sin(clamp((t-a)/d)*Math.PI);
export const ink='#392e2a';
export const colors={beef:'#b84d51',pork:'#dc8c7a',chicken:'#d6aa68',teal:'#207f87',cream:'#f6e9d1',gold:'#d29b4e'};

export const Canvas:React.FC<{children:React.ReactNode;bg?:string}>=({children,bg='#efe1c8'})=><AbsoluteFill style={{background:bg,overflow:'hidden'}}><svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}><defs><linearGradient id="paper27" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f6ecd8"/><stop offset="1" stopColor="#d9bc8e"/></linearGradient><linearGradient id="steel27" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dae1df"/><stop offset=".5" stopColor="#a9b9b8"/><stop offset="1" stopColor="#718a8d"/></linearGradient><linearGradient id="wood27" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#cf9a57"/><stop offset="1" stopColor="#946133"/></linearGradient><linearGradient id="glass27"><stop stopColor="#c5e5db" stopOpacity=".76"/><stop offset="1" stopColor="#7cb8b6" stopOpacity=".28"/></linearGradient><linearGradient id="meat27"><stop stopColor="#e68e82"/><stop offset="1" stopColor="#a7424a"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#paper27)"/>{children}</svg></AbsoluteFill>;

export const Reveal:React.FC<{t:number;at:number;kind?:'left'|'circle'|'up';children:React.ReactNode}>=({t,at,kind='left',children})=>{
 const id=useId().replace(/:/g,'');const v=p(t,at,.32);
 return <g><defs><clipPath id={id}>{kind==='circle'?<circle cx="540" cy="950" r={v*1550}/>:kind==='up'?<rect x="0" y={1920*(1-v)} width="1080" height={1920*v}/>:<rect width={1080*v} height="1920"/>}</clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></g>;
};

export const Meat:React.FC<{kind:'beef'|'pork'|'chicken';x?:number;y?:number;w?:number;angle?:number;lift?:number}>=({kind,x=0,y=0,w=300,angle=0,lift=0})=><g transform={`translate(${x} ${y-lift}) scale(${w/400}) rotate(${angle} 200 150)`} stroke={ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
 <ellipse cx="205" cy="268" rx="180" ry="24" fill="#4e3426" opacity=".15" stroke="none"/>
 {kind==='beef'?<>
  <path d="M40 122 Q23 65 92 44 Q145 4 213 45 Q263 34 303 72 Q340 89 360 143 Q388 188 341 223 Q285 256 233 244 Q188 269 123 236 Q65 236 43 199 Q18 168 40 122Z" fill="#edd2b2"/>
  <path d="M53 125 Q45 78 101 61 Q147 24 207 61 Q259 50 292 86 Q335 102 344 147 Q371 186 329 209 Q286 239 232 226 Q183 250 128 220 Q73 220 58 190 Q35 164 53 125Z" fill="url(#meat27)"/>
  <path d="M80 116 Q137 79 190 93 Q219 113 218 160 Q190 201 131 195 Q74 191 73 154Z" fill="#b94950" stroke="#79363e" strokeWidth="3"/>
  <path d="M245 84 Q286 82 312 122 Q343 162 314 189 Q274 215 233 193 L233 132Z" fill="#bf5558" stroke="#813e43" strokeWidth="3"/>
  <path d="M201 65 Q221 77 222 105 L237 133 L273 139 L273 154 L231 153 L214 194 L199 190 L213 145 L196 115Z" fill="#f5e1c5" stroke="#8d6c58" strokeWidth="2.5"/>
  {['M95 111 Q118 95 143 107 Q155 121 174 115','M87 142 Q111 121 136 136 Q162 150 187 140','M97 166 Q126 146 143 162 L176 174','M256 104 Q274 124 301 124','M253 175 Q280 155 305 173'].map((d,i)=><path key={i} d={d} fill="none" stroke="#eaa79b" strokeWidth="4" opacity=".75"/>)}
  <path d="M88 77 Q125 49 155 58 M280 85 Q305 95 320 116" fill="none" stroke="#f7c9b0" strokeWidth="5" opacity=".8"/>
 </>:kind==='pork'?<>
  <path d="M67 79 Q112 22 175 42 Q225 14 288 55 Q346 67 353 131 Q379 185 329 219 Q272 253 212 240 Q141 263 91 231 Q37 217 40 163 Q28 112 67 79Z" fill="#f3d7bd"/>
  <path d="M79 89 Q112 46 172 62 Q222 35 281 74 Q326 82 335 135 Q357 178 315 201 Q266 232 211 221 Q142 241 104 214 Q57 203 60 162 Q47 119 79 89Z" fill="#de9c88"/>
  <path d="M92 116 Q124 77 175 95 Q224 72 267 108 Q294 126 275 162 Q242 190 204 175 Q150 204 114 176 Q83 163 92 116Z" fill="#cc7d71"/>
  <path d="M279 160 Q308 160 314 183 Q321 211 296 220 Q265 222 264 201 L235 193 L230 178Z" fill="#f4e7cc"/>
  <path d="M100 123 Q146 104 171 125 Q198 145 234 128 M108 153 Q143 136 171 155 M189 87 Q208 112 237 109" fill="none" stroke="#efbfaa" strokeWidth="5"/>
  <path d="M85 88 Q126 53 157 70" stroke="#ffe2c7" strokeWidth="6" fill="none"/>
 </>:<>
  <path d="M119 213 Q67 234 47 202 Q25 177 58 155 L102 139 Q91 80 148 52 Q203 25 251 65 Q294 82 293 140 L333 153 Q371 171 352 201 Q328 230 284 213 Q244 247 197 240 Q152 248 119 213Z" fill="#eccb91"/>
  <path d="M118 136 Q113 81 157 65 Q206 43 245 80 Q277 94 274 143 Q266 192 215 216 Q165 222 127 188Z" fill="#ddb777"/>
  <path d="M101 143 Q61 148 53 177 Q49 197 78 205 Q106 206 133 178 M288 146 Q325 144 343 174 Q353 197 322 205 Q293 205 266 177" fill="#d6a56a"/>
  <path d="M122 184 Q116 209 140 226 Q167 235 181 218 M263 185 Q274 216 246 229 L221 222" fill="#e6bc81"/>
  <path d="M147 91 Q176 66 208 76 M143 110 Q157 96 168 98" stroke="#ffe5b0" strokeWidth="8" fill="none"/>
  <path d="M187 107 Q205 148 190 191 M230 101 Q214 133 235 167" fill="none" stroke="#c49153" strokeWidth="3"/>
 </>}
</g>;

export const Tag:React.FC<{x:number;y:number;w?:number;text:string;small?:string;angle?:number;progress?:number}>=({x,y,w=330,text,small,angle=0,progress=1})=>{
 const id=useId().replace(/:/g,'');
 return <g transform={`translate(${x} ${y}) rotate(${angle} ${w/2} 80)`}><path d={`M${w*.45} 0 Q${w*.5} -64 ${w*.55} 0`} fill="none" stroke="#7e6347" strokeWidth="5"/><defs><clipPath id={id}><rect x="-10" y="-5" width={(w+20)*progress} height="215"/></clipPath></defs><g clipPath={`url(#${id})`}><path d={`M12 0 L${w-12} 0 Q${w} 0 ${w} 13 L${w} 174 Q${w} 188 ${w-15} 188 L14 188 Q0 188 0 174 L0 15 Q0 0 12 0Z`} fill="#fff4d9" stroke={ink} strokeWidth="4"/><circle cx={w/2} cy="15" r="6" fill="#a1835f"/><text x={w/2} y="105" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize={text.length>7?52:68} fill={ink}>{text}</text>{small&&<text x={w/2} y="151" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="29" fill="#705343">{small}</text>}</g></g>;
};

export const Crate:React.FC<{x:number;y:number;w?:number;angle?:number;label?:string}>=({x,y,w=170,angle=0,label='FRÍO'})=><g transform={`translate(${x} ${y}) scale(${w/170}) rotate(${angle} 85 60)`} stroke={ink} strokeWidth="3.5" strokeLinejoin="round"><path d="M6 22 L137 5 L168 26 L38 45Z" fill="#c7b38a"/><path d="M6 22 L38 45 L38 129 L6 104Z" fill="#9c835b"/><path d="M38 45 L168 26 L168 111 L38 129Z" fill="#c8b895"/><path d="M85 11 L114 8 L142 29 L113 34Z" fill="#528b8c"/><path d="M113 34 L142 29 L142 115 L113 119Z" fill="#5e9291"/><path d="M18 43 L29 52 M18 63 L29 72 M18 83 L29 92" stroke="#765e40"/><path d="M56 57 L94 52 L94 91 L56 96Z" fill="#f7eed5"/><text x="74" y="80" textAnchor="middle" stroke="none" fill="#416d74" fontFamily="Arial" fontSize="13" fontWeight="700">{label}</text><path d="M78 106 L86 105 M92 104 L99 103" stroke="#746549" strokeWidth="2"/></g>;

export const Icon:React.FC<{kind:'energy'|'fuel'|'cold'|'shield'|'globe'|'clock';x:number;y:number;size?:number;t?:number;progress?:number}>=({kind,x,y,size=150,t=0,progress=1})=><g transform={`translate(${x} ${y}) scale(${size/150})`} opacity={progress} stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M18 5 Q5 5 5 20 L5 127 Q5 145 22 145 L129 145 Q145 145 145 127 L145 20 Q145 5 128 5Z" fill="#f9edd3"/>
 {kind==='energy'?<><path d="M78 20 L43 81 L72 81 L58 129 L111 62 L81 62 L101 20Z" fill="#d7a33e"/><path d="M22 55 L30 55 M116 112 L126 112" stroke="#a16d36"/></>:kind==='fuel'?<><path d="M34 128 L34 36 Q34 25 45 25 L84 25 Q94 25 94 36 L94 128Z" fill="#38878b"/><path d="M43 39 L85 39 L85 67 L43 67Z" fill="#e6dcc1"/><path d="M94 55 Q119 47 118 80 L118 111 Q121 126 130 111 L130 58 L115 40" fill="none"/><path d="M116 39 L129 48 L136 66 L125 69 L114 51Z" fill="#a0b9b6"/><path d="M48 92 L80 92 M48 106 L71 106" stroke="#b9d2c5"/></>:kind==='cold'?<><rect x="25" y="23" width="100" height="104" rx="13" fill="#a1c3c1"/><circle cx="75" cy="74" r="35" fill="#e9e9d4"/><g transform={`rotate(${t*180} 75 74)`}>{[0,90,180,270].map(a=><path key={a} d="M75 74 Q89 40 104 49 Q111 67 75 74" fill="#528a91" transform={`rotate(${a} 75 74)`}/>)}</g><path d="M43 113 L107 113" stroke="#47767d" strokeWidth="4"/></>:kind==='shield'?<><path d="M75 18 Q99 35 123 34 L116 84 Q108 114 75 132 Q42 114 34 84 L27 34 Q53 35 75 18Z" fill="#8eaf9a"/><path d="M48 75 L68 94 L106 52" fill="none" stroke="#fff4d6" strokeWidth="12"/></>:kind==='globe'?<><circle cx="75" cy="75" r="55" fill="#92c2c0"/><path d="M29 50 L55 31 L76 39 L69 64 L49 76 L54 103 L41 112 M100 32 L117 57 L92 76 L104 97 L95 120 L77 106 L83 85 L69 69" fill="#8d9a61"/><path d="M22 73 L128 73 M75 22 Q40 75 75 129 M75 22 Q109 75 75 129" fill="none" opacity=".45" strokeWidth="2"/></>:<><circle cx="75" cy="75" r="53" fill="#e4d3b0"/><path d="M75 37 L75 75 L103 87" fill="none" transform={`rotate(${t*20} 75 75)`}/></>}
</g>;

export const Shop:React.FC<{t:number;counter?:boolean}>=({t,counter=true})=><g stroke={ink} strokeWidth="4" strokeLinejoin="round">
 <path d="M0 0 H1080 V1920 H0Z" fill="#e7cba1" stroke="none"/>
 <path d="M0 230 L1080 230 L1080 1280 L0 1280Z" fill="#f3dfbd"/>
 {[0,1,2,3,4,5].map(i=><g key={i} opacity=".36" stroke="#bba688" strokeWidth="2"><path d={`M0 ${310+i*155} H1080`}/><path d={`M${i*220-100} 230 V1280`}/></g>)}
 <path d="M0 1550 L1080 1300 L1080 1920 H0Z" fill="#b78958"/>
 {[0,1,2,3,4].map(i=><path key={i} d={`M${i*270-260} 1920 L${400+i*130} 1280`} stroke="#9e754e" strokeWidth="3"/>)}
 <path d="M-10 150 L1090 150 L1090 320 L-10 320Z" fill="#7a4941"/>
 {[0,1,2,3,4,5,6,7].map(i=><path key={i} d={`M${i*144-36} 150 L${i*144+108} 150 L${i*144+125} 320 L${i*144-50} 320Z`} fill={i%2?'#eee0bd':'#ac554b'} strokeWidth="3"/>)}
 <path d="M180 65 L900 65 L900 190 L180 190Z" fill="#f4e5c9" stroke="#614438" strokeWidth="7"/>
 <text x="540" y="148" textAnchor="middle" fontFamily="Georgia,serif" fontSize="67" fontWeight="700" fill="#684438" stroke="none">CARNICERÍA</text>
 <path d="M80 435 L676 435 L676 920 L80 920Z" fill="#a2c4c1" strokeWidth="8"/>
 <path d="M96 453 L660 453 L660 904 L96 904Z" fill="#d4e5d9" stroke="none"/>
 <path d="M100 690 H656 M380 450 V906" stroke="#779b96" strokeWidth="6"/>
 <path d="M106 457 L217 457 L483 905 L372 905Z" fill="white" opacity=".18" stroke="none"/>
 <path d="M765 410 H1006 V805 H765Z" fill="#608a83" strokeWidth="6"/><path d="M780 424 H990 V789 H780Z" fill="#f3e5c9" stroke="none"/>
 <text x="885" y="510" textAnchor="middle" fill="#71513e" stroke="none" fontFamily="Arial" fontSize="35">MERCADO</text><text x="885" y="565" textAnchor="middle" fill="#71513e" stroke="none" fontFamily="Arial" fontSize="30">DE BARRIO</text>
 <path d="M799 623 H968 M799 649 H958 M799 675 H945" stroke="#b29469" strokeWidth="7"/>
 {counter&&<g><path d="M-20 1145 L771 1070 L831 1170 L831 1477 L-20 1510Z" fill="#668e90"/><path d="M-20 1145 L771 1070 L831 1170 L21 1266Z" fill="url(#steel27)"/><path d="M22 1159 L744 1090 L779 1156 L32 1234Z" fill="#eee5d1"/><path d="M18 1280 L804 1195 L804 1395 L18 1464Z" fill="url(#glass27)" strokeWidth="5"/><path d="M50 1284 L240 1262 L382 1432 L202 1449Z" fill="white" opacity=".2" stroke="none"/><path d="M-15 1510 L825 1480 L825 1542 L-15 1585Z" fill="#40666b"/>
 <Meat kind="beef" x={45} y={1190} w={240}/><Meat kind="pork" x={309} y={1160} w={227}/><Meat kind="chicken" x={557} y={1140} w={220}/></g>}
 <path d="M0 1650 Q420 1510 1080 1660" fill="none" stroke="#ffd391" strokeWidth="80" opacity=".12"/>
</g>;

export const Cow:React.FC<{x:number;y:number;w?:number;t:number;chew?:number}>=({x,y,w=350,t,chew=1})=><g transform={`translate(${x} ${y}) scale(${w/400})`} stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
 <ellipse cx="200" cy="264" rx="177" ry="19" fill="#67543c" opacity=".16" stroke="none"/>
 {[110,160,280,326].map((v,i)=><g key={v} transform={`rotate(${Math.sin(t*1.4+i)*1.4} ${v} 165)`}><path d={`M${v-16} 148 L${v+10} 153 L${v+6} 242 L${v-9} 252 L${v-21} 242Z`} fill={i%2?'#9d704b':'#bc8956'}/><path d={`M${v-21} 239 L${v+7} 239 L${v+10} 259 L${v-23} 259Z`} fill="#4c4138"/></g>)}
 <path d="M79 92 Q105 46 187 46 Q275 37 322 79 Q350 113 329 174 Q316 205 240 203 L133 193 Q80 182 79 92Z" fill="#bd8b58"/>
 <path d="M113 153 Q176 175 263 169 Q300 165 327 137 L319 183 Q283 211 183 190 L125 181Z" fill="#9c704d" stroke="none"/>
 <path d="M100 84 Q154 61 201 65" fill="none" stroke="#e1b77c" strokeWidth="10"/>
 <g transform={`rotate(${9*Math.sin(t*1.2)*chew+4*chew} 96 108)`}>
 <path d="M100 80 Q82 62 58 81 Q38 104 40 140 L23 177 Q21 205 56 215 Q91 218 100 183 L116 143Z" fill="#be8b55"/>
 <path d="M47 92 Q12 61 7 91 Q12 112 43 111 M89 83 Q113 52 126 74 Q136 97 106 106" fill="#b27d4f"/>
 <path d="M51 77 Q40 46 55 35 Q58 57 72 69 M89 74 Q100 49 89 37 Q85 58 76 66" fill="#e5d5ae"/>
 <path d="M28 170 Q57 154 92 172 L91 194 Q76 221 46 208 Q22 198 28 170Z" fill="#d6b085"/>
 <path d="M43 183 L47 185 M76 183 L80 181" strokeWidth="6"/><ellipse cx="60" cy="122" rx="7" ry="9" fill="#2b2926"/><circle cx="62" cy="119" r="2" fill="white" stroke="none"/>
 <path d={`M48 ${199+2*Math.sin(t*5)} Q61 ${206+3*Math.sin(t*5)} 76 199`} fill="none" strokeWidth="2.5"/>
 </g>
 <path d="M326 85 Q368 89 361 142 Q351 172 373 190" fill="none" stroke="#9b6a48" strokeWidth="12" transform={`rotate(${7*Math.sin(t*2)} 325 85)`}/>
</g>;

export const Farm:React.FC<{t:number;us?:boolean}>=({t,us=false})=><g stroke={ink} strokeWidth="4" strokeLinejoin="round">
 <rect width="1080" height="1920" fill="#cadfd2" stroke="none"/>
 <path d="M0 585 Q250 435 514 576 Q810 442 1080 538 V1920 H0Z" fill="#b1bc7e"/>
 <path d="M0 780 Q270 615 633 704 Q835 724 1080 655 V1920 H0Z" fill="#9ea86c"/>
 <path d="M0 1180 Q590 830 1080 1040 V1920 H0Z" fill="#cab47b"/>
 {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${i*220-500} 1920 Q${i*135+20} 1330 ${i*100+90} 1150`} fill="none" stroke="#a58e5d" strokeWidth="19"/>)}
 <path d="M670 826 V483 L850 360 L1035 483 V826Z" fill="#ac6552"/><path d="M637 490 L850 337 L1068 490 L1044 521 L850 393 L660 520Z" fill="#795244"/><path d="M753 826 V590 H950 V826Z" fill="#644f41"/><path d="M760 600 L850 690 L941 600 M760 811 L850 718 L941 811" stroke="#bd9472" strokeWidth="9"/>
 <text x="850" y="568" textAnchor="middle" fontFamily="Arial" fontSize="31" fill="#fff1d1" stroke="none">{us?'GANADO · EE. UU.':'GRANJA GANADERA'}</text>
 <path d="M0 1110 L500 1027 M0 1160 L500 1077 M800 977 L1080 930 M800 1027 L1080 983" stroke="#8d7652" strokeWidth="18"/>
 <g transform={`translate(500 0) scale(${1-.9*p(t,Math.floor(t/10)*10+7,.7)} 1) translate(-500 0)`}><path d="M500 1027 L800 977 M500 1077 L800 1027 M525 1022 L525 1110 M780 980 L780 1057" stroke="#9b7b50" strokeWidth="15"/></g>
 {[40,250,470,710,950].map((v,i)=><path key={v} d={`M${v} ${1200-i*35} V${990-i*35}`} stroke="#967950" strokeWidth="22"/>)}
 <Cow x={80} y={765} w={470} t={t}/><Cow x={520} y={888} w={320} t={t+1.4} chew={.4}/>
</g>;

export const Wheel:React.FC<{x:number;y:number;r:number;turn:number}>=({x,y,r,turn})=><g transform={`translate(${x} ${y}) rotate(${turn})`} stroke={ink} strokeWidth="5"><circle r={r} fill="#3c4545"/><circle r={r*.65} fill="#9caaa6"/><circle r={r*.22} fill="#607c80"/>{[0,60,120,180,240,300].map(a=><path key={a} d={`M0 ${-r*.32} L0 ${-r*.55}`} stroke="#4d6264" strokeWidth="5" transform={`rotate(${a})`}/>)}</g>;

export const Truck:React.FC<{x:number;y:number;w?:number;t:number;speed?:number;door?:number}>=({x,y,w=820,t,speed=1,door=0})=>{
 const bob=Math.sin(t*10)*2*speed;
 return <g transform={`translate(${x} ${y}) scale(${w/820})`} stroke={ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
  <ellipse cx="410" cy="371" rx="370" ry="22" fill="#393b2e" opacity=".17" stroke="none"/>
  <g transform={`translate(0 ${bob})`}>
   <path d="M35 58 Q35 40 52 40 H505 Q525 40 525 60 V306 H35Z" fill="#e1ded0"/><path d="M45 61 H514 V94 H45Z" fill="#438a8e" stroke="none"/>
   <path d="M48 111 H510 M48 145 H510 M48 180 H510 M48 214 H510 M48 249 H510" fill="none" stroke="#c0c1b4" strokeWidth="3"/>
   <path d="M55 44 V306 M87 44 V306" stroke="#b0b8ae" strokeWidth="3"/>
   <text x="294" y="203" textAnchor="middle" stroke="none" fill="#577f80" fontFamily="Arial" fontSize="34" fontWeight="700">CADENA DE FRÍO</text>
   <path d="M524 305 V153 Q526 130 548 130 H633 Q651 130 665 149 L731 221 Q745 234 745 256 V309Z" fill="#2a858b"/>
   <path d="M549 151 H625 L687 216 H549Z" fill="#a8cecc"/>
   <g transform={`translate(0 ${Math.sin(t*2)*1.8})`}><path d="M561 215 V192 Q570 168 589 176 Q610 178 610 202 V215Z" fill="#dfaa7c" strokeWidth="2.5"/><path d="M562 189 Q559 167 580 165 Q603 163 609 181 L599 185 L591 177 L581 183Z" fill="#554237" strokeWidth="2.5"/><path d="M575 215 L616 215 L626 226 H554Z" fill="#1e6770" strokeWidth="2.5"/><path d="M603 200 L621 208" stroke="#dfaa7c" strokeWidth="7"/><circle cx="632" cy="211" r="15" fill="none" stroke="#365b5d" strokeWidth="4" transform={`rotate(${Math.sin(t*1.5)*9} 632 211)`}/><circle cx="598" cy="187" r="2" fill="#382c25" stroke="none"/></g>
   <path d="M548 236 H710 V301 H548Z" fill="#3b9295"/><path d="M563 246 H586" stroke="#c6d4c7" strokeWidth="6"/><path d="M718 252 H749 V281 H718Z" fill="#f3d99a"/><path d="M738 294 H771 V319 H738Z" fill="#6c8384"/>
   <path d="M24 309 H752 L760 337 H26Z" fill="#52676a"/>
   <path d="M42 321 Q64 268 113 288 M600 324 Q636 268 696 303" fill="none" stroke="#587777" strokeWidth="17"/>
   <path d="M51 32 V-1 H161 V32Z" fill="#c7d7d0"/>
   {[0,1,2,3,4].map(i=><path key={i} d={`M${66+i*18} 4 V26`} stroke="#71979a" strokeWidth="4"/>)}
   <g transform={`translate(${-door*105} 0)`}><path d="M36 101 H85 V296 H36Z" fill="#becbc1"/><path d="M63 172 V221" stroke="#52787c" strokeWidth="7"/></g>
  </g>
  <Wheel x={164} y={327+bob*.2} r={49} turn={t*speed*270}/><Wheel x={662} y={327+bob*.2} r={49} turn={t*speed*270}/>
 </g>;
};

export const Road:React.FC<{t:number;speed?:number}>=({t,speed=1})=><g stroke={ink} strokeWidth="4">
 <rect width="1080" height="1920" fill="#c3d9d2" stroke="none"/>
 <path d="M-100 670 L140 450 L350 658 L625 465 L920 671 L1160 480 V1400 H-100Z" fill="#9da984"/>
 <path d="M-100 790 Q270 600 500 780 Q840 570 1190 782 V1570 H-100Z" fill="#b9b381"/>
 {[0,1,2,3].map(i=>{const x=((i*390-t*speed*28)%1600+1600)%1600-260;return <g key={i} transform={`translate(${x} 740)`}><path d="M0 70 L0 -75 M0 -37 Q-42 -71 -45 -43 M0 -48 Q44 -90 46 -54" fill="none" stroke="#728257" strokeWidth="17"/><path d="M-33 91 H30" stroke="#8d7b50" strokeWidth="5"/></g>;})}
 <path d="M0 1040 L1080 963 V1510 L0 1575Z" fill="#747c79"/><path d="M0 1054 L1080 980 M0 1510 L1080 1450" stroke="#c2c4a9" strokeWidth="12"/>
 {[0,1,2,3,4,5].map(i=>{const x=((i*275-t*speed*155)%1700+1700)%1700-280;return <path key={i} d={`M${x} 1277 L${x+135} 1269`} stroke="#ece0b5" strokeWidth="11"/>;})}
 <path d="M0 1570 Q480 1450 1080 1510 V1920 H0Z" fill="#c1a477"/>
 {[0,1,2,3,4].map(i=>{const x=((i*310-t*speed*240)%1600+1600)%1600-260;return <g key={i} transform={`translate(${x} 1570)`}><path d="M0 40 L0 -25 M0 15 L-28 -8 M0 12 L25 -13" stroke="#8c9a65" strokeWidth="8"/></g>;})}
</g>;

export const Warehouse:React.FC<{t:number;flow?:number}>=({t,flow=1})=><g stroke={ink} strokeWidth="4" strokeLinejoin="round">
 <rect width="1080" height="1920" fill="#d2c4a8" stroke="none"/>
 <path d="M0 425 L540 255 L1080 425 V1360 H0Z" fill="#d9d8c4"/><path d="M-20 425 L540 240 L1100 425" fill="none" stroke="#6d7a73" strokeWidth="25"/>
 <path d="M115 1320 V570 H485 V1320 M595 1320 V570 H965 V1320" fill="#718f8a" strokeWidth="10"/>
 {[0,1,2,3,4,5].map(i=><path key={i} d={`M603 ${600+i*115} H956`} stroke="#adc0ad" strokeWidth="9"/>)}
 <text x="540" y="477" textAnchor="middle" fill="#4c6661" stroke="none" fontFamily="Arial" fontSize="42" fontWeight="700">DISTRIBUCIÓN</text>
 <path d="M0 1370 L1080 1280 V1920 H0Z" fill="#b1a488"/>
 <path d="M0 1124 L1080 1043 L1080 1127 L0 1208Z" fill="#718d89"/>
 {[0,1,2,3,4,5,6,7,8,9,10].map(i=><g key={i} transform={`translate(${i*110-20} ${1170-i*8}) rotate(${t*flow*160})`}><ellipse rx="43" ry="25" fill="#b5c5ba"/><path d="M-28 -5 L27 5" stroke="#68837d" strokeWidth="4"/></g>)}
 <path d="M60 1205 V1480 M445 1175 V1450 M890 1146 V1410" stroke="#58746f" strokeWidth="20"/>
 {[0,1,2].map(i=><Crate key={i} x={((i*400+t*flow*140)%1420)-260} y={966-((i*400+t*flow*140)%1420)*.08} w={215}/>)}
</g>;

export const MapTrade:React.FC<{t:number;route?:number;security?:boolean}>=({t,route=1,security=false})=>{
 const id=useId().replace(/:/g,'');
 return <g><rect x="65" y="435" width="950" height="830" rx="35" fill="#c7dedd" stroke={ink} strokeWidth="4"/>
 <svg x="95" y="485" width="900" height="660" viewBox="0 0 840 560" style={{overflow:'hidden'}}><defs><clipPath id={id}><rect width="840" height="560"/></clipPath></defs><g clipPath={`url(#${id})`}>
 <path d={countryPaths.usa} fill="#c8bc8d" stroke="#6c7763" strokeWidth="3"/><path d={countryPaths.mexico} fill="#91a17e" stroke="#4e7566" strokeWidth="3"/>
 <text x="434" y="160" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontSize="31" fill="#4a5549">EE. UU.</text><text x="407" y="395" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontSize="28" fill="#365d54">MÉXICO</text>
 <path d="M405 209 C322 285 462 314 458 402" pathLength="1" fill="none" stroke="#426d6e" strokeWidth="11" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1-route}/>
 {route>.85&&<path d="M444 382 L459 410 L473 383" fill="none" stroke="#426d6e" strokeWidth="10" strokeLinecap="round"/>}
 {security&&<><path d="M406 211 Q558 220 514 325 Q493 367 458 402" pathLength="1" fill="none" stroke="#b18b46" strokeWidth="7" strokeDasharray=".035 .025" strokeDashoffset={-t*.03}/><path d="M432 307 L459 354 L405 354Z" fill="#e8b66f" stroke={ink} strokeWidth="3"/><text x="432" y="344" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontSize="31" fill={ink}>!</text></>}
 </g></svg><text x="540" y="1215" textAnchor="middle" fontFamily="Arial" fontSize="30" fill="#426967">{security?'Esquema de ruta comercial':'Flujo comercial ilustrativo · sin volúmenes asignados'}</text></g>;
};

export const Scale:React.FC<{x:number;y:number;t:number;weight?:number;w?:number}>=({x,y,t,weight=0,w=360})=><g transform={`translate(${x} ${y}) scale(${w/360})`} stroke={ink} strokeWidth="4" strokeLinejoin="round"><path d="M46 242 L68 109 L295 109 L320 242Z" fill="#6d9595"/><path d="M41 245 H325 V272 H41Z" fill="url(#steel27)"/><path d="M165 116 V54 H202 V116Z" fill="#819d99"/><path d={`M25 ${45+weight*13} Q180 ${88+weight*13} 335 ${45+weight*13} L335 ${29+weight*13} Q180 ${66+weight*13} 25 ${29+weight*13}Z`} fill="#b7c6ba"/><rect x="95" y="138" width="177" height="84" rx="16" fill="#f0e8d2"/><path d="M112 190 Q182 113 252 190" fill="none" stroke="#9ba88f" strokeWidth="4"/><path d="M182 194 L182 151" stroke="#b8654d" strokeWidth="6" transform={`rotate(${-58+weight*91+Math.sin(t*14)*Math.exp(-weight*9)*2} 182 194)`}/><circle cx="182" cy="194" r="8" fill="#6e7670"/>
</g>;

export const Balance:React.FC<{x:number;y:number;t:number;tilt?:number}>=({x,y,t,tilt=0})=><g transform={`translate(${x} ${y})`} stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M260 520 H520 L485 478 H295Z" fill="#aa8b56"/><path d="M390 478 V93" stroke="#8d8055" strokeWidth="20"/><path d="M365 480 L390 300 L415 480" fill="#b9a36e"/><g transform={`rotate(${tilt+Math.sin(t*1.8)*1.2} 390 145)`}><path d="M140 145 H640" stroke="#7b7554" strokeWidth="15"/><path d="M140 145 L65 355 M140 145 L215 355 M640 145 L565 355 M640 145 L715 355" fill="none" stroke="#937d52" strokeWidth="4"/><path d="M48 355 Q140 418 232 355Z M548 355 Q640 418 732 355Z" fill="#bca374"/><Crate x={70} y={213} w={142}/><path d="M591 259 L688 259 L679 351 L599 351Z" fill="#d9be88"/><path d="M610 259 Q608 219 640 219 Q672 219 670 259" fill="none" stroke="#a08558" strokeWidth="9"/></g><text x="140" y="455" textAnchor="middle" stroke="none" fontFamily="Arial" fontSize="34" fill="#56675d">OFERTA</text><text x="640" y="455" textAnchor="middle" stroke="none" fontFamily="Arial" fontSize="34" fill="#56675d">DEMANDA</text></g>;

export const Cart:React.FC<{x:number;y:number;w?:number;t:number;roll?:number;items?:number}>=({x,y,w=700,t,roll=1,items=3})=><g transform={`translate(${x} ${y}) scale(${w/700})`} stroke={ink} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
 <ellipse cx="360" cy="490" rx="280" ry="21" fill="#72593d" opacity=".15" stroke="none"/>
 <path d="M43 61 H117 L178 357 H606 L659 109 H138" fill="#c7d1b5" fillOpacity=".37"/>
 <path d="M44 61 H114 L179 358 H610 L642 412 H203 L182 358" fill="none" stroke="#5d8181" strokeWidth="12"/>
 <path d="M130 106 H659 L612 335 H176Z" fill="#bbc9b1" fillOpacity=".38" stroke="#658485" strokeWidth="9"/>
 {[0,1,2,3,4,5,6,7].map(i=><path key={i} d={`M${151+i*66} 112 L${189+i*58} 330`} stroke="#779591" strokeWidth="4"/>)}
 <path d="M146 166 H646 M158 224 H634 M171 282 H620" stroke="#779591" strokeWidth="4"/>
 <path d="M44 59 H112" stroke="#7c5142" strokeWidth="21"/>
 {items>0&&<Meat kind="beef" x={183} y={116} w={190}/>} {items>1&&<Meat kind="chicken" x={357} y={108} w={194}/>} {items>2&&<Meat kind="pork" x={460} y={174} w={177}/>}
 <Wheel x={236} y={444} r={43} turn={t*roll*230}/><Wheel x={567} y={444} r={43} turn={t*roll*230}/>
</g>;

export const Label:React.FC<{x:number;y:number;text:string;size?:number;color?:string;anchor?:'start'|'middle'|'end'}>=({x,y,text,size=40,color=ink,anchor='middle'})=><text x={x} y={y} textAnchor={anchor} fontFamily="Arial,sans-serif" fontSize={size} fontWeight="700" fill={color}>{text}</text>;

export const Badge:React.FC<{x:number;y:number;text:string;width?:number;color?:string}>=({x,y,text,width=520,color='#f7e9cd'})=><g transform={`translate(${x} ${y})`}><rect width={width} height="66" rx="17" fill={color} stroke="#746649" strokeWidth="2.5"/><Label x={width/2} y={45} text={text} size={30}/></g>;
