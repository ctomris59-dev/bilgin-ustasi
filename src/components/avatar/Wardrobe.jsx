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
  [SLOTS.HEADWEAR]: "Şapka / Taç",
  [SLOTS.FACE]: "Aksesuar",
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
    <div className="space-y-4 font-['Fredoka',sans-serif]">
      <div className="sticker-card p-4 bg-[#FFFFFF]">
        <h3 className="font-display text-base text-[#4A2E4B] mb-2 font-black">Ten Tonu ✨</h3>
        <div className="flex gap-2 mb-4">
          {SKIN_TONES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSlot("skin", s.id)}
              className={`w-9 h-9 rounded-2xl border-3 ${profile.avatar.skin === s.id ? "border-[#FF70A6] scale-110 shadow-md" : "border-[#4A2E4B]/20"}`}
              style={{ backgroundColor: s.hex }}
              aria-label={`Ten tonu ${s.id}`}
            />
          ))}
        </div>
        <h3 className="font-display text-base text-[#4A2E4B] mb-2 font-black">Saç Stili 💇‍♀️</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {HAIR_STYLES.map((h) => (
            <button
              key={h.id}
              onClick={() => setSlot("hairStyle", h.id)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black ${
                profile.avatar.hairStyle === h.id ? "bg-[#FF70A6] text-white shadow-md" : "bg-[#FFE8EC] text-[#4A2E4B]"
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
        <h3 className="font-display text-base text-[#4A2E4B] mb-2 font-black">Saç Rengi 🎨</h3>
        <div className="flex gap-2 flex-wrap">
          {HAIR_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setSlot("hairColor", c)}
              className={`w-8 h-8 rounded-2xl border-3 ${profile.avatar.hairColor === c ? "border-[#FF70A6] scale-110 shadow-md" : "border-[#4A2E4B]/20"}`}
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
          <div key={set.id} className="sticker-card p-4 bg-[#FFFFFF]">
            <h3 className="font-display text-base mb-3 font-black" style={{ color: set.color }}>
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
                    className={`text-left p-3 rounded-2xl border-2 text-xs font-black transition-all ${
                      !owned
                        ? "opacity-40 cursor-not-allowed border-dashed border-[#4A2E4B]/30 bg-gray-50"
                        : active
                        ? "border-[#FF70A6] bg-[#FFE8EC] shadow-md"
                        : "border-[#4A2E4B]/20 bg-[#FFFFFF] hover:border-[#FF70A6]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#4A2E4B]">{item.label}</span>
                      {item.legendary && <span className="text-[10px] text-[#FFD166] font-black">✨ efsanevi</span>}
                    </div>
                    <div className="text-[10px] text-[#4A2E4B]/70 mt-1 font-bold">
                      {SLOT_LABELS[item.slot]} {!owned && `· 🔒 ${item.legendary ? "Görevle Aç" : "Mağazadan Al"}`}
                      {active && owned && " · Takılı ✓"}
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
    <div className="space-y-4 font-['Fredoka',sans-serif]">
      <div className="sticker-card p-4 bg-[#FFFFFF]">
        <h3 className="font-display text-base text-[#4A2E4B] mb-3 font-black">Sevimli Dostların 🐾</h3>
        <div className="grid grid-cols-2 gap-2">
          {PETS.map((p) => {
            const owned = unlocked.has(p.id);
            const active = profile.pet.activeSpecies === p.id;
            return (
              <button
                key={p.id}
                disabled={!owned}
                onClick={() => selectSpecies(p.id)}
                className={`text-left p-3 rounded-2xl border-2 text-xs font-black transition-all ${
                  !owned
                    ? "opacity-40 cursor-not-allowed border-dashed border-[#4A2E4B]/30 bg-gray-50"
                    : active
                    ? "border-[#FF70A6] bg-[#FFE8EC] shadow-md"
                    : "border-[#4A2E4B]/20 bg-[#FFFFFF]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#4A2E4B]">{p.label}</span>
                  {p.legendary && <span className="text-[10px] text-[#FFD166]">✨ efsanevi</span>}
                </div>
                <div className="text-[10px] text-[#4A2E4B]/70 mt-1 font-bold">{!owned ? `🔒 Mağazadan Al` : active ? "Yanında ✨" : "Sahipsin"}</div>
              </button>
            );
          })}
        </div>
      </div>

      {profile.pet.activeSpecies && (
        <div className="sticker-card p-4 bg-[#FFFFFF]">
          <h3 className="font-display text-base text-[#4A2E4B] mb-3 font-black">Aksesuarlar 🎀</h3>
          <div className="grid grid-cols-2 gap-2">
            {PET_ACCESSORIES.map((a) => {
              const owned = unlocked.has(a.id);
              const active = profile.pet.accessory === a.id;
              return (
                <button
                  key={a.id}
                  disabled={!owned}
                  onClick={() => selectAccessory(a.id)}
                  className={`text-left p-3 rounded-2xl border-2 text-xs font-black transition-all ${
                    !owned
                      ? "opacity-40 cursor-not-allowed border-dashed border-[#4A2E4B]/30"
                      : active
                      ? "border-[#FF70A6] bg-[#FFE8EC] shadow-md"
                      : "border-[#4A2E4B]/20"
                  }`}
                >
                  <span className="text-[#4A2E4B]">{a.label}</span>
                  <div className="text-[10px] text-[#4A2E4B]/70 mt-1 font-bold">{!owned ? "🔒 Mağazadan Al" : active ? "Takılı ✓" : "Sahipsin"}</div>
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
    <div className="space-y-4 font-['Fredoka',sans-serif]">
      <div className="sticker-card p-3 bg-[#FFFFFF]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-sm text-[#4A2E4B] font-black">🏠 Evim — {completedCount}/{ROOM_TYPES.length} Oda Tamamlandı</h3>
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
                className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl border-2 font-black ${
                  activeRoomId === r.id ? "border-[#4A2E4B] bg-[#FFE8EC] shadow-sm" : unlocked_ ? "border-[#4A2E4B]/20" : "border-dashed border-[#4A2E4B]/20 opacity-50"
                }`}
              >
                <span className="text-xl">{unlocked_ ? r.emoji : "🔒"}</span>
                <span className="text-[10px] text-[#4A2E4B] whitespace-nowrap">{r.title}</span>
                {unlocked_ && <span className="text-[9px] text-[#FF70A6]">{pct}%</span>}
              </button>
            );
          })}
        </div>
      </div>

      {!roomUnlocked ? (
        <div className="sticker-card p-6 text-center text-sm font-bold text-[#4A2E4B] bg-[#FFFFFF]">
          🔒 {activeRoomType.title}, Sihirli Yol Haritası'nda ilgili dünya açılınca döşenebilir hale gelir. Haritadan seviyeni kontrol edebilirsin! ✨
        </div>
      ) : (
        <>
          {isRoomComplete(activeRoomState) && (
            <div className="sticker-card p-3 text-center text-sm bg-[#52E3C2]/30 border-2 border-[#52E3C2] font-black text-[#4A2E4B]">
              🎉 Bu oda tamamen döşendi! Tebrikler!
            </div>
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
    <div className="space-y-4 font-['Fredoka',sans-serif]">
      <RoomBackground room={profile.rooms[activeRoomId]}>
        <div className="flex items-end gap-2">
          <AvatarCanvas avatar={profile.avatar} size={160} />
          <PetCanvas pet={profile.pet} size={70} />
        </div>
      </RoomBackground>
      <p className="text-center font-display text-xl text-[#4A2E4B] font-black -mt-1">{profile.childName} ✨</p>

      <div className="flex gap-1 bg-[#FFFFFF] rounded-2xl p-1 border-2 border-[#4A2E4B]">
        {[
          { id: "clothes", label: "👗 Kıyafet" },
          { id: "pet", label: "🐾 Hayvan" },
          { id: "room", label: "🏠 Ev" },
          { id: "stickers", label: "🎨 Sticker" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              subTab === t.id ? "bg-[#FF70A6] text-white shadow-sm" : "text-[#4A2E4B]"
            }`}
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
