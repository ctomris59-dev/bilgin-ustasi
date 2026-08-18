import { useEffect, useId, useMemo, useRef, useState } from "react";
import heroMaster from "../../assets/avatar-v5/premium/heroMasterData.js";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";
import { PREMIUM_RIG_MASKS } from "../../data/premiumRigMasks";

const VIEW_W = 320;
const VIEW_H = 427;
const LEG_SKIN = "#d49a74";
const SOCK = "#d9e1e8";
const HAIR = "#6b351f";

function motionFrame(motion, elapsed) {
  const t = elapsed / 1000;
  if (motion === "thinking") return { x: 6 + Math.sin(t * 2.4) * 2, y: -7 + Math.sin(t * 3) * 2, rotate: 3.6 + Math.sin(t * 2.1) * 1.4, scale: 1.012 };
  if (motion === "happy") {
    const b = Math.abs(Math.sin(t * 5.1));
    return { x: Math.sin(t * 3.5) * 2.8, y: -5 - b * 17, rotate: Math.sin(t * 4.4) * 1.8, scale: 1 + b * .024 };
  }
  if (motion === "victory") {
    const p = (t % 1.25) / 1.25;
    const jump = p < .72 ? Math.sin(Math.PI * (p / .72)) : 0;
    return { x: Math.sin(t * 5) * 3.5, y: -jump * 32, rotate: Math.sin(t * 4.8) * 2.5, scale: 1 + jump * .032 };
  }
  if (motion === "levelup") {
    const p = (Math.sin(t * 4.2) + 1) / 2;
    return { x: 0, y: -p * 14, rotate: 0, scale: 1 + p * .032 };
  }
  if (motion === "equip") {
    const p = Math.min(elapsed / 720, 1);
    const pop = Math.sin(Math.PI * p);
    return { x: 0, y: -pop * 10, rotate: 0, scale: .94 + p * .06 + pop * .06 };
  }
  const breathe = (Math.sin(t * 2) + 1) / 2;
  return { x: Math.sin(t * 1.2) * 1.5, y: -2 - breathe * 6, rotate: Math.sin(t * 1.3) * .55, scale: 1 + breathe * .008 };
}

function tone(item) {
  const rig = item?.rig || {};
  return {
    base: rig.base || item?.color || "#2f9fe8",
    secondary: rig.secondary || rig.base || item?.color || "#1766a9",
    trim: rig.trim || "#dff8ff",
    dark: rig.dark || "#153c58",
    style: rig.style || item?.kind || "default",
  };
}

function filterFor(item, slot) {
  const t = tone(item);
  if (slot === "outfit" && t.style === "explorer") return "grayscale(1) brightness(1.68) contrast(.82)";
  if (t.style === "cosmicArmor") return "hue-rotate(60deg) saturate(1.65) brightness(.98)";
  if (t.style === "cloud") return "grayscale(.6) hue-rotate(160deg) saturate(1.2) brightness(1.35)";
  if (t.style === "emeraldRobe") return "hue-rotate(-50deg) saturate(1.55) brightness(.86)";
  if (t.style === "sneaker") return "hue-rotate(115deg) saturate(1.6) brightness(.9)";
  if (t.style === "cloudBoot") return "grayscale(.65) hue-rotate(155deg) saturate(1.1) brightness(1.34)";
  if (t.style === "sandal") return "sepia(.35) saturate(1.05) brightness(.92)";
  return "none";
}

