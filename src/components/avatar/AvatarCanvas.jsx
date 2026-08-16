import { ITEMS } from "../../data/avatarParts";

const INK = "#3a3153";
const S = 4.5; // standart kontur kalınlığı

function findItem(id) {
  return ITEMS.find((i) => i.id === id) || null;
}

function Hair({ style, color }) {
  const p = { fill: color, stroke: INK, strokeWidth: S, strokeLinejoin: "round" };
  switch (style) {
    case "hair-long":
      return (
        <g>
          <path d="M58 58 Q56 128 66 152 Q74 156 80 150 Q74 100 76 60 Z" {...p} />
          <path d="M142 58 Q144 128 134 152 Q126 156 120 150 Q126 100 124 60 Z" {...p} />
          <path d="M58 50 Q100 10 142 50 Q140 32 100 26 Q60 32 58 50 Z" {...p} />
        </g>
      );
    case "hair-pony":
      return (
        <g>
          <path d="M58 50 Q100 10 142 50 Q140 32 100 26 Q60 32 58 50 Z" {...p} />
          <path d="M138 54 Q168 66 158 112 Q148 96 130 82 Z" {...p} />
        </g>
      );
    case "hair-curly":
      return (
        <g>
          <circle cx="60" cy="48" r="15" {...p} />
          <circle cx="80" cy="30" r="16" {...p} />
          <circle cx="100" cy="22" r="17" {...p} />
          <circle cx="120" cy="30" r="16" {...p} />
          <circle cx="140" cy="48" r="15" {...p} />
        </g>
      );
    case "hair-bob":
    default:
      return <path d="M56 52 Q100 8 144 52 Q148 78 134 96 L128 64 Q100 34 72 64 L66 96 Q52 78 56 52 Z" {...p} />;
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
          <path d="M100 4 L132 56 L68 56 Z" {...p} />
          <ellipse cx="100" cy="56" rx="38" ry="9" {...p} />
          <circle cx="100" cy="14" r="4" fill="#fff6cf" className="animate-twinkle" />
        </g>
      );
    case "detective-hat":
      return (
        <g>
          <path d="M62 44 Q100 16 138 44 L138 56 L62 56 Z" {...p} />
          <rect x="56" y="52" width="88" height="10" rx="4" {...p} />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d="M60 48 Q100 14 140 48 L140 58 L60 58 Z" {...p} />
          <path d="M132 50 Q158 50 160 62 L132 60 Z" {...p} />
        </g>
      );
    case "beanie":
      return (
        <g>
          <path d="M60 50 Q100 6 140 50 L140 60 L60 60 Z" {...p} />
          <rect x="58" y="54" width="84" height="12" rx="6" fill={item.color} stroke={INK} strokeWidth={S} opacity="0.75" />
          <circle cx="100" cy="10" r="8" fill="#fff" stroke={INK} strokeWidth={S} />
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M62 46 L72 18 L88 40 L100 12 L112 40 L128 18 L138 46 Z" {...p} />
          <circle cx="68" cy="12" r="3" fill="#fff6cf" className="animate-twinkle" />
          <circle cx="132" cy="12" r="3" fill="#fff6cf" className="animate-twinkle" />
          <circle cx="100" cy="4" r="3.5" fill="#fff6cf" className="animate-twinkle" />
        </g>
      );
    case "wings":
      return (
        <g>
          <path d="M58 98 Q8 84 14 132 Q42 122 60 106 Z" fill={item.color} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
          <path d="M142 98 Q192 84 186 132 Q158 122 140 106 Z" fill={item.color} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
        </g>
      );
    case "hairbow":
      return (
        <g transform="translate(128,30) rotate(-10)">
          <path d="M-14 -6 L0 4 L-14 14 Z M14 -6 L0 4 L14 14 Z" {...p} />
          <circle cx="0" cy="4" r="4" {...p} />
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
            return <circle key={i} cx={cx} cy={cy} r="6.5" fill={item.color} stroke={INK} strokeWidth="2.5" />;
          })}
        </g>
      );
    case "partyhat":
      return (
        <g>
          <path d="M100 6 L124 56 L76 56 Z" {...p} />
          <circle cx="100" cy="6" r="5" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <circle cx="90" cy="32" r="3" fill="#fff" opacity="0.8" />
          <circle cx="108" cy="42" r="3" fill="#fff" opacity="0.8" />
        </g>
      );
    case "halo":
      return (
        <g>
          <ellipse cx="100" cy="20" rx="26" ry="8" fill="none" stroke={item.color} strokeWidth="6" className="animate-twinkle" />
          <ellipse cx="100" cy="20" rx="26" ry="8" fill="none" stroke={INK} strokeWidth="1.5" opacity="0.4" />
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
          <circle cx="84" cy="80" r="14" fill="rgba(255,255,255,0.35)" stroke={item.color} strokeWidth={S} />
          <circle cx="116" cy="80" r="14" fill="rgba(255,255,255,0.35)" stroke={item.color} strokeWidth={S} />
          <line x1="98" y1="80" x2="102" y2="80" stroke={item.color} strokeWidth={S} />
        </g>
      );
    case "sunglasses":
      return (
        <g>
          <circle cx="84" cy="80" r="14" fill={item.color} stroke={INK} strokeWidth={S} />
          <circle cx="116" cy="80" r="14" fill={item.color} stroke={INK} strokeWidth={S} />
          <line x1="98" y1="80" x2="102" y2="80" stroke={INK} strokeWidth={S} />
          <circle cx="80" cy="76" r="3" fill="#fff" opacity="0.6" />
          <circle cx="112" cy="76" r="3" fill="#fff" opacity="0.6" />
        </g>
      );
    case "magnifier":
      return (
        <g transform="translate(148,148) rotate(20)">
          <circle cx="0" cy="0" r="15" fill="rgba(255,255,255,0.4)" stroke={INK} strokeWidth={S} />
          <line x1="11" y1="11" x2="28" y2="28" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case "wand":
      return (
        <g transform="translate(156,156) rotate(-25)">
          <rect x="-3" y="-32" width="6" height="42" rx="3" fill="#a9764a" stroke={INK} strokeWidth={2.5} />
          <path d="M0 -42 L6 -32 L-6 -32 Z" fill="#ffe066" stroke={INK} strokeWidth={2} className="animate-twinkle" />
        </g>
      );
    case "backpack-badge":
      return <rect x="132" y="96" width="16" height="20" rx="4" fill={item.color} stroke={INK} strokeWidth={S} />;
    default:
      return null;
  }
}

