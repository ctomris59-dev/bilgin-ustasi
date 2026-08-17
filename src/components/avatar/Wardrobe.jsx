import { useMemo, useState } from "react";
import { ITEMS } from "../../data/avatarParts";
import { PETS, PET_ACCESSORIES, ROOM_ITEMS } from "../../data/petsAndRoom";
import { ROOM_TYPES } from "../../data/houseRooms";
import { CHARACTER_STYLES, getCharacterStyleAsset } from "../../data/gameAssets";
import { getCatalogMeta, isItemEquipped } from "../../data/catalog";
import { getLevelInfo } from "../../data/levels";
import { getWorldById } from "../../data/worlds";
import RoomBuilder from "./RoomBuilder";
import { playPop } from "../../lib/sound";

const TABS = [
  { id: "equipment", label: "Ekipman", hint: "Karakterini özelleştir" },
  { id: "pets", label: "Dostlar", hint: "Keşif dostunu seç" },
  { id: "base", label: "Üs", hint: "Odanı geliştir" },
  { id: "appearance", label: "Görünüm", hint: "Karakter stilini seç" },
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
    if (["outfit", "shoes", "headwear", "face"].includes(item.slot)) {
      onChangeAvatar({ ...profile.avatar, [item.slot]: profile.avatar?.[item.slot] === item.id && ["headwear", "face"].includes(item.slot) ? null : item.id });
    }
  }

  function choosePet(item) {
    playPop(); onSelectItem?.(item);
    onChangePet({ ...profile.pet, activeSpecies: profile.pet?.activeSpecies === item.id ? null : item.id });
  }

  function choosePetAccessory(item) {
    playPop(); onSelectItem?.(item);
    onChangePet({ ...profile.pet, accessory: profile.pet?.accessory === item.id ? null : item.id });
  }

  return (
    <div className="v4x-character-screen">
      <section className="v4x-character-head">
        <div><span className="v4x-eyebrow">KAŞİF PROFİLİ</span><h2>Karakterini geliştir</h2><p>Görevlerden açtığın itemleri kuşan; petini ve üssünü aynı envanterden yönet.</p></div>
        <div className="v4x-character-summary"><span><b>{owned.size}</b><small>Sahip</small></span><span><b>{countEquipped(profile)}</b><small>Takılı</small></span><span><b>{level}</b><small>Seviye</small></span></div>
      </section>

      <nav className="v4x-character-tabs">
        {TABS.map((entry) => <button key={entry.id} className={tab === entry.id ? "is-active" : ""} onClick={() => { playPop(); setTab(entry.id); }}><strong>{entry.label}</strong><small>{entry.hint}</small></button>)}
      </nav>

      {tab === "equipment" && (
        <section className="v4x-inventory-panel">
          <div className="v4x-slot-tabs">
            {[["outfit","Kıyafet"],["shoes","Ayakkabı"],["headwear","Başlık"],["face","Aksesuar"]].map(([id,label]) => <button key={id} className={slot === id ? "is-active" : ""} onClick={() => setSlot(id)}>{label}</button>)}
          </div>
          <div className="v4x-inventory-grid">
            {equipment.map((item) => <InventoryCard key={item.id} item={item} equipped={isItemEquipped(profile, item)} onClick={() => equip(item)} onSelect={() => onSelectItem?.(item)} />)}
            {equipment.length === 0 && <EmptyInventory text="Bu slot için henüz item açmadın. Dükkan ve test ödüllerinden yeni parçalar kazanabilirsin." />}
          </div>
        </section>
      )}

      {tab === "pets" && (
        <section className="v4x-pet-manager">
          <div className="v4x-section-title"><div><small>KEŞİF DOSTLARI</small><strong>Aktif dostunu seç</strong></div><span>{pets.length} açık</span></div>
          <div className="v4x-inventory-grid v4x-pet-grid">
            {pets.map((item) => <InventoryCard key={item.id} item={item} equipped={profile.pet?.activeSpecies === item.id} onClick={() => choosePet(item)} onSelect={() => onSelectItem?.(item)} actionLabel="Aktif Et" />)}
          </div>
          <div className="v4x-section-title v4x-subsection"><div><small>DOST EKİPMANI</small><strong>Aksesuarlar</strong></div></div>
          <div className="v4x-inventory-grid v4x-compact-grid">
            {petAccessories.map((item) => <InventoryCard key={item.id} item={item} equipped={profile.pet?.accessory === item.id} onClick={() => choosePetAccessory(item)} onSelect={() => onSelectItem?.(item)} actionLabel="Kullan" />)}
          </div>
        </section>
      )}

      {tab === "base" && (
        <section className="v4x-base-manager">
          <div className="v4x-room-tabs">
            {ROOM_TYPES.map((room) => {
              const world = getWorldById(room.unlockWorld); const unlocked = !world || level >= world.unlockLevel;
              return <button key={room.id} disabled={!unlocked} className={roomId === room.id ? "is-active" : ""} onClick={() => setRoomId(room.id)}><span>{room.emoji}</span><strong>{room.title}</strong><small>{unlocked ? "Düzenle" : `Sv. ${world?.unlockLevel}`}</small></button>;
            })}
          </div>
          <RoomBuilder room={profile.rooms?.[roomId]} roomId={roomId} unlockedIds={owned} onCommit={(nextRoom) => onChangeRoomSlot(roomId, nextRoom)} />
          <div className="v4x-room-inventory-note"><span>◈</span><p><strong>Üs itemleri de dersle açılır.</strong> Yeni masa, lamba, halı ve duvar temalarını dükkândan coin ile alabilirsin.</p></div>
        </section>
      )}

      {tab === "appearance" && (
        <section className="v4x-style-manager">
          <div className="v4x-section-title"><div><small>KARAKTER STİLİ</small><strong>Tam görünüm ön ayarları</strong></div><span>Itemler ayrı olarak takılmaya devam eder</span></div>
          <div className="v4x-style-grid">
            {CHARACTER_STYLES.map((style) => {
              const active = (profile.avatar?.characterStyle || "auto") === style.id;
              return <button key={style.id} className={active ? "is-active" : ""} onClick={() => onChangeAvatar({ ...profile.avatar, characterStyle: style.id })}><div><img src={getCharacterStyleAsset(style.id)} alt="" /></div><strong>{style.label}</strong><small>{style.description}</small>{active && <b>✓ Aktif</b>}</button>;
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function InventoryCard({ item, equipped, onClick, onSelect, actionLabel = "Kuşan" }) {
  return <article className={`v4x-inventory-card rarity-${item.rarity} ${equipped ? "is-equipped" : ""}`} style={{ "--item-accent": item.rarityMeta.color }}>
    <button type="button" className="v4x-inventory-preview" onClick={onSelect}><img src={item.cardAsset} alt={item.label} /><span>{item.rarityMeta.label}</span></button>
    <div className="v4x-inventory-copy"><small>{item.slotMeta.label}</small><strong>{item.label}</strong><em>{item.world.shortTitle}</em></div>
    <button className="v4x-equip-button" onClick={onClick}>{equipped ? "✓ Takılı" : actionLabel}</button>
  </article>;
}

function EmptyInventory({ text }) { return <div className="v4x-empty v4x-empty-wide"><span>◇</span><strong>Henüz item yok</strong><small>{text}</small></div>; }

function countEquipped(profile) {
  return [profile.avatar?.outfit, profile.avatar?.shoes, profile.avatar?.headwear, profile.avatar?.face, profile.pet?.activeSpecies, profile.pet?.accessory].filter(Boolean).length;
}
