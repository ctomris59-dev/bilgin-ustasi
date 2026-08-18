import { useEffect, useId, useMemo, useRef, useState } from "react";
import heroMaster from "../../assets/avatar-v5/premium/heroMasterData.js";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";
import { getWornAsset } from "../../data/coreWearables";
import { PREMIUM_RIG_MASKS } from "../../data/premiumRigMasks";
import { HERO_VIEWBOX } from "../../data/heroAnchors";
import WornAsset from "./WornAsset";

const { width: VIEW_W, height: VIEW_H } = HERO_VIEWBOX;

function motionFrame(motion, elapsed) {
  const t = elapsed / 1000;
  if (motion === "thinking") return { x: 5 + Math.sin(t * 2.4) * 2, y: -7 + Math.sin(t * 3) * 2, rotate: 3.4 + Math.sin(t * 2.1) * 1.2, scale: 1.01 };
  if (motion === "happy") {
    const bounce = Math.abs(Math.sin(t * 5.2));
    return { x: Math.sin(t * 3.5) * 2.8, y: -5 - bounce * 17, rotate: Math.sin(t * 4.3) * 1.7, scale: 1 + bounce * .024 };
  }
  if (motion === "victory") {
    const phase = (t % 1.25) / 1.25;
    const jump = phase < .72 ? Math.sin(Math.PI * (phase / .72)) : 0;
    return { x: Math.sin(t * 5) * 3.4, y: -jump * 32, rotate: Math.sin(t * 4.8) * 2.5, scale: 1 + jump * .032 };
  }
  if (motion === "levelup") {
    const pulse = (Math.sin(t * 4.2) + 1) / 2;
    return { x: 0, y: -pulse * 14, rotate: 0, scale: 1 + pulse * .032 };
  }
  if (motion === "equip") {
    const p = Math.min(elapsed / 720, 1);
    const pop = Math.sin(Math.PI * p);
    return { x: 0, y: -pop * 10, rotate: 0, scale: .94 + p * .06 + pop * .06 };
  }
  const breathe = (Math.sin(t * 2) + 1) / 2;
  return { x: Math.sin(t * 1.2) * 1.5, y: -2 - breathe * 6, rotate: Math.sin(t * 1.3) * .55, scale: 1 + breathe * .008 };
}

