import { ITEMS } from "../../data/avatarParts";

const FALLBACKS = {
  outfit: { color: "#5FE5D1", set: "gunluk", label: "Keşif Ceketi" },
  shoes: { color: "#62B5FF", set: "gunluk", label: "Işıklı Koşu Ayakkabısı" },
};

function findItem(id, slot) {
  if (!id) return FALLBACKS[slot] || null;
  return ITEMS.find((item) => item.id === id) || FALLBACKS[slot] || null;
}

function shade(hex, amount = -24) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return "#173F70";
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r} ${g} ${b})`;
}

export default function GameHero({ avatar = {}, pulseKey = "hero", compact = false }) {
  const outfit = findItem(avatar.outfit, "outfit");
  const shoes = findItem(avatar.shoes, "shoes");
  const headwear = findItem(avatar.headwear, "headwear");
  const face = findItem(avatar.face, "face");
  const back = findItem(avatar.back, "back");
  const outfitColor = outfit?.color || "#5FE5D1";
  const outfitDark = shade(outfitColor, -58);
  const shoeColor = shoes?.color || "#62B5FF";

  return (
    <div className={`v45-hero ${compact ? "is-compact" : ""}`} key={pulseKey}>
      <svg className="v45-hero-svg" viewBox="0 0 420 560" role="img" aria-label="Kıvırcık saçlı, yeşil gözlü Bilgin Kaşif">
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD7B7" />
            <stop offset="1" stopColor="#F2A97D" />
          </linearGradient>
          <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9A4D26" />
            <stop offset=".58" stopColor="#6A2F1C" />
            <stop offset="1" stopColor="#3F1C16" />
          </linearGradient>
          <linearGradient id="eye" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#83FFD1" />
            <stop offset="1" stopColor="#16B983" />
          </linearGradient>
          <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C8FFFF" stopOpacity=".72" />
            <stop offset="1" stopColor="#3C9EFF" stopOpacity=".45" />
          </linearGradient>
          <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#001532" floodOpacity=".42" />
          </filter>
          <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <ellipse cx="210" cy="520" rx="112" ry="20" fill="#2AF2DD" opacity=".16" />
        <ellipse cx="210" cy="515" rx="78" ry="10" fill="#70E9FF" opacity=".28" />

        {back && <BackLayer item={back} />}

        <g className="v45-hero-body" filter="url(#softShadow)">
          <path d="M153 305C164 274 187 258 210 258C233 258 256 274 267 305L287 412C290 431 275 447 256 447H164C145 447 130 431 133 412Z" fill={outfitDark} opacity=".96" />
          <path d="M167 291C181 276 194 270 210 270C226 270 239 276 253 291L263 409C264 421 254 431 242 431H178C166 431 156 421 157 409Z" fill={outfitColor} />
          <path d="M207 277L207 424" stroke="#EFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".86" />
          <path d="M176 309C191 316 229 316 244 309" fill="none" stroke="#EFFFFF" strokeWidth="3" opacity=".52" />
          <path d="M173 354H193V371H173Z" rx="5" fill="#092F54" opacity=".32" />
          <path d="M227 354H247V371H227Z" rx="5" fill="#092F54" opacity=".32" />
          <circle cx="210" cy="336" r="5" fill="#FFD166" />
          <circle cx="210" cy="359" r="5" fill="#FF8CA8" />
          <circle cx="210" cy="382" r="5" fill="#6CF1D0" />
          <path d="M154 314C137 331 128 360 125 392" fill="none" stroke={outfitColor} strokeWidth="28" strokeLinecap="round" />
          <path d="M266 314C283 331 292 360 295 392" fill="none" stroke={outfitColor} strokeWidth="28" strokeLinecap="round" />
          <circle cx="124" cy="402" r="18" fill="url(#skin)" />
          <circle cx="296" cy="402" r="18" fill="url(#skin)" />
          <path d="M173 430L167 494" stroke="#173757" strokeWidth="25" strokeLinecap="round" />
          <path d="M247 430L253 494" stroke="#173757" strokeWidth="25" strokeLinecap="round" />
          <Shoe x={140} y={474} color={shoeColor} mirrored={false} />
          <Shoe x={232} y={474} color={shoeColor} mirrored />

          <circle cx="210" cy="206" r="91" fill="url(#hair)" />
          <circle cx="210" cy="213" r="71" fill="url(#skin)" />
          <CurlyHair />
          <path d="M169 217C174 199 187 193 199 197" fill="none" stroke="#64301F" strokeWidth="7" strokeLinecap="round" opacity=".55" />
          <path d="M221 197C233 193 246 199 251 217" fill="none" stroke="#64301F" strokeWidth="7" strokeLinecap="round" opacity=".55" />
          <Eye cx={183} cy={222} />
          <Eye cx={237} cy={222} />
          <path d="M185 257C198 269 222 269 235 257" fill="none" stroke="#A94F58" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="167" cy="250" rx="17" ry="9" fill="#FF8F95" opacity=".34" />
          <ellipse cx="253" cy="250" rx="17" ry="9" fill="#FF8F95" opacity=".34" />
          <path d="M209 229L203 246L214 247" fill="none" stroke="#D88867" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M183 192C193 185 202 182 210 182C219 182 229 185 238 192" fill="none" stroke="#4A2118" strokeWidth="8" strokeLinecap="round" />
        </g>

        {headwear && <HeadwearLayer item={headwear} />}
        {face && <FaceLayer item={face} />}

        <g className="v45-hero-sparkles" filter="url(#glow)">
          <circle cx="105" cy="190" r="3.8" fill="#79F7E6" />
          <circle cx="319" cy="276" r="3" fill="#FFD166" />
          <path d="M323 159l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#70D6FF" />
        </g>
      </svg>
    </div>
  );
}

function Eye({ cx, cy }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="15" ry="18" fill="#FFFFFF" />
      <ellipse cx={cx} cy={cy + 1} rx="9.5" ry="12" fill="url(#eye)" />
      <ellipse cx={cx} cy={cy + 2} rx="4.2" ry="6" fill="#083C35" />
      <circle cx={cx - 3} cy={cy - 4} r="3" fill="#FFFFFF" />
    </g>
  );
}

function CurlyHair() {
  const curls = [
    [151,151,30],[181,135,32],[216,132,33],[251,143,31],[275,168,29],
    [146,184,28],[272,201,28],[147,222,26],[269,235,25],[158,259,25],
    [258,269,24],[178,281,25],[238,282,25]
  ];
  return <g>{curls.map(([cx,cy,r],i)=><circle key={i} cx={cx} cy={cy} r={r} fill="url(#hair)" />)}</g>;
}

function Shoe({ x, y, color, mirrored }) {
  return (
    <g transform={`translate(${x} ${y}) ${mirrored ? "scale(-1 1) translate(-48 0)" : ""}`}>
      <path d="M4 10C7 3 20 1 29 4L42 13C47 16 48 25 44 29C34 35 12 36 3 30C-1 25 0 16 4 10Z" fill={shade(color, -45)} />
      <path d="M6 9C13 5 22 5 30 8L43 18C37 23 13 25 3 20C3 15 4 12 6 9Z" fill={color} />
      <path d="M7 25C17 29 35 27 44 23" fill="none" stroke="#E9FFFF" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function BackLayer({ item }) {
  const c = item.color || "#7D8CFF";
  if (item.shape === "wings" || item.id?.includes("wing")) {
    return <g className="v45-rig-layer v45-rig-back">
      <path d="M165 330C105 312 69 269 82 224C122 232 158 253 184 292Z" fill={c} opacity=".55" stroke="#C7FFFF" strokeWidth="4" />
      <path d="M255 330C315 312 351 269 338 224C298 232 262 253 236 292Z" fill={c} opacity=".55" stroke="#C7FFFF" strokeWidth="4" />
      <path d="M104 250L159 306M316 250L261 306" stroke="#FFFFFF" strokeOpacity=".6" strokeWidth="3" />
    </g>;
  }
  return <g className="v45-rig-layer v45-rig-back">
    <rect x="142" y="286" width="136" height="128" rx="38" fill={shade(c,-45)} stroke="#9AF9F0" strokeOpacity=".55" strokeWidth="4" />
    <rect x="157" y="299" width="106" height="91" rx="28" fill={c} />
    <path d="M173 316C189 299 231 299 247 316" fill="none" stroke="#E9FFFF" strokeOpacity=".66" strokeWidth="5" />
  </g>;
}

function HeadwearLayer({ item }) {
  const c = item.color || "#FFD166";
  const shape = item.shape || "cap";
  if (shape === "halo") return <g className="v45-rig-layer v45-rig-head"><ellipse cx="210" cy="112" rx="70" ry="18" fill="none" stroke={c} strokeWidth="10" filter="url(#glow)" /></g>;
  if (shape === "crown") return <g className="v45-rig-layer v45-rig-head"><path d="M159 148L174 96L204 126L232 91L252 128L277 103L263 161Z" fill={c} stroke="#FFF2A8" strokeWidth="4" /><circle cx="205" cy="123" r="7" fill="#70D6FF" /></g>;
  if (shape === "hairbow") return <g className="v45-rig-layer v45-rig-head"><path d="M250 138C274 115 296 120 299 139C302 158 280 168 253 150C228 171 207 163 209 143C211 123 231 119 250 138Z" fill={c} stroke="#FFD9E8" strokeWidth="4" /><circle cx="253" cy="144" r="10" fill={shade(c,-35)} /></g>;
  if (shape === "wizardhat") return <g className="v45-rig-layer v45-rig-head"><path d="M183 142L222 54L255 145Z" fill={shade(c,-25)} stroke="#DDFEFF" strokeOpacity=".5" strokeWidth="3" /><ellipse cx="220" cy="148" rx="76" ry="19" fill={c} /><path d="M201 105L231 91L218 122Z" fill="#FFD166" opacity=".9" /></g>;
  if (shape === "flowercrown") return <g className="v45-rig-layer v45-rig-head"><path d="M159 159C180 137 241 134 267 159" fill="none" stroke="#56D99C" strokeWidth="8" strokeLinecap="round" />{[174,195,218,241,259].map((x,i)=><g key={x}><circle cx={x} cy={148 + (i%2)*4} r="11" fill={i%2 ? c : "#FFD166"}/><circle cx={x} cy={148 + (i%2)*4} r="4" fill="#FFF5D8"/></g>)}</g>;
  if (shape === "partyhat") return <g className="v45-rig-layer v45-rig-head"><path d="M188 153L217 76L248 154Z" fill={c} stroke="#FFF" strokeOpacity=".45" strokeWidth="3" /><circle cx="217" cy="72" r="11" fill="#FFD166" /></g>;
  return <g className="v45-rig-layer v45-rig-head"><path d="M155 164C160 121 190 103 219 104C250 105 274 124 278 163C244 146 190 145 155 164Z" fill={c} stroke="#DDFEFF" strokeOpacity=".38" strokeWidth="3" /><path d="M218 151C248 144 275 148 293 162C270 166 245 168 218 164Z" fill={shade(c,-35)} /></g>;
}

function FaceLayer({ item }) {
  const c = item.color || "#70D6FF";
  const shape = item.shape || "glasses";
  if (shape === "wand") return <g className="v45-rig-layer v45-rig-face"><path d="M300 370L346 315" stroke={shade(c,-35)} strokeWidth="9" strokeLinecap="round" /><path d="M347 299l8 15 16 8-16 8-8 15-8-15-15-8 15-8z" fill={c} filter="url(#glow)" /></g>;
  if (shape === "magnifier") return <g className="v45-rig-layer v45-rig-face"><circle cx="280" cy="235" r="28" fill="url(#visor)" stroke={c} strokeWidth="7" /><path d="M300 256L331 291" stroke={c} strokeWidth="10" strokeLinecap="round" /></g>;
  if (shape === "backpack-badge") return <g className="v45-rig-layer v45-rig-face"><path d="M298 330C312 323 330 328 336 341L342 371C344 381 336 391 325 391H299C289 391 281 381 283 371L289 342C290 337 293 333 298 330Z" fill={c} stroke="#FFF1AA" strokeWidth="4" /><path d="M299 346H327" stroke="#FFF" strokeOpacity=".7" strokeWidth="4" /></g>;
  const dark = shape === "sunglasses" || item.id?.includes("visor");
  return <g className="v45-rig-layer v45-rig-face">
    <rect x="158" y="205" width="47" height="35" rx="16" fill={dark ? "#09213E" : "url(#visor)"} stroke={c} strokeWidth="5" />
    <rect x="215" y="205" width="47" height="35" rx="16" fill={dark ? "#09213E" : "url(#visor)"} stroke={c} strokeWidth="5" />
    <path d="M205 220H215" stroke={c} strokeWidth="6" strokeLinecap="round" />
    <path d="M158 215L143 208M262 215L277 208" stroke={c} strokeWidth="5" strokeLinecap="round" />
  </g>;
}