export default function AnimatedAvatar({ avatar = {}, size = 320, animation = "idle", showEquipment = true, showBadges = false, compact = false }) {
  const uid = useId().replace(/:/g, "");
  const loadout = useMemo(() => getRigLoadout(avatar), [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]);
  const signature = useMemo(() => getRigSignature(avatar), [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]);
  const previousSignature = useRef(signature);
  const stackRef = useRef(null);
  const [equipBurst, setEquipBurst] = useState(false);

  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setEquipBurst(true);
    const timer = window.setTimeout(() => setEquipBurst(false), 760);
    return () => window.clearTimeout(timer);
  }, [signature]);

  const motion = equipBurst ? "equip" : animation;

  useEffect(() => {
    const node = stackRef.current;
    if (!node) return undefined;
    let raf = 0;
    let stopped = false;
    const start = performance.now();
    const tick = (now) => {
      if (stopped || !stackRef.current) return;
      const f = motionFrame(motion, now - start);
      stackRef.current.style.transform = `translate3d(${f.x.toFixed(2)}px,${f.y.toFixed(2)}px,0) rotate(${f.rotate.toFixed(2)}deg) scale(${f.scale.toFixed(4)})`;
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(raf);
      if (node) node.style.transform = "translate3d(0,0,0) rotate(0deg) scale(1)";
    };
  }, [motion]);

  const equippedCount = Object.values(loadout).filter(Boolean).length;

  return (
    <div
      className={`v5-animated-avatar v5p-avatar v45-live-avatar v456-core-avatar motion-${motion} ${compact ? "is-compact" : ""}`}
      style={{ width: size, aspectRatio: `${VIEW_W}/${VIEW_H}` }}
      role="img"
      aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü tek master kahraman`}
      data-avatar-version="4.5.6-core18"
      data-motion={motion}
      data-rig-signature={signature}
    >
      <div className="v5p-aura" aria-hidden="true" />
      <div className="v5p-floor" aria-hidden="true" />
      {equipBurst && <div className="v5p-equip-ring" aria-hidden="true" />}

      <div ref={stackRef} className="v45-live-stack" aria-hidden="true">
        {showEquipment && <BackBehind item={loadout.back} uid={uid} />}
        <img src={heroMaster} alt="" draggable="false" className="v45-live-master" />
        {showEquipment && (
          <svg className="v455-mask-svg v456-core-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              {Object.entries(PREMIUM_RIG_MASKS).map(([slot, paths]) => (
                <clipPath key={slot} id={`${slot}-${uid}`} clipPathUnits="userSpaceOnUse">
                  {paths.map((d, index) => <path key={index} d={d} />)}
                </clipPath>
              ))}
              <linearGradient id={`cosmic-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5435da"/><stop offset=".5" stopColor="#176fdf"/><stop offset="1" stopColor="#7d3de8"/></linearGradient>
              <linearGradient id={`cloud-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f7fdff"/><stop offset="1" stopColor="#8fcfff"/></linearGradient>
              <linearGradient id={`emerald-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1aa276"/><stop offset="1" stopColor="#0b5a43"/></linearGradient>
            </defs>

            {loadout.outfit && <MaskedSlot slot="outfit" item={loadout.outfit} uid={uid} />}
            {loadout.shoes && <MaskedSlot slot="shoes" item={loadout.shoes} uid={uid} />}
            {loadout.back && tone(loadout.back).style !== "crystalWings" && <MaskedSlot slot="back" item={loadout.back} uid={uid} />}
            {loadout.outfit && <OutfitDetails item={loadout.outfit} uid={uid} />}
            {loadout.shoes && <ShoeDetails item={loadout.shoes} uid={uid} />}
            {loadout.back && <BackFront item={loadout.back} />}
            {loadout.headwear && <HeadwearLayer item={loadout.headwear} uid={uid} />}
            {loadout.face && <AccessoryLayer item={loadout.face} />}
          </svg>
        )}
      </div>

      <MotionFX motion={motion} />
      {showBadges && <div className="v5p-status"><span>{motion.toUpperCase()}</span><b>{equippedCount}/5</b></div>}
    </div>
  );
}

function MaskedSlot({ slot, item, uid }) {
  const t = tone(item);
  const opacity = slot === "outfit" ? .22 : slot === "shoes" ? .20 : .12;
  return <g clipPath={`url(#${slot}-${uid})`} className={`v456-masked-slot is-${slot}`}>
    <image href={heroMaster} x="0" y="0" width={VIEW_W} height={VIEW_H} preserveAspectRatio="none" style={{ filter: filterFor(item, slot) }} />
    <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={t.base} opacity={opacity} className="v456-color-wash" />
  </g>;
}

