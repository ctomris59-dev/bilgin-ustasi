import { useState } from "react";
import { ITEMS } from "../data/avatarParts";
import { PETS, PET_ACCESSORIES, ROOM_ITEMS } from "../data/petsAndRoom";
import { isWorldUnlocked, getWorldById } from "../data/worlds";
import { getLevelInfo } from "../data/levels";

const SLOT_LABEL = {
  outfit: "Kıyafet",
  shoes: "Ayakkabı",
  face: "Yüz Aksesuarı",
  headwear: "Baş Aksesuarı",
  petSpecies: "Evcil Hayvan",
  petAccessory: "Evcil Hayvan Aksesuarı",
  wallpaper: "Duvar Kağıdı",
  rug: "Halı",
  desk: "Çalışma Masası",
  lamp: "Lambader",
  plant: "Saksı Bitki",
  poster: "Poster",
};

function BuyRow({ item, coins, currentLevel, onBuy }) {
  const canAfford = coins >= item.price;
  const world = item.world ? getWorldById(item.world) : null;
  const worldOk = !item.world || isWorldUnlocked(item.world, currentLevel);

  if (!worldOk) {
    return (
      <div className="sticker-card p-3 flex items-center justify-between opacity-60">
        <div>
          <p className="font-semibold">{item.label}</p>
          <p className="text-xs">
            🔒 {world.emoji} {world.title} açılınca (Seviye {world.unlockLevel})
          </p>
        </div>
        <span className="px-3 py-2 rounded-full text-xs font-bold bg-ink/10">🪙 {item.price}</span>
      </div>
    );
  }

  return (
    <div className="sticker-card p-3 flex items-center justify-between">
      <div>
        <p className="font-semibold">{item.label}</p>
        <p className="text-xs opacity-60">{SLOT_LABEL[item.slot] || ""}</p>
      </div>
      <button
        disabled={!canAfford}
        onClick={() => onBuy(item)}
        className={`px-4 py-2 rounded-full text-sm font-bold ${canAfford ? "bg-gold text-ink hover:bg-gold-bright" : "bg-ink/10 text-ink/40 cursor-not-allowed"}`}
      >
        🪙 {item.price}
      </button>
    </div>
  );
}

function sortByWorldLock(items, currentLevel) {
  return [...items].sort((a, b) => {
    const aOk = !a.world || isWorldUnlocked(a.world, currentLevel);
    const bOk = !b.world || isWorldUnlocked(b.world, currentLevel);
    if (aOk === bOk) return 0;
    return aOk ? -1 : 1;
  });
}

export default function Shop({ profile, onBuyItem, onRedeemReward }) {
  const [tab, setTab] = useState("avatar");
  const unlocked = new Set(profile.unlockedItems);
  const { current } = getLevelInfo(profile.xp);
  const currentLevel = current.level;

  const purchasableAvatar = sortByWorldLock(ITEMS.filter((i) => !i.legendary && !unlocked.has(i.id)), currentLevel);
  const purchasablePets = sortByWorldLock([...PETS.filter((p) => !p.legendary), ...PET_ACCESSORIES].filter((i) => !unlocked.has(i.id)), currentLevel);
  const purchasableRoom = sortByWorldLock(ROOM_ITEMS.filter((i) => !unlocked.has(i.id)), currentLevel);

  const TABS = [
    { id: "avatar", label: "👗 Avatar" },
    { id: "pet", label: "🐾 Evcil Hayvan" },
    { id: "room", label: "🛋️ Oda" },
    { id: "real", label: "🎁 Gerçek Ödül" },
  ];

  return (
    <div className="space-y-4">
      <div className="sticker-card p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm opacity-70">Mevcut Coin</p>
            <p className="font-display text-2xl text-gold-bright">🪙 {profile.coins}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 bg-parchment-dim rounded-full p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-1.5 rounded-full text-xs font-semibold ${tab === t.id ? "bg-violet text-white" : "text-ink"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "avatar" && (
        <div className="grid grid-cols-1 gap-2">
          {purchasableAvatar.length === 0 && (
            <p className="sticker-card p-4 text-center text-sm">Tüm satın alınabilir avatar parçaları zaten sende! Efsanevi parçalar için %100 test çöz. ✨</p>
          )}
          {purchasableAvatar.map((item) => (
            <BuyRow key={item.id} item={item} coins={profile.coins} currentLevel={currentLevel} onBuy={onBuyItem} />
          ))}
        </div>
      )}

      {tab === "pet" && (
        <div className="grid grid-cols-1 gap-2">
          {purchasablePets.length === 0 && (
            <p className="sticker-card p-4 text-center text-sm">Tüm evcil hayvan parçaları sende! Ejderha için Fen Bilimleri'nden %100 al. ✨</p>
          )}
          {purchasablePets.map((item) => (
            <BuyRow key={item.id} item={item} coins={profile.coins} currentLevel={currentLevel} onBuy={onBuyItem} />
          ))}
        </div>
      )}

      {tab === "room" && (
        <div className="grid grid-cols-1 gap-2">
          {purchasableRoom.length === 0 && <p className="sticker-card p-4 text-center text-sm">Tüm oda eşyaları sende! 🛋️</p>}
          {purchasableRoom.map((item) => (
            <BuyRow key={item.id} item={item} coins={profile.coins} currentLevel={currentLevel} onBuy={onBuyItem} />
          ))}
        </div>
      )}

      {tab === "real" && (
        <div className="grid grid-cols-1 gap-2">
          {profile.rewardsCatalog.map((reward) => {
            const canAfford = profile.coins >= reward.cost;
            return (
              <div key={reward.id} className="sticker-card p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{reward.label}</p>
                  <p className="text-xs opacity-60">Ebeveyn onayı ile teslim edilir</p>
                </div>
                <button
                  disabled={!canAfford}
                  onClick={() => onRedeemReward(reward)}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    canAfford ? "bg-coral text-white hover:brightness-110" : "bg-ink/10 text-ink/40 cursor-not-allowed"
                  }`}
                >
                  🪙 {reward.cost}
                </button>
              </div>
            );
          })}
          {profile.redemptions.length > 0 && (
            <div className="sticker-card p-3 mt-2">
              <p className="font-display text-sm mb-2">Bekleyen / Geçmiş Talepler</p>
              <ul className="text-sm space-y-1">
                {profile.redemptions.slice(-5).reverse().map((r) => (
                  <li key={r.id} className="flex justify-between">
                    <span>{r.label}</span>
                    <span className={r.fulfilled ? "text-teal" : "text-coral"}>{r.fulfilled ? "Teslim edildi ✓" : "Bekliyor"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
