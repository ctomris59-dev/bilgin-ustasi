import { PETS, PET_ACCESSORIES } from "../../data/petsAndRoom";

const INK = "#4A2E4B";
const S = 4;

function AccessoryOverlay({ accessoryId, color }) {
  if (!accessoryId) return null;
  switch (accessoryId) {
    case "pet-collar":
    case "pet-collar-blue":
      return <ellipse cx="50" cy="64" rx="18" ry="5" fill={color} stroke={INK} strokeWidth={S} />;
    case "pet-bow":
      return (
        <g>
          <path d="M36 26 L50 36 L36 46 Z M64 26 L50 36 L64 46 Z" fill={color} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="50" cy="36" r="3.5" fill={color} stroke={INK} strokeWidth="2" />
        </g>
      );
    case "pet-scarf":
      return <rect x="30" y="58" width="40" height="11" rx="5" fill={color} stroke={INK} strokeWidth={S} />;
    default:
      return null;
  }
}

function Eyes() {
  return (
    <>
      <ellipse cx="42" cy="30" rx="5" ry="6" fill={INK} />
      <ellipse cx="58" cy="30" rx="5" ry="6" fill={INK} />
      <circle cx="43.5" cy="27.5" r="1.6" fill="#FFFFFF" />
      <circle cx="59.5" cy="27.5" r="1.6" fill="#FFFFFF" />
    </>
  );
}

function Body({ type, color }) {
  const p = { fill: color, stroke: INK, strokeWidth: S, strokeLinejoin: "round" };
  switch (type) {
    case "dog":
      return (
        <g>
          <ellipse cx="50" cy="56" rx="27" ry="20" {...p} />
          <circle cx="50" cy="30" r="19" {...p} />
          <ellipse cx="32" cy="22" rx="8" ry="12" transform="rotate(-20 32 22)" {...p} />
          <ellipse cx="68" cy="22" rx="8" ry="12" transform="rotate(20 68 22)" {...p} />
          <Eyes />
          <ellipse cx="50" cy="38" rx="4.5" ry="3.5" fill={INK} />
          <path d="M44 43 Q50 48 56 43" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "dragon":
      return (
        <g>
          <ellipse cx="50" cy="56" rx="25" ry="19" {...p} />
          <circle cx="50" cy="30" r="18" {...p} />
          <path d="M34 16 L40 0 L46 16 Z M54 16 L60 0 L66 16 Z" fill="#FFF275" stroke={INK} strokeWidth={S} />
          <path d="M76 50 Q96 42 92 64 Q82 60 76 62 Z" fill={color} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
          <Eyes />
          <path d="M44 42 Q50 47 56 42" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "owl":
      return (
        <g>
          <ellipse cx="50" cy="46" rx="24" ry="28" {...p} />
          <circle cx="40" cy="36" r="12" fill="#FFFFFF" stroke={INK} strokeWidth={S} />
          <circle cx="60" cy="36" r="12" fill="#FFFFFF" stroke={INK} strokeWidth={S} />
          <circle cx="40" cy="36" r="5" fill={INK} />
          <circle cx="60" cy="36" r="5" fill={INK} />
          <path d="M50 42 L44 50 L56 50 Z" fill="#FFD166" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </g>
      );
    case "cat":
    default:
      return (
        <g>
          <ellipse cx="50" cy="56" rx="25" ry="19" {...p} />
          <circle cx="50" cy="30" r="18" {...p} />
          <path d="M36 16 L28 -2 L46 14 Z M64 16 L72 -2 L54 14 Z" {...p} />
          <Eyes />
          <path d="M46 39 L54 39 L50 44 Z" fill={INK} />
          <path d="M76 56 Q94 48 88 36" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M76 56 Q94 48 88 36" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />
        </g>
      );
  }
}

export default function PetCanvas({ pet, size = 90 }) {
  if (!pet?.activeSpecies) return null;
  const species = PETS.find((p) => p.id === pet.activeSpecies);
  if (!species) return null;
  const accessory = PET_ACCESSORIES.find((a) => a.id === pet.accessory);

  return (
    <svg viewBox="0 0 100 72" width={size} height={size * 0.72} role="img" aria-label={`Evcil hayvan: ${species.label}`} className="animate-bob">
      <ellipse cx="50" cy="68" rx="28" ry="4.5" fill="rgba(74,46,75,0.18)" />
      <Body type={species.type} color={species.color} />
      {accessory && <AccessoryOverlay accessoryId={accessory.id} color={accessory.color} />}
    </svg>
  );
}