function OutfitDetails({ item, uid }) {
  const t = tone(item);
  if (t.style === "explorer") return <g clipPath={`url(#outfit-${uid})`} className="v456-outfit-detail">
    <path d="M160 91 V176" stroke={t.trim} strokeWidth="2.7" strokeLinecap="round"/><path d="M136 138 H151 M169 138 H187" stroke={t.trim} strokeWidth="2.4" strokeLinecap="round"/>
    <rect x="176" y="115" width="12" height="10" rx="2" fill={t.trim}/><path d="M178 120 l3 3 5-6" fill="none" stroke={t.dark} strokeWidth="1.5"/>
  </g>;

  if (t.style === "cosmicArmor") return <g clipPath={`url(#outfit-${uid})`} className="v456-outfit-detail">
    <rect x="118" y="86" width="86" height="98" fill={`url(#cosmic-${uid})`} opacity=".42"/>
    <path d="M144 103 L160 114 L177 103 L184 130 L176 151 L160 160 L144 151 L136 130 Z" fill="none" stroke={t.trim} strokeWidth="2.4"/>
    <path d="M143 125 H178 M148 139 H173" stroke={t.trim} strokeWidth="1.8" opacity=".9"/>
    <circle cx="151" cy="116" r="2" fill="#fff3a4"/><circle cx="170" cy="132" r="1.8" fill="#89f8ff"/><path d="M185 119 l3 5 5 3-5 3-3 5-3-5-5-3 5-3z" fill="#fff0a0"/>
  </g>;

  if (t.style === "cloud") return <>
    <g clipPath={`url(#outfit-${uid})`} className="v456-outfit-detail"><rect x="115" y="83" width="95" height="105" fill={`url(#cloud-${uid})`} opacity=".52"/><path d="M137 109 Q145 99 154 108 Q161 95 170 107 Q181 101 186 112" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round"/></g>
    <path d="M143 162 Q160 171 178 162 L191 224 Q160 238 129 224 Z" fill={`url(#cloud-${uid})`} fillOpacity=".88" stroke="#eafaff" strokeWidth="1.8" className="v456-soft-addon"/>
    <path d="M133 214 Q160 226 187 214" fill="none" stroke="#fff" strokeWidth="2.7" opacity=".72"/>
  </>;

  if (t.style === "emeraldRobe") return <>
    <g clipPath={`url(#outfit-${uid})`} className="v456-outfit-detail"><rect x="112" y="84" width="100" height="110" fill={`url(#emerald-${uid})`} opacity=".45"/><path d="M139 105 Q160 119 181 105 M136 132 Q160 145 184 132" fill="none" stroke={t.trim} strokeWidth="2.4"/></g>
    <path d="M140 160 Q160 169 180 160 L197 238 Q160 255 123 238 Z" fill={`url(#emerald-${uid})`} fillOpacity=".91" stroke={t.trim} strokeWidth="1.9" className="v456-soft-addon"/>
    <path d="M130 227 Q160 240 190 227" fill="none" stroke={t.trim} strokeWidth="2.2" opacity=".72"/>
  </>;
  return null;
}

function ShoeDetails({ item, uid }) {
  const t = tone(item);
  if (t.style === "boots") return <g className="v456-shoe-detail" fill="none" stroke={t.trim} strokeLinecap="round">
    <path d="M111 348 L137 365 M117 340 L141 357" strokeWidth="1.8"/><path d="M214 368 L240 386 M221 359 L245 378" strokeWidth="1.8"/>
    <path d="M99 399 Q119 408 143 399 M211 419 Q232 427 253 419" strokeWidth="2.2"/>
  </g>;

  if (t.style === "sneaker") return <>
    <g clipPath={`url(#shoes-${uid})`}><rect x="85" y="320" width="72" height="55" fill={LEG_SKIN} opacity=".98"/><rect x="198" y="338" width="66" height="58" fill={LEG_SKIN} opacity=".98"/><rect x="91" y="356" width="64" height="23" fill={SOCK}/><rect x="202" y="377" width="61" height="22" fill={SOCK}/></g>
    <g className="v456-shoe-detail"><path d="M93 377 Q111 368 135 374 L148 392 Q126 405 91 398 Z" fill={t.base} stroke={t.dark} strokeWidth="2"/><path d="M210 397 Q228 388 247 395 L258 414 Q237 426 207 418 Z" fill={t.base} stroke={t.dark} strokeWidth="2"/><path d="M92 396 Q120 404 148 392 M208 416 Q235 424 258 413" fill="none" stroke={t.trim} strokeWidth="4"/><path d="M105 379 L132 390 M218 399 L245 410" stroke={t.trim} strokeWidth="1.7"/></g>
  </>;

  if (t.style === "cloudBoot") return <g className="v456-shoe-detail"><path d="M95 359 Q105 350 115 358 Q123 346 134 357 Q143 352 149 363" fill={t.trim} stroke={t.dark} strokeWidth="1.5"/><path d="M207 379 Q217 370 227 378 Q235 366 246 377 Q254 372 260 383" fill={t.trim} stroke={t.dark} strokeWidth="1.5"/><path d="M96 398 Q118 409 145 398 M210 419 Q233 428 257 418" fill="none" stroke="#fff" strokeWidth="3"/></g>;

  if (t.style === "sandal") return <>
    <g clipPath={`url(#shoes-${uid})`}><rect x="84" y="318" width="75" height="88" fill={LEG_SKIN} opacity=".98"/><rect x="198" y="337" width="68" height="91" fill={LEG_SKIN} opacity=".98"/></g>
    <g className="v456-shoe-detail" fill="none" stroke={t.base} strokeLinecap="round"><path d="M92 397 Q118 405 145 398" strokeWidth="5"/><path d="M210 418 Q233 426 258 419" strokeWidth="5"/><path d="M103 377 L133 400 M132 378 L104 399" strokeWidth="3.6"/><path d="M219 398 L247 420 M246 399 L220 420" strokeWidth="3.6"/></g>
  </>;
  return null;
}

