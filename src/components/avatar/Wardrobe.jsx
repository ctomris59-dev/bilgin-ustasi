import { useMemo, useState } from "react";
import AvatarCanvas from "./AvatarCanvas";
import PetCanvas from "./PetCanvas";
import RoomBackground from "./RoomBackground";
import StickerAlbum from "../StickerAlbum";
import {
  ITEMS,
  SLOTS,
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  SETS,
} from "../../data/avatarParts";
import { PETS, PET_ACCESSORIES } from "../../data/petsAndRoom";
import {
  ROOM_TYPES,
  getRoomCompletion,
  isRoomComplete,
} from "../../data/houseRooms";
import { isWorldUnlocked } from "../../data/worlds";
import { getLevelInfo } from "../../data/levels";
import { playPop } from "../../lib/sound";
import RoomBuilder from "./RoomBuilder";
import { getHairAsset, getItemAsset, getPetAsset, getRarity, getRarityMeta } from "../../data/gameAssets";

const SLOT_LABELS = {
  [SLOTS.OUTFIT]: "Kıyafet",
  [SLOTS.SHOES]: "Ayakkabı",
  [SLOTS.HEADWEAR]: "Başlık",
  [SLOTS.FACE]: "Ekipman",
};

const SET_PRESENTATION = {
  gunluk: { label: "Günlük Kaşif", accent: "#70A1FF", icon: "compass" },
  buyulu: { label: "Orman Keşfi", accent: "#52E3C2", icon: "leaf" },
  deniz: { label: "Sahil Görevi", accent: "#52E3FF", icon: "wave" },
  prens: { label: "Ustalık Koleksiyonu", accent: "#FFD166", icon: "crown" },
  uzay: { label: "Gökyüzü Keşfi", accent: "#8FA8FF", icon: "star" },
  bilim: { label: "Araştırmacı Seti", accent: "#A98CFF", icon: "flask" },
  pijama: { label: "Gece Üssü", accent: "#9B8CFF", icon: "moon" },
  kozmik: { label: "Kozmik Koleksiyon", accent: "#C39BFF", icon: "orbit" },
};

const ROOM_PRESENTATION = {
  bedroom: { label: "Ana Üs", icon: "home" },
  playroom: { label: "Oyun Alanı", icon: "game" },
  studyroom: { label: "Çalışma Üssü", icon: "book" },
  livingroom: { label: "Dinlenme Alanı", icon: "sofa" },
  garden: { label: "Bahçe", icon: "leaf" },
  library: { label: "Bilgi Arşivi", icon: "library" },
};

const HAIR_LABELS = {
  "hair-space-buns": "Çift Topuz",
  "hair-long-braid": "Uzun Örgü",
  "hair-twin-pigtails": "Çift At Kuyruğu",
  "hair-bob-bangs": "Kısa Bob",
  "hair-wavy-long": "Uzun Dalgalı",
  "hair-curly-afro": "Kıvırcık",
};

