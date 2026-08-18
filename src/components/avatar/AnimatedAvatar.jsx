import { useEffect, useId, useMemo, useRef, useState } from "react";
import heroMaster from "../../assets/avatar-v5/premium/heroMasterData.js";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";

const VIEW_W = 320;
const VIEW_H = 427;

function motionFrame(motion, elapsed) {
  const t = elapsed / 1000;
  if (motion === "thinking") return { x: 5 + Math.sin(t * 2.6) * 2, y: -5 + Math.sin(t * 3.1) * 2, rotate: 3 + Math.sin(t * 2.2), scale: 1.01 };
  if (motion === "happy") {
    const b = Math.abs(Math.sin(t * 5.2));
    return { x: Math.sin(t * 3.8) * 2, y: -4 - b * 14, rotate: Math.sin(t * 4.6) * 1.4, scale: 1 + b * .02 };
  }
  if (motion === "victory") {
    const p = (t % 1.25) / 1.25;
    const jump = p < .72 ? Math.sin(Math.PI * (p / .72)) : 0;
    return { x: Math.sin(t * 5.1) * 3, y: -jump * 28, rotate: Math.sin(t * 4.9) * 2.2, scale: 1 + jump * .028 };
  }
  if (motion === "levelup") {
    const p = (Math.sin(t * 4.4) + 1) / 2;
    return { x: 0, y: -p * 12, rotate: 0, scale: 1 + p * .028 };
  }
  if (motion === "equip") {
    const p = Math.min(elapsed / 720, 1);
    const pop = Math.sin(Math.PI * p);
    return { x: 0, y: -pop * 8, rotate: 0, scale: .94 + p * .06 + pop * .05 };
  }
  const b = (Math.sin(t * 2.05) + 1) / 2;
  return { x: Math.sin(t * 1.25) * 1.5, y: -2 - b * 6, rotate: Math.sin(t * 1.35) * .5, scale: 1 + b * .007 };
}

