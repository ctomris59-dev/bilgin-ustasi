import { HERO_ANCHORS } from "../../data/heroAnchors";

function palette(item) {
  const rig = item?.rig || {};
  return {
    base: rig.base || item?.color || "#29a7ff",
    secondary: rig.secondary || rig.base || item?.color || "#1766a9",
    trim: rig.trim || "#eafcff",
    dark: rig.dark || "#19384e",
  };
}

export default function WornAsset({ item, worn, uid, phase = "front" }) {
  if (!item || !worn?.key) return null;
  const p = palette(item);
  const key = worn.key;

  if (phase === "behind") {
    if (key === "back.explorerPack") return <ExplorerPackBehind p={p} />;
    if (key === "back.crystalWings") return <CrystalWings p={p} uid={uid} />;
    if (key === "back.scrollPack") return <ScrollPackBehind p={p} />;
    return null;
  }

  if (phase === "front") {
    if (key === "outfit.explorer") return <ExplorerOutfit p={p} />;
    if (key === "outfit.cosmicArmor") return <CosmicArmor p={p} uid={uid} />;
    if (key === "outfit.cloudDress") return <CloudDress p={p} uid={uid} />;
    if (key === "outfit.emeraldRobe") return <EmeraldRobe p={p} uid={uid} />;

    if (key === "shoes.explorerBoots") return <ExplorerBoots p={p} />;
    if (key === "shoes.redSneakers") return <RedSneakers p={p} />;
    if (key === "shoes.cloud") return <CloudShoes p={p} />;
    if (key === "shoes.sandals") return <Sandals p={p} />;

    if (key === "head.pilotGoggles") return <PilotGoggles p={p} />;
    if (key === "head.wizardHat") return <WizardHat p={p} />;
    if (key === "head.goldCrown") return <GoldCrown p={p} />;

    if (key === "accessory.monocle") return <Monocle p={p} />;
    if (key === "accessory.compassNecklace") return <CompassNecklace p={p} />;
    if (key === "accessory.starBrooch") return <StarBrooch p={p} />;
    if (key === "accessory.wand") return <Wand p={p} />;

    if (key === "back.explorerPack") return <ExplorerPackFront p={p} />;
    if (key === "back.scrollPack") return <ScrollPackFront p={p} />;
  }

  return null;
}

function ExplorerOutfit({ p }) {
  return <g className="v46-worn v46-outfit-explorer">
    <path d="M151 91 Q160 98 169 91 L181 100 L194 124 L188 159 L179 168 L171 155 L169 116 L151 116 L149 155 L140 168 L130 158 L126 124 L139 100 Z" fill={p.base} stroke={p.dark} strokeWidth="2.2"/>
    <path d="M151 93 L160 111 L170 93" fill="#f8fbfd" stroke={p.dark} strokeWidth="1.6"/>
    <path d="M160 111 V167" stroke={p.trim} strokeWidth="2.6" strokeLinecap="round"/>
    <path d="M137 137 H151 M169 137 H184" stroke={p.trim} strokeWidth="2.4" strokeLinecap="round"/>
    <circle cx="160" cy="128" r="2.4" fill={p.trim}/><circle cx="160" cy="145" r="2.4" fill={p.trim}/>
    <rect x="176" y="116" width="11" height="9" rx="2" fill={p.trim}/>
    <path d="M178 121 l3 2.5 4.5-5" fill="none" stroke={p.dark} strokeWidth="1.4"/>
  </g>;
}