export default function Wardrobe({
  profile,
  onChangeAvatar,
  onChangePet,
  onChangeRoomSlot,
}) {
  const [subTab, setSubTab] = useState("gear");
  const [activeRoomId, setActiveRoomId] = useState("bedroom");

  const unlocked = useMemo(
    () => new Set(profile.unlockedItems || []),
    [profile.unlockedItems]
  );

  const { current } = getLevelInfo(profile.xp || 0);
  const ownedCount = unlocked.size;
  const totalCollectibles = ITEMS.length + PETS.length + PET_ACCESSORIES.length;
  const equippedCount = [
    profile.avatar?.outfit,
    profile.avatar?.shoes,
    profile.avatar?.headwear,
    profile.avatar?.face,
  ].filter(Boolean).length;

  const tabs = [
    { id: "gear", label: "Ekipman", icon: "user" },
    { id: "pet", label: "Dost", icon: "paw" },
    { id: "room", label: "Üs", icon: "home" },
    { id: "stickers", label: "Arşiv", icon: "collection" },
  ];

  function changeTab(id) {
    playPop();
    setSubTab(id);
  }

  return (
    <div className="app-shell relative space-y-4 pb-8">
      <AmbientParticle left="7%" top="9%" delay="0s" />
      <AmbientParticle left="89%" top="15%" delay="1.3s" />
      <AmbientParticle left="14%" top="48%" delay="2.1s" />

      <header className="px-1">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8793B4]">
          Karakter Merkezi
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1
              className="text-2xl font-black tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Kaşif Profili
            </h1>
            <p className="mt-1 text-xs font-medium text-[#8793B4]">
              Karakterini, dostunu ve üssünü özelleştir.
            </p>
          </div>

          <div className="glass-card flex items-center gap-2 rounded-xl px-3 py-2">
            <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#687494]">
              Seviye
            </span>
            <span className="text-sm font-black text-[#A98CFF]">{current.level}</span>
          </div>
        </div>
      </header>

      <section
        className="glass-card relative overflow-hidden p-3.5 sm:p-4"
        style={{
          background:
            "linear-gradient(145deg, rgba(24,33,68,.90), rgba(7,12,28,.95))",
        }}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "#8B6CFF", opacity: 0.08 }}
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-24 h-60 w-60 rounded-full blur-3xl"
          style={{ background: "#52E3FF", opacity: 0.055 }}
        />

        <div className="relative z-10 overflow-hidden rounded-[18px] border border-white/[0.075] bg-black/[0.10]">
          <RoomBackground room={profile.rooms?.[activeRoomId]}>
            <div className="relative flex min-h-[270px] items-end justify-center gap-2 px-4 pb-1 pt-5">
              <div
                className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full blur-3xl"
                style={{ background: "rgba(82,227,255,.065)" }}
              />

              <div className="relative z-10 animate-bob">
                <AvatarCanvas avatar={profile.avatar} size={170} />
              </div>

              {profile.pet?.activeSpecies && (
                <div
                  className="relative z-10 animate-bob"
                  style={{ animationDelay: "420ms" }}
                >
                  <PetCanvas pet={profile.pet} size={72} />
                </div>
              )}

              <div className="absolute left-3 top-3 rounded-xl border border-white/[0.08] bg-[#070B1D]/65 px-2.5 py-1.5 backdrop-blur-md">
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#687494]">
                  Aktif Profil
                </p>
                <p className="mt-0.5 text-xs font-black text-white">
                  {profile.childName}
                </p>
              </div>
            </div>
          </RoomBackground>
        </div>

        <div className="relative z-20 -mt-1 grid grid-cols-3 gap-2">
          <ProfileStat label="Koleksiyon" value={ownedCount} accent="#52E3FF" />
          <ProfileStat label="Takılı" value={equippedCount} accent="#52E3C2" />
          <ProfileStat
            label="Toplam"
            value={totalCollectibles}
            accent="#FFD166"
          />
        </div>
      </section>

      <nav className="glass-card grid grid-cols-4 gap-1 p-1.5">
        {tabs.map((tab) => {
          const active = subTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              className="relative flex min-h-[58px] flex-col items-center justify-center gap-1 overflow-hidden rounded-xl px-1 transition-all duration-200"
              style={{
                color: active ? "#F5F7FF" : "#7F8BAA",
                background: active
                  ? "linear-gradient(145deg, rgba(139,108,255,.18), rgba(82,227,255,.055))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(169,140,255,.20)"
                  : "1px solid transparent",
                transform: active ? "translateY(-1px)" : "none",
              }}
            >
              {active && (
                <span
                  className="absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 rounded-full"
                  style={{
                    background: "linear-gradient(90deg,#8B6CFF,#52E3FF)",
                    boxShadow: "0 0 12px rgba(82,227,255,.35)",
                  }}
                />
              )}

              <GameIcon name={tab.icon} size={18} active={active} />
              <span className="text-[9px] font-black uppercase tracking-[0.08em]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {subTab === "gear" && (
        <GearTab
          profile={profile}
          unlocked={unlocked}
          onChangeAvatar={onChangeAvatar}
        />
      )}

      {subTab === "pet" && (
        <PetTab
          profile={profile}
          unlocked={unlocked}
          onChangePet={onChangePet}
        />
      )}

      {subTab === "room" && (
        <BaseTab
          profile={profile}
          unlocked={unlocked}
          onChangeRoomSlot={onChangeRoomSlot}
          activeRoomId={activeRoomId}
          onSelectRoom={setActiveRoomId}
        />
      )}

      {subTab === "stickers" && (
        <section className="glass-card overflow-hidden p-3 sm:p-4">
          <SectionHeading
            eyebrow="Koleksiyon"
            title="Keşif Arşivi"
            subtitle="Görevlerden kazandığın sticker ve başarı parçaları."
            accent="#FF78AA"
          />
          <div className="mt-4">
            <StickerAlbum profile={profile} />
          </div>
        </section>
      )}
    </div>
  );
}

