import { ITEMS } from "../../data/avatarParts";

const INK = "#4A2E4B";
const S = 4.5;

function findItem(id) {
  return ITEMS.find((i) => i.id === id) || null;
}

function Hair({ style, color }) {
  const p = { fill: color, stroke: INK, strokeWidth: S, strokeLinejoin: "round" };
  switch (style) {
    case "hair-long-braid":
      return (
        <g>
          <path d="M58 58 Q56 128 66 152 Q74 156 80 150 Q74 100 76 60 Z" {...p} />
          <path d="M142 58 Q144 128 134 152 Q126 156 120 150 Q126 100 124 60 Z" {...p} />
          <path d="M58 50 Q100 10 142 50 Q140 32 100 26 Q60 32 58 50 Z" {...p} />
          <path d="M136 70 Q160 110 145 155 Q135 160 130 150 Q142 110 130 80 Z" {...p} />
          <circle cx="140" cy="148" r="5" fill="#FF70A6" stroke={INK} strokeWidth="2" />
        </g>
      );
    case "hair-twin-pigtails":
      return (
        <g>
          <path d="M58 50 Q100 10 142 50 Q140 32 100 26 Q60 32 58 50 Z" {...p} />
          <path d="M58 54 Q28 66 38 112 Q48 96 66 82 Z" {...p} />
          <path d="M142 54 Q172 66 162 112 Q152 96 134 82 Z" {...p} />
          <circle cx="60" cy="62" r="5.5" fill="#FF70A6" stroke={INK} strokeWidth="2.5" />
          <circle cx="140" cy="62" r="5.5" fill="#FF70A6" stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case "hair-space-buns":
      return (
        <g>
          <circle cx="58" cy="24" r="18" {...p} />
          <circle cx="142" cy="24" r="18" {...p} />
          <path d="M56 52 Q100 8 144 52 Q148 78 134 96 L128 64 Q100 34 72 64 L66 96 Q52 78 56 52 Z" {...p} />
          <circle cx="58" cy="24" r="8" fill="#FF9EAA" opacity="0.6" />
          <circle cx="142" cy="24" r="8" fill="#FF9EAA" opacity="0.6" />
        </g>
      );
    case "hair-wavy-long":
      return (
        <g>
          <path d="M52 52 Q35 100 45 155 Q55 160 62 148 Q50 105 60 60 Z" {...p} />
          <path d="M148 52 Q165 100 155 155 Q145 160 138 148 Q150 105 140 60 Z" {...p} />
          <path d="M54 48 Q100 6 146 48 Q142 28 100 22 Q58 28 54 48 Z" {...p} />
        </g>
      );
    case "hair-curly-afro":
      return (
        <g>
          <circle cx="55" cy="48" r="16" {...p} />
          <circle cx="75" cy="28" r="17" {...p} />
          <circle cx="100" cy="20" r="18" {...p} />
          <circle cx="125" cy="28" r="17" {...p} />
          <circle cx="145" cy="48" r="16" {...p} />
          <circle cx="62" cy="68" r="14" {...p} />
          <circle cx="138" cy="68" r="14" {...p} />
        </g>
      );
    case "hair-bob-bangs":
    default:
      return <path d="M54 52 Q100 8 146 52 Q150 82 136 102 L128 66 Q100 42 72 66 L64 102 Q50 82 54 52 Z" {...p} />;
  }
}

function Headwear({ id }) {
  const item = findItem(id);
  if (!item) return null;
  const p = { fill: item.color, stroke: INK, strokeWidth: S, strokeLinejoin: "round" };
  switch (item.shape || id) {
    case "wizardhat":
      return (
        <g>
          <path d="M100 2 L134 56 L66 56 Z" {...p} />
          <ellipse cx="100" cy="56" rx="40" ry="10" {...p} />
          <circle cx="100" cy="14" r="5" fill="#FFF275" className="animate-twinkle" />
        </g>
      );
    case "detective-hat":
      return (
        <g>
          <path d="M62 44 Q100 16 138 44 L138 56 L62 56 Z" {...p} />
          <rect x="54" y="52" width="92" height="10" rx="5" {...p} />
          <path d="M90 48 L100 38 L110 48 Z" fill="#FF70A6" stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M60 48 Q100 14 140 48 L140 58 L60 58 Z" {...p} />
          <path d="M132 50 Q160 50 162 62 L132 60 Z" {...p} />
          <circle cx="80" cy="36" r="4" fill="#FFFFFF" opacity="0.8" />
        </g>
      );
    case "beanie":
      return (
        <g>
          <path d="M60 50 Q100 6 140 50 L140 60 L60 60 Z" {...p} />
          <rect x="56" y="54" width="88" height="12" rx="6" fill={item.color} stroke={INK} strokeWidth={S} />
          <circle cx="100" cy="8" r="9" fill="#FFFFFF" stroke={INK} strokeWidth={S} />
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M60 46 L70 16 L88 40 L100 10 L112 40 L130 16 L140 46 Z" {...p} />
          <circle cx="68" cy="10" r="4" fill="#FFF275" className="animate-twinkle" />
          <circle cx="132" cy="10" r="4" fill="#FFF275" className="animate-twinkle" />
          <circle cx="100" cy="4" r="5" fill="#FF70A6" className="animate-twinkle" />
        </g>
      );
    case "wings":
      return (
        <g>
          <path d="M58 98 Q0 70 10 136 Q42 122 60 106 Z" fill={item.color} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
          <path d="M142 98 Q200 70 190 136 Q158 122 140 106 Z" fill={item.color} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
        </g>
      );
    case "hairbow":
      return (
        <g transform="translate(130,28) rotate(-10)">
          <path d="M-16 -8 L0 4 L-16 16 Z M16 -8 L0 4 L16 16 Z" {...p} />
          <circle cx="0" cy="4" r="5" {...p} />
        </g>
      );
    case "flowercrown":
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = -70 + i * 35;
            const rad = (angle * Math.PI) / 180;
            const cx = 100 + 46 * Math.sin(rad);
            const cy = 34 - 30 * Math.cos(rad);
            return <circle key={i} cx={cx} cy={cy} r="7" fill={i % 2 === 0 ? "#FF70A6" : "#FFD166"} stroke={INK} strokeWidth="2.5" />;
          })}
        </g>
      );
    case "partyhat":
      return (
        <g>
          <path d="M100 4 L126 56 L74 56 Z" {...p} />
          <circle cx="100" cy="4" r="6" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
          <circle cx="92" cy="30" r="3.5" fill="#FFF275" />
          <circle cx="110" cy="42" r="3.5" fill="#FF70A6" />
        </g>
      );
    case "halo":
      return (
        <g>
          <ellipse cx="100" cy="18" rx="28" ry="9" fill="none" stroke="#FFF275" strokeWidth="7" className="animate-twinkle" />
          <ellipse cx="100" cy="18" rx="28" ry="9" fill="none" stroke={INK} strokeWidth="2" opacity="0.6" />
        </g>
      );
    default:
      return null;
  }
}