function CosmicArmor({ p, uid }) {
  return <g className="v46-worn v46-outfit-cosmic">
    <defs><linearGradient id={`v46-cosmic-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={p.base}/><stop offset=".48" stopColor={p.secondary}/><stop offset="1" stopColor="#8d45ff"/></linearGradient></defs>
    <path d="M149 92 L160 102 L173 92 L185 101 L194 124 L187 158 L178 166 L171 150 L169 119 L151 119 L148 150 L140 166 L131 157 L126 124 L137 101 Z" fill={`url(#v46-cosmic-${uid})`} stroke={p.trim} strokeWidth="2.1"/>
    <path d="M141 111 L160 121 L181 111 L178 144 L160 157 L143 144 Z" fill="#1e2c73" fillOpacity=".7" stroke={p.trim} strokeWidth="1.8"/>
    <path d="M132 104 L145 97 L149 111 L137 119 Z M188 104 L175 97 L171 111 L184 119 Z" fill={p.secondary} stroke={p.trim} strokeWidth="1.5"/>
    <circle cx="160" cy="132" r="5" fill="#7ff3ff"/><circle cx="160" cy="132" r="2" fill="#ffffff"/>
    <circle cx="146" cy="121" r="1.5" fill="#fff5b0"/><circle cx="175" cy="143" r="1.3" fill="#ffffff"/><circle cx="181" cy="118" r="1" fill="#8ff8ff"/>
  </g>;
}

function CloudDress({ p, uid }) {
  return <g className="v46-worn v46-outfit-cloud">
    <defs><linearGradient id={`v46-cloud-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fbfeff"/><stop offset="1" stopColor={p.secondary}/></linearGradient></defs>
    <path d="M148 95 Q160 103 172 95 L183 104 L188 139 L177 157 L169 149 L168 116 L152 116 L151 149 L143 157 L132 139 L137 104 Z" fill={`url(#v46-cloud-${uid})`} stroke="#eafdff" strokeWidth="2"/>
    <path d="M143 154 Q160 166 177 154 L196 229 Q160 246 124 229 Z" fill={`url(#v46-cloud-${uid})`} stroke="#eafdff" strokeWidth="2.2"/>
    <path d="M128 222 Q160 238 192 222" fill="none" stroke="#ffffff" strokeWidth="3" opacity=".85"/>
    <path d="M142 110 q8-11 16 0 q7-13 16 0 q8-8 14 2" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="146" cy="137" r="4" fill="#fff" opacity=".85"/><circle cx="153" cy="134" r="5" fill="#fff" opacity=".85"/><circle cx="161" cy="137" r="4" fill="#fff" opacity=".85"/>
  </g>;
}

function EmeraldRobe({ p, uid }) {
  return <g className="v46-worn v46-outfit-emerald">
    <defs><linearGradient id={`v46-emerald-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={p.base}/><stop offset="1" stopColor={p.secondary}/></linearGradient></defs>
    <path d="M149 93 Q160 101 172 93 L185 103 L191 137 L180 159 L170 150 L168 116 L152 116 L150 150 L140 159 L129 137 L136 103 Z" fill={`url(#v46-emerald-${uid})`} stroke={p.trim} strokeWidth="2.1"/>
    <path d="M141 154 Q160 166 179 154 L200 241 Q160 261 120 241 Z" fill={`url(#v46-emerald-${uid})`} stroke={p.trim} strokeWidth="2.2"/>
    <path d="M160 105 V238 M132 225 Q160 241 188 225" fill="none" stroke={p.trim} strokeWidth="2" opacity=".82"/>
    <path d="M160 119 l5 8 9 2-7 6 1 9-8-5-8 5 2-9-7-6 9-2z" fill={p.trim} opacity=".82"/>
  </g>;
}

function ExplorerBoots({ p }) {
  return <g className="v46-worn v46-shoes-boots">
    <path d="M105 343 Q120 337 139 344 L143 376 Q151 391 143 408 Q122 419 96 410 Q93 399 104 389 Z" fill={p.base} stroke={p.dark} strokeWidth="2.2"/>
    <path d="M208 359 Q226 352 243 362 L246 391 Q257 404 249 420 Q228 429 209 421 Q203 409 211 397 Z" fill={p.base} stroke={p.dark} strokeWidth="2.2"/>
    <path d="M109 353 L137 371 M112 366 L140 384 M214 370 L240 388 M216 383 L242 400" stroke={p.trim} strokeWidth="2"/>
    <path d="M98 407 Q121 417 145 407 M210 418 Q230 427 250 417" fill="none" stroke="#222" strokeWidth="4"/>
  </g>;
}

function RedSneakers({ p }) {
  return <g className="v46-worn v46-shoes-sneakers">
    <path d="M103 375 Q118 368 136 375 L147 395 Q146 406 134 410 L102 408 Q94 401 98 393 Z" fill={p.base} stroke={p.dark} strokeWidth="2"/>
    <path d="M211 391 Q227 383 242 390 L253 408 Q252 418 240 422 L211 421 Q204 415 207 406 Z" fill={p.base} stroke={p.dark} strokeWidth="2"/>
    <path d="M104 389 H139 M213 405 H247" stroke={p.trim} strokeWidth="3"/>
    <path d="M108 380 L133 394 M216 396 L239 409" stroke="#fff" strokeWidth="1.8"/>
  </g>;
}

function CloudShoes({ p }) {
  return <g className="v46-worn v46-shoes-cloud">
    <path d="M101 369 Q111 357 123 365 Q132 353 141 368 Q151 370 150 385 L144 405 Q123 416 99 407 Q91 396 98 384 Z" fill={p.base} stroke={p.dark} strokeWidth="2"/>
    <path d="M207 386 Q217 374 228 382 Q238 370 247 386 Q257 389 256 403 L250 420 Q230 429 208 421 Q200 412 204 399 Z" fill={p.base} stroke={p.dark} strokeWidth="2"/>
    <path d="M100 390 q8-9 15 0 q8-12 17 0 q8-7 15 1 M207 405 q8-9 15 0 q8-12 17 0 q8-7 15 1" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
  </g>;
}

function Sandals({ p }) {
  return <g className="v46-worn v46-shoes-sandals">
    <path d="M99 398 Q119 407 143 398 L145 407 Q120 418 97 409 Z" fill={p.dark}/>
    <path d="M209 414 Q229 422 250 414 L251 421 Q230 429 208 423 Z" fill={p.dark}/>
    <path d="M104 387 L137 404 M110 378 L133 404 M214 402 L245 418 M219 393 L241 418" fill="none" stroke={p.base} strokeWidth="5" strokeLinecap="round"/>
    <path d="M104 378 Q118 371 137 378 M214 393 Q229 386 244 393" fill="none" stroke={p.trim} strokeWidth="2"/>
  </g>;
}

function PilotGoggles({ p }) {
  const y = HERO_ANCHORS.forehead.y - 2;
  return <g className="v46-worn v46-head-goggles">
    <path d={`M126 ${y} Q160 ${y-10} 194 ${y}`} fill="none" stroke={p.dark} strokeWidth="5" strokeLinecap="round"/>
    <ellipse cx="145" cy={y} rx="16" ry="10" fill="#58c9ff" fillOpacity=".45" stroke={p.trim} strokeWidth="3" transform={`rotate(-8 145 ${y})`}/>
    <ellipse cx="176" cy={y} rx="16" ry="10" fill="#58c9ff" fillOpacity=".45" stroke={p.trim} strokeWidth="3" transform={`rotate(8 176 ${y})`}/>
    <path d={`M160 ${y-2} H161`} stroke={p.trim} strokeWidth="4"/>
  </g>;
}

function WizardHat({ p }) {
  return <g className="v46-worn v46-head-wizard">
    <path d="M111 63 Q160 48 209 63 Q199 75 160 74 Q121 75 111 63 Z" fill={p.base} stroke={p.trim} strokeWidth="2.2"/>
    <path d="M134 59 L166 5 Q180 27 192 63 Z" fill={p.base} stroke={p.trim} strokeWidth="2.2"/>
    <path d="M144 46 Q166 53 185 44" fill="none" stroke={p.secondary} strokeWidth="4"/>
    <circle cx="169" cy="29" r="3" fill={p.trim}/>
  </g>;
}

function GoldCrown({ p }) {
  return <g className="v46-worn v46-head-crown">
    <path d="M128 57 L134 30 L151 45 L160 21 L174 45 L190 30 L192 59 Z" fill={p.base} stroke={p.dark} strokeWidth="2.2"/>
    <path d="M132 55 H189" stroke={p.trim} strokeWidth="4"/>
    <circle cx="160" cy="39" r="4" fill="#63e9ff"/><circle cx="142" cy="45" r="3" fill="#ff6c8f"/><circle cx="180" cy="45" r="3" fill="#8d72ff"/>
  </g>;
}

function Monocle({ p }) {
  const a = HERO_ANCHORS.rightEye;
  return <g className="v46-worn v46-accessory-monocle">
    <circle cx={a.x} cy={a.y} r="10.5" fill="#baf7ff" fillOpacity=".10" stroke={p.base} strokeWidth="2.4"/>
    <circle cx={a.x} cy={a.y} r="8.1" fill="none" stroke={p.trim} strokeWidth="1.1" opacity=".9"/>
    <path d={`M${a.x+8} ${a.y+8} Q${a.x+14} ${a.y+20} ${a.x+7} ${a.y+33}`} fill="none" stroke={p.base} strokeWidth="1.8"/>
  </g>;
}

function CompassNecklace({ p }) {
  const a = HERO_ANCHORS.chest;
  return <g className="v46-worn v46-accessory-necklace">
    <path d={`M${a.x-17} ${a.y-20} Q${a.x} ${a.y-4} ${a.x+17} ${a.y-20}`} fill="none" stroke={p.dark} strokeWidth="2"/>
    <circle cx={a.x} cy={a.y-3} r="8" fill={p.base} stroke={p.trim} strokeWidth="2"/>
    <path d={`M${a.x} ${a.y-9} l3 6-3 6-3-6z`} fill="#64dfff" stroke={p.dark} strokeWidth=".8"/>
  </g>;
}

function StarBrooch({ p }) {
  const x = 185, y = 120;
  return <g className="v46-worn v46-accessory-brooch"><path d={`M${x} ${y-8} l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z`} fill={p.base} stroke={p.trim} strokeWidth="1.5"/></g>;
}

function Wand({ p }) {
  const a = HERO_ANCHORS.rightHand;
  return <g className="v46-worn v46-accessory-wand">
    <path d={`M${a.x-3} ${a.y+1} L${a.x+31} ${a.y-45}`} stroke={p.dark} strokeWidth="5" strokeLinecap="round"/>
    <path d={`M${a.x+32} ${a.y-53} l4 8 9 2-7 6 1 9-8-4-8 5 2-9-7-6 9-2z`} fill={p.trim} stroke={p.base} strokeWidth="1.6"/>
  </g>;
}

function ExplorerPackBehind({ p }) {
  return <g className="v46-worn v46-back-pack-behind">
    <path d="M188 103 Q214 96 229 116 L235 165 Q228 190 203 184 L187 166 Z" fill={p.base} stroke={p.dark} strokeWidth="2.4"/>
    <rect x="196" y="116" width="27" height="27" rx="7" fill={p.secondary} stroke={p.trim} strokeWidth="1.6"/>
    <path d="M203 102 Q210 87 221 100" fill="none" stroke={p.dark} strokeWidth="4"/>
  </g>;
}
function ExplorerPackFront({ p }) {
  return <g className="v46-worn v46-back-pack-front"><path d="M145 101 Q134 132 143 163 M180 99 Q194 132 184 164" fill="none" stroke={p.dark} strokeWidth="4" opacity=".9"/><path d="M145 126 Q160 134 184 126" fill="none" stroke={p.trim} strokeWidth="1.7" opacity=".75"/></g>;
}

function CrystalWings({ p, uid }) {
  return <g className="v46-worn v46-back-wings">
    <defs><linearGradient id={`v46-wing-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={p.trim}/><stop offset=".55" stopColor={p.base}/><stop offset="1" stopColor={p.secondary}/></linearGradient></defs>
    <path d="M143 132 C112 102 73 111 52 148 C84 140 101 153 115 177 C90 171 71 183 63 207 C98 198 121 181 145 154 Z" fill={`url(#v46-wing-${uid})`} fillOpacity=".75" stroke={p.trim} strokeWidth="2"/>
    <path d="M178 132 C209 102 248 111 269 148 C237 140 220 153 206 177 C231 171 250 183 258 207 C223 198 200 181 176 154 Z" fill={`url(#v46-wing-${uid})`} fillOpacity=".75" stroke={p.trim} strokeWidth="2"/>
  </g>;
}

function ScrollPackBehind({ p }) {
  return <g className="v46-worn v46-back-scroll-behind">
    <path d="M200 112 Q223 112 229 132 L229 177 Q214 190 195 178 L188 139 Z" fill={p.base} stroke={p.dark} strokeWidth="2.3"/>
    <rect x="199" y="92" width="12" height="70" rx="6" fill="#e8cf9a" stroke={p.dark} strokeWidth="2" transform="rotate(9 205 127)"/>
    <path d="M196 103 Q207 96 217 104 M195 155 Q207 163 221 155" fill="none" stroke={p.trim} strokeWidth="2"/>
  </g>;
}
function ScrollPackFront({ p }) {
  return <g className="v46-worn v46-back-scroll-front"><path d="M181 105 Q195 133 185 164" fill="none" stroke={p.dark} strokeWidth="4"/><circle cx="186" cy="132" r="3" fill={p.trim}/></g>;
}
