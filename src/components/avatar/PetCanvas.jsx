import { PETS, PET_ACCESSORIES } from "../../data/petsAndRoom";

const INK = "#3a3153";
const S = 4;

function AccessoryOverlay({ accessoryId, color }) {
  if (!accessoryId) return null;
  switch (accessoryId) {
    case "pet-collar":
      return <ellipse cx="50" cy="64" rx="17" ry="4.5" fill={color} stroke={INK} strokeWidth={S} />;
    case "pet-bow":
      return (
        <g>
          <path d="M38 28 L50 37 L38 46 Z M62 28 L50 37 L62 46 Z" fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <circle cx="50" cy="37" r="3" fill={color} stroke={INK} strokeWidth={2} />
        </g>
      );
    case "pet-scarf":
      return <rect x="32" y="58" width="36" height="10" rx="5" fill={color} stroke={INK} strokeWidth={S} />;
    default:
      return null;
  }
}

function Eyes() {
  return (
    <>
      <ellipse cx="43" cy="30" rx="4.5" ry="5.5" fill={INK} />
      <ellipse cx="57" cy="30" rx="4.5" ry="5.5" fill={INK} />
      <circle cx="44.5" cy="27.5" r="1.4" fill="#fff" />
      <circle cx="58.5" cy="27.5" r="1.4" fill="#fff" />
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
          <ellipse cx="34" cy="20" rx="7" ry="11" transform="rotate(-25 34 20)" {...p} />
          <ellipse cx="66" cy="20" rx="7" ry="11" transform="rotate(25 66 20)" {...p} />
          <Eyes />
          <ellipse cx="50" cy="38" rx="4" ry="3" fill={INK} />
          <path d="M44 43 Q50 47 56 43" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "dragon":
      return (
        <g>
          <ellipse cx="50" cy="56" rx="25" ry="19" {...p} />
          <circle cx="50" cy="30" r="18" {...p} />
          <path d="M36 16 L40 2 L46 16 Z M54 16 L60 2 L64 16 Z" {...p} />
          <path d="M76 50 Q94 44 92 62 Q82 60 76 62 Z" fill={color} stroke={INK} strokeWidth={S} strokeLinejoin="round" opacity="0.9" />
          <Eyes />
          <path d="M44 42 Q50 46 56 42" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "owl":
      return (
        <g>
          <ellipse cx="50" cy="46" rx="24" ry="28" {...p} />
          <circle cx="41" cy="36" r="11" fill="#fff" stroke={INK} strokeWidth={S} />
          <circle cx="59" cy="36" r="11" fill="#fff" stroke={INK} strokeWidth={S} />
          <circle cx="41" cy="36" r="4.5" fill={INK} />
          <circle cx="59" cy="36" r="4.5" fill={INK} />
          <path d="M50 42 L45 50 L55 50 Z" fill="#ffc93c" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </g>
      );
    case "cat":
    default:
      return (
        <g>
          <ellipse cx="50" cy="56" rx="25" ry="19" {...p} />
          <circle cx="50" cy="30" r="18" {...p} />
          <path d="M36 16 L30 0 L46 14 Z M64 16 L70 0 L54 14 Z" {...p} />
          <Eyes />
          <path d="M46 39 L54 39 L50 44 Z" fill={INK} />
          <path d="M76 56 Q92 50 88 38" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M76 56 Q92 50 88 38" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
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
      <ellipse cx="50" cy="68" rx="26" ry="4" fill="rgba(58,49,83,0.15)" />
      <Body type={species.type} color={species.color} />
      {accessory && <AccessoryOverlay accessoryId={accessory.id} color={accessory.color} />}
    </svg>
  );
}
