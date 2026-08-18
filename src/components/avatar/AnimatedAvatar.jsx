import { useEffect, useId, useMemo, useRef, useState } from "react";
import heroMaster from "../../assets/avatar-v5/premium/heroMasterData.js";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";
import { PREMIUM_RIG_MASKS } from "../../data/premiumRigMasks";

const VIEW_W = 320;
const VIEW_H = 427;

function motionFrame(motion, elapsed) {
  const t = elapsed / 1000;
  if (motion === "thinking") {
    return { x: 5 + Math.sin(t * 2.7) * 2, y: -6 + Math.sin(t * 3.2) * 2, rotate: 3 + Math.sin(t * 2.1) * 1.2, scale: 1.01 };
  }
  if (motion === "happy") {
    const bounce = Math.abs(Math.sin(t * 5.4));
    return { x: Math.sin(t * 3.6) * 2.5, y: -4 - bounce * 15, rotate: Math.sin(t * 4.5) * 1.5, scale: 1 + bounce * .022 };
  }
  if (motion === "victory") {
    const phase = (t % 1.25) / 1.25;
    const jump = phase < .72 ? Math.sin(Math.PI * (phase / .72)) : 0;
    return { x: Math.sin(t * 5) * 3, y: -jump * 30, rotate: Math.sin(t * 4.8) * 2.3, scale: 1 + jump * .03 };
  }
  if (motion === "levelup") {
    const pulse = (Math.sin(t * 4.4) + 1) / 2;
    return { x: 0, y: -pulse * 13, rotate: 0, scale: 1 + pulse * .03 };
  }
  if (motion === "equip") {
    const p = Math.min(elapsed / 720, 1);
    const pop = Math.sin(Math.PI * p);
    return { x: 0, y: -pop * 9, rotate: 0, scale: .95 + p * .05 + pop * .055 };
  }
  const breathe = (Math.sin(t * 2) + 1) / 2;
  return { x: Math.sin(t * 1.2) * 1.6, y: -2 - breathe * 6, rotate: Math.sin(t * 1.3) * .55, scale: 1 + breathe * .008 };
}

function itemTone(item, slot) {
  const id = item?.id || "";
  const common = { color: "#2f9fe8", trim: "#8eeeff", filter: "saturate(1.18) brightness(1.03)" };
  if (!item) return common;
  if (slot === "outfit" && (id === "outfit-tshirt" || /labcoat|science|lab/i.test(id))) {
    return { color: "#edf9ff", trim: "#49dfbf", filter: "grayscale(1) brightness(1.72) contrast(.78)" };
  }
  if (/infinity|galaxy|crystal|cosmic|aurora|comet|orbit/i.test(id)) {
    return { color: "#694cff", trim: "#55e9ff", filter: "hue-rotate(58deg) saturate(1.7) brightness(1.08)" };
  }
  if (/gold|crown|halo|solar|sun/i.test(id)) {
    return { color: "#f3b83f", trim: "#fff0a2", filter: "sepia(.75) saturate(1.8) hue-rotate(350deg) brightness(1.1)" };
  }
  if (/green|emerald|forest|ocean|teal/i.test(id)) {
    return { color: "#25c9a4", trim: "#c9fff2", filter: "hue-rotate(-43deg) saturate(1.55) brightness(1.05)" };
  }
  if (/red|meteor|christmas|coral|volcano/i.test(id)) {
    return { color: "#e94b64", trim: "#ffd0d7", filter: "hue-rotate(122deg) saturate(1.6) brightness(1.03)" };
  }
  if (/pink|summer|candy/i.test(id)) {
    return { color: "#f36aaf", trim: "#ffe0f1", filter: "hue-rotate(88deg) saturate(1.45) brightness(1.08)" };
  }
  if (/night|shadow|black|thunder/i.test(id)) {
    return { color: "#263956", trim: "#8bdcff", filter: "saturate(.8) brightness(.67) contrast(1.18)" };
  }
  return { ...common, color: item.primary || item.color || common.color };
}

function outfitKind(item) {
  const id = item?.id || "";
  if (id === "outfit-tshirt" || /labcoat|science|lab/i.test(id)) return "lab";
  if (/infinity|armor|crystal|galaxy|meteor|volcano|neon/i.test(id)) return "armor";
  if (/robe|cape|cloud|wizard/i.test(id)) return "robe";
  if (/overall/i.test(id)) return "overall";
  return item?.kind || "jacket";
}

