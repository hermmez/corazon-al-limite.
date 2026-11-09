import React from "react";

const traces = [
  "M-140,500 H77 L166,411 V271 L212,225 H355",
  "M-90,553 H103 L226,430 V315 L275,266 H390",
  "M-70,632 H75 L132,575 H326 L414,487 H674 L758,403 V274 L839,193 H1082",
  "M1125,312 H928 L851,388 V488 L752,587 H534 L478,643 H322",
  "M1150,540 H974 L888,626 H829 L765,692 H661",
  "M1140,720 H984 L911,793 V1113 L831,1193 H738",
  "M-120,1000 H51 L131,920 H264 L319,865 H378",
  "M-60,1102 H86 L149,1039 H224",
  "M-85,1420 H68 L192,1296 H305 L358,1243 H487",
  "M-94,1482 H101 L211,1372 H281 L373,1280 H568",
  "M1170,1287 H1031 L928,1390 V1486 L808,1606 H650",
  "M1134,1458 H1016 L874,1600 V1687 L792,1769 H597 L524,1842 H293",
  "M1129,1584 H1036 L946,1674 V1758 L815,1889 H704",
  "M-100,1727 H87 L189,1625 H340 L398,1567 H493",
  "M-90,1825 H170 L270,1725 H432 L484,1673 H549",
  "M-94,1911 H224 L274,1861 H410",
];

const ports: ReadonlyArray<[number,number]> = [[212,225],[355,225],[390,266],[326,575],[534,587],[322,643],[661,692],[738,1193],[264,920],[378,865],[224,1039],[487,1243],[568,1280],[650,1606],[293,1842],[704,1889],[493,1567],[549,1673],[410,1861]];
const solder = Array.from({length:30}, (_, i)=>({x:(i*211+41)%1080,y:(i*157+444)%1920,r:2+i%4}));

export const Banco: React.FC<{time: number; shift: number; warm: number}> = React.memo(({time,shift,warm}) => <g>
  <defs>
    <linearGradient id="e12banco" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#172c37"/><stop offset=".42" stopColor="#192d39"/>
      <stop offset=".74" stopColor="#111e2b"/><stop offset="1" stopColor="#0d1927"/>
    </linearGradient>
    <radialGradient id="e12foco" cx="51%" cy="47%" r="62%">
      <stop offset="0" stopColor="#526368" stopOpacity=".82"/>
      <stop offset=".6" stopColor="#3c575c" stopOpacity=".38"/>
      <stop offset="1" stopColor="#243843" stopOpacity="0"/>
    </radialGradient>
    <pattern id="e12reticula" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="#b5bdae" strokeOpacity=".19" />
      <path d="M-5 0H5 M0 -5V5 M27 32h10m-5-5v10" stroke="#8dc3b6" strokeOpacity=".23" strokeWidth="1.5"/>
    </pattern>
    <pattern id="e12bancoTrama" width="47" height="31" patternUnits="userSpaceOnUse">
      <path d="M4 7h12m17 7h5m-26 8h15m5 5h9" stroke="#a5b9af" strokeOpacity=".08" />
      <circle cx="23" cy="3" r="1.2" fill="#a5b9af" fillOpacity=".19" />
    </pattern>
    <linearGradient id="e12viga" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#6e807f"/><stop offset=".32" stopColor="#29414c"/><stop offset="1" stopColor="#132638"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#e12banco)" />
  <rect width="1080" height="1920" fill="url(#e12foco)" />
  <rect x="-40" y="-40" width="1160" height="2000" fill="url(#e12reticula)" opacity=".56" transform={"translate("+(-shift*.16)+" "+(-Math.sin(time*.13)*9)+")"}/>
  <g transform={"translate("+(shift*.44)+" "+(Math.sin(time*.095)*13)+")"}>
    <path d="M-130,309 H279 L414,174 H827 L894,107 H1132 M-90,1629 H215 L284,1560 H466 M1076,1354 H1018 L950,1422 V1530 L804,1676 H662" stroke="#b3bdac" strokeWidth="25" opacity=".13" fill="none"/>
    <path d="M-130,309 H279 L414,174 H827 L894,107 H1132 M-90,1629 H215 L284,1560 H466 M1076,1354 H1018 L950,1422 V1530 L804,1676 H662" stroke="#080e16" strokeWidth="13" opacity=".38" fill="none"/>
    {traces.map((d,i)=><g key={d} opacity={i%3===0 ? .69 : .4}>
      <path d={d} stroke="#111d27" strokeWidth={i%3===0? 15:9} fill="none" strokeLinejoin="round" />
      <path d={d} stroke={i%4===0 ? "#9a7754":"#527975"} strokeWidth={i%3===0? 6:3.5} fill="none" strokeLinejoin="round" />
    </g>)}
    {ports.map(([x,y],i)=><g key={x} transform={"translate("+x+" "+y+")"}>
      <circle r={i%4===0?13:8} fill="#14242e" stroke={i%4===0?"#ac8458":"#63807b"} strokeWidth="2.5" />
      <circle r="3.2" fill="#9eac97" />
    </g>)}
    {solder.map(({x,y,r},i)=><circle key={i} cx={x} cy={y} r={r} fill="#a5ab92" opacity=".28"/>)}
    <path d="M-61,684 L57,565 H134 L111,596 H69 L-54,719Z M951,1664 L1034,1581 H1143 V1606 H1044 L951,1698Z" fill="url(#e12viga)" stroke="#111e2a" strokeWidth="5" />
    <path d="M-65,744 L22,656 H60 M1020,1738 L1085,1673 M71,1964 L271,1764 H362" stroke="#98815d" strokeWidth="2" opacity=".7" fill="none"/>
  </g>
  <rect width="1080" height="1920" fill="url(#e12bancoTrama)"/>
  <ellipse cx="540" cy="970" rx="760" ry="670" fill="url(#e12calor)" opacity={warm*.21}/>
</g>);

