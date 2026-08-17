import { PETS, PET_ACCESSORIES } from "../../data/petsAndRoom";
import { getPetAsset, getItemCardAsset } from "../../data/gameAssets";

export default function PetCanvas({ pet, size = 90 }) {
  if (!pet?.activeSpecies) return null;
  const species = PETS.find((entry) => entry.id === pet.activeSpecies);
  if (!species) return null;
  const accessory = PET_ACCESSORIES.find((entry) => entry.id === pet.accessory) || null;

  return (
    <div className="relative flex items-end justify-center v43-pet-canvas" style={{ width: size, height: size }} role="img" aria-label={`Keşif dostu: ${species.label}`}>
      <div className="absolute bottom-[5%] h-[18%] w-[72%] rounded-full blur-lg" style={{ background: species.color, opacity: 0.18 }} />
      <img src={getPetAsset(species.id)} alt="" draggable="false" className="relative z-10 h-full w-full select-none object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,.35)]" />
      {accessory && <PetAccessory item={accessory} />}
    </div>
  );
}

function PetAccessory({ item }) {
  const id = item.id || "";
  const top = /goggle|cap|şapka/i.test(`${id} ${item.label}`);
  const medal = /medal|madalya/i.test(`${id} ${item.label}`);
  const style = top
    ? { width: "48%", height: "38%", top: "3%", left: "26%" }
    : medal
      ? { width: "31%", height: "31%", top: "46%", left: "35%" }
      : { width: "47%", height: "35%", top: "48%", left: "27%" };
  return <img src={getItemCardAsset(item)} alt="" draggable="false" className="absolute z-20 object-contain v43-pet-accessory" style={style} />;
}