export default function AnimatedAvatar({
  avatar = {},
  size = 320,
  animation = "idle",
  showEquipment = true,
  showBadges = false,
  compact = false,
}) {
  const uid = useId().replace(/:/g, "");
  const loadout = useMemo(
    () => getRigLoadout(avatar),
    [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]
  );
  const signature = useMemo(
    () => getRigSignature(avatar),
    [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]
  );
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
      className={`v5-animated-avatar v5p-avatar v45-live-avatar v455-mask-avatar motion-${motion} ${compact ? "is-compact" : ""}`}
      style={{ width: size, aspectRatio: `${VIEW_W}/${VIEW_H}` }}
      role="img"
      aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü Bilgin Kaşif`}
      data-avatar-version="4.5.5-mask-rig"
      data-motion={motion}
      data-rig-signature={signature}
    >
      <div className="v5p-aura" aria-hidden="true" />
      <div className="v5p-floor" aria-hidden="true" />
      {equipBurst && <div className="v5p-equip-ring" aria-hidden="true" />}

      <div ref={stackRef} className="v45-live-stack" aria-hidden="true">
        {showEquipment && <BackLayer item={loadout.back} uid={uid} />}
        <img src={heroMaster} alt="" draggable="false" className="v45-live-master" />
        {showEquipment && (
          <svg className="v455-mask-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              {Object.entries(PREMIUM_RIG_MASKS).map(([slot, paths]) => (
                <clipPath key={slot} id={`${slot}-${uid}`} clipPathUnits="userSpaceOnUse">
                  {paths.map((d, index) => <path key={index} d={d} />)}
                </clipPath>
              ))}
            </defs>

            {loadout.outfit && <MasterTint slot="outfit" item={loadout.outfit} uid={uid} />}
            {loadout.shoes && <MasterTint slot="shoes" item={loadout.shoes} uid={uid} />}
            {loadout.back && loadout.back.kind !== "wings" && <MasterTint slot="back" item={loadout.back} uid={uid} />}
            {loadout.headwear && <HeadwearLayer item={loadout.headwear} uid={uid} />}
            {loadout.face && <FaceLayer item={loadout.face} uid={uid} />}
          </svg>
        )}
      </div>

      <MotionFX motion={motion} />
      {showBadges && <div className="v5p-status"><span>{motion.toUpperCase()}</span><b>{equippedCount}/5</b></div>}
    </div>
  );
}

function MasterTint({ slot, item, uid }) {
  const tone = itemTone(item, slot);
  return (
    <g clipPath={`url(#${slot}-${uid})`} className={`v455-tint-layer is-${slot}`}>
      <image
        href={heroMaster}
        x="0"
        y="0"
        width={VIEW_W}
        height={VIEW_H}
        preserveAspectRatio="none"
        style={{ filter: tone.filter }}
      />
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={tone.color} opacity={slot === "outfit" ? ".20" : ".16"} className="v455-color-wash" />
      {slot === "outfit" && <OutfitDetails item={item} tone={tone} />}
      {slot === "shoes" && <ShoeDetails item={item} tone={tone} />}
      {slot === "back" && <BackDetails item={item} tone={tone} />}
    </g>
  );
}

