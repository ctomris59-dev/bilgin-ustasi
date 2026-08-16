import { useState } from "react";
import AvatarCanvas from "./AvatarCanvas";
import PetCanvas from "./PetCanvas";
import RoomBackground from "./RoomBackground";
import StickerAlbum from "../StickerAlbum";
import { ITEMS, SLOTS, SKIN_TONES, HAIR_STYLES, HAIR_COLORS, SETS } from "../../data/avatarParts";
import { PETS, PET_ACCESSORIES } from "../../data/petsAndRoom";
import { ROOM_TYPES, getRoomCompletion, isRoomComplete } from "../../data/houseRooms";
import { isWorldUnlocked } from "../../data/worlds";
import { getLevelInfo } from "../../data/levels";
import { playPop } from "../../lib/sound";
import RoomBuilder from "./RoomBuilder";

const SLOT_LABELS = {
  [SLOTS.OUTFIT]: "Kıyafet",
  [SLOTS.SHOES]: "Ayakkabı",
  [SLOTS.HEADWEAR]: "Baş / Aksesuar",
  [SLOTS.FACE]: "Yüz Aksesuarı",
};

function ClothesTab({ profile, unlocked, onChangeAvatar }) {
  function setSlot(slot, itemId) {
    onChangeAvatar({ ...profile.avatar, [slot]: itemId });
  }
  function toggleSlot(slot, itemId) {
    const current = profile.avatar[slot];
    setSlot(slot, current === itemId ? null : itemId);
  }

  return (
    <div className="space-y-4">
      <div className="sticker-card p-4">
        <h3 className="font-display text-base mb-2">Ten Tonu</h3>
        <div className="flex gap-2 mb-4">
          {SKIN_TONES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSlot("skin", s.id)}
              className={`w-9 h-9 rounded-full border-2 ${profile.avatar.skin === s.id ? "border-violet" : "border-transparent"}`}
              style={{ backgroundColor: s.hex }}
              aria-label={`Ten tonu ${s.id}`}
            />
          ))}
        </div>
        <h3 className="font-display text-base mb-2">Saç Stili</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {HAIR_STYLES.map((h) => (
            <button
              key={h.id}
              onClick={() => setSlot("hairStyle", h.id)}
              className={`px-3 py-1.5 rounded-full text-sm ${profile.avatar.hairStyle === h.id ? "bg-violet text-white" : "bg-parchment-dim text-ink"}`}
            >
              {h.label}
            </button>
          ))}
        </div>
        <h3 className="font-display text-base mb-2">Saç Rengi</h3>
        <div className="flex gap-2">
          {HAIR_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setSlot("hairColor", c)}
              className={`w-8 h-8 rounded-full border-2 ${profile.avatar.hairColor === c ? "border-violet" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              aria-label={`Saç rengi ${c}`}
            />
          ))}
        </div>
      </div>

      {Object.values(SETS).map((set) => {
        const setItems = ITEMS.filter((i) => i.set === set.id);
        if (setItems.length === 0) return null;
        return (
          <div key={set.id} className="sticker-card p-4">
            <h3 className="font-display text-base mb-3" style={{ color: set.color }}>
              {set.label}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {setItems.map((item) => {
                const owned = unlocked.has(item.id);
                const active = profile.avatar[item.slot] === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={!owned}
                    onClick={() => toggleSlot(item.slot, item.id)}
                    className={`text-left p-2.5 rounded-xl border text-sm transition ${
                      !owned
                        ? "opacity-40 cursor-not-allowed border-dashed border-ink/30"
                        : active
                        ? "border-violet bg-violet/10"
                        : "border-ink/15 hover:border-violet/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.label}</span>
                      {item.legendary && <span className="text-xs text-gold">✨ efsanevi</span>}
                    </div>
                    <div className="text-xs opacity-70">
                      {SLOT_LABELS[item.slot]} {!owned && `· 🔒 Mağazadan ${item.legendary ? "kazan" : "al"}`}
                      {active && owned && " · Takılı"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PetTab({ profile, unlocked, onChangePet }) {
  function selectSpecies(id) {
    onChangePet({ ...profile.pet, activeSpecies: profile.pet.activeSpecies === id ? null : id });
  }
  function selectAccessory(id) {
    onChangePet({ ...profile.pet, accessory: profile.pet.accessory === id ? null : id });
  }

  return (
    <div className="space-y-4">
      <div className="sticker-card p-4">
        <h3 className="font-display text-base mb-3">Dostların</h3>
        <div className="grid grid-cols-2 gap-2">
          {PETS.map((p) => {
            const owned = unlocked.has(p.id);
            const active = profile.pet.activeSpecies === p.id;
            return (
              <button
                key={p.id}
                disabled={!owned}
                onClick={() => selectSpecies(p.id)}
                className={`text-left p-2.5 rounded-xl border text-sm transition ${
                  !owned ? "opacity-40 cursor-not-allowed border-dashed border-ink/30" : active ? "border-violet bg-violet/10" : "border-ink/15 hover:border-violet/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{p.label}</span>
                  {p.legendary && <span className="text-xs text-gold">✨ efsanevi</span>}
                </div>
                <div className="text-xs opacity-70">{!owned ? `🔒 Mağazadan ${p.legendary ? "kazan" : "al"}` : active ? "Aktif" : "Sahipsin"}</div>
              </button>
            );
          })}
        </div>
      </div>

      {profile.pet.activeSpecies && (
        <div className="sticker-card p-4">
          <h3 className="font-display text-base mb-3">Aksesuarlar</h3>
          <div className="grid grid-cols-2 gap-2">
            {PET_ACCESSORIES.map((a) => {
              const owned = unlocked.has(a.id);
              const active = profile.pet.accessory === a.id;
              return (
                <button
                  key={a.id}
                  disabled={!owned}
                  onClick={() => selectAccessory(a.id)}
                  className={`text-left p-2.5 rounded-xl border text-sm transition ${
                    !owned ? "opacity-40 cursor-not-allowed border-dashed border-ink/30" : active ? "border-violet bg-violet/10" : "border-ink/15 hover:border-violet/50"
                  }`}
                >
                  <span className="font-semibold">{a.label}</span>
                  <div className="text-xs opacity-70">{!owned ? "🔒 Mağazadan al" : active ? "Takılı" : "Sahipsin"}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function HouseTab({ profile, unlocked, onChangeRoomSlot, activeRoomId, onSelectRoom }) {
  const { current } = getLevelInfo(profile.xp);
  const currentLevel = current.level;
  const activeRoomType = ROOM_TYPES.find((r) => r.id === activeRoomId);
  const activeRoomState = profile.rooms[activeRoomId];
  const roomUnlocked = isWorldUnlocked(activeRoomType.unlockWorld, currentLevel);
  const completedCount = ROOM_TYPES.filter((r) => isRoomComplete(profile.rooms[r.id])).length;

  return (
    <div className="space-y-4">
      <div className="sticker-card p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-sm">🏠 Evim — {completedCount}/{ROOM_TYPES.length} oda tamamlandı</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ROOM_TYPES.map((r) => {
            const unlocked_ = isWorldUnlocked(r.unlockWorld, currentLevel);
            const pct = Math.round(getRoomCompletion(profile.rooms[r.id]) * 100);
            return (
              <button
                key={r.id}
                onClick={() => {
                  playPop();
                  onSelectRoom(r.id);
                }}
                className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl border-2 ${
                  activeRoomId === r.id ? "border-ink bg-parchment-dim" : unlocked_ ? "border-ink/20" : "border-dashed border-ink/20 opacity-50"
                }`}
              >
                <span className="text-xl">{unlocked_ ? r.emoji : "🔒"}</span>
                <span className="text-[10px] font-semibold whitespace-nowrap">{r.title}</span>
                {unlocked_ && <span className="text-[9px] opacity-60">{pct}%</span>}
              </button>
            );
          })}
        </div>
      </div>

      {!roomUnlocked ? (
        <div className="sticker-card p-6 text-center text-sm">
          🔒 {activeRoomType.title}, Sihirli Yol Haritası'nda ilgili dünya açılınca döşenebilir hale gelir. Haritadan hangi seviyede olduğunu görebilirsin!
        </div>
      ) : (
        <>
          {isRoomComplete(activeRoomState) && (
            <div className="sticker-card p-3 text-center text-sm bg-teal/15 border-teal font-semibold">🎉 Bu oda tamamen döşendi!</div>
          )}
          <RoomBuilder
            key={activeRoomId}
            room={activeRoomState}
            roomId={activeRoomId}
            unlockedIds={unlocked}
            onCommit={(newState) => onChangeRoomSlot(activeRoomId, newState)}
          />
        </>
      )}
    </div>
  );
}

export default function Wardrobe({ profile, onChangeAvatar, onChangePet, onChangeRoomSlot }) {
  const [subTab, setSubTab] = useState("clothes");
  const [activeRoomId, setActiveRoomId] = useState("bedroom");
  const unlocked = new Set(profile.unlockedItems);

  return (
    <div className="space-y-4">
      <RoomBackground room={profile.rooms[activeRoomId]}>
        <div className="flex items-end gap-1">
          <AvatarCanvas avatar={profile.avatar} size={160} />
          <PetCanvas pet={profile.pet} size={70} />
        </div>
      </RoomBackground>
      <p className="text-center font-display text-lg -mt-1">{profile.childName}</p>

      <div className="flex gap-1 bg-parchment-dim rounded-full p-1">
        {[
          { id: "clothes", label: "👗 Kıyafet" },
          { id: "pet", label: "🐾 Hayvan" },
          { id: "room", label: "🏠 Ev" },
          { id: "stickers", label: "🎨 Sticker" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex-1 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${subTab === t.id ? "bg-violet text-white" : "text-ink"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "clothes" && <ClothesTab profile={profile} unlocked={unlocked} onChangeAvatar={onChangeAvatar} />}
      {subTab === "pet" && <PetTab profile={profile} unlocked={unlocked} onChangePet={onChangePet} />}
      {subTab === "room" && (
        <HouseTab profile={profile} unlocked={unlocked} onChangeRoomSlot={onChangeRoomSlot} activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />
      )}
      {subTab === "stickers" && <StickerAlbum profile={profile} />}
    </div>
  );
}