const wire = "M-326,10 H-413 Q-445,10 -445,42 V410 Q-445,452 -401,452 H-78 M78,452 H152 M274,452 H401 Q445,452 445,410 V42 Q445,10 413,10 H326";
const rail = (d: string) => <g fill="none" strokeLinejoin="round" strokeLinecap="round">
  <path d={d} stroke="#0c1823" strokeWidth="26" />
  <path d={d} stroke="#653f38" strokeWidth="18" />
  <path d={d} stroke="#a06d48" strokeWidth="11" />
  <path d={d} stroke="#d39859" strokeWidth="4" />
</g>;

const Clip: React.FC<{side:-1|1}> = ({side}) => <g transform={"scale("+side+" 1)"}>
  <path d="M330,78 H385 L408,108 V127 H302 V102Z" fill="#283c43" stroke="#111a23" strokeWidth="6"/>
  <path d="M302,110 H407 V129 H302Z" fill="#55666a" stroke="#151e28" strokeWidth="3" />
  <path d="M336,-72 L350,-95 L362,-92 L354,-66 V62 Q354,75 370,82 L390,86 V103 H347 Q324,103 324,77 V-51Z" fill="url(#e12cobre)" stroke="#2b2529" strokeWidth="5" />
  <path d="M341,-61 V60 Q341,82 365,91 H384" fill="none" stroke="#ebad74" strokeWidth="4"/>
  <path d="M323,102 H384" stroke="#ad8b65" strokeWidth="3"/>
</g>;

export const Circuito: React.FC<{show: number; active: number; fault: number; time: number}> = ({show,active,fault,time}) => <g opacity={show}>
  <path d="M-484,-109 L-454,-137 H457 L486,-110 V514 L457,543 H-457 L-485,514Z" fill="#162b35" fillOpacity=".82" stroke="#2d474e" strokeWidth="3"/>
  <path d="M-470,114 V508 L-449,530 H448 L469,508 V116" fill="none" stroke="#677c77" strokeWidth="2" opacity=".73" />
  {rail(wire)}
  <path d={wire} stroke={fault > .45 ? "#f09254":"#76e6d2"} strokeWidth={2+fault*2} fill="none" opacity={active*.75} />
  <Clip side={-1} /><Clip side={1} />
  <g transform="translate(0 452)">
    <path d="M-84,-40 L-65,-53 H65 L83,-38 V39 L65,51 H-66 L-84,39Z" fill="#233d4a" stroke="#0b1820" strokeWidth="5"/>
    <path d="M-68,-37 H68 V35 H-68Z" fill="#193239" stroke="#53776d" strokeWidth="2"/>
    <path d="M-75,0 H-17 M16,0 H76 M-16,-28 V28 M16,-15 V15" fill="none" stroke="#d3d8ac" strokeWidth="4"/>
    <path d="M-55,-23 h11 m-5.5 -5.5 v11 m91 -6 h12" stroke="#9abdb3" strokeWidth="1.7"/>
  </g>
  <g transform="translate(212 452)">
    <path d="M-64,-44 H65 V44 H-64Z" fill="#2b4148" stroke="#111c26" strokeWidth="5" />
    <path d="M-61,0 H-30 M30,0 H61" stroke="#c8a57d" strokeWidth="4" />
    <circle r="28" fill={active>.15?"#6d7252":"#172930"} stroke="#c2b591" strokeWidth="3" />
    <path d="M-18,-18 L18,18 M-18,18 L18,-18" stroke={active>.15?"#ffffcb":"#778585"} strokeWidth="3.5"/>
    <ellipse rx="53" ry="53" fill="url(#e12azul)" opacity={active*.69}/>
  </g>
  <g opacity={active}>
    {Array.from({length:13},(_,i)=>{
      const phase=(time*(115+fault*62)+i*206)%2664;
      let x=-445, y=10;
      if(phase<890)x=phase-445;
      else if(phase<1332){x=445; y=10+phase-890;}
      else if(phase<2222){x=445-(phase-1332);y=452;}
      else y=452-(phase-2222);
      if((y===10 && Math.abs(x)<330)||(y===452 && (Math.abs(x)<78||(x>152&&x<274))))return null;
      return <g key={i} transform={"translate("+x+" "+y+")"}>
        <ellipse rx={fault>.45?25:18} ry={fault>.45?25:18} fill={fault>.45?"url(#e12calor)":"url(#e12azul)"} opacity=".73" />
        <circle r={fault>.45?5:3.5} fill={fault>.45?"#ffd68c":"#d8fff2"} />
      </g>;
    })}
  </g>
</g>;