function OutfitDetails({ item, tone }) {
  const id = item?.id || "";
  const kind = outfitKind(item);
  const legendary = item?.rarity === "legendary" || /infinity|galaxy|crystal|cosmic/i.test(id);

  if (kind === "lab") {
    return (
      <g className="v455-outfit-details">
        <path d="M159 103 V171" stroke={tone.trim} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M136 139 H151 M169 139 H187" stroke={tone.trim} strokeWidth="2.3" strokeLinecap="round" />
        <rect x="176" y="116" width="11" height="9" rx="2" fill={tone.trim} opacity=".95" />
        <path d="M178 121 l3 2 4-5" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    );
  }

  if (kind === "armor") {
    return (
      <g className="v455-outfit-details">
        <path d="M145 107 L160 115 L176 107 L184 132 L174 151 L160 158 L146 151 L137 132 Z" fill={tone.color} fillOpacity=".28" stroke={tone.trim} strokeWidth="2.3" />
        <path d="M143 126 H178 M148 139 H173" stroke={tone.trim} strokeWidth="1.8" opacity=".85" />
        {legendary && <>
          <circle cx="151" cy="119" r="2" fill="#fff2a6" />
          <circle cx="169" cy="132" r="1.8" fill="#8ff5ff" />
          <path d="M183 111 l3 5 5 3-5 3-3 5-3-5-5-3 5-3z" fill="#fff0a0" opacity=".9" />
        </>}
      </g>
    );
  }

  if (kind === "robe") {
    return (
      <g className="v455-outfit-details">
        <path d="M140 111 Q160 124 181 111" fill="none" stroke={tone.trim} strokeWidth="2.4" />
        <path d="M138 132 Q160 144 183 132" fill="none" stroke={tone.trim} strokeWidth="1.7" opacity=".8" />
        <path d="M158 116 l3 5 5 3-5 3-3 5-3-5-5-3 5-3z" fill={tone.trim} opacity=".85" />
      </g>
    );
  }

  if (kind === "overall") {
    return (
      <g className="v455-outfit-details">
        <path d="M146 105 L152 121 V151 H169 V121 L176 105" fill="none" stroke={tone.trim} strokeWidth="3" />
        <rect x="153" y="131" width="15" height="10" rx="2.5" fill={tone.color} opacity=".55" />
      </g>
    );
  }

  return (
    <g className="v455-outfit-details">
      <path d="M160 105 V167" stroke={tone.trim} strokeWidth="2" opacity=".9" />
      <path d="M140 138 H151 M169 138 H181" stroke={tone.trim} strokeWidth="2" strokeLinecap="round" />
      {item?.variant % 2 === 1 && <path d="M139 118 Q160 128 181 118" fill="none" stroke={tone.trim} strokeWidth="1.8" opacity=".75" />}
    </g>
  );
}

function ShoeDetails({ item, tone }) {
  const id = item?.id || "";
  const cosmic = /cosmic|galaxy|crystal|aurora|comet|star/i.test(id);
  return (
    <g className="v455-shoe-details" fill="none" stroke={tone.trim} strokeLinecap="round">
      <path d="M111 374 C122 379 133 378 142 373" strokeWidth="2.3" />
      <path d="M218 396 C229 400 240 399 249 395" strokeWidth="2.3" />
      <path d="M116 354 L133 365 M125 351 L139 360" strokeWidth="1.7" opacity=".9" />
      <path d="M219 367 L238 379 M225 363 L243 374" strokeWidth="1.7" opacity=".9" />
      {cosmic && <><circle cx="132" cy="382" r="2" fill={tone.trim} stroke="none" /><circle cx="236" cy="407" r="2" fill={tone.trim} stroke="none" /></>}
    </g>
  );
}

function BackDetails({ item, tone }) {
  if (!item) return null;
  return (
    <g className="v455-back-details">
      <path d="M205 115 Q220 122 225 143" fill="none" stroke={tone.trim} strokeWidth="2.5" opacity=".9" />
      <circle cx="218" cy="153" r="3" fill={tone.trim} />
    </g>
  );
}

function BackLayer({ item, uid }) {
  if (!item) return null;
  const isWings = item.kind === "wings" || item.shape === "wings" || /wing/i.test(item.id || "");
  if (!isWings) return null;
  const tone = itemTone(item, "back");
  return (
    <svg className="v455-back-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`wing-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={tone.trim} stopOpacity=".88" />
          <stop offset="1" stopColor={tone.color} stopOpacity=".55" />
        </linearGradient>
      </defs>
      <g fill={`url(#wing-${uid})`} stroke={tone.trim} strokeWidth="2" opacity=".92" className="v455-wing-group">
        <path d="M125 150 C91 128 60 142 49 176 C73 166 92 174 109 197 C88 197 74 210 72 231 C100 220 120 204 134 181 Z" />
        <path d="M195 150 C229 128 260 142 271 176 C247 166 228 174 211 197 C232 197 246 210 248 231 C220 220 200 204 186 181 Z" />
      </g>
    </svg>
  );
}

