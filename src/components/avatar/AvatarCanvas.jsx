import { ITEMS } from "../../data/avatarParts";
import { getAvatarPreset, getItemCardAsset } from "../../data/gameAssets";

export default function AvatarCanvas({ avatar = {}, size = 180, showEquipment = true }) {
  const preset = getAvatarPreset(avatar);
  const equipment = [
    { key: "outfit", id: avatar.outfit, label: "Kıyafet", pos: "left-top" },
    { key: "headwear", id: avatar.headwear, label: "Başlık", pos: "right-top" },
    { key: "shoes", id: avatar.shoes, label: "Ayakkabı", pos: "left-bottom" },
    { key: "face", id: avatar.face, label: "Aksesuar", pos: "right-bottom" },
  ].map((entry) => ({ ...entry, item: ITEMS.find((item) => item.id === entry.id) })).filter((entry) => entry.item);

  return (
    <div className="game-avatar relative isolate flex items-end justify-center" style={{ width: size, height: size * 1.18 }} role="img" aria-label="Kaşif avatarı">
      <div className="pointer-events-none absolute bottom-[5%] left-1/2 h-[22%] w-[72%] -translate-x-1/2 rounded-full blur-2xl" style={{ background: avatar.hairColor || "#52E3FF", opacity: 0.16 }} />
      <div className="pointer-events-none absolute inset-[12%] rounded-full border border-white/[0.04] bg-gradient-to-b from-white/[0.025] to-transparent" />
      <img src={preset} alt="" draggable="false" className="relative z-10 h-full w-full select-none object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,.38)]" />
      {showEquipment && equipment.map((entry) => <EquipmentBadge key={entry.key} item={entry.item} position={entry.pos} label={entry.label} />)}
      <div className="pointer-events-none absolute bottom-[6%] left-1/2 z-20 h-[3px] w-[58%] -translate-x-1/2 rounded-full bg-white/10 blur-[1px]" />
    </div>
  );
}

function EquipmentBadge({ item, position, label }) {
  return <div className={`v4x-avatar-equip-badge ${position}`} style={{ "--badge-accent": item.color || "#52E3FF" }} title={`${label}: ${item.label}`}>
    <img src={getItemCardAsset(item)} alt=""/><span>{label}</span>
  </div>;
}