function BackBehind({ item, uid }) {
  if (!item || tone(item).style !== "crystalWings") return null;
  const t = tone(item);
  return <svg className="v455-back-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id={`wings-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={t.trim}/><stop offset=".55" stopColor={t.base}/><stop offset="1" stopColor={t.secondary}/></linearGradient></defs>
    <g className="v455-wing-group v456-crystal-wings" fill={`url(#wings-${uid})`} fillOpacity=".78" stroke={t.trim} strokeWidth="1.8">
      <path d="M127 147 C98 127 68 135 52 164 L81 161 L58 186 L99 181 L75 211 L119 194 L136 177 Z"/><path d="M193 147 C222 127 252 135 268 164 L239 161 L262 186 L221 181 L245 211 L201 194 L184 177 Z"/>
      <path d="M119 151 L80 183 M128 159 L96 199 M201 151 L240 183 M192 159 L224 199" fill="none" opacity=".82"/>
    </g>
  </svg>;
}

function BackFront({ item }) {
  const t = tone(item);
  if (t.style !== "scrollPack") return null;
  return <g className="v456-back-front"><path d="M216 107 Q231 104 235 118 L236 150 Q231 159 221 155 L218 119 Z" fill={t.secondary} stroke={t.dark} strokeWidth="2"/><path d="M220 110 Q228 105 234 111 M221 151 Q229 157 235 150" fill="none" stroke={t.trim} strokeWidth="2"/></g>;
}

function HeadwearLayer({ item, uid }) {
  const t = tone(item);
  if (t.style === "pilotGoggles") return null;
  const hideBakedGoggles = <g clipPath={`url(#headwear-${uid})`} opacity=".92"><rect x="120" y="15" width="80" height="55" fill={HAIR}/></g>;

  if (t.style === "wizardHat") return <>{hideBakedGoggles}<g className="v455-headwear v456-headwear"><path d="M109 68 Q159 49 210 68 Q202 80 160 79 Q118 80 109 68Z" fill={t.base} stroke={t.trim} strokeWidth="2.3"/><path d="M132 65 L165 7 L195 66 Z" fill={t.base} stroke={t.trim} strokeWidth="2.3"/><path d="M150 50 Q170 58 189 49" fill="none" stroke={t.trim} strokeWidth="3"/><circle cx="168" cy="33" r="3" fill={t.trim}/></g></>;
  if (t.style === "goldCrown") return <>{hideBakedGoggles}<g className="v455-headwear v456-headwear"><path d="M127 59 L134 31 L151 46 L161 21 L174 46 L192 31 L190 62 Z" fill={t.base} stroke={t.trim} strokeWidth="2.5"/><path d="M134 55 H188" stroke={t.dark} strokeWidth="2"/><circle cx="161" cy="39" r="4" fill="#6fdcff"/><circle cx="143" cy="49" r="2.5" fill="#ff6f88"/><circle cx="180" cy="49" r="2.5" fill="#9d7cff"/></g></>;
  return null;
}

function AccessoryLayer({ item }) {
  const t = tone(item);
  if (t.style === "compassNecklace") return null;
  if (t.style === "monocle") return <g className="v455-face-item v456-accessory"><circle cx="178" cy="84" r="12" fill="#b8efff" fillOpacity=".08" stroke={t.trim} strokeWidth="2.3"/><path d="M188 91 Q196 108 190 126" fill="none" stroke={t.dark} strokeWidth="1.7"/></g>;
  if (t.style === "starBrooch") return <path className="v455-face-item v456-accessory" d="M188 119 l4 7 8 2-6 5 1 8-7-4-7 4 1-8-6-5 8-2z" fill={t.base} stroke={t.trim} strokeWidth="1.4"/>;
  if (t.style === "wand") return <g className="v455-face-item v456-accessory"><path d="M215 171 L252 126" stroke={t.dark} strokeWidth="5" strokeLinecap="round"/><path d="M254 116 l5 9 10 2-8 7 1 10-8-5-9 5 2-10-8-7 10-2z" fill={t.base} stroke={t.trim} strokeWidth="1.6"/><circle cx="254" cy="130" r="2" fill="#fff"/></g>;
  return null;
}

function MotionFX({ motion }) {
  return <div className={`v45-motion-fx is-${motion}`} aria-hidden="true">
    {motion === "thinking" && <span className="v45-fx-question">?</span>}
    {motion === "happy" && <><i className="v45-fx-star s1">✦</i><i className="v45-fx-star s2">✦</i></>}
    {motion === "victory" && <><i className="v45-fx-star s1">★</i><i className="v45-fx-star s2">✦</i><i className="v45-fx-star s3">★</i></>}
    {motion === "equip" && <span className="v45-fx-equip">KUŞANILDI!</span>}
  </div>;
}