function Face({ id }) {
  const item = findItem(id);
  if (!item) return null;
  switch (item.shape || id) {
    case "glasses":
      return (
        <g>
          <circle cx="82" cy="80" r="15" fill="rgba(255,255,255,0.4)" stroke={item.color} strokeWidth={S} />
          <circle cx="118" cy="80" r="15" fill="rgba(255,255,255,0.4)" stroke={item.color} strokeWidth={S} />
          <line x1="97" y1="80" x2="103" y2="80" stroke={item.color} strokeWidth={S} />
        </g>
      );
    case "sunglasses":
      return (
        <g>
          <path d="M68 68 L96 68 L92 92 L72 92 Z" fill={item.color} stroke={INK} strokeWidth={S} />
          <path d="M104 68 L132 68 L128 92 L108 92 Z" fill={item.color} stroke={INK} strokeWidth={S} />
          <line x1="96" y1="74" x2="104" y2="74" stroke={INK} strokeWidth={S} />
          <circle cx="76" cy="74" r="3" fill="#FFFFFF" opacity="0.8" />
          <circle cx="112" cy="74" r="3" fill="#FFFFFF" opacity="0.8" />
        </g>
      );
    case "magnifier":
      return (
        <g transform="translate(148,148) rotate(20)">
          <circle cx="0" cy="0" r="16" fill="rgba(255,255,255,0.5)" stroke={INK} strokeWidth={S} />
          <line x1="11" y1="11" x2="30" y2="30" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        </g>
      );
    case "wand":
      return (
        <g transform="translate(156,156) rotate(-25)">
          <rect x="-3" y="-34" width="6" height="46" rx="3" fill="#FF70A6" stroke={INK} strokeWidth="2.5" />
          <path d="M0 -44 L7 -32 L-7 -32 Z" fill="#FFF275" stroke={INK} strokeWidth="2" className="animate-twinkle" />
        </g>
      );
    case "backpack-badge":
      return <rect x="132" y="96" width="18" height="22" rx="5" fill={item.color} stroke={INK} strokeWidth={S} />;
    default:
      return null;
  }
}

