import { useEffect, useId, useMemo, useRef, useState } from "react";
import heroMaster from "../../assets/avatar-v5/premium/hero-master.webp";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";
import { PREMIUM_RIG_MASKS } from "../../data/premiumRigMasks";

const VIEW_W = 320;
const VIEW_H = 427;

const TONES = {
  blue: { filter: "saturate(1.12) brightness(1.04)", accent: "#4BCBFF" },
  white: { filter: "grayscale(1) brightness(1.88) contrast(.76)", accent: "#55E4C2" },
  teal: { filter: "hue-rotate(-34deg) saturate(1.35) brightness(1.08)", accent: "#55E4C2" },
  purple: { filter: "hue-rotate(55deg) saturate(1.35) brightness(1.05)", accent: "#B886FF" },
  pink: { filter: "hue-rotate(95deg) saturate(1.34) brightness(1.11)", accent: "#FF8DBF" },
  red: { filter: "hue-rotate(132deg) saturate(1.48) brightness(1.02)", accent: "#FF6B78" },
  gold: { filter: "sepia(.72) saturate(1.6) hue-rotate(353deg) brightness(1.16)", accent: "#FFD166" },
  cosmic: { filter: "hue-rotate(64deg) saturate(1.72) brightness(1.08) contrast(1.03)", accent: "#C26CFF" },
  dark: { filter: "saturate(.9) brightness(.72) contrast(1.18)", accent: "#7B8EB5" },
};

function visualTone(item, slot) {
  if (!item) return "blue";
  const id = item.id || "";
  if (id === "outfit-tshirt" || /labcoat|cloud|white/i.test(id)) return "white";
  if (/yellow|gold|crown|halo|sun|party/i.test(id)) return "gold";
  if (/red|christmas/i.test(id)) return "red";
  if (/pink|summer/i.test(id)) return "pink";
  if (/purple|crystal|galaxy|wizard/i.test(id)) return "cosmic";
  if (/green|emerald|teal|sandals|halloween/i.test(id)) return "teal";
  if (/night|black|shadow/i.test(id)) return "dark";
  if (item.set === "bilim" && slot === "outfit") return "white";
  if (item.set === "kozmik") return "cosmic";
  if (item.set === "buyulu") return "purple";
  if (item.set === "deniz") return "teal";
  if (item.set === "pijama") return "pink";
  if (item.set === "prens") return "gold";
  return "blue";
}

