import { useEffect, useId, useMemo, useRef, useState } from "react";
import heroMaster from "../../assets/avatar-v5/premium/heroMasterData.js";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";
import { PREMIUM_RIG_MASKS } from "../../data/premiumRigMasks";

const VIEW_W = 320;
const VIEW_H = 427;

const TONES = {
  blue: { filter: "saturate(1.15) brightness(1.03)", accent: "#4BCBFF" },
  white: { filter: "grayscale(1) brightness(1.85) contrast(.78)", accent: "#55E4C2" },
  teal: { filter: "hue-rotate(-34deg) saturate(1.38) brightness(1.06)", accent: "#55E4C2" },
  purple: { filter: "hue-rotate(55deg) saturate(1.4) brightness(1.03)", accent: "#B886FF" },
  pink: { filter: "hue-rotate(95deg) saturate(1.38) brightness(1.08)", accent: "#FF8DBF" },
  red: { filter: "hue-rotate(132deg) saturate(1.5) brightness(1.01)", accent: "#FF6B78" },
  gold: { filter: "sepia(.72) saturate(1.65) hue-rotate(353deg) brightness(1.15)", accent: "#FFD166" },
  cosmic: { filter: "hue-rotate(64deg) saturate(1.75) brightness(1.07) contrast(1.04)", accent: "#C26CFF" },
  dark: { filter: "saturate(.9) brightness(.7) contrast(1.2)", accent: "#7B8EB5" },
};