export default function AvatarCanvas({ avatar, size = 220 }) {
  const skinHex = avatar.skin === "skin-1" ? "#FFE0C2" : avatar.skin === "skin-3" ? "#C98A5C" : avatar.skin === "skin-4" ? "#8A5636" : "#F2C399";
  const outfitItem = findItem(avatar.outfit);
  const shoesItem = findItem(avatar.shoes);
  const outfitColor = outfitItem?.color || "#FF70A6";
  const shoesColor = shoesItem?.color || "#70D6FF";
  const skinP = { fill: skinHex, stroke: INK, strokeWidth: S, strokeLinejoin: "round" };
  const outfitP = { fill: outfitColor, stroke: INK, strokeWidth: S, strokeLinejoin: "round" };

  return (
    <svg viewBox="0 0 200 265" width={size} height={size * 1.3} role="img" aria-label="Sevimli Toca avatarı">
      {avatar.headwear === "headwear-wings" && <Headwear id={avatar.headwear} />}

      <ellipse cx="100" cy="250" rx="40" ry="9" fill="rgba(74,46,75,0.18)" />

      <rect x="78" y="184" width="18" height="48" rx="9" {...skinP} />
      <rect x="104" y="184" width="18" height="48" rx="9" {...skinP} />

      <ellipse cx="87" cy="232" rx="16" ry="10" fill={shoesColor} stroke={INK} strokeWidth={S} />
      <ellipse cx="113" cy="232" rx="16" ry="10" fill={shoesColor} stroke={INK} strokeWidth={S} />

      <rect x="48" y="110" width="20" height="62" rx="10" transform="rotate(10 58 141)" {...outfitP} />
      <rect x="132" y="110" width="20" height="62" rx="10" transform="rotate(-10 142 141)" {...outfitP} />
      <circle cx="55" cy="178" r="10" {...skinP} />
      <circle cx="145" cy="178" r="10" {...skinP} />

      <path d="M66 106 Q100 92 134 106 L138 192 Q100 206 62 192 Z" {...outfitP} />

      <circle cx="100" cy="66" r="44" {...skinP} />

      <circle cx="73" cy="80" r="8" fill="#FF9EAA" opacity="0.65" />
      <circle cx="127" cy="80" r="8" fill="#FF9EAA" opacity="0.65" />

      <ellipse cx="83" cy="66" rx="7.5" ry="9.5" fill={INK} />
      <ellipse cx="117" cy="66" rx="7.5" ry="9.5" fill={INK} />
      <circle cx="85.5" cy="62" r="2.5" fill="#FFFFFF" />
      <circle cx="119.5" cy="62" r="2.5" fill="#FFFFFF" />

      <path d="M74 50 Q83 45 92 50" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M108 50 Q117 45 126 50" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />

      <path d="M88 86 Q100 95 112 86" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />

      <Hair style={avatar.hairStyle} color={avatar.hairColor} />

      {avatar.headwear !== "headwear-wings" && <Headwear id={avatar.headwear} />}

      <Face id={avatar.face} />
    </svg>
  );
}