function palette(item, slot) {
  const id = item?.id || "";
  if (slot === "outfit" && (id === "outfit-tshirt" || /labcoat/i.test(id))) return { a: "#f7fbff", b: "#dbe9f3", trim: "#45d9bd", dark: "#183b54" };
  if (/gold|crown|halo|solar|sun/i.test(id)) return { a: "#ffd66b", b: "#e39a24", trim: "#fff3ae", dark: "#724416" };
  if (/crystal|galaxy|cosmic|aurora|comet|orbit|infinity/i.test(id)) return { a: "#586cff", b: "#8f46e9", trim: "#54e7ff", dark: "#1f255f" };
  if (/green|emerald|forest|teal|ocean/i.test(id)) return { a: "#39d7b7", b: "#15918a", trim: "#d8fff7", dark: "#14505a" };
  if (/red|meteor|christmas|coral/i.test(id)) return { a: "#ff6f78", b: "#be3d57", trim: "#ffd8dd", dark: "#6b2437" };
  if (/pink|summer|candy/i.test(id)) return { a: "#ff8fc7", b: "#c5579a", trim: "#ffe0f1", dark: "#72345e" };
  if (/night|shadow|black|thunder/i.test(id)) return { a: "#40506f", b: "#202b49", trim: "#8edaff", dark: "#10172a" };
  return { a: item?.primary || item?.color || "#3e9fe8", b: item?.secondary || "#175e9c", trim: "#dff8ff", dark: "#153c58" };
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
    let frameId = 0;
    let stopped = false;
    const start = performance.now();
    const tick = (now) => {
      if (stopped || !stackRef.current) return;
      const f = motionFrame(motion, now - start);
      stackRef.current.style.transform = `translate3d(${f.x.toFixed(2)}px,${f.y.toFixed(2)}px,0) rotate(${f.rotate.toFixed(2)}deg) scale(${f.scale.toFixed(4)})`;
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => { stopped = true; cancelAnimationFrame(frameId); if (node) node.style.transform = "none"; };
  }, [motion]);

  const equippedCount = Object.values(loadout).filter(Boolean).length;
  const wingItem = loadout.back?.kind === "wings" ? loadout.back : loadout.headwear?.shape === "wings" ? loadout.headwear : null;

  return (
    <div className={`v5-animated-avatar v5p-avatar v45-live-avatar motion-${motion} ${compact ? "is-compact" : ""}`} style={{ width: size, aspectRatio: `${VIEW_W}/${VIEW_H}` }} role="img" aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü Bilgin Kaşif`} data-avatar-version="4.5.4-body-rig" data-motion={motion} data-rig-signature={signature}>
      <div className="v5p-aura" aria-hidden="true" />
      <div className="v5p-floor" aria-hidden="true" />
      {equipBurst && <div className="v5p-equip-ring" aria-hidden="true" />}

      <div ref={stackRef} className="v45-live-stack" aria-hidden="true">
        {showEquipment && (loadout.back || wingItem) && <BackRig item={wingItem || loadout.back} uid={uid} />}
        <img src={heroMaster} alt="" draggable="false" className="v45-live-master" />
        {showEquipment && <FrontRig loadout={loadout} uid={uid} />}
      </div>

      <MotionFX motion={motion} />
      {showBadges && <div className="v5p-status"><span>{motion.toUpperCase()}</span><b>{equippedCount}/5</b></div>}
    </div>
  );
}

function BackRig({ item, uid }) {
  const c = palette(item, "back");
  const wings = item?.kind === "wings" || item?.shape === "wings" || /wing/i.test(item?.id || "");
  return (
    <svg className="v45-body-rig v45-body-rig-back" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
      <defs><linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={c.a}/><stop offset="1" stopColor={c.b}/></linearGradient></defs>
      {wings ? <g className="v45-rig-wings" fill={`url(#bg-${uid})`} stroke={c.trim} strokeWidth="2.2" opacity=".9">
        <path d="M121 173 C79 143 48 162 42 205 C69 189 88 196 108 224 C82 226 66 244 69 270 C102 253 119 242 132 221 Z"/>
        <path d="M199 173 C241 143 272 162 278 205 C251 189 232 196 212 224 C238 226 254 244 251 270 C218 253 201 242 188 221 Z"/>
      </g> : <g className="v45-rig-backpack">
        <path d="M184 149 C219 147 238 166 238 201 L239 255 C238 274 226 286 207 286 L184 286 C177 250 175 210 178 177 C179 164 180 156 184 149 Z" fill={`url(#bg-${uid})`} stroke={c.dark} strokeWidth="3"/>
        <path d="M194 163 Q215 151 228 169" fill="none" stroke={c.trim} strokeWidth="5" strokeLinecap="round"/>
        <rect x="192" y="216" width="36" height="38" rx="9" fill={c.dark} opacity=".55"/>
        <path d="M197 226 H223" stroke={c.trim} strokeWidth="3" opacity=".85"/>
      </g>}
    </svg>
  );
}