function HeadwearLayer({ item, uid }) {
  const id = item?.id || "";
  const shape = item?.shape || "";
  const tone = itemTone(item, "headwear");
  if (shape === "wings") return null;

  if (/halo/i.test(shape + id)) {
    return <ellipse cx="160" cy="30" rx="34" ry="8" fill="none" stroke={tone.trim} strokeWidth="5" className="v455-headwear v455-halo" />;
  }
  if (/crown/i.test(shape + id)) {
    return <g className="v455-headwear"><path d="M132 54 L138 30 L153 45 L161 24 L173 45 L188 31 L187 57 Z" fill={tone.color} stroke={tone.trim} strokeWidth="2.5" /><circle cx="161" cy="39" r="3" fill={tone.trim} /></g>;
  }
  if (/hairbow|bow/i.test(shape + id)) {
    return <g className="v455-headwear" transform="translate(194 61) rotate(12)"><path d="M0 0 C-17-12-24 6-8 14 L0 9 C17 22 25 2 9-7 Z" fill={tone.color} stroke={tone.trim} strokeWidth="2" /><circle cx="1" cy="5" r="6" fill={tone.trim} /></g>;
  }
  if (/wizard|witch/i.test(id)) {
    return <g className="v455-headwear"><path d="M116 67 Q160 49 204 67 Q197 77 160 76 Q123 77 116 67Z" fill={tone.color} stroke={tone.trim} strokeWidth="2.5" /><path d="M137 64 L166 11 L190 65 Z" fill={tone.color} stroke={tone.trim} strokeWidth="2.5" /><circle cx="169" cy="36" r="3" fill={tone.trim} /></g>;
  }
  if (/party/i.test(id)) {
    return <g className="v455-headwear"><path d="M143 62 L161 17 L178 62 Z" fill={tone.color} stroke={tone.trim} strokeWidth="2" /><circle cx="161" cy="16" r="5" fill={tone.trim} /></g>;
  }

  return <g className="v455-headwear"><path d="M119 65 Q132 38 164 38 Q191 39 202 62 Q182 54 158 55 Q136 55 119 65 Z" fill={tone.color} stroke={tone.trim} strokeWidth="2.5" /><path d="M160 55 Q191 53 207 65 Q190 69 167 64" fill={tone.color} stroke={tone.trim} strokeWidth="2" /></g>;
}

function FaceLayer({ item }) {
  const id = item?.id || "";
  const shape = item?.shape || "";
  const tone = itemTone(item, "face");
  if (/wand/i.test(shape + id)) {
    return <g className="v455-face-item"><path d="M216 169 L253 126" stroke={tone.color} strokeWidth="5" strokeLinecap="round" /><path d="M254 118 l4 8 9 2-7 6 1 9-7-4-8 5 1-9-7-6 9-2z" fill={tone.trim} /></g>;
  }
  if (/magnifier/i.test(shape + id)) {
    return <g className="v455-face-item"><circle cx="204" cy="105" r="16" fill="#b8f4ff" fillOpacity=".16" stroke={tone.trim} strokeWidth="4" /><path d="M215 117 L237 146" stroke={tone.color} strokeWidth="6" strokeLinecap="round" /></g>;
  }
  const sunglasses = /sunglass|shade/i.test(shape + id);
  return <g className="v455-face-item" fill={sunglasses ? "#183047" : "#aeefff"} fillOpacity={sunglasses ? ".78" : ".18"} stroke={tone.trim} strokeWidth="2.5"><rect x="132" y="77" width="25" height="16" rx="8" /><rect x="164" y="77" width="25" height="16" rx="8" /><path d="M157 83 H164 M132 82 L122 78 M189 82 L199 78" fill="none" /></g>;
}

function MotionFX({ motion }) {
  return (
    <div className={`v45-motion-fx is-${motion}`} aria-hidden="true">
      {motion === "thinking" && <span className="v45-fx-question">?</span>}
      {motion === "happy" && <><i className="v45-fx-star s1">✦</i><i className="v45-fx-star s2">✦</i></>}
      {motion === "victory" && <><i className="v45-fx-star s1">★</i><i className="v45-fx-star s2">✦</i><i className="v45-fx-star s3">★</i></>}
      {motion === "equip" && <span className="v45-fx-equip">KUŞANILDI!</span>}
    </div>
  );
}