export default function AvatarCanvas({ avatar, size = 220 }) {
  const skinHex = avatar.skin === "skin-1" ? "#ffe0c2" : avatar.skin === "skin-3" ? "#c98a5c" : avatar.skin === "skin-4" ? "#8a5636" : "#f2c399";
  const outfitItem = findItem(avatar.outfit);
  const shoesItem = findItem(avatar.shoes);
  const outfitColor = outfitItem?.color || "#8c6fff";
  const shoesColor = shoesItem?.color || "#3a3153";
  const skinP = { fill: skinHex, stroke: INK, strokeWidth: S, strokeLinejoin: "round" };
  const outfitP = { fill: outfitColor, stroke: INK, strokeWidth: S, strokeLinejoin: "round" };

  return (
    <svg viewBox="0 0 200 265" width={size} height={size * 1.3} role="img" aria-label="Kişiselleştirilmiş avatar">
      {/* Layer 5b: arkadan aksesuar (kanat gibi) */}
      {avatar.headwear === "headwear-wings" && <Headwear id={avatar.headwear} />}

      {/* Yumuşak zemin gölgesi */}
      <ellipse cx="100" cy="250" rx="38" ry="8" fill="rgba(58,49,83,0.15)" />

      {/* Layer 1: bacaklar */}
      <rect x="78" y="184" width="18" height="48" rx="9" {...skinP} />
      <rect x="104" y="184" width="18" height="48" rx="9" {...skinP} />

      {/* Layer 2.5: ayakkabı */}
      <ellipse cx="87" cy="232" rx="15" ry="9" fill={shoesColor} stroke={INK} strokeWidth={S} />
      <ellipse cx="113" cy="232" rx="15" ry="9" fill={shoesColor} stroke={INK} strokeWidth={S} />

      {/* Layer 2: kollar (gövdenin arkasında) */}
      <rect x="48" y="110" width="20" height="62" rx="10" transform="rotate(10 58 141)" {...outfitP} />
      <rect x="132" y="110" width="20" height="62" rx="10" transform="rotate(-10 142 141)" {...outfitP} />
      <circle cx="55" cy="178" r="10" {...skinP} />
      <circle cx="145" cy="178" r="10" {...skinP} />

      {/* Layer 2: kıyafet (torso) */}
      <path d="M66 106 Q100 92 134 106 L138 192 Q100 206 62 192 Z" {...outfitP} />

      {/* Layer 1: baş (büyük, yuvarlak - Toca Boca stili) */}
      <circle cx="100" cy="66" r="42" {...skinP} />

      {/* Yanaklar */}
      <circle cx="74" cy="80" r="7" fill="#ff8fc7" opacity="0.55" />
      <circle cx="126" cy="80" r="7" fill="#ff8fc7" opacity="0.55" />

      {/* Büyük sevimli gözler */}
      <ellipse cx="83" cy="66" rx="7" ry="9" fill={INK} />
      <ellipse cx="117" cy="66" rx="7" ry="9" fill={INK} />
      <circle cx="85.5" cy="62" r="2.2" fill="#fff" />
      <circle cx="119.5" cy="62" r="2.2" fill="#fff" />

      {/* Kaşlar */}
      <path d="M74 52 Q83 47 92 52" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M108 52 Q117 47 126 52" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* Gülümseme */}
      <path d="M88 86 Q100 94 112 86" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Layer 4: saç */}
      <Hair style={avatar.hairStyle} color={avatar.hairColor} />

      {/* Layer 5: şapka/aksesuar (kanat hariç) */}
      {avatar.headwear !== "headwear-wings" && <Headwear id={avatar.headwear} />}

      {/* Layer 5.5: yüz aksesuarı */}
      <Face id={avatar.face} />
    </svg>
  );
}
