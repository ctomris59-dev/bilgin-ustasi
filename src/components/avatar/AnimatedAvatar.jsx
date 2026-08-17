import { useEffect, useId, useMemo, useRef, useState } from "react";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";

const SKIN = "#F3C3A2";
const SKIN_SHADOW = "#DFA27E";
const HAIR = "#5A301F";
const HAIR_DARK = "#321A13";
const HAIR_LIGHT = "#8B5030";
const EYE = "#35D58B";
const EYE_DARK = "#0F7B58";

export default function AnimatedAvatar({
  avatar = {},
  size = 320,
  animation = "idle",
  showEquipment = true,
  showBadges = false,
  compact = false,
}) {
  const uid = useId().replace(/:/g, "");
  const loadout = useMemo(() => getRigLoadout(avatar), [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]);
  const signature = useMemo(() => getRigSignature(avatar), [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]);
  const [blink, setBlink] = useState(false);
  const [equipBurst, setEquipBurst] = useState(false);
  const previousSignature = useRef(signature);

  useEffect(() => {
    let blinkTimer;
    let reopenTimer;
    let cancelled = false;
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        reopenTimer = window.setTimeout(() => {
          setBlink(false);
          if (!cancelled) scheduleBlink();
        }, 135);
      }, 2200 + Math.random() * 2600);
    };
    scheduleBlink();
    return () => {
      cancelled = true;
      window.clearTimeout(blinkTimer);
      window.clearTimeout(reopenTimer);
    };
  }, []);

  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setEquipBurst(true);
    const timer = window.setTimeout(() => setEquipBurst(false), 760);
    return () => window.clearTimeout(timer);
  }, [signature]);

  const motion = equipBurst ? "equip" : animation;
  const equippedCount = Object.values(loadout).filter(Boolean).length;

  return (
    <div
      className={`v5-animated-avatar motion-${motion} ${compact ? "is-compact" : ""}`}
      style={{ width: size, aspectRatio: "360 / 520" }}
      role="img"
      aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü Bilgin Kaşif`}
      data-avatar-version="5"
    >
      <div className="v5-avatar-glow" />
      {equipBurst && <div className="v5-equip-ring" aria-hidden="true" />}

      <svg className="v5-avatar-svg" viewBox="0 0 360 520" aria-hidden="true">
        <defs>
          <linearGradient id={`skin-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD8BC" />
            <stop offset="1" stopColor={SKIN} />
          </linearGradient>
          <linearGradient id={`hair-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={HAIR_LIGHT} />
            <stop offset="0.48" stopColor={HAIR} />
            <stop offset="1" stopColor={HAIR_DARK} />
          </linearGradient>
          <linearGradient id={`pants-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#263A55" />
            <stop offset="1" stopColor="#13233B" />
          </linearGradient>
          <filter id={`softShadow-${uid}`} x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#020915" floodOpacity="0.42" />
          </filter>
          <filter id={`spark-${uid}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <ellipse className="v5-avatar-ground" cx="180" cy="487" rx="92" ry="17" />

        {showEquipment && <BackEquipment item={loadout.back} />}
        <HairBack fill={`url(#hair-${uid})`} />

        <g className="v5-bone-legs" filter={`url(#softShadow-${uid})`}>
          <path d="M143 327 C140 360 139 403 143 448 L169 448 C174 404 174 363 171 328 Z" fill={`url(#pants-${uid})`} />
          <path d="M189 328 C186 365 186 405 191 448 L217 448 C221 403 220 363 216 327 Z" fill={`url(#pants-${uid})`} />
          <path d="M148 438 L166 438 L166 462 L146 462 Z" fill={`url(#skin-${uid})`} />
          <path d="M194 438 L213 438 L214 462 L193 462 Z" fill={`url(#skin-${uid})`} />
          {showEquipment ? <Shoes item={loadout.shoes} /> : <DefaultShoes />}
        </g>

        <g className="v5-bone-torso">
          <path d="M149 199 C158 192 167 189 180 189 C194 189 204 193 212 200 L211 232 L149 232 Z" fill={`url(#skin-${uid})`} />
          {showEquipment ? <Outfit item={loadout.outfit} /> : <Outfit item={null} />}
          <Arms outfit={showEquipment ? loadout.outfit : null} skinFill={`url(#skin-${uid})`} />
        </g>

        <g className="v5-bone-head">
          <ellipse cx="180" cy="135" rx="61" ry="67" fill={`url(#skin-${uid})`} />
          <ellipse cx="121" cy="143" rx="9" ry="15" fill={SKIN_SHADOW} opacity="0.55" />
          <ellipse cx="239" cy="143" rx="9" ry="15" fill={SKIN_SHADOW} opacity="0.55" />

          <g className={blink ? "v5-eyes is-blinking" : "v5-eyes"}>
            <path className="v5-eye-lid" d="M143 133 Q156 126 168 134" fill="none" stroke="#3B251F" strokeWidth="4" strokeLinecap="round" />
            <path className="v5-eye-lid" d="M192 134 Q205 126 218 133" fill="none" stroke="#3B251F" strokeWidth="4" strokeLinecap="round" />
            <g className="v5-eye-open">
              <ellipse cx="156" cy="138" rx="13" ry="14" fill="#F8FCFF" />
              <ellipse cx="205" cy="138" rx="13" ry="14" fill="#F8FCFF" />
              <circle cx="157" cy="139" r="8.5" fill={EYE} />
              <circle cx="204" cy="139" r="8.5" fill={EYE} />
              <circle cx="157" cy="140" r="4.7" fill={EYE_DARK} />
              <circle cx="204" cy="140" r="4.7" fill={EYE_DARK} />
              <circle cx="154" cy="136" r="2.4" fill="#FFFFFF" />
              <circle cx="201" cy="136" r="2.4" fill="#FFFFFF" />
            </g>
          </g>

          <path d="M174 155 Q180 159 186 155" fill="none" stroke="#C9826F" strokeWidth="2.5" strokeLinecap="round" />
          <path className="v5-mouth" d="M164 172 Q180 184 196 171" fill="none" stroke="#9C4E50" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="144" cy="159" rx="10" ry="5" fill="#F0958F" opacity="0.28" />
          <ellipse cx="216" cy="159" rx="10" ry="5" fill="#F0958F" opacity="0.28" />

          <HairFront fill={`url(#hair-${uid})`} />
          {showEquipment && <Headwear item={loadout.headwear} />}
          {showEquipment && <FaceAccessory item={loadout.face} />}
        </g>

        <g className="v5-avatar-sparkles" filter={`url(#spark-${uid})`}>
          <circle cx="95" cy="233" r="2.8" fill="#68ECFF" />
          <circle cx="272" cy="198" r="2.4" fill="#FFD76A" />
          <path d="M263 286 l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#7EF3D5" />
        </g>
      </svg>

      {showBadges && (
        <div className="v5-avatar-status">
          <span>V5 HERO</span>
          <b>{equippedCount}/5</b>
        </div>
      )}
    </div>
  );
}

function HairBack({ fill }) {
  const curls = [
    [132,88,24],[157,73,25],[185,70,25],[211,78,25],[231,96,24],
    [122,116,23],[238,122,23],[119,148,22],[241,151,22],[126,179,22],
    [235,180,22],[141,198,23],[219,200,23],[161,207,21],[198,209,21],
  ];
  return <g className="v5-hair-back">
    <path d="M122 84 C139 47 210 38 238 85 C263 126 248 202 220 219 L139 219 C111 197 99 126 122 84 Z" fill={fill} />
    {curls.map(([cx,cy,r],index)=><circle key={index} cx={cx} cy={cy} r={r} fill={fill} />)}
  </g>;
}

function HairFront({ fill }) {
  return <g className="v5-hair-front">
    <path d="M122 111 C126 72 154 57 184 58 C215 59 237 79 239 110 C224 92 211 91 199 95 C184 101 173 102 160 96 C145 89 133 94 122 111 Z" fill={fill} />
    <circle cx="133" cy="100" r="17" fill={fill}/><circle cx="151" cy="86" r="18" fill={fill}/><circle cx="174" cy="80" r="17" fill={fill}/><circle cx="198" cy="83" r="18" fill={fill}/><circle cx="220" cy="96" r="18" fill={fill}/>
    <path d="M124 124 Q132 116 139 123" fill="none" stroke={HAIR_LIGHT} strokeWidth="4" strokeLinecap="round" opacity=".65" />
    <path d="M219 113 Q228 106 234 116" fill="none" stroke={HAIR_LIGHT} strokeWidth="4" strokeLinecap="round" opacity=".55" />
  </g>;
}

function Outfit({ item }) {
  const primary = item?.kind === "lab" || item?.id === "outfit-tshirt" ? "#F5FAFF" : item?.primary || "#29A7FF";
  const secondary = item?.kind === "lab" || item?.id === "outfit-tshirt" ? "#36CBA7" : item?.secondary || "#0B5FC6";
  const kind = item?.kind || "jacket";

  if (kind === "dress" || kind === "robe") {
    return <g className="v5-slot-outfit">
      <path d="M145 209 Q180 194 215 209 L226 327 Q180 348 134 327 Z" fill={primary} stroke={secondary} strokeWidth="4" />
      <path d="M153 217 Q180 229 207 216" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity=".55" />
      <path d="M143 267 L217 267" stroke={secondary} strokeWidth="5" opacity=".8" />
      <circle cx="180" cy="242" r="5" fill="#FFD166" />
    </g>;
  }

  if (kind === "armor") {
    return <g className="v5-slot-outfit">
      <path d="M145 207 L180 197 L215 207 L221 310 L180 329 L139 310 Z" fill={primary} stroke={secondary} strokeWidth="5" />
      <path d="M154 218 L180 229 L206 218 L201 276 L180 290 L159 276 Z" fill="#0C203C" opacity=".42" />
      <path d="M180 205 V317 M145 255 H215" stroke="#DDF6FF" strokeWidth="3" opacity=".45" />
    </g>;
  }

  if (kind === "overall") {
    return <g className="v5-slot-outfit">
      <path d="M151 207 H209 L217 318 H143 Z" fill={primary} stroke={secondary} strokeWidth="4" />
      <path d="M158 207 L165 245 H195 L202 207" fill="#F7F9FF" opacity=".9" />
      <rect x="166" y="250" width="28" height="31" rx="7" fill={secondary} opacity=".75" />
    </g>;
  }

  return <g className="v5-slot-outfit">
    <path d="M146 207 Q161 198 180 198 Q199 198 214 207 L220 311 Q199 327 180 327 Q160 327 140 311 Z" fill={primary} stroke={secondary} strokeWidth="4" />
    <path d="M180 202 V318" stroke={secondary} strokeWidth="4" />
    <path d="M151 216 Q165 226 180 226 Q195 226 209 216" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity=".7" />
    <path d="M149 274 H169 M191 274 H211" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
    <circle cx="180" cy="246" r="4" fill="#FFD166" />
    <circle cx="180" cy="264" r="4" fill="#FFD166" />
    {item?.id === "outfit-tshirt" && <g><rect x="192" y="229" width="14" height="12" rx="3" fill="#43D7B5"/><path d="M197 233 l3 3 5-6" fill="none" stroke="#fff" strokeWidth="2"/></g>}
  </g>;
}

function Arms({ outfit, skinFill }) {
  const primary = outfit?.kind === "lab" || outfit?.id === "outfit-tshirt" ? "#F5FAFF" : outfit?.primary || "#29A7FF";
  const secondary = outfit?.kind === "lab" || outfit?.id === "outfit-tshirt" ? "#36CBA7" : outfit?.secondary || "#0B5FC6";
  return <>
    <g className="v5-arm v5-arm-left">
      <path d="M150 216 C130 224 119 254 110 286" fill="none" stroke={primary} strokeWidth="25" strokeLinecap="round" />
      <path d="M150 217 C131 226 121 251 114 274" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" opacity=".8" />
      <circle cx="108" cy="294" r="13" fill={skinFill} />
    </g>
    <g className="v5-arm v5-arm-right">
      <path d="M210 216 C230 224 241 254 250 286" fill="none" stroke={primary} strokeWidth="25" strokeLinecap="round" />
      <path d="M210 217 C229 226 239 251 246 274" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" opacity=".8" />
      <circle cx="252" cy="294" r="13" fill={skinFill} />
    </g>
  </>;
}

function DefaultShoes() {
  return <g><path d="M138 455 Q153 447 171 456 L171 477 Q145 483 132 472 Z" fill="#4E3527"/><path d="M188 456 Q207 447 221 456 L228 472 Q214 483 188 477 Z" fill="#4E3527"/></g>;
}

function Shoes({ item }) {
  if (!item) return <DefaultShoes />;
  const primary = item.primary || "#4E3527";
  const secondary = item.secondary || "#261C18";
  if (item.kind === "sandals") return <g className="v5-slot-shoes"><path d="M137 463 Q154 455 171 462 L172 477 Q147 484 134 473 Z" fill={secondary}/><path d="M143 459 L168 471 M139 470 L166 459" stroke={primary} strokeWidth="5"/><path d="M189 462 Q207 455 222 463 L227 474 Q211 483 188 477 Z" fill={secondary}/><path d="M194 459 L220 470 M192 471 L218 459" stroke={primary} strokeWidth="5"/></g>;
  if (item.kind === "boots") return <g className="v5-slot-shoes"><path d="M139 431 H170 L172 476 Q147 483 133 472 L140 455 Z" fill={primary} stroke={secondary} strokeWidth="4"/><path d="M190 431 H220 L227 472 Q213 483 188 476 Z" fill={primary} stroke={secondary} strokeWidth="4"/><path d="M145 446 H166 M195 446 H217" stroke="#F0E3C0" strokeWidth="3" opacity=".75"/></g>;
  return <g className="v5-slot-shoes"><path d="M138 454 Q153 445 171 455 L175 469 Q161 481 133 474 Z" fill={primary} stroke={secondary} strokeWidth="4"/><path d="M188 455 Q207 445 221 455 L228 474 Q200 481 186 469 Z" fill={primary} stroke={secondary} strokeWidth="4"/><path d="M145 458 L167 464 M194 464 L217 458" stroke="#F7FBFF" strokeWidth="3"/></g>;
}

function BackEquipment({ item }) {
  if (!item) return null;
  if (item.kind === "wings") return <g className="v5-slot-back v5-wings" opacity=".93"><path d="M153 225 C112 183 71 193 74 244 C78 284 113 298 153 270 Z" fill={item.primary} stroke="#DFFBFF" strokeWidth="4"/><path d="M207 225 C248 183 289 193 286 244 C282 284 247 298 207 270 Z" fill={item.primary} stroke="#DFFBFF" strokeWidth="4"/><path d="M142 237 C113 223 97 230 91 252 M218 237 C247 223 263 230 269 252" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity=".55"/></g>;
  return <g className="v5-slot-back"><rect x="129" y="215" width="102" height="113" rx="30" fill={item.primary} stroke={item.secondary} strokeWidth="5"/><rect x="146" y="236" width="68" height="42" rx="15" fill={item.secondary} opacity=".65"/><path d="M149 219 Q180 194 211 219" fill="none" stroke="#DDF6FF" strokeWidth="5" opacity=".45"/></g>;
}

function Headwear({ item }) {
  if (!item) return null;
  const primary = item.primary || "#29A7FF";
  const secondary = item.secondary || "#0B5FC6";
  const kind = item.kind;
  if (kind === "crown") return <g className="v5-slot-headwear"><path d="M145 72 L158 43 L177 65 L195 40 L213 70 L214 87 L146 87 Z" fill="#FFD166" stroke="#FFF0A0" strokeWidth="4"/><circle cx="158" cy="61" r="5" fill="#65E4FF"/><circle cx="195" cy="58" r="5" fill="#D987FF"/></g>;
  if (kind === "halo") return <g className="v5-slot-headwear"><ellipse cx="180" cy="59" rx="48" ry="13" fill="none" stroke="#FFE57D" strokeWidth="8" opacity=".92"/></g>;
  if (/wizard/i.test(kind)) return <g className="v5-slot-headwear"><path d="M144 91 L177 31 L211 91 Z" fill={primary} stroke={secondary} strokeWidth="5"/><ellipse cx="180" cy="91" rx="52" ry="13" fill={secondary}/><circle cx="177" cy="62" r="5" fill="#FFD166"/></g>;
  if (/hairbow/i.test(kind)) return <g className="v5-slot-headwear"><path d="M213 78 C234 57 245 72 235 91 C248 94 239 112 216 97 Z" fill={primary} stroke={secondary} strokeWidth="4"/><circle cx="216" cy="91" r="9" fill="#FFD166"/></g>;
  if (/beanie/i.test(kind)) return <g className="v5-slot-headwear"><path d="M136 93 Q143 49 180 48 Q218 49 225 93 Z" fill={primary} stroke={secondary} strokeWidth="5"/><rect x="134" y="85" width="92" height="18" rx="9" fill={secondary}/></g>;
  return <g className="v5-slot-headwear"><path d="M137 92 Q146 57 180 57 Q213 57 222 92 Z" fill={primary} stroke={secondary} strokeWidth="5"/><path d="M174 91 Q215 86 237 101 Q201 108 171 101 Z" fill={secondary}/></g>;
}

function FaceAccessory({ item }) {
  if (!item) return null;
  const primary = item.primary || "#52E3C2";
  if (/glasses|sunglasses/i.test(item.kind)) return <g className="v5-slot-face"><rect x="139" y="126" width="34" height="26" rx="12" fill="none" stroke={primary} strokeWidth="5"/><rect x="188" y="126" width="34" height="26" rx="12" fill="none" stroke={primary} strokeWidth="5"/><path d="M173 137 H188" stroke={primary} strokeWidth="5"/></g>;
  if (/magnifier/i.test(item.kind)) return <g className="v5-slot-face"><circle cx="225" cy="169" r="18" fill="none" stroke={primary} strokeWidth="6"/><path d="M238 181 L258 204" stroke={primary} strokeWidth="7" strokeLinecap="round"/></g>;
  if (/wand/i.test(item.kind)) return <g className="v5-slot-face"><path d="M252 232 L281 184" stroke={primary} strokeWidth="7" strokeLinecap="round"/><path d="M281 174 l5 10 10 5-10 5-5 10-5-10-10-5 10-5z" fill="#FFD166"/></g>;
  return <g className="v5-slot-face"><circle cx="225" cy="170" r="7" fill={primary}/><path d="M219 170 H202" stroke={primary} strokeWidth="4" strokeLinecap="round"/></g>;
}