function visualTone(item, slot) {
  if (!item) return "blue";
  const id = item.id || "";
  if (id === "outfit-tshirt" || /labcoat|cloud|white|science/i.test(id)) return "white";
  if (/yellow|gold|crown|halo|sun|party|solar/i.test(id)) return "gold";
  if (/red|christmas|meteor|coral/i.test(id)) return "red";
  if (/pink|summer/i.test(id)) return "pink";
  if (/purple|crystal|galaxy|wizard|cosmic|aurora|comet|orbit/i.test(id)) return "cosmic";
  if (/green|emerald|teal|sandals|halloween|forest|ocean/i.test(id)) return "teal";
  if (/night|black|shadow|thunder/i.test(id)) return "dark";
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
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setEquipBurst(true);
    const timer = window.setTimeout(() => setEquipBurst(false), 820);
    return () => window.clearTimeout(timer);
  }, [signature]);

  useEffect(() => {
    let blinkTimer;
    let openTimer;
    let stopped = false;
    const schedule = () => {
      blinkTimer = window.setTimeout(() => {
        if (stopped) return;
        setBlink(true);
        openTimer = window.setTimeout(() => {
          setBlink(false);
          if (!stopped) schedule();
        }, 115);
      }, 2600 + Math.random() * 2500);
    };
    schedule();
    return () => {
      stopped = true;
      window.clearTimeout(blinkTimer);
      window.clearTimeout(openTimer);
    };
  }, []);

  const motion = equipBurst ? "equip" : animation;
  const equippedCount = Object.values(loadout).filter(Boolean).length;
  const headWings = showEquipment && loadout.headwear?.shape === "wings" ? loadout.headwear : null;
  const backWings = showEquipment && loadout.back?.kind === "wings" ? loadout.back : null;
  const wings = headWings || backWings;

  return (
    <div
      className={`v5-animated-avatar v5p-avatar motion-${motion} ${compact ? "is-compact" : ""}`}
      style={{ width: size, aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      role="img"
      aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü Bilgin Kaşif`}
      data-avatar-version="4.5-master-premium"
      data-rig-signature={signature}
    >
      <div className="v5p-aura" aria-hidden="true" />
      <div className="v5p-floor" aria-hidden="true" />
      {equipBurst && <div className="v5p-equip-ring" aria-hidden="true" />}

      <svg className="v5p-rig-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          {Object.entries(PREMIUM_RIG_MASKS).map(([slot, paths]) => (
            <clipPath key={slot} id={`${slot}-${uid}`} clipPathUnits="userSpaceOnUse">
              {paths.map((d, index) => <path key={index} d={d} />)}
            </clipPath>
          ))}
          <filter id={`soft-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#020814" floodOpacity=".55" />
          </filter>
          <filter id={`gearGlow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.4" result="g" />
            <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id={`lens-${uid}`} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#9BF2FF" stopOpacity=".38" />
            <stop offset="1" stopColor="#235ECF" stopOpacity=".18" />
          </linearGradient>
        </defs>

        {wings && <WingAccessory item={wings} uid={uid} />}
        {showEquipment && loadout.back && !backWings && <BackAccessory item={loadout.back} uid={uid} />}

        <image href={heroMaster} x="0" y="0" width={VIEW_W} height={VIEW_H} className="v5p-master-image" />

        {showEquipment && loadout.outfit && <TintedMasterLayer uid={uid} slot="outfit" item={loadout.outfit} />}
        {showEquipment && loadout.shoes && <TintedMasterLayer uid={uid} slot="shoes" item={loadout.shoes} />}
        {showEquipment && loadout.headwear && loadout.headwear.shape !== "wings" && (
          <>
            <TintedMasterLayer uid={uid} slot="headwear" item={loadout.headwear} />
            <PremiumHeadwear item={loadout.headwear} uid={uid} />
          </>
        )}
        {showEquipment && loadout.outfit && <OutfitDetails item={loadout.outfit} uid={uid} />}
        {showEquipment && loadout.shoes && <ShoeDetails item={loadout.shoes} uid={uid} />}
        {showEquipment && loadout.face && <PremiumFaceItem item={loadout.face} uid={uid} />}
        {blink && <BlinkOverlay />}
      </svg>

      {showBadges && (
        <div className="v5p-status"><span>MASTER HERO</span><b>{equippedCount}/5</b></div>
      )}
    </div>
  );
}

function TintedMasterLayer({ uid, slot, item }) {
  const tone = toneFor(item, slot);
  return (
    <image
      href={heroMaster}
      x="0" y="0" width={VIEW_W} height={VIEW_H}
      clipPath={`url(#${slot}-${uid})`}
      className={`v5p-rig-layer v5p-${slot}`}
      style={{ filter: tone.filter }}
    />
  );
}

function BackAccessory({ item, uid }) {
  const tone = toneFor(item, "back");
  const color = tone.accent;
  const variant = item.variant || 0;
  const tech = /science|neon|infinity|star|aurora/i.test(item.id || "");
  return (
    <g className="v5p-rig-layer v5p-back-accessory" filter={`url(#soft-${uid})`}>
      <path d="M205 112 C230 112 249 130 251 157 L255 211 C256 229 244 242 226 242 L206 242 C195 217 191 188 193 156 C194 135 197 121 205 112 Z" fill="#102B43" opacity=".72" />
      <path d="M214 119 C235 122 245 136 246 158 L249 205 C249 217 241 226 229 228 L211 228 C204 204 201 181 202 157 C203 139 207 127 214 119 Z" fill={color} opacity=".9" />
      <path d="M218 132 Q232 126 242 139" fill="none" stroke="#E8F7E7" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
      <rect x="214" y="177" width="29" height="28" rx="7" fill="#0A2940" opacity=".48" />
      <path d="M218 185 H239" stroke="#DFFBFF" strokeOpacity=".55" strokeWidth="2.6" />
      {tech ? <>
        <circle cx="235" cy="150" r="5" fill="#63F2DF" filter={`url(#gearGlow-${uid})`} />
        <path d="M217 215 l5-8 5 8 5-8 6 8" fill="none" stroke="#7EF6EA" strokeWidth="2" opacity=".8" />
      </> : <>
        <rect x="221" y="144" width="18" height="8" rx="4" fill="#D79B55" opacity=".75" />
        {variant % 2 === 1 && <circle cx="230" cy="191" r="5" fill="#FFD166" />}
      </>}
    </g>
  );
}

function OutfitDetails({ item, uid }) {
  const id = item?.id || "";
  const kind = item?.kind || "jacket";
  const variant = item?.variant || 0;
  const accent = toneFor(item, "outfit").accent;
  const fx = { filter: `url(#soft-${uid})` };

  if (kind === "lab") {
    return (
      <g className="v5p-outfit-detail" clipPath={`url(#outfit-${uid})`} {...fx}>
        <path d="M157 116 C158 144 158 169 159 190" fill="none" stroke="#43D9B8" strokeWidth="2.6" opacity=".96" />
        <path d="M168 116 C168 144 168 169 168 190" fill="none" stroke="#43D9B8" strokeWidth="2.2" opacity=".78" />
        <path d="M135 145 L150 145 M176 145 L190 145" stroke="#43D9B8" strokeWidth="2.1" strokeLinecap="round" opacity=".86" />
        <rect x="178" y="122" width="11" height="9" rx="2" fill="#26B995" opacity=".92" />
        <path d="M181 126 l2 2 4-5" fill="none" stroke="#F6FFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M180 137 v18 M184 137 v18 M188 137 v18" stroke="#EF6C7D" strokeWidth="1.5" />
      </g>
    );
  }

  if (kind === "robe") {
    return <g className="v5p-outfit-detail" clipPath={`url(#outfit-${uid})`} {...fx}>
      <path d="M154 111 Q165 128 177 112 Q185 132 198 113" fill="none" stroke={accent} strokeWidth="3" opacity=".85" />
      <path d="M159 139 Q177 149 194 139 M157 157 Q176 168 196 156" fill="none" stroke="#F2E8FF" strokeWidth="2.2" opacity=".65" />
      <path d="M188 131 l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={accent} filter={`url(#gearGlow-${uid})`} />
      {variant > 1 && <circle cx="146" cy="137" r="3" fill="#FFD166" />}
    </g>;
  }

  if (kind === "armor") {
    return <g className="v5p-outfit-detail" clipPath={`url(#outfit-${uid})`} {...fx}>
      <path d="M151 113 L176 124 L201 112 L197 154 L177 166 L156 154 Z" fill={accent} fillOpacity=".28" stroke="#D7F8FF" strokeWidth="2.7" />
      <path d="M160 129 H194 M158 142 H196" stroke="#D7F8FF" strokeWidth="2" opacity=".55" />
      <path d="M176 124 V162" stroke="#091F3C" strokeWidth="3" opacity=".45" />
    </g>;
  }

  if (kind === "overall") {
    return <g className="v5p-outfit-detail" clipPath={`url(#outfit-${uid})`} {...fx}>
      <path d="M155 112 L163 125 V163 H191 V125 L199 112" fill={accent} fillOpacity=".22" stroke="#E9FFFF" strokeWidth="2.2" />
      <rect x="169" y="137" width="16" height="12" rx="3" fill="#0D3A55" opacity=".5" />
      <circle cx="163" cy="126" r="3" fill="#FFD166" /><circle cx="191" cy="126" r="3" fill="#FFD166" />
    </g>;
  }

  const cosmic = /crystal|galaxy|cosmic|aurora|comet|orbit/i.test(id);
  return <g className="v5p-outfit-detail" clipPath={`url(#outfit-${uid})`} {...fx}>
    <path d="M151 119 Q176 129 201 118" fill="none" stroke={accent} strokeWidth="2.5" opacity=".8" />
    <path d="M156 147 H170 M185 147 H198" stroke="#DDFBFF" strokeWidth="2" strokeLinecap="round" opacity=".62" />
    {kind === "hoodie" && <path d="M153 107 Q176 91 201 108" fill="none" stroke="#DFFAFF" strokeWidth="3.5" opacity=".55" />}
    {kind === "utility" && <><rect x="151" y="132" width="13" height="14" rx="3" fill="#071E38" opacity=".38"/><rect x="190" y="132" width="13" height="14" rx="3" fill="#071E38" opacity=".38"/></>}
    {cosmic && <><circle cx="145" cy="136" r="2" fill="#EAFBFF"/><circle cx="189" cy="159" r="1.8" fill="#FFD9FF"/><path d="M194 128 l2.5 5 5 2.5-5 2.5-2.5 5-2.5-5-5-2.5 5-2.5z" fill={accent}/></>}
    {variant === 3 && <path d="M163 160 Q177 151 191 160" fill="none" stroke="#FFD166" strokeWidth="2" />}
  </g>;
}

function ShoeDetails({ item, uid }) {
  const kind = item?.kind || "sneakers";
  const color = toneFor(item, "shoes").accent;
  const variant = item?.variant || 0;
  const fx = { filter: `url(#soft-${uid})` };
  if (kind === "sandals") {
    return <g className="v5p-shoe-detail" {...fx}>
      <path d="M101 399 Q121 407 143 399 M211 400 Q232 408 252 399" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M113 389 l13 12 M224 390 l13 12" stroke="#F4E4B8" strokeWidth="3" strokeLinecap="round" />
    </g>;
  }
  if (kind === "boots") {
    return <g className="v5p-shoe-detail" {...fx}>
      <path d="M109 356 Q128 364 143 356 M214 357 Q232 364 245 356" fill="none" stroke={color} strokeWidth="4" opacity=".8" />
      {[0,1,2].map((n) => <g key={n}><path d={`M113 ${371+n*9} L136 ${378+n*7}`} stroke="#F4E4C5" strokeWidth="2"/><path d={`M218 ${372+n*9} L241 ${378+n*7}`} stroke="#F4E4C5" strokeWidth="2"/></g>)}
      {variant % 2 === 1 && <><circle cx="133" cy="398" r="3" fill="#62F0E0"/><circle cx="237" cy="399" r="3" fill="#62F0E0"/></>}
    </g>;
  }
  return <g className="v5p-shoe-detail" {...fx}>
    <path d="M107 395 Q126 405 146 397 M210 397 Q231 407 252 398" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M113 381 L138 389 M216 382 L242 390" stroke="#EAFBFF" strokeWidth="2.5" opacity=".8" />
    {variant > 1 && <><path d="M117 388 l4 5 5-5 5 5 5-5" fill="none" stroke="#FFD166" strokeWidth="1.8"/><path d="M220 389 l4 5 5-5 5 5 5-5" fill="none" stroke="#FFD166" strokeWidth="1.8"/></>}
  </g>;
}

function PremiumHeadwear({ item, uid }) {
  const color = toneFor(item, "headwear").accent;
  const shape = item?.shape || "cap";
  const fx = { filter: `url(#soft-${uid})` };
  if (shape === "halo") return <ellipse cx="174" cy="22" rx="35" ry="9" fill="none" stroke={color} strokeWidth="4" {...fx}/>;
  if (shape === "hairbow") return <g {...fx} transform="translate(217 54) rotate(12)"><path d="M0 0 C-14 -11 -18 4 -7 11 L0 7 Z" fill={color}/><path d="M0 0 C14 -11 18 4 7 11 L0 7 Z" fill={color}/><circle cx="0" cy="5" r="5" fill="#FFE6A7"/></g>;
  if (shape === "crown") return <g {...fx}><path d="M145 44 L152 22 L165 39 L177 17 L189 39 L203 23 L208 47 Z" fill={color} stroke="#FFF1A5" strokeWidth="2"/><rect x="146" y="43" width="61" height="10" rx="4" fill="#D99513"/><circle cx="177" cy="39" r="4" fill="#64EDFF"/></g>;
  if (shape === "wizardhat") return <g {...fx}><path d="M151 51 C158 30 168 7 178 -6 C188 16 193 34 199 53 Z" fill={color} stroke="#BCEEFF" strokeWidth="2"/><path d="M134 54 Q176 39 216 55 Q178 68 134 54 Z" fill={color}/><path d="M171 13 l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#FFD166"/></g>;
  if (shape === "flowercrown") return <g {...fx}><path d="M143 52 Q174 37 207 51" fill="none" stroke="#56D996" strokeWidth="5"/><circle cx="154" cy="47" r="7" fill="#FF8CB8"/><circle cx="176" cy="43" r="7" fill="#FFD166"/><circle cx="198" cy="47" r="7" fill="#8B8CFF"/></g>;
  if (shape === "beanie") return <g {...fx}><path d="M143 52 Q146 17 176 13 Q205 17 208 53 Z" fill={color}/><rect x="142" y="47" width="68" height="11" rx="5" fill="#092757" opacity=".7"/><circle cx="176" cy="12" r="7" fill="#EAFBFF"/></g>;
  if (shape === "partyhat") return <g {...fx}><path d="M165 50 L181 12 L198 51 Z" fill={color} stroke="#FFEBA3" strokeWidth="2"/><circle cx="181" cy="11" r="6" fill="#FFD166"/></g>;
  if (shape === "detective-hat") return <g {...fx}><path d="M142 51 Q148 22 176 21 Q203 23 209 50 Z" fill="#76513E" stroke="#C79A72" strokeWidth="2"/><path d="M133 53 Q176 43 219 54 Q177 67 133 53 Z" fill="#5E3C30"/><path d="M146 43 H205" stroke={color} strokeWidth="5"/></g>;
  return <g {...fx}><path d="M140 51 Q149 23 178 23 Q204 25 211 49 Q178 58 140 51 Z" fill={color} stroke="#A7EEFF" strokeWidth="2"/><path d="M203 46 Q222 45 228 52 Q214 58 199 54" fill={color}/><path d="M151 42 Q177 31 201 42" fill="none" stroke="#08346D" strokeWidth="5" opacity=".55"/></g>;
}

function PremiumFaceItem({ item, uid }) {
  const color = toneFor(item, "face").accent;
  const shape = item?.shape || "glasses";
  const fx = { filter: `url(#soft-${uid})` };
  if (shape === "backpack-badge") return <g {...fx}><circle cx="183" cy="125" r="6.5" fill="#FFD166" stroke="#FFF4BE" strokeWidth="1.5"/><path d="M180 125 l2 2 4-5" fill="none" stroke="#0A466C" strokeWidth="1.3"/></g>;
  if (shape === "magnifier") return <g {...fx} transform="rotate(-16 236 222)"><circle cx="236" cy="204" r="15" fill={`url(#lens-${uid})`} stroke={color} strokeWidth="4"/><path d="M247 215 L269 242" stroke="#6C452D" strokeWidth="7" strokeLinecap="round"/></g>;
  if (shape === "wand") return <g {...fx}><path d="M239 240 L275 182" stroke="#744B2E" strokeWidth="5" strokeLinecap="round"/><path d="M278 169 l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill={color}/></g>;
  const dark = shape === "sunglasses" || /visor/i.test(item?.id || "");
  return <g {...fx}><ellipse cx="151" cy="67" rx="14" ry="11" fill={dark ? "#07152B" : `url(#lens-${uid})`} fillOpacity={dark ? ".84" : "1"} stroke={color} strokeWidth="3"/><ellipse cx="178" cy="66.5" rx="14" ry="11" fill={dark ? "#07152B" : `url(#lens-${uid})`} fillOpacity={dark ? ".84" : "1"} stroke={color} strokeWidth="3"/><path d="M164 66 Q165 63 166 66" fill="none" stroke={color} strokeWidth="3"/><path d="M137 66 L128 63 M192 65 L201 61" stroke={color} strokeWidth="2.5"/></g>;
}

function WingAccessory({ item, uid }) {
  const color = toneFor(item, item.slot || "headwear").accent;
  return <g className="v5p-wing-accessory" filter={`url(#soft-${uid})`} opacity=".9"><path d="M119 130 C72 99 54 116 79 153 C48 145 44 170 83 181 C57 190 69 211 107 191 C117 174 122 153 119 130 Z" fill={color} fillOpacity=".28" stroke={color} strokeWidth="3"/><path d="M215 130 C263 99 281 116 255 153 C287 145 291 170 252 181 C278 190 266 211 228 191 C217 174 212 153 215 130 Z" fill={color} fillOpacity=".28" stroke={color} strokeWidth="3"/></g>;
}

function BlinkOverlay() {
  return <g className="v5p-blink" opacity=".92"><path d="M139 67 Q151 74 162 66" fill="none" stroke="#D89D7D" strokeWidth="5" strokeLinecap="round"/><path d="M166 66 Q178 73 190 64" fill="none" stroke="#D89D7D" strokeWidth="5" strokeLinecap="round"/></g>;
}