function FrontRig({ loadout, uid }) {
  return (
    <svg className="v45-body-rig v45-body-rig-front" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
      <defs>
        {[["out", loadout.outfit, "outfit"],["shoe", loadout.shoes, "shoes"],["head", loadout.headwear, "headwear"],["face", loadout.face, "face"]].map(([key,item,slot]) => {
          const c = palette(item, slot);
          return <linearGradient key={key} id={`${key}-${uid}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={c.a}/><stop offset="1" stopColor={c.b}/></linearGradient>;
        })}
      </defs>
      {loadout.outfit && <OutfitRig item={loadout.outfit} uid={uid}/>} 
      {loadout.shoes && <ShoesRig item={loadout.shoes} uid={uid}/>} 
      {loadout.headwear && loadout.headwear.shape !== "wings" && <HeadRig item={loadout.headwear} uid={uid}/>} 
      {loadout.face && <FaceRig item={loadout.face} uid={uid}/>} 
    </svg>
  );
}

function OutfitRig({ item, uid }) {
  const c = palette(item, "outfit");
  const kind = item.kind || "jacket";
  const robe = ["robe","dress"].includes(kind);
  const lab = kind === "lab";
  const armor = kind === "armor";
  const overall = kind === "overall";
  return <g className={`v45-rig-outfit kind-${kind}`} strokeLinejoin="round" strokeLinecap="round">
    <path d="M125 154 C112 158 102 168 96 184 L83 230 C80 240 86 247 96 248 C104 249 109 244 112 236 L124 202 L127 255 C128 270 139 279 160 279 C181 279 192 270 193 255 L196 202 L208 236 C211 244 216 249 224 248 C234 247 240 240 237 230 L224 184 C218 168 208 158 195 154 L179 149 C174 154 168 157 160 157 C152 157 146 154 141 149 Z" fill={`url(#out-${uid})`} stroke={c.dark} strokeWidth="3.2"/>
    {robe && <path d="M128 247 C139 260 181 260 192 247 L203 320 C183 329 137 329 117 320 Z" fill={`url(#out-${uid})`} stroke={c.dark} strokeWidth="3"/>}
    {lab && <><path d="M159 158 V276" stroke={c.trim} strokeWidth="3.5"/><path d="M131 198 H151 M169 198 H189" stroke={c.trim} strokeWidth="3"/><rect x="174" y="169" width="15" height="12" rx="2" fill={c.trim}/><path d="M178 175 l3 3 5-7" fill="none" stroke={c.dark} strokeWidth="2"/></>}
    {armor && <><path d="M128 160 L160 174 L192 160 L187 219 L160 236 L133 219 Z" fill={c.trim} fillOpacity=".28" stroke={c.trim} strokeWidth="3"/><path d="M136 188 H184 M140 206 H180" stroke={c.trim} strokeWidth="2.5"/></>}
    {overall && <><path d="M139 157 L147 178 V241 H173 V178 L181 157" fill="none" stroke={c.trim} strokeWidth="5"/><rect x="148" y="195" width="24" height="18" rx="4" fill={c.dark} opacity=".55"/></>}
    {!lab && !armor && !overall && <><path d="M160 158 V268" stroke={c.trim} strokeWidth="3" opacity=".9"/><path d="M133 208 H150 M170 208 H187" stroke={c.trim} strokeWidth="3"/><circle cx="160" cy="185" r="3.5" fill={c.trim}/><circle cx="160" cy="202" r="3.5" fill={c.trim}/></>}
    {item.variant % 2 === 1 && <path d="M126 173 Q143 185 160 176 Q177 185 194 173" fill="none" stroke={c.trim} strokeWidth="2.4" opacity=".75"/>}
  </g>;
}

function ShoesRig({ item, uid }) {
  const c = palette(item, "shoes");
  const sandals = item.kind === "sandals";
  const boots = item.kind === "boots";
  const shoe = (x, flip = false) => <g transform={`translate(${x} 0) ${flip ? "scale(-1 1) translate(-320 0)" : ""}`}>
    {boots ? <><path d="M101 341 C113 337 127 338 136 343 L137 389 C127 397 105 397 95 389 L98 359 Z" fill={`url(#shoe-${uid})`} stroke={c.dark} strokeWidth="3"/><path d="M99 389 C112 393 128 393 140 389 L146 402 C129 410 102 409 87 402 L94 391 Z" fill={c.dark}/><path d="M105 351 H131 M104 362 H132 M103 373 H133" stroke={c.trim} strokeWidth="2.3"/></> : sandals ? <><path d="M92 389 C107 383 130 383 143 391 L142 401 C125 407 102 407 88 401 Z" fill={`url(#shoe-${uid})`} stroke={c.dark} strokeWidth="3"/><path d="M103 374 L129 398 M128 374 L104 398" stroke={c.trim} strokeWidth="4"/></> : <><path d="M93 384 C104 375 129 374 141 383 L147 398 C130 407 102 407 87 399 Z" fill={`url(#shoe-${uid})`} stroke={c.dark} strokeWidth="3"/><path d="M99 385 Q116 392 137 386" fill="none" stroke={c.trim} strokeWidth="3"/><path d="M92 399 H143" stroke="#f6ffff" strokeWidth="4"/></>}
  </g>;
  return <g className={`v45-rig-shoes kind-${item.kind || "sneakers"}`}>{shoe(0)}{shoe(0, true)}</g>;
}

function HeadRig({ item, uid }) {
  const c = palette(item, "headwear");
  const shape = item.shape || item.kind || "cap";
  if (shape === "halo") return <ellipse cx="160" cy="54" rx="46" ry="11" fill="none" stroke={c.a} strokeWidth="6" opacity=".9"/>;
  if (shape === "crown") return <path d="M116 81 L126 49 L148 69 L161 42 L176 69 L198 49 L205 82 Z" fill={`url(#head-${uid})`} stroke={c.dark} strokeWidth="3"/>;
  if (shape === "wizardhat") return <><path d="M118 92 L159 24 L197 93 Z" fill={`url(#head-${uid})`} stroke={c.dark} strokeWidth="3"/><ellipse cx="160" cy="94" rx="57" ry="13" fill={c.b} stroke={c.dark} strokeWidth="3"/><path d="M145 59 Q160 69 176 58" fill="none" stroke={c.trim} strokeWidth="4"/></>;
  if (shape === "hairbow") return <><path d="M111 83 C92 68 89 50 105 47 C119 46 130 58 137 72 Z" fill={`url(#head-${uid})`} stroke={c.dark} strokeWidth="3"/><path d="M137 72 C143 55 158 48 169 56 C177 63 172 78 155 87 Z" fill={`url(#head-${uid})`} stroke={c.dark} strokeWidth="3"/><circle cx="142" cy="73" r="8" fill={c.trim}/></>;
  if (shape === "partyhat") return <><path d="M137 84 L160 37 L184 84 Z" fill={`url(#head-${uid})`} stroke={c.dark} strokeWidth="3"/><circle cx="160" cy="34" r="7" fill={c.trim}/></>;
  if (shape === "beanie") return <><path d="M111 92 C113 59 133 45 160 45 C187 45 207 59 209 92 Z" fill={`url(#head-${uid})`} stroke={c.dark} strokeWidth="3"/><rect x="110" y="82" width="100" height="20" rx="9" fill={c.b} stroke={c.dark} strokeWidth="3"/></>;
  if (shape === "detective-hat") return <><path d="M116 84 C126 58 144 49 161 49 C179 49 197 59 204 84 Z" fill={`url(#head-${uid})`} stroke={c.dark} strokeWidth="3"/><ellipse cx="160" cy="88" rx="59" ry="12" fill={c.b} stroke={c.dark} strokeWidth="3"/></>;
  return <><path d="M111 83 C119 55 139 46 160 46 C183 46 201 59 205 84 Z" fill={`url(#head-${uid})`} stroke={c.dark} strokeWidth="3"/><path d="M161 83 C184 78 207 83 220 95 C197 99 178 99 159 95 Z" fill={c.b} stroke={c.dark} strokeWidth="3"/></>;
}

function FaceRig({ item, uid }) {
  const c = palette(item, "face");
  const shape = item.shape || item.kind || "glasses";
  if (shape === "wand") return <g transform="rotate(-18 232 230)"><rect x="226" y="170" width="8" height="104" rx="4" fill={c.dark}/><path d="M230 157 l8 13 15 2-11 10 3 15-15-7-14 7 3-15-11-10 15-2z" fill={`url(#face-${uid})`} stroke={c.trim} strokeWidth="2"/></g>;
  if (shape === "magnifier") return <><circle cx="206" cy="151" r="22" fill="none" stroke={c.dark} strokeWidth="6"/><circle cx="206" cy="151" r="17" fill="#9befff" fillOpacity=".17"/><path d="M221 167 L249 203" stroke={c.dark} strokeWidth="8" strokeLinecap="round"/></>;
  const sunglasses = shape === "sunglasses";
  return <g className="v45-rig-face"><rect x="119" y="125" width="39" height="27" rx="12" fill={sunglasses ? c.dark : "#bceeff"} fillOpacity={sunglasses ? .9 : .2} stroke={c.dark} strokeWidth="4"/><rect x="163" y="125" width="39" height="27" rx="12" fill={sunglasses ? c.dark : "#bceeff"} fillOpacity={sunglasses ? .9 : .2} stroke={c.dark} strokeWidth="4"/><path d="M158 135 H164 M117 134 L105 129 M204 134 L216 129" stroke={c.dark} strokeWidth="4" strokeLinecap="round"/></g>;
}

function MotionFX({ motion }) {
  return <div className={`v45-motion-fx is-${motion}`} aria-hidden="true">
    {motion === "thinking" && <span className="v45-fx-question">?</span>}
    {motion === "happy" && <><i className="v45-fx-star s1">✦</i><i className="v45-fx-star s2">✦</i></>}
    {motion === "victory" && <><i className="v45-fx-star s1">★</i><i className="v45-fx-star s2">✦</i><i className="v45-fx-star s3">★</i></>}
    {motion === "equip" && <span className="v45-fx-equip">KUŞANILDI!</span>}
  </div>;
}