function toneFor(item, slot) {
  return TONES[visualTone(item, slot)] || TONES.blue;
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
  const [equipBurst, setEquipBurst] = useState(false);

  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setEquipBurst(true);
    const timer = window.setTimeout(() => setEquipBurst(false), 820);
    return () => window.clearTimeout(timer);
  }, [signature]);

  const motion = equipBurst ? "equip" : animation;
  const equippedCount = Object.values(loadout).filter(Boolean).length;
  const wings = showEquipment && loadout.headwear?.shape === "wings" ? loadout.headwear : null;

  return (
    <div
      className={`v5-animated-avatar v5p-avatar motion-${motion} ${compact ? "is-compact" : ""}`}
      style={{ width: size, aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      role="img"
      aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü Bilgin Kaşif`}
      data-avatar-version="5.1-premium"
      data-rig-signature={signature}
    >
      <div className="v5p-aura" aria-hidden="true" />
      <div className="v5p-floor" aria-hidden="true" />
      {equipBurst && <div className="v5p-equip-ring" aria-hidden="true" />}

      <svg
        className="v5p-rig-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {Object.entries(PREMIUM_RIG_MASKS).map(([slot, paths]) => (
            <clipPath key={slot} id={`${slot}-${uid}`} clipPathUnits="userSpaceOnUse">
              {paths.map((d, index) => <path key={index} d={d} />)}
            </clipPath>
          ))}
          <filter id={`soft-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#020814" floodOpacity=".55" />
          </filter>
          <linearGradient id={`lens-${uid}`} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#9BF2FF" stopOpacity=".38" />
            <stop offset="1" stopColor="#235ECF" stopOpacity=".18" />
          </linearGradient>
        </defs>

        {wings && <WingAccessory item={wings} uid={uid} />}

        <image href={heroMaster} x="0" y="0" width={VIEW_W} height={VIEW_H} className="v5p-master-image" />

        {showEquipment && loadout.back && (
          <TintedMasterLayer uid={uid} slot="back" item={loadout.back} />
        )}
        {showEquipment && loadout.outfit && (
          <>
            <TintedMasterLayer uid={uid} slot="outfit" item={loadout.outfit} />
            <OutfitDetails item={loadout.outfit} uid={uid} />
          </>
        )}
        {showEquipment && loadout.shoes && (
          <TintedMasterLayer uid={uid} slot="shoes" item={loadout.shoes} />
        )}
        {showEquipment && loadout.headwear && loadout.headwear.shape !== "wings" && (
          <>
            <TintedMasterLayer uid={uid} slot="headwear" item={loadout.headwear} />
            <PremiumHeadwear item={loadout.headwear} uid={uid} />
          </>
        )}
        {showEquipment && loadout.face && <PremiumFaceItem item={loadout.face} uid={uid} />}
      </svg>

      {showBadges && (
        <div className="v5p-status">
          <span>PREMIUM HERO</span>
          <b>{equippedCount}/5</b>
        </div>
      )}
    </div>
  );
}

function TintedMasterLayer({ uid, slot, item }) {
  const tone = toneFor(item, slot);
  return (
    <image
      href={heroMaster}
      x="0"
      y="0"
      width={VIEW_W}
      height={VIEW_H}
      clipPath={`url(#${slot}-${uid})`}
      className={`v5p-rig-layer v5p-${slot}`}
      style={{ filter: tone.filter }}
    />
  );
}

function OutfitDetails({ item, uid }) {
  if (!item) return null;
  const id = item.id || "";
  const tone = toneFor(item, "outfit");

  if (id === "outfit-tshirt" || /labcoat/i.test(id)) {
    return (
      <g className="v5p-outfit-detail" clipPath={`url(#outfit-${uid})`} filter={`url(#soft-${uid})`}>
        <path d="M157 116 C158 144 158 169 159 190" fill="none" stroke="#43D9B8" strokeWidth="2.6" opacity=".96" />
        <path d="M168 116 C168 144 168 169 168 190" fill="none" stroke="#43D9B8" strokeWidth="2.2" opacity=".78" />
        <path d="M135 145 L150 145 M176 145 L190 145" stroke="#43D9B8" strokeWidth="2.1" strokeLinecap="round" opacity=".86" />
        <rect x="178" y="122" width="11" height="9" rx="2" fill="#26B995" opacity=".92" />
        <path d="M181 126 l2 2 4-5" fill="none" stroke="#F6FFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }

  if (/crystal|galaxy|cosmic/i.test(id)) {
    return (
      <g className="v5p-outfit-detail" clipPath={`url(#outfit-${uid})`}>
        <circle cx="143" cy="136" r="2" fill="#EAFBFF" opacity=".9" />
        <circle cx="179" cy="161" r="1.6" fill="#FFD9FF" opacity=".86" />
        <path d="M188 131 l2.5 5 5 2.5-5 2.5-2.5 5-2.5-5-5-2.5 5-2.5z" fill={tone.accent} opacity=".92" />
      </g>
    );
  }

  return null;
}

function PremiumHeadwear({ item, uid }) {
  const tone = toneFor(item, "headwear");
  const color = tone.accent;
  const shape = item.shape || "cap";
  const common = { filter: `url(#soft-${uid})` };

  if (shape === "halo") {
    return <ellipse cx="174" cy="22" rx="35" ry="9" fill="none" stroke={color} strokeWidth="4" opacity=".9" {...common} />;
  }
  if (shape === "hairbow") {
    return <g {...common} transform="translate(217 54) rotate(12)"><path d="M0 0 C-14 -11 -18 4 -7 11 L0 7 Z" fill={color}/><path d="M0 0 C14 -11 18 4 7 11 L0 7 Z" fill={color}/><circle cx="0" cy="5" r="5" fill="#FFE6A7"/></g>;
  }
  if (shape === "crown") {
    return <g {...common}><path d="M145 44 L152 22 L165 39 L177 17 L189 39 L203 23 L208 47 Z" fill={color} stroke="#FFF1A5" strokeWidth="2"/><rect x="146" y="43" width="61" height="10" rx="4" fill="#D99513"/><circle cx="177" cy="39" r="4" fill="#64EDFF"/></g>;
  }
  if (shape === "wizardhat") {
    return <g {...common}><path d="M151 51 C158 30 168 7 178 -6 C188 16 193 34 199 53 Z" fill={color} stroke="#BCEEFF" strokeWidth="2"/><path d="M134 54 Q176 39 216 55 Q178 68 134 54 Z" fill={color}/><path d="M171 13 l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#FFD166"/></g>;
  }
  if (shape === "flowercrown") {
    return <g {...common}><path d="M143 52 Q174 37 207 51" fill="none" stroke="#56D996" strokeWidth="5"/><circle cx="154" cy="47" r="7" fill="#FF8CB8"/><circle cx="176" cy="43" r="7" fill="#FFD166"/><circle cx="198" cy="47" r="7" fill="#8B8CFF"/><circle cx="154" cy="47" r="2" fill="#FFF6C9"/><circle cx="176" cy="43" r="2" fill="#FFF6C9"/><circle cx="198" cy="47" r="2" fill="#FFF6C9"/></g>;
  }
  if (shape === "detective-hat") {
    return <g {...common}><path d="M142 51 Q148 22 176 21 Q203 23 209 50 Z" fill="#76513E" stroke="#C79A72" strokeWidth="2"/><path d="M133 53 Q176 43 219 54 Q177 67 133 53 Z" fill="#5E3C30"/><path d="M146 43 H205" stroke={color} strokeWidth="5"/></g>;
  }
  if (shape === "beanie") {
    return <g {...common}><path d="M143 52 Q146 17 176 13 Q205 17 208 53 Z" fill={color}/><rect x="142" y="47" width="68" height="11" rx="5" fill="#092757" opacity=".7"/><circle cx="176" cy="12" r="7" fill="#EAFBFF"/></g>;
  }
  if (shape === "partyhat") {
    return <g {...common}><path d="M165 50 L181 12 L198 51 Z" fill={color} stroke="#FFEBA3" strokeWidth="2"/><circle cx="181" cy="11" r="6" fill="#FFD166"/><path d="M169 39 L193 32 M173 29 L188 24" stroke="#EAFBFF" strokeWidth="2" opacity=".8"/></g>;
  }
  return <g {...common}><path d="M140 51 Q149 23 178 23 Q204 25 211 49 Q178 58 140 51 Z" fill={color} stroke="#A7EEFF" strokeWidth="2"/><path d="M203 46 Q222 45 228 52 Q214 58 199 54" fill={color}/><path d="M151 42 Q177 31 201 42" fill="none" stroke="#08346D" strokeWidth="5" opacity=".55"/></g>;
}

function PremiumFaceItem({ item, uid }) {
  const tone = toneFor(item, "face");
  const color = tone.accent;
  const shape = item.shape || "glasses";
  const common = { filter: `url(#soft-${uid})` };

  if (shape === "backpack-badge") {
    return <g {...common}><circle cx="183" cy="125" r="6.5" fill="#FFD166" stroke="#FFF4BE" strokeWidth="1.5"/><path d="M180 125 l2 2 4-5" fill="none" stroke="#0A466C" strokeWidth="1.3" strokeLinecap="round"/></g>;
  }
  if (shape === "magnifier") {
    return <g {...common} transform="rotate(-16 236 222)"><circle cx="236" cy="204" r="15" fill={`url(#lens-${uid})`} stroke={color} strokeWidth="4"/><path d="M247 215 L269 242" stroke="#6C452D" strokeWidth="7" strokeLinecap="round"/></g>;
  }
  if (shape === "wand") {
    return <g {...common}><path d="M239 240 L275 182" stroke="#744B2E" strokeWidth="5" strokeLinecap="round"/><path d="M278 169 l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill={color}/></g>;
  }

  const sunglasses = shape === "sunglasses";
  return <g {...common}>
    <ellipse cx="151" cy="67" rx="14" ry="11" fill={sunglasses ? "#07152B" : `url(#lens-${uid})`} fillOpacity={sunglasses ? ".82" : "1"} stroke={color} strokeWidth="3"/>
    <ellipse cx="178" cy="66.5" rx="14" ry="11" fill={sunglasses ? "#07152B" : `url(#lens-${uid})`} fillOpacity={sunglasses ? ".82" : "1"} stroke={color} strokeWidth="3"/>
    <path d="M164 66 Q165 63 166 66" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <path d="M137 66 L128 63 M192 65 L201 61" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </g>;
}

function WingAccessory({ item, uid }) {
  const color = toneFor(item, "headwear").accent;
  return <g className="v5p-wing-accessory" filter={`url(#soft-${uid})`} opacity=".9">
    <path d="M119 130 C72 99 54 116 79 153 C48 145 44 170 83 181 C57 190 69 211 107 191 C117 174 122 153 119 130 Z" fill={color} fillOpacity=".28" stroke={color} strokeWidth="3"/>
    <path d="M215 130 C263 99 281 116 255 153 C287 145 291 170 252 181 C278 190 266 211 228 191 C217 174 212 153 215 130 Z" fill={color} fillOpacity=".28" stroke={color} strokeWidth="3"/>
    <path d="M95 136 Q89 159 102 180 M239 136 Q245 159 232 180" fill="none" stroke="#E9FDFF" strokeWidth="2" opacity=".55"/>
  </g>;
}
