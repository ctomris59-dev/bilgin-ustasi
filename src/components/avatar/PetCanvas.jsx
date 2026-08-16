import { PETS } from "../../data/petsAndRoom";
import { getPetAsset } from "../../data/gameAssets";

export default function PetCanvas({ pet, size = 90 }) {
  if (!pet?.activeSpecies) return null;
  const species = PETS.find((entry) => entry.id === pet.activeSpecies);
  if (!species) return null;

  return (
    <div
      className="relative flex items-end justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Keşif dostu: ${species.label}`}
    >
      <div
        className="absolute bottom-[5%] h-[18%] w-[72%] rounded-full blur-lg"
        style={{ background: species.color, opacity: 0.16 }}
      />
      <img
        src={getPetAsset(species.id)}
        alt=""
        draggable="false"
        className="relative z-10 h-full w-full select-none object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,.35)]"
      />
      {pet.accessory && (
        <span
          className="absolute right-0 top-1 z-20 h-3 w-3 rounded-full border border-white/30"
          style={{ background: "#FFD166", boxShadow: "0 0 12px rgba(255,209,102,.4)" }}
        />
      )}
    </div>
  );
}
