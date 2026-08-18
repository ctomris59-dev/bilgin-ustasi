import { PETS } from "../../data/petsAndRoom";
import { getCatalogMeta } from "../../data/catalog";

export default function CompanionHub({ profile, onChangePet }) {
  const pets = PETS.map(getCatalogMeta);
  const active = profile?.pet?.activeSpecies;
  return <section className="v47-simple-page"><header><span className="v47-eyebrow">DOST</span><h1>Keşif arkadaşını seç.</h1><p>Dostların görevlerde yanında görünür ve Bilgin Kaşif Üssü'ne canlılık katar.</p></header><div className="v47-simple-grid">{pets.map((pet)=><button key={pet.id} className={active===pet.id?"is-active":""} onClick={()=>onChangePet?.({...profile.pet,activeSpecies:pet.id})}><img src={pet.cardAsset} alt=""/><small>KEŞİF DOSTU</small><strong>{pet.label}</strong><span>{active===pet.id?"✓ AKTİF":"SEÇ"}</span></button>)}</div></section>;
}