function GearTab({ profile, unlocked, onChangeAvatar }) {
  function setSlot(slot, itemId) {
    playPop();
    onChangeAvatar({ ...profile.avatar, [slot]: itemId });
  }

  function toggleSlot(slot, itemId) {
    const current = profile.avatar?.[slot];
    setSlot(slot, current === itemId ? null : itemId);
  }

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <SectionHeading
          eyebrow="Temel Görünüm"
          title="Karakter Ayarları"
          subtitle="Temel görünümü seç. Bunlar coin gerektirmez."
          accent="#A98CFF"
        />

        <div className="mt-5 space-y-5">
          <OptionGroup label="Ten Tonu">
            <div className="flex flex-wrap gap-2.5">
              {SKIN_TONES.map((skin) => {
                const active = profile.avatar?.skin === skin.id;

                return (
                  <button
                    key={skin.id}
                    onClick={() => setSlot("skin", skin.id)}
                    className="relative h-10 w-10 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: skin.hex,
                      border: active
                        ? "2px solid #52E3FF"
                        : "1px solid rgba(255,255,255,.16)",
                      boxShadow: active
                        ? "0 0 0 3px rgba(82,227,255,.08), 0 0 20px rgba(82,227,255,.12)"
                        : "0 8px 18px rgba(0,0,0,.12)",
                    }}
                    aria-label={`Ten tonu ${skin.id}`}
                  >
                    {active && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#52E3FF] text-[9px] font-black text-[#07101A]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </OptionGroup>

          <OptionGroup label="Saç Stili">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {HAIR_STYLES.map((hair) => {
                const active = profile.avatar?.hairStyle === hair.id;

                return (
                  <button
                    key={hair.id}
                    onClick={() => setSlot("hairStyle", hair.id)}
                    className="group relative overflow-hidden rounded-2xl border p-2 transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: active
                        ? "linear-gradient(145deg,rgba(139,108,255,.22),rgba(82,227,255,.07))"
                        : "rgba(255,255,255,.028)",
                      borderColor: active
                        ? "rgba(82,227,255,.35)"
                        : "rgba(255,255,255,.08)",
                      boxShadow: active ? "0 0 22px rgba(82,227,255,.08)" : "none",
                    }}
                  >
                    <img
                      src={getHairAsset(hair.id)}
                      alt=""
                      className="mx-auto h-14 w-14 object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="mt-1 block truncate text-[8px] font-black text-[#B7C0D8]">
                      {HAIR_LABELS[hair.id] || hair.label}
                    </span>
                    {active && (
                      <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#52E3FF] text-[9px] font-black text-[#06101C]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </OptionGroup>

          <OptionGroup label="Saç Rengi">
            <div className="flex flex-wrap gap-2.5">
              {HAIR_COLORS.map((color) => {
                const active = profile.avatar?.hairColor === color;

                return (
                  <button
                    key={color}
                    onClick={() => setSlot("hairColor", color)}
                    className="relative h-9 w-9 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: color,
                      border: active
                        ? "2px solid #FFFFFF"
                        : "1px solid rgba(255,255,255,.14)",
                      boxShadow: active
                        ? `0 0 18px ${color}55`
                        : "none",
                    }}
                    aria-label={`Saç rengi ${color}`}
                  >
                    {active && (
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white drop-shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </OptionGroup>
        </div>
      </section>

      {Object.values(SETS).map((set) => {
        const setItems = ITEMS.filter((item) => item.set === set.id);
        if (setItems.length === 0) return null;

        const presentation = SET_PRESENTATION[set.id] || {
          label: set.label,
          accent: set.color || "#8B6CFF",
          icon: "collection",
        };

        const ownedInSet = setItems.filter((item) => unlocked.has(item.id)).length;

        return (
          <section key={set.id} className="glass-card overflow-hidden p-4">
            <SectionHeading
              eyebrow={`${ownedInSet}/${setItems.length} parça`}
              title={presentation.label}
              subtitle="Görevlerden veya Kaşif Dükkânı'ndan açılan ekipmanlar."
              accent={presentation.accent}
              icon={presentation.icon}
            />

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {setItems.map((item) => {
                const owned = unlocked.has(item.id);
                const active = profile.avatar?.[item.slot] === item.id;
                const label = matureItemLabel(item.label);

                return (
                  <button
                    key={item.id}
                    disabled={!owned}
                    onClick={() => toggleSlot(item.slot, item.id)}
                    className="group relative overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-250 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed"
                    style={{
                      background: active
                        ? `linear-gradient(135deg, ${presentation.accent}18, rgba(255,255,255,.035))`
                        : "rgba(255,255,255,.028)",
                      borderColor: active
                        ? `${presentation.accent}55`
                        : owned
                        ? "rgba(255,255,255,.085)"
                        : "rgba(255,255,255,.045)",
                      opacity: owned ? 1 : 0.48,
                      boxShadow: active
                        ? `0 12px 30px ${presentation.accent}10`
                        : "none",
                    }}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-0 h-full w-[2px]"
                        style={{
                          background: presentation.accent,
                          boxShadow: `0 0 12px ${presentation.accent}`,
                        }}
                      />
                    )}

                    <div className="flex items-start gap-3">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                        <img
                          src={getRarityMeta(getRarity(item)).frame}
                          alt=""
                          className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-75"
                        />
                        <img
                          src={getItemAsset(item)}
                          alt=""
                          className="relative z-10 h-[72%] w-[72%] object-contain drop-shadow-[0_8px_7px_rgba(0,0,0,.35)]"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-xs font-black text-white">
                            {label}
                          </p>

                          {item.legendary && (
                            <span className="shrink-0 rounded-full border border-[#FFD166]/20 bg-[#FFD166]/10 px-2 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#FFD166]">
                              Efsanevi
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.10em] text-[#687494]">
                          {SLOT_LABELS[item.slot] || "Ekipman"}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span
                            className="text-[9px] font-black"
                            style={{
                              color: active
                                ? presentation.accent
                                : owned
                                ? "#8793B4"
                                : "#687494",
                            }}
                          >
                            {active
                              ? "Takılı ✓"
                              : owned
                              ? "Kullanılabilir"
                              : item.legendary
                              ? "Görev ile açılır"
                              : "Dükkânda kilitli"}
                          </span>

                          {owned && !active && (
                            <span className="text-[9px] font-black text-[#8793B4] opacity-0 transition-opacity group-hover:opacity-100">
                              Tak →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PetTab({ profile, unlocked, onChangePet }) {
  const petState = profile.pet || { activeSpecies: null, accessory: null };

  function selectSpecies(id) {
    playPop();
    onChangePet({
      ...petState,
      activeSpecies: petState.activeSpecies === id ? null : id,
    });
  }

  function selectAccessory(id) {
    playPop();
    onChangePet({
      ...petState,
      accessory: petState.accessory === id ? null : id,
    });
  }

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <SectionHeading
          eyebrow="Yol Arkadaşı"
          title="Keşif Dostları"
          subtitle="Görevlerde yanında görünecek dostunu seç."
          accent="#52E3C2"
          icon="paw"
        />

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {PETS.map((pet) => {
            const owned = unlocked.has(pet.id);
            const active = petState.activeSpecies === pet.id;

            return (
              <button
                key={pet.id}
                disabled={!owned}
                onClick={() => selectSpecies(pet.id)}
                className="relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-200 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed"
                style={{
                  opacity: owned ? 1 : 0.45,
                  background: active
                    ? "linear-gradient(135deg,rgba(82,227,194,.14),rgba(82,227,255,.04))"
                    : "rgba(255,255,255,.028)",
                  borderColor: active
                    ? "rgba(82,227,194,.36)"
                    : "rgba(255,255,255,.075)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]"
                  >
                    <img
                      src={getPetAsset(pet.id)}
                      alt=""
                      className="h-[88%] w-[88%] object-contain drop-shadow-[0_8px_7px_rgba(0,0,0,.35)]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-black text-white">
                      {maturePetLabel(pet.label)}
                    </p>
                    <p className="mt-1 text-[8px] font-black uppercase tracking-[0.11em] text-[#687494]">
                      {pet.legendary ? "Efsanevi Dost" : "Keşif Dostu"}
                    </p>
                  </div>
                </div>

                <p
                  className="mt-3 text-[9px] font-black"
                  style={{ color: active ? "#52E3C2" : "#8793B4" }}
                >
                  {!owned ? "Kilitli" : active ? "Yanında ✓" : "Seç"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {petState.activeSpecies && (
        <section className="glass-card p-4">
          <SectionHeading
            eyebrow="Dost Ekipmanı"
            title="Aksesuar"
            subtitle="Seçili dostunun görünümünü tamamla."
            accent="#FFD166"
            icon="tag"
          />

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {PET_ACCESSORIES.map((accessory) => {
              const owned = unlocked.has(accessory.id);
              const active = petState.accessory === accessory.id;

              return (
                <button
                  key={accessory.id}
                  disabled={!owned}
                  onClick={() => selectAccessory(accessory.id)}
                  className="rounded-2xl border p-3 text-left transition-all duration-200 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed"
                  style={{
                    opacity: owned ? 1 : 0.45,
                    background: active
                      ? "rgba(255,209,102,.09)"
                      : "rgba(255,255,255,.028)",
                    borderColor: active
                      ? "rgba(255,209,102,.32)"
                      : "rgba(255,255,255,.075)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={getItemAsset(accessory)}
                      alt=""
                      className="h-10 w-10 object-contain drop-shadow-[0_5px_5px_rgba(0,0,0,.3)]"
                    />
                    <p className="text-[11px] font-black text-white">
                      {matureItemLabel(accessory.label)}
                    </p>
                  </div>
                  <p
                    className="mt-2 text-[9px] font-black"
                    style={{ color: active ? "#FFD166" : "#8793B4" }}
                  >
                    {!owned ? "Dükkânda kilitli" : active ? "Takılı ✓" : "Tak"}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function BaseTab({
  profile,
  unlocked,
  onChangeRoomSlot,
  activeRoomId,
  onSelectRoom,
}) {
  const { current } = getLevelInfo(profile.xp || 0);
  const currentLevel = current.level;

  const activeRoomType =
    ROOM_TYPES.find((room) => room.id === activeRoomId) || ROOM_TYPES[0];

  const activeRoomState = profile.rooms?.[activeRoomId] || {
    wallpaper: null,
    items: [],
  };

  const roomUnlocked = isWorldUnlocked(
    activeRoomType.unlockWorld,
    currentLevel
  );

  const completedCount = ROOM_TYPES.filter((room) =>
    isRoomComplete(profile.rooms?.[room.id])
  ).length;

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <SectionHeading
          eyebrow={`${completedCount}/${ROOM_TYPES.length} bölüm tamamlandı`}
          title="Kaşif Üssü"
          subtitle="Çalışarak kazandığın eşyalarla kendi üssünü geliştir."
          accent="#52E3FF"
          icon="home"
        />

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {ROOM_TYPES.map((room) => {
            const unlockedRoom = isWorldUnlocked(room.unlockWorld, currentLevel);
            const pct = Math.round(
              getRoomCompletion(profile.rooms?.[room.id]) * 100
            );
            const active = activeRoomId === room.id;
            const presentation = ROOM_PRESENTATION[room.id] || {
              label: room.title,
              icon: "home",
            };

            return (
              <button
                key={room.id}
                onClick={() => {
                  playPop();
                  onSelectRoom(room.id);
                }}
                className="min-w-[112px] shrink-0 rounded-2xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  opacity: unlockedRoom ? 1 : 0.5,
                  background: active
                    ? "linear-gradient(135deg,rgba(82,227,255,.11),rgba(139,108,255,.06))"
                    : "rgba(255,255,255,.025)",
                  borderColor: active
                    ? "rgba(82,227,255,.28)"
                    : "rgba(255,255,255,.07)",
                }}
              >
                <div className="flex items-center justify-between">
                  <GameIcon
                    name={unlockedRoom ? presentation.icon : "lock"}
                    size={17}
                    color={active ? "#52E3FF" : "#8793B4"}
                  />
                  {unlockedRoom && (
                    <span className="text-[9px] font-black text-[#52E3FF]">
                      {pct}%
                    </span>
                  )}
                </div>

                <p className="mt-2 text-[10px] font-black text-white">
                  {presentation.label}
                </p>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#687494]">
                  {unlockedRoom ? (active ? "Aktif" : "Açık") : "Kilitli"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {!roomUnlocked ? (
        <section
          className="glass-card p-6 text-center"
          style={{
            background:
              "linear-gradient(145deg,rgba(20,27,55,.75),rgba(8,13,30,.92))",
          }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-[#8793B4]">
            <GameIcon name="lock" size={20} />
          </div>
          <p className="mt-3 text-sm font-black text-white">
            Bu üs bölümü henüz kilitli
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[11px] font-medium leading-relaxed text-[#8793B4]">
            Keşif Haritası'nda ilerledikçe yeni oda ve alanlar kullanılabilir hale gelir.
          </p>
        </section>
      ) : (
        <>
          {isRoomComplete(activeRoomState) && (
            <div
              className="glass-card flex items-center gap-3 p-3.5"
              style={{
                borderColor: "rgba(82,227,194,.22)",
                background: "rgba(82,227,194,.055)",
              }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#52E3C2]/10 text-[#52E3C2]">
                ✓
              </div>
              <div>
                <p className="text-xs font-black text-[#75E9B7]">
                  Üs bölümü tamamlandı
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[#8793B4]">
                  Bu alandaki temel yerleşimi tamamladın.
                </p>
              </div>
            </div>
          )}

          <section className="glass-card overflow-hidden p-3 sm:p-4">
            <RoomBuilder
              key={activeRoomId}
              room={activeRoomState}
              roomId={activeRoomId}
              unlockedIds={unlocked}
              onCommit={(newState) =>
                onChangeRoomSlot(activeRoomId, newState)
              }
            />
          </section>
        </>
      )}
    </div>
  );
}

function ProfileStat({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#070B1D]/65 px-2 py-2.5 text-center backdrop-blur-md">
      <p
        className="text-sm font-black"
        style={{ color: accent, fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-[#687494]">
        {label}
      </p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, accent, icon }) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}10`, color: accent }}
        >
          <GameIcon name={icon} size={18} color={accent} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p
          className="text-[8px] font-black uppercase tracking-[0.18em]"
          style={{ color: accent }}
        >
          {eyebrow}
        </p>
        <h2
          className="mt-0.5 text-base font-black text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[10px] font-medium leading-relaxed text-[#8793B4]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function OptionGroup({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-[#8793B4]">
        {label}
      </p>
      {children}
    </div>
  );
}

function AmbientParticle({ left, top, delay }) {
  return (
    <span
      className="magic-particle"
      style={{ left, top, animationDelay: delay }}
    />
  );
}

function slotIcon(slot) {
  if (slot === SLOTS.OUTFIT) return "shirt";
  if (slot === SLOTS.SHOES) return "shoe";
  if (slot === SLOTS.HEADWEAR) return "cap";
  if (slot === SLOTS.FACE) return "tool";
  return "collection";
}

function matureItemLabel(label = "") {
  return label
    .replace(/🌸|✨|🧜‍♀️|👑|🌌|🔍|🌙|🌠|🎀|🌈|🪄|🦋|🎉|🕶️|☁️|⭐|💎|🦄|🪽/g, "")
    .replace(/Prenses/gi, "Kristal")
    .replace(/Peri/gi, "Orman")
    .replace(/Sihirli/gi, "Keşif")
    .replace(/Pamuk Şeker/gi, "Gökyüzü")
    .replace(/Kalpli/gi, "Günlük")
    .replace(/Çilekli/gi, "Kırmızı")
    .replace(/Pembe/gi, "Mercan")
    .replace(/Simli/gi, "Işıklı")
    .replace(/Balo/gi, "Ustalık")
    .replace(/Denizkızı/gi, "Sahil")
    .replace(/Unikorn/gi, "Kozmik")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function maturePetLabel(label = "") {
  return label
    .replace(/🐱|🐶|🐰|🦉|🐼|🦄|🐉/g, "")
    .replace(/Pamuk/gi, "Turuncu")
    .replace(/Şeker/gi, "Kahverengi")
    .replace(/Sevimli/gi, "Keşif")
    .replace(/Uykucu/gi, "Gölge")
    .replace(/Sihirli/gi, "Kozmik")
    .replace(/Bebek/gi, "Genç")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function GameIcon({ name, size = 20, color = "currentColor", active = false }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: active ? 2.1 : 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 20c.6-4 2.8-6 6.5-6s5.9 2 6.5 6" />
        </svg>
      );
    case "paw":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="2" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="5.8" cy="12.5" r="1.7" />
          <circle cx="18.2" cy="12.5" r="1.7" />
          <path d="M8 17.2c0-2.1 1.8-3.7 4-3.7s4 1.6 4 3.7c0 1.8-1.4 2.8-4 2.8s-4-1-4-2.8Z" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="m4 11 8-6 8 6" />
          <path d="M6.5 10v9h11v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );
    case "collection":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case "shirt":
      return (
        <svg {...common}>
          <path d="m8 5-4 3 2 4 2-1v8h8v-8l2 1 2-4-4-3c-.8 1.1-1.9 1.6-4 1.6S8.8 6.1 8 5Z" />
        </svg>
      );
    case "shoe":
      return (
        <svg {...common}>
          <path d="M5 14c3 1 4.2-.7 5-4l2 2c1.6 1.7 3.5 2.8 6.5 3.2.9.1 1.5.8 1.5 1.8 0 1.1-.9 2-2 2H7c-2 0-3-1.2-2-5Z" />
        </svg>
      );
    case "cap":
      return (
        <svg {...common}>
          <path d="M5 13c.7-4 3.4-6 7-6s6.3 2 7 6H5Z" />
          <path d="M12 7V5M19 13c1.6 0 2.7.5 3 1.5-2.5.7-4.8.8-7 .5" />
        </svg>
      );
    case "tool":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="5" />
          <path d="m14 14 5 5" />
          <path d="M8 10h4" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M19 5C11 5 6 8 6 14c0 3 2 5 5 5 6 0 8-6 8-14Z" />
          <path d="M5 20c2-5 6-8 11-10" />
        </svg>
      );
    case "wave":
      return (
        <svg {...common}>
          <path d="M3 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2" />
          <path d="M4 10c2 0 2-1.5 4-1.5S10 10 12 10s2-1.5 4-1.5S18 10 20 10" />
        </svg>
      );
    case "crown":
      return (
        <svg {...common}>
          <path d="m4 8 4 4 4-6 4 6 4-4-2 10H6L4 8Z" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.2 5.3L20 9l-4.3 3.7L17 18l-5-2.8L7 18l1.3-5.3L4 9l5.8-.7L12 3Z" />
        </svg>
      );
    case "flask":
      return (
        <svg {...common}>
          <path d="M9 3h6M10 3v6l-5 8.2A2.5 2.5 0 0 0 7.2 21h9.6a2.5 2.5 0 0 0 2.2-3.8L14 9V3" />
          <path d="M8 15h8" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M19 15.5A8 8 0 0 1 8.5 5 8.1 8.1 0 1 0 19 15.5Z" />
        </svg>
      );
    case "orbit":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(35 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-35 12 12)" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M4 5h7l9 9-6 6-9-9V5Z" />
          <circle cx="8" cy="8" r="1.2" />
        </svg>
      );
    case "game":
      return (
        <svg {...common}>
          <path d="M7 9h10c2 0 3.5 1.8 3 3.8l-1 4.2c-.4 1.8-2.7 2.3-3.8.9L13.8 16h-3.6l-1.4 1.9c-1.1 1.4-3.4.9-3.8-.9l-1-4.2C3.5 10.8 5 9 7 9Z" />
          <path d="M8 11.5v3M6.5 13h3M16.5 12.3h.01M18 14h.01" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 5.5c3-.7 5.7-.3 8 1.5v12c-2.3-1.8-5-2.2-8-1.5v-12Z" />
          <path d="M20 5.5c-3-.7-5.7-.3-8 1.5v12c2.3-1.8 5-2.2 8-1.5v-12Z" />
        </svg>
      );
    case "sofa":
      return (
        <svg {...common}>
          <path d="M6 12V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" />
          <path d="M5 11a2 2 0 0 0-2 2v4h18v-4a2 2 0 0 0-2-2" />
          <path d="M6 17v2M18 17v2" />
        </svg>
      );
    case "library":
      return (
        <svg {...common}>
          <path d="M5 4v16M9 4v16M14 6v14M18 4l2 16" />
          <path d="M3 20h18" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "compass":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        </svg>
      );
  }
}
