import { useMemo, useState } from "react";
import { ITEMS } from "../../data/avatarParts";
import { PETS, PET_ACCESSORIES } from "../../data/petsAndRoom";
import { ROOM_TYPES } from "../../data/houseRooms";
import { getCatalogMeta, isItemEquipped } from "../../data/catalog";
import { getLevelInfo } from "../../data/levels";
import { getWorldById } from "../../data/worlds";
import { HERO_PROFILE } from "../../data/avatarRig";
import RoomBuilder from "./RoomBuilder";
import RoomBackground from "./RoomBackground";
import AvatarCanvas from "./AvatarCanvas";
import PetCanvas from "./PetCanvas";
import { playPop } from "../../lib/sound";

const TABS = [
  { id: "equipment", label: "Ekipman", hint: "Kahramanı giydir" },
  { id: "pets", label: "Dostlar", hint: "Keşif dostunu seç" },
  { id: "base", label: "Üs", hint: "Odanı geliştir" },
];

const SLOT_TABS = [
  ["outfit", "Kıyafet"], ["shoes", "Ayakkabı"], ["headwear", "Başlık"],
  ["face", "Aksesuar"], ["back", "Sırt Eşyası"],
];

export default function Wardrobe({ profile, onChangeAvatar, onChangePet, onChangeRoomSlot, onSelectItem }) {
  const [tab, setTab] = useState("equipment");
  const [slot, setSlot] = useState("outfit");
  const [roomId, setRoomId] = useState("bedroom");
  const owned = useMemo(() => new Set(profile.unlockedItems || []), [profile.unlockedItems]);
  const level = getLevelInfo(profile.xp || 0).current.level;

  const equipment = useMemo(() => ITEMS.filter((item) => owned.has(item.id) && item.slot === slot).map(getCatalogMeta), [owned, slot]);
  const pets = useMemo(() => PETS.filter((item) => owned.has(item.id)).map(getCatalogMeta), [owned]);
  const petAccessories = useMemo(() => PET_ACCESSORIES.filter((item) => owned.has(item.id)).map(getCatalogMeta), [owned]);

  function equip(item) {
    playPop();
    onSelectItem?.(item);
    if (["outfit", "shoes", "headwear", "face", "back"].includes(item.slot)) {
      const removable = ["headwear", "face", "back"].includes(item.slot);
      const current = profile.avatar?.[item.slot];
      onChangeAvatar({ ...profile.avatar, [item.slot]: removable && current === item.id ? null : item.id });
    }
  }

  function choosePet(item) {
    playPop();
    onSelectItem?.(item);
    onChangePet({ ...profile.pet, activeSpecies: profile.pet?.activeSpecies === item.id ? null : item.id });
  }

  function choosePetAccessory(item) {
    playPop();
    onSelectItem?.(item);
    onChangePet({ ...profile.pet, accessory: profile.pet?.accessory === item.id ? null : item.id });
  }

  return (
    <div className="v4x-character-screen v43-character-screen">
      <section className="v4x-character-head v43-character-head">
        <div>
          <span className="v4x-eyebrow">V5 · TEK KAHRAMAN</span>
          <h2>Karakter & Envanter</h2>
          <p>{HERO_PROFILE.name} tek ana karakterdir. Kazandığın parçalar artık doğrudan onun rig slotlarına takılır ve hareket eder.</p>
        </div>
        <div className="v4x-character-summary">
          <span><b>{owned.size}</b><small>Sahip</small></span>
          <span><b>{countEquipped(profile)}</b><small>Takılı</small></span>
          <span><b>{level}</b><small>Seviye</small></span>
        </div>
      </section>

      <nav className="v4x-character-tabs v43-character-tabs">
        {TABS.map((entry) => (
          <button key={entry.id} className={tab === entry.id ? "is-active" : ""} onClick={() => { playPop(); setTab(entry.id); }}>
            <strong>{entry.label}</strong><small>{entry.hint}</small>
          </button>
        ))}
      </nav>

      <div className="v43-character-workspace">
        <CharacterStage profile={profile} level={level} />
        <div className="v43-character-content">
          {tab === "equipment" && (
            <section className="v4x-inventory-panel v43-inventory-panel">
              <div className="v43-panel-title">
                <div><small>V5 RIG EKİPMANLARI</small><strong>Takmak istediğin parçayı seç</strong></div>
                <span>{equipment.length} açık</span>
              </div>
              <div className="v4x-slot-tabs v43-slot-tabs">
                {SLOT_TABS.map(([id,label]) => <button key={id} className={slot === id ? "is-active" : ""} onClick={() => setSlot(id)}>{label}</button>)}
              </div>
              <div className="v4x-inventory-grid v43-inventory-grid">
                {equipment.map((item) => (
                  <InventoryCard key={item.id} item={item} equipped={isItemEquipped(profile, item)} onClick={() => equip(item)} onSelect={() => onSelectItem?.(item)} />
                ))}
                {equipment.length === 0 && <EmptyInventory text="Bu slot için henüz item açmadın. Test çözerek coin kazan ve Kaşif Dükkânı'ndan yeni parçalar aç." />}
              </div>
            </section>
          )}

          {tab === "pets" && (
            <section className="v4x-pet-manager v43-pet-manager">
              <div className="v4x-section-title"><div><small>KEŞİF DOSTLARI</small><strong>Aktif dostunu seç</strong></div><span>{pets.length} açık</span></div>
              <div className="v4x-inventory-grid v4x-pet-grid v43-inventory-grid">
                {pets.map((item) => <InventoryCard key={item.id} item={item} equipped={profile.pet?.activeSpecies === item.id} onClick={() => choosePet(item)} onSelect={() => onSelectItem?.(item)} actionLabel="Aktif Et" />)}
              </div>
              <div className="v4x-section-title v4x-subsection"><div><small>DOST EKİPMANI</small><strong>Aksesuarlar</strong></div></div>
              <div className="v4x-inventory-grid v4x-compact-grid v43-inventory-grid">
                {petAccessories.map((item) => <InventoryCard key={item.id} item={item} equipped={profile.pet?.accessory === item.id} onClick={() => choosePetAccessory(item)} onSelect={() => onSelectItem?.(item)} actionLabel="Kullan" />)}
              </div>
            </section>
          )}

          {tab === "base" && (
            <section className="v4x-base-manager v43-base-manager">
              <div className="v4x-room-tabs">
                {ROOM_TYPES.map((room) => {
                  const world = getWorldById(room.unlockWorld);
                  const unlocked = !world || level >= world.unlockLevel;
                  return <button key={room.id} disabled={!unlocked} className={roomId === room.id ? "is-active" : ""} onClick={() => setRoomId(room.id)}><span>{room.emoji}</span><strong>{room.title}</strong><small>{unlocked ? "Düzenle" : `Sv. ${world?.unlockLevel}`}</small></button>;
                })}
              </div>
              <RoomBuilder room={profile.rooms?.[roomId]} roomId={roomId} unlockedIds={owned} onCommit={(nextRoom) => onChangeRoomSlot(roomId, nextRoom)} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function CharacterStage({ profile, level }) {
  return <aside className="v43-character-stage-panel">
    <div className="v43-stage-kicker"><span>AKTİF KAŞİF · {HERO_PROFILE.name.toUpperCase()}</span><b>Lv. {level}</b></div>
    <div className="v43-character-stage">
      <RoomBackground room={profile.rooms?.bedroom} compact heroStage>
        <AvatarCanvas avatar={profile.avatar} size={350} showEquipment showBadges />
        {profile.pet?.activeSpecies && <div className="v43-stage-pet"><PetCanvas pet={profile.pet} size={104} /></div>}
      </RoomBackground>
    </div>
    <div className="v43-equipped-strip">
      {SLOT_TABS.map(([slot,label]) => <div key={slot} className={profile.avatar?.[slot] ? "is-on" : ""}><span>{profile.avatar?.[slot] ? "✓" : "–"}</span><small>{label}</small></div>)}
    </div>
    <div className="v43-learning-loop"><strong>Ders → Ödül → Ekipman → Kahraman</strong><small>Her yeni parça karakterin gerçek SVG rig slotuna takılır.</small></div>
  </aside>;
}

function InventoryCard({ item, equipped, onClick, onSelect, actionLabel = "Kuşan" }) {
  return <article className={`v4x-inventory-card v43-inventory-card rarity-${item.rarity} ${equipped ? "is-equipped" : ""}`} style={{ "--item-accent": item.rarityMeta.color }}>
    <button type="button" className="v4x-inventory-preview" onClick={onSelect}><img src={item.cardAsset} alt={item.label} /><span>{item.rarityMeta.label}</span></button>
    <div className="v4x-inventory-copy"><small>{item.slotMeta.label}</small><strong>{item.label}</strong><em>{item.world.shortTitle}</em></div>
    <button className="v4x-equip-button" onClick={onClick}>{equipped ? "✓ Takılı" : actionLabel}</button>
  </article>;
}

function EmptyInventory({ text }) {
  return <div className="v4x-empty v4x-empty-wide"><span>◇</span><strong>Henüz item yok</strong><small>{text}</small></div>;
}

function countEquipped(profile) {
  return [profile.avatar?.outfit, profile.avatar?.shoes, profile.avatar?.headwear, profile.avatar?.face, profile.avatar?.back, profile.pet?.activeSpecies, profile.pet?.accessory].filter(Boolean).length;
}
