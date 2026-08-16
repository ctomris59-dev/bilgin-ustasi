import { useId } from "react";
import { ITEMS } from "../../data/avatarParts";

const OUTLINE = "#17213E";
function findItem(id) { return ITEMS.find((i) => i.id === id) || null; }
function skinColor(id) { return id === "skin-1" ? "#FFE0C2" : id === "skin-3" ? "#C98A5C" : id === "skin-4" ? "#8A5636" : "#F2C399"; }

export default function AvatarCanvas({ avatar, size = 220 }) {
  const uid = useId().replace(/:/g, "");
  const skin = skinColor(avatar.skin);
  const outfit = findItem(avatar.outfit);
  const shoes = findItem(avatar.shoes);
  const headwear = findItem(avatar.headwear);
  const face = findItem(avatar.face);
  const outfitColor = outfit?.color || "#6F8CFF";
  const shoesColor = shoes?.color || "#70D6FF";
  const hair = avatar.hairColor || "#5A3A2B";

  return <svg viewBox="0 0 210 280" width={size} height={size*1.33} role="img" aria-label="Kaşif karakteri" style={{ overflow:"visible" }}>
    <defs>
      <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".24"/><stop offset=".3" stopColor={skin}/><stop offset="1" stopColor={shade(skin,-18)}/></linearGradient>
      <linearGradient id={`${uid}-outfit`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={lighten(outfitColor,18)}/><stop offset=".55" stopColor={outfitColor}/><stop offset="1" stopColor={shade(outfitColor,-28)}/></linearGradient>
      <linearGradient id={`${uid}-hair`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={lighten(hair,16)}/><stop offset=".6" stopColor={hair}/><stop offset="1" stopColor={shade(hair,-35)}/></linearGradient>
      <filter id={`${uid}-shadow`} x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#020611" floodOpacity=".34"/></filter>
      <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>

    {headwear?.shape === "wings" && <Wings color={headwear.color} />}
    <ellipse cx="105" cy="261" rx="48" ry="10" fill="rgba(0,0,0,.24)" />
    <g filter={`url(#${uid}-shadow)`}>
      <Legs skin={skin} shoesColor={shoesColor} skinGrad={`${uid}-skin`} />
      <Arms skinGrad={`${uid}-skin`} outfitGrad={`${uid}-outfit`} />
      <Torso colorGrad={`${uid}-outfit`} outfit={outfit} />
      <Neck skinGrad={`${uid}-skin`} />
      <Head skinGrad={`${uid}-skin`} skin={skin} />
      <Hair style={avatar.hairStyle} gradient={`${uid}-hair`} color={hair} />
      {headwear?.shape !== "wings" && <Headwear item={headwear} />}
      <Face item={face} />
    </g>
    <circle cx="165" cy="42" r="2" fill="#fff" opacity=".6" className="animate-twinkle" />
    <circle cx="43" cy="92" r="1.5" fill="#52E3FF" opacity=".7" className="animate-twinkle" />
  </svg>;
}

function Head({ skinGrad, skin }) { return <g><path d="M63 72 Q66 35 105 30 Q144 35 147 72 L142 108 Q135 135 105 139 Q75 135 68 108 Z" fill={`url(#${skinGrad})`} stroke={OUTLINE} strokeWidth="2.4" strokeLinejoin="round"/><ellipse cx="78" cy="98" rx="9" ry="5" fill="#F58C94" opacity=".22"/><ellipse cx="132" cy="98" rx="9" ry="5" fill="#F58C94" opacity=".22"/><path d="M78 80 Q86 75 94 80" stroke={OUTLINE} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".74"/><path d="M116 80 Q124 75 132 80" stroke={OUTLINE} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".74"/><ellipse cx="86" cy="89" rx="5.3" ry="6.5" fill="#18223E"/><ellipse cx="124" cy="89" rx="5.3" ry="6.5" fill="#18223E"/><circle cx="88" cy="86.8" r="1.6" fill="#fff"/><circle cx="126" cy="86.8" r="1.6" fill="#fff"/><path d="M99 105 Q105 110 111 105" stroke="#9B5B57" strokeWidth="2.2" fill="none" strokeLinecap="round"/><path d="M105 92 Q102 101 107 101" stroke={shade(skin,-30)} strokeWidth="1.4" fill="none" opacity=".55"/></g>; }
function Neck({ skinGrad }) { return <path d="M95 131 L115 131 L118 153 Q105 161 92 153 Z" fill={`url(#${skinGrad})`} stroke={OUTLINE} strokeWidth="2.2"/>; }
function Torso({ colorGrad, outfit }) { const lab=outfit?.id?.includes('labcoat'); return <g><path d="M72 150 Q105 137 138 150 L146 221 Q105 235 64 221 Z" fill={`url(#${colorGrad})`} stroke={OUTLINE} strokeWidth="2.6" strokeLinejoin="round"/><path d="M82 155 Q105 171 128 155" stroke="rgba(255,255,255,.34)" strokeWidth="2" fill="none"/>{lab && <><path d="M105 151 L105 220" stroke="#fff" strokeOpacity=".55" strokeWidth="2"/><path d="M86 188 H100 V203 H86 Z" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.35)"/></>}</g>; }
function Arms({ skinGrad, outfitGrad }) { return <g><path d="M74 151 Q57 155 48 178 L42 207 Q45 215 54 211 L65 184 L79 170 Z" fill={`url(#${outfitGrad})`} stroke={OUTLINE} strokeWidth="2.4"/><path d="M136 151 Q153 155 162 178 L168 207 Q165 215 156 211 L145 184 L131 170 Z" fill={`url(#${outfitGrad})`} stroke={OUTLINE} strokeWidth="2.4"/><circle cx="48" cy="213" r="8" fill={`url(#${skinGrad})`} stroke={OUTLINE} strokeWidth="2"/><circle cx="162" cy="213" r="8" fill={`url(#${skinGrad})`} stroke={OUTLINE} strokeWidth="2"/></g>; }
function Legs({ skinGrad, shoesColor }) { return <g><path d="M78 218 L99 218 L96 252 L76 252 Z" fill={`url(#${skinGrad})`} stroke={OUTLINE} strokeWidth="2.2"/><path d="M111 218 L132 218 L134 252 L114 252 Z" fill={`url(#${skinGrad})`} stroke={OUTLINE} strokeWidth="2.2"/><path d="M70 248 Q84 243 98 249 L99 260 Q82 265 67 258 Z" fill={shoesColor} stroke={OUTLINE} strokeWidth="2.4"/><path d="M111 249 Q126 243 139 250 L143 258 Q126 265 111 260 Z" fill={shoesColor} stroke={OUTLINE} strokeWidth="2.4"/><path d="M73 251 H95" stroke="#fff" strokeOpacity=".4" strokeWidth="2"/><path d="M115 251 H138" stroke="#fff" strokeOpacity=".4" strokeWidth="2"/></g>; }

function Hair({ style, gradient, color }) {
  const p={ fill:`url(#${gradient})`, stroke:OUTLINE, strokeWidth:2.5, strokeLinejoin:"round" };
  if(style==='hair-space-buns') return <g><circle cx="72" cy="38" r="17" {...p}/><circle cx="138" cy="38" r="17" {...p}/><path d="M61 72 Q64 29 105 24 Q146 29 149 73 L138 92 Q137 58 105 49 Q73 58 72 92 Z" {...p}/><path d="M74 43 Q82 35 90 36" stroke="#fff" opacity=".2" strokeWidth="4" fill="none" strokeLinecap="round"/></g>;
  if(style==='hair-long-braid') return <g><path d="M59 72 Q64 30 105 25 Q147 30 151 72 L139 91 Q137 58 105 49 Q73 58 71 91 Z" {...p}/><path d="M136 74 Q158 113 146 164 Q138 172 132 164 Q143 121 129 85 Z" {...p}/><path d="M145 155 Q155 166 144 176 Q133 166 141 156" fill={color} stroke={OUTLINE} strokeWidth="2"/></g>;
  if(style==='hair-twin-pigtails') return <g><path d="M60 70 Q65 30 105 25 Q145 30 150 70 L138 91 Q136 58 105 49 Q74 58 72 91 Z" {...p}/><path d="M65 59 Q36 64 41 112 Q52 96 72 84 Z" {...p}/><path d="M145 59 Q174 64 169 112 Q158 96 138 84 Z" {...p}/></g>;
  if(style==='hair-wavy-long') return <g><path d="M56 68 Q60 27 105 23 Q150 27 154 68 Q166 115 151 167 Q141 173 134 161 Q146 112 137 75 Q128 54 105 50 Q82 54 73 75 Q64 112 76 161 Q69 173 59 167 Q44 115 56 68 Z" {...p}/></g>;
  if(style==='hair-curly-afro') return <g>{[[66,51,18],[84,33,18],[105,28,20],[127,34,18],[145,53,18],[63,73,16],[147,75,16]].map(([cx,cy,r],i)=><circle key={i} cx={cx} cy={cy} r={r} {...p}/>)}</g>;
  return <path d="M59 70 Q63 28 105 24 Q147 28 151 70 L140 103 Q137 61 105 50 Q73 61 70 103 Z" {...p}/>;
}

function Headwear({ item }) {
  if(!item) return null; const c=item.color, p={ fill:c, stroke:OUTLINE, strokeWidth:2.2, strokeLinejoin:"round" };
  switch(item.shape){
    case 'cap': return <g><path d="M68 55 Q105 26 142 55 L140 66 L69 66 Z" {...p}/><path d="M135 57 Q159 57 163 68 L136 67 Z" {...p}/></g>;
    case 'beanie': return <g><path d="M67 58 Q105 20 143 58 L142 69 L68 69 Z" {...p}/><rect x="65" y="61" width="80" height="12" rx="6" {...p}/></g>;
    case 'wizardhat': return <g><path d="M105 4 L139 61 L72 61 Z" {...p}/><ellipse cx="105" cy="61" rx="40" ry="8" {...p}/></g>;
    case 'detective-hat': return <g><path d="M71 55 Q105 29 139 55 L138 65 L72 65 Z" {...p}/><rect x="63" y="61" width="84" height="9" rx="5" {...p}/></g>;
    case 'crown': return <path d="M72 56 L81 29 L96 50 L105 21 L116 50 L132 29 L140 56 Z" {...p}/>;
    case 'hairbow': return <g transform="translate(137 48) rotate(-8)"><path d="M-15 -8 L0 2 L-15 13 Z M15 -8 L0 2 L15 13 Z" {...p}/><circle cy="2" r="4" {...p}/></g>;
    case 'flowercrown': return <g>{[74,90,106,122,138].map((x,i)=><circle key={x} cx={x} cy={51-Math.abs(106-x)*.18} r="6" fill={i%2? '#FFD166':c} stroke={OUTLINE} strokeWidth="1.8"/>)}</g>;
    case 'partyhat': return <path d="M105 12 L130 62 L80 62 Z" {...p}/>;
    case 'halo': return <ellipse cx="105" cy="28" rx="28" ry="8" fill="none" stroke={c} strokeWidth="6" opacity=".9"/>;
    default: return null;
  }
}
function Wings({ color }) { return <g opacity=".82"><path d="M65 151 Q13 112 20 190 Q49 177 71 161 Z" fill={color} stroke={OUTLINE} strokeWidth="2.2"/><path d="M145 151 Q197 112 190 190 Q161 177 139 161 Z" fill={color} stroke={OUTLINE} strokeWidth="2.2"/><path d="M37 158 Q51 151 64 158" stroke="#fff" strokeOpacity=".38" fill="none"/><path d="M173 158 Q159 151 146 158" stroke="#fff" strokeOpacity=".38" fill="none"/></g>; }
function Face({ item }) { if(!item)return null; const c=item.color; if(item.shape==='glasses')return <g><circle cx="86" cy="90" r="14" fill="rgba(255,255,255,.12)" stroke={c} strokeWidth="2.4"/><circle cx="124" cy="90" r="14" fill="rgba(255,255,255,.12)" stroke={c} strokeWidth="2.4"/><line x1="100" y1="90" x2="110" y2="90" stroke={c} strokeWidth="2.4"/></g>; if(item.shape==='sunglasses')return <g><path d="M72 80 H100 L96 100 H76 Z" fill={c} stroke={OUTLINE} strokeWidth="2.2"/><path d="M110 80 H138 L134 100 H114 Z" fill={c} stroke={OUTLINE} strokeWidth="2.2"/><line x1="100" y1="85" x2="110" y2="85" stroke={OUTLINE} strokeWidth="2"/></g>; if(item.shape==='magnifier')return <g transform="translate(158 181) rotate(22)"><circle r="15" fill="rgba(112,214,255,.16)" stroke={c} strokeWidth="3"/><line x1="10" y1="10" x2="27" y2="27" stroke={OUTLINE} strokeWidth="5" strokeLinecap="round"/></g>; if(item.shape==='wand')return <g transform="translate(163 184) rotate(-24)"><line x1="0" y1="0" x2="0" y2="-43" stroke={c} strokeWidth="5" strokeLinecap="round"/><path d="M0 -50 L5 -41 L-5 -41 Z" fill="#FFD166"/></g>; if(item.shape==='backpack-badge')return <rect x="136" y="151" width="19" height="26" rx="6" fill={c} stroke={OUTLINE} strokeWidth="2"/>; return null; }

function lighten(hex, amt){ return mix(hex,'#ffffff',amt/100); }
function shade(hex, amt){ return mix(hex,'#000000',Math.abs(amt)/100); }
function mix(a,b,t){ const pa=parseInt(a.replace('#','').padEnd(6,'0'),16), pb=parseInt(b.replace('#','').padEnd(6,'0'),16); const ar=(pa>>16)&255,ag=(pa>>8)&255,ab=pa&255,br=(pb>>16)&255,bg=(pb>>8)&255,bb=pb&255; const c=(Math.round(ar+(br-ar)*t)<<16)|(Math.round(ag+(bg-ag)*t)<<8)|Math.round(ab+(bb-ab)*t); return `#${c.toString(16).padStart(6,'0')}`; }
