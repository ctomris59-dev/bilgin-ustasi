import { useMemo, useState } from "react";
import { ITEMS } from "../../data/avatarParts";
import { PETS, PET_ACCESSORIES } from "../../data/petsAndRoom";
import { ROOM_TYPES } from "../../data/houseRooms";
import { getCatalogMeta, isItemEquipped } from "../../data/catalog";
import { getLevelInfo } from "../../data/levels";
import { getWorldById } from "../../data/worlds";
import RoomBuilder from "./RoomBuilder";
import PetCanvas from "./PetCanvas";
import AnimatedAvatar from "./AnimatedAvatar";
import { playPop } from "../../lib/sound";

const MODES = [["equipment", "Kahraman", "✦"], ["pets", "Dost", "◆"], ["base", "Üs", "⌂"]];
const SLOT_TABS = [["outfit", "Kıyafet", "◈"], ["shoes", "Ayakkabı", "⌁"], ["headwear", "Başlık", "△"], ["face", "Aksesuar", "◎"], ["back", "Sırt", "◇"]];
const MOTIONS = [["idle", "Rahat", "●"], ["thinking", "Düşün", "?"], ["happy", "Mutlu", "✦"], ["victory", "Zafer", "★"]];

export default function Wardrobe({ profile, onChangeAvatar, onChangePet, onChangeRoomSlot, onSelectItem }) {
  const [mode, setMode] = useState("equipment");
  const [slot, setSlot] = useState("outfit");
  const [selectedId, setSelectedId] = useState(null);
  const [roomId, setRoomId] = useState("bedroom");
  const [motion, setMotion] = useState("idle");

  const owned = useMemo(() => new Set(profile.unlockedItems || []), [profile.unlockedItems]);
  const level = getLevelInfo(profile.xp || 0).current.level;
  const equipment = useMemo(() => ITEMS.filter((item) => owned.has(item.id) && item.slot === slot).map(getCatalogMeta), [owned, slot]);
  const selected = equipment.find((item) => item.id === selectedId) || equipment[0] || null;
  const pets = useMemo(() => PETS.filter((item) => owned.has(item.id)).map(getCatalogMeta), [owned]);
  const petAccessories = useMemo(() => PET_ACCESSORIES.filter((item) => owned.has(item.id)).map(getCatalogMeta), [owned]);
  const equippedCount = [profile.avatar?.outfit, profile.avatar?.shoes, profile.avatar?.headwear, profile.avatar?.face, profile.avatar?.back].filter(Boolean).length;
  const completion = Math.round((equippedCount / 5) * 100);

  function equip(item) {
    if (!item) return;
    onSelectItem?.(item);
    onChangeAvatar({ ...profile.avatar, [item.slot]: item.id });
  }

  function chooseAndEquip(item) {
    if (!item) return;
    setSelectedId(item.id);
    playPop();
    equip(item);
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
    <div className="v45-game-screen v45-master-screen">
      <header className="v45-game-head">
        <div>
          <span className="v45-kicker">V4.6 · LAYERED CORE 18</span>
          <h2>Bilgin Kaşifini geliştir</h2>
          <p>Tek nötr master · 5 sabit slot · anchor tabanlı wornAsset katmanları. Mağaza ikonları karakter rendererından tamamen ayrıdır.</p>
        </div>
        <div className="v45-head-stats">
          <span><b>Lv.{level}</b><small>Seviye</small></span>
          <span><b>{Math.min(18, [...owned].filter((id) => ITEMS.some((item) => item.id === id)).length)}/18</b><small>Core Set</small></span>
          <span><b>{completion}%</b><small>Donanım</small></span>
        </div>
      </header>

      <nav className="v45-mode-switch" aria-label="Karakter alanı">
        {MODES.map(([id, label, icon]) => <button key={id} type="button" className={mode === id ? "is-active" : ""} onClick={() => { setMode(id); playPop(); }}><span>{icon}</span><strong>{label}</strong></button>)}
      </nav>

      {mode === "equipment" && (
        <section className="v45-loadout-layout v45-master-layout">
          <div className="v45-hero-stage v45-premium-stage">
            <div className="v45-stage-orbit v45-stage-orbit-one" />
            <div className="v45-stage-orbit v45-stage-orbit-two" />
            <div className="v45-stage-stars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <div className="v45-stage-copy"><span>AKTİF KAHRAMAN</span><strong>Bilgin Kaşif</strong><small>Kıvırcık saç · yeşil göz · nötr master + katmanlı rig</small></div>

            <div className="v45-motion-console" aria-label="Karakter animasyonları" data-active-motion={motion}>
              {MOTIONS.map(([id, label, icon]) => <button key={id} type="button" className={motion === id ? "is-active" : ""} onClick={() => { setMotion(id); playPop(); }} title={`${label} animasyonu`} aria-pressed={motion === id}><span>{icon}</span><small>{label}</small></button>)}
            </div>

            <div className="v45-premium-hero-wrap"><AnimatedAvatar avatar={profile.avatar} size={520} animation={motion} showEquipment showBadges /></div>

            <div className="v45-equipped-dock">
              {SLOT_TABS.map(([id, label, icon]) => <button key={id} type="button" className={`${slot === id ? "is-active" : ""} ${profile.avatar?.[id] ? "is-equipped" : ""}`} onClick={() => { setSlot(id); setSelectedId(null); playPop(); }}><span>{icon}</span><small>{label}</small><b>{profile.avatar?.[id] ? "✓" : "+"}</b></button>)}
            </div>
          </div>

          <div className="v45-inventory-zone v45-master-inventory">
            <div className="v45-loop-banner"><span><b>1</b> Soruyu çöz</span><i>→</i><span><b>2</b> Ödül kazan</span><i>→</i><span><b>3</b> Ekipmanı kuşan</span><i>→</i><span><b>4</b> Kahramanı geliştir</span></div>
            <div className="v45-slot-header"><div><small>{SLOT_TABS.find(([id]) => id === slot)?.[1]?.toUpperCase()}</small><strong>Envanter</strong></div><span>{equipment.length} / {ITEMS.filter((item) => item.slot === slot).length} açık</span></div>

            <div className="v45-item-carousel">
              {equipment.map((item) => {
                const equipped = isItemEquipped(profile, item);
                const active = selected?.id === item.id;
                return <button key={item.id} type="button" className={`v45-item-card rarity-${item.rarity} ${equipped ? "is-equipped" : ""} ${active ? "is-selected" : ""}`} style={{ "--item-accent": item.rarityMeta.color }} onClick={() => chooseAndEquip(item)} aria-pressed={equipped}>
                  <span className="v45-rarity">{item.rarityMeta.label}</span><img src={item.cardAsset} alt="" /><strong>{item.label}</strong><small>{item.world.shortTitle}</small><em>{equipped ? "TAKILI" : "KUŞAN"}</em>
                </button>;
              })}
              {equipment.length === 0 && <div className="v45-empty-inventory"><span>◇</span><strong>Bu slotta açık item yok</strong><small>Dükkândan çekirdek item satın al veya görev ödülü kazan.</small></div>}
            </div>

            <div className="v45-selected-panel">
              {selected ? <>
                <div className="v45-selected-art" style={{ "--item-accent": selected.rarityMeta.color }}><img src={selected.cardAsset} alt={selected.label} /></div>
                <div className="v45-selected-copy"><span style={{ color: selected.rarityMeta.color }}>{selected.rarityMeta.label} · {selected.slotMeta.label}</span><h3>{selected.label}</h3><p>Vitrindeki shopIcon yalnızca kart içindir. Kahraman üzerinde bu itemin ayrı wornAsset'i, kendi anchor noktası ve katman sırası kullanılır.</p><div><b>RIG SLOT</b><strong>{selected.slot.toUpperCase()}</strong></div></div>
                <button type="button" className={`v45-equip-cta ${isItemEquipped(profile, selected) ? "is-on" : ""}`} onClick={() => { playPop(); equip(selected); }}>{isItemEquipped(profile, selected) ? "✓ Üzerinde" : "Kahramana Tak"}</button>
              </> : <div className="v45-select-hint"><span>✦</span><strong>Bir ekipman seç</strong><small>Karta dokunduğunda doğrudan kuşanır.</small></div>}
            </div>
          </div>
        </section>
      )}

      {mode === "pets" && <section className="v45-secondary-screen"><div className="v45-secondary-hero"><span className="v45-kicker">KEŞİF DOSTU</span><h3>Macera takımını kur</h3><p>Dostun kahramanın yanında görevlerde görünür.</p><div className="v45-pet-stage"><PetCanvas pet={profile.pet} size={210} /></div></div><div className="v45-secondary-list"><h3>Dostlar</h3><div className="v45-mini-cards">{pets.map((item) => <MiniCard key={item.id} item={item} active={profile.pet?.activeSpecies === item.id} onClick={() => choosePet(item)} />)}</div><h3>Aksesuarlar</h3><div className="v45-mini-cards">{petAccessories.map((item) => <MiniCard key={item.id} item={item} active={profile.pet?.accessory === item.id} onClick={() => choosePetAccessory(item)} />)}</div></div></section>}

      {mode === "base" && <section className="v45-base-screen"><div className="v45-room-selector">{ROOM_TYPES.map((room) => { const world = getWorldById(room.unlockWorld); const unlocked = !world || level >= world.unlockLevel; return <button key={room.id} type="button" disabled={!unlocked} className={roomId === room.id ? "is-active" : ""} onClick={() => setRoomId(room.id)}><span>{room.emoji}</span><strong>{room.title}</strong><small>{unlocked ? "Düzenle" : `Sv. ${world?.unlockLevel}`}</small></button>; })}</div><RoomBuilder room={profile.rooms?.[roomId]} roomId={roomId} unlockedIds={owned} onCommit={(nextRoom) => onChangeRoomSlot(roomId, nextRoom)} /></section>}
    </div>
  );
}

function MiniCard({ item, active, onClick }) {
  return <button type="button" className={`v45-mini-card ${active ? "is-active" : ""}`} onClick={onClick}><img src={item.cardAsset} alt="" /><strong>{item.label}</strong><small>{active ? "Aktif" : "Seç"}</small></button>;
}