export default function LayeredHero({ avatar = {}, size = 320, animation = "idle", showEquipment = true, showBadges = false, compact = false }) {
  const uid = useId().replace(/:/g, "");
  const loadout = useMemo(() => getRigLoadout(avatar), [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]);
  const worn = useMemo(() => ({
    outfit: getWornAsset(loadout.outfit),
    shoes: getWornAsset(loadout.shoes),
    headwear: getWornAsset(loadout.headwear),
    face: getWornAsset(loadout.face),
    back: getWornAsset(loadout.back),
  }), [loadout.outfit, loadout.shoes, loadout.headwear, loadout.face, loadout.back]);
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
      className={`v46-layered-hero motion-${motion} ${compact ? "is-compact" : ""}`}
      style={{ width: size, aspectRatio: `${VIEW_W}/${VIEW_H}` }}
      role="img"
      aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü tek nötr master karakter`}
      data-avatar-version="4.6-layered-neutral"
      data-motion={motion}
      data-rig-signature={signature}
    >
      <div className="v46-aura" aria-hidden="true" />
      <div className="v46-floor" aria-hidden="true" />
      {equipBurst && <div className="v46-equip-ring" aria-hidden="true" />}

      <div ref={stackRef} className="v46-hero-stack" aria-hidden="true">
        {showEquipment && worn.back && <svg className="v46-layer v46-layer-back" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}><WornAsset item={loadout.back} worn={worn.back} uid={uid} phase="behind" /></svg>}
        <NeutralMaster uid={uid} />
        {showEquipment && <svg className="v46-layer v46-layer-front" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
          {worn.outfit && <WornAsset item={loadout.outfit} worn={worn.outfit} uid={uid} />}
          {worn.shoes && <WornAsset item={loadout.shoes} worn={worn.shoes} uid={uid} />}
          {worn.back && <WornAsset item={loadout.back} worn={worn.back} uid={uid} />}
          {worn.face && <WornAsset item={loadout.face} worn={worn.face} uid={uid} />}
          {worn.headwear && <WornAsset item={loadout.headwear} worn={worn.headwear} uid={uid} />}
        </svg>}
      </div>

      <MotionFX motion={motion} />
      {showBadges && <div className="v46-status"><span>{motion.toUpperCase()}</span><b>{equippedCount}/5</b></div>}
    </div>
  );
}

function NeutralMaster({ uid }) {
  const subtract = ["outfit", "shoes", "back", "headwear"];
  return <svg className="v46-neutral-master" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
    <defs>
      <mask id={`neutral-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
        <rect width={VIEW_W} height={VIEW_H} fill="white" />
        {subtract.flatMap((slot) => (PREMIUM_RIG_MASKS[slot] || []).map((d, index) => <path key={`${slot}-${index}`} d={d} fill="black" />))}
        <circle cx="160" cy="118" r="14" fill="black" />
        <path d="M145 103 Q160 121 175 103 L179 132 Q160 141 141 132 Z" fill="black" />
      </mask>
    </defs>

    {/* reconstructed neutral material sits under the punched-out equipment pixels */}
    <g className="v46-neutral-underlay">
      <path d="M193 90 Q217 93 229 116 L231 166 Q213 181 195 167 L184 132 Z" fill="#6b351f" opacity=".92" />
      <path d="M127 98 Q143 88 153 94 L160 106 L169 94 Q181 89 194 101 L193 143 Q184 161 173 169 L160 158 L147 170 Q135 162 126 145 Z" fill="#f2f3ee" stroke="#cfd8d9" strokeWidth="1.5" />
      <path d="M127 107 Q119 121 116 148 Q112 163 122 170 Q132 166 136 153 L141 119 Z" fill="#f2f3ee" stroke="#cfd8d9" strokeWidth="1.5" />
      <path d="M193 108 Q203 123 208 148 Q214 162 204 170 Q194 166 189 151 L182 119 Z" fill="#f2f3ee" stroke="#cfd8d9" strokeWidth="1.5" />
      <path d="M145 103 Q160 112 175 103" fill="none" stroke="#cfd8d9" strokeWidth="1.4" />
      <path d="M154 107 V159" stroke="#d7dfdf" strokeWidth="1.3" opacity=".75" />

      <path d="M106 329 Q122 322 139 329 L141 364 Q124 374 107 366 Z" fill="#d49a74" />
      <path d="M210 345 Q226 338 242 346 L244 380 Q228 390 211 382 Z" fill="#d49a74" />
      <path d="M109 347 Q124 341 139 348 L141 361 Q124 367 108 361 Z" fill="#dce4e8" />
      <path d="M213 363 Q228 357 242 364 L244 378 Q229 384 212 378 Z" fill="#dce4e8" />

      <ellipse cx="147" cy="28" rx="16" ry="10" fill="#6b351f" transform="rotate(-13 147 28)" />
      <ellipse cx="176" cy="28" rx="16" ry="10" fill="#6b351f" transform="rotate(13 176 28)" />
      <path d="M137 28 Q160 15 187 29 Q180 39 160 39 Q143 39 137 28Z" fill="#6b351f" />
    </g>

    <image href={heroMaster} x="0" y="0" width={VIEW_W} height={VIEW_H} preserveAspectRatio="none" mask={`url(#neutral-${uid})`} />

    {/* clean neutral chest replaces the baked-in necklace area */}
    <path d="M146 105 Q160 116 174 105 L178 132 Q160 140 142 132 Z" fill="#f2f3ee" opacity=".96" />
    <path d="M150 105 Q160 111 170 105" fill="none" stroke="#cbd4d6" strokeWidth="1.2" />
  </svg>;
}

function MotionFX({ motion }) {
  return <div className={`v46-motion-fx is-${motion}`} aria-hidden="true">
    {motion === "thinking" && <span className="v46-fx-question">?</span>}
    {motion === "happy" && <><i className="v46-fx-star s1">✦</i><i className="v46-fx-star s2">✦</i></>}
    {motion === "victory" && <><i className="v46-fx-star s1">★</i><i className="v46-fx-star s2">✦</i><i className="v46-fx-star s3">★</i></>}
    {motion === "equip" && <span className="v46-fx-equip">KUŞANILDI!</span>}
  </div>;
}
