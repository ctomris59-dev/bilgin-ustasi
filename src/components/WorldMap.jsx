import { useState, useMemo } from "react";
import { WORLDS } from "../data/worlds";
import { getLevelInfo } from "../data/levels";
import { ITEMS } from "../data/avatarParts";
import { PETS, ROOM_ITEMS } from "../data/petsAndRoom";
import { playPop } from "../lib/sound";

function getWorldRewards(worldId) {
  return [...ITEMS, ...PETS, ...ROOM_ITEMS].filter((i) => i.world === worldId);
}

export default function WorldMap({ profile, onClose }) {
  const { current } = getLevelInfo(profile.xp);
  const currentLevel = current.level;
  const [selected, setSelected] = useState(null);

  const worldsWithStatus = useMemo(
    () =>
      WORLDS.map((w) => ({
        ...w,
        unlocked: currentLevel >= w.unlockLevel,
        isCurrent: currentLevel >= w.unlockLevel && (WORLDS.find((n) => n.order === w.order + 1)?.unlockLevel ?? Infinity) > currentLevel,
      })),
    [currentLevel]
  );

  const selectedWorld = selected ? worldsWithStatus.find((w) => w.id === selected) : null;

  return (
    <div className="sticker-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">🗺️ Sihirli Yol Haritası</h2>
        <button onClick={onClose} className="text-sm opacity-60">
          Kapat ✕
        </button>
      </div>
      <p className="text-xs opacity-60">Seviye atladıkça yeni dünyalar açılır. Şu an Seviye {currentLevel} · {current.title}</p>

      {!selectedWorld ? (
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {worldsWithStatus.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => {
                playPop();
                setSelected(w.id);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition ${
                w.isCurrent ? "border-ink bg-gold/25 animate-pop" : w.unlocked ? "border-ink bg-parchment-dim" : "border-dashed border-ink/30 opacity-50"
              } ${idx % 2 === 0 ? "ml-0 mr-8" : "ml-8 mr-0"}`}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 border-ink flex items-center justify-center text-2xl shrink-0 ${w.isCurrent ? "animate-bob" : ""}`}
                style={{ backgroundColor: w.unlocked ? w.color : "#e5e0f0" }}
              >
                {w.unlocked ? w.emoji : "🔒"}
              </div>
              <div className="text-left flex-1">
                <p className="font-display text-sm leading-tight">{w.order}. {w.title}</p>
                <p className="text-[11px] opacity-60">{w.unlocked ? w.blurb : `Seviye ${w.unlockLevel} gerekli`}</p>
              </div>
              {w.isCurrent && <span className="text-xs font-bold text-coral shrink-0">SEN BURADASIN</span>}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <button onClick={() => setSelected(null)} className="text-sm text-violet font-semibold">
            ← Haritaya dön
          </button>
          <div className="rounded-2xl border-2 border-ink p-4 text-center" style={{ backgroundColor: selectedWorld.unlocked ? `${selectedWorld.color}33` : "#e5e0f0" }}>
            <p className="text-4xl mb-1">{selectedWorld.unlocked ? selectedWorld.emoji : "🔒"}</p>
            <p className="font-display text-lg">{selectedWorld.title}</p>
            <p className="text-sm opacity-70 mt-1">{selectedWorld.unlocked ? selectedWorld.blurb : `Bu dünya Seviye ${selectedWorld.unlockLevel}'de açılır.`}</p>
          </div>
          <div>
            <p className="font-display text-sm mb-2 px-1">Bu Dünyanın Ödülleri</p>
            <div className="grid grid-cols-2 gap-2">
              {getWorldRewards(selectedWorld.id).map((item) => {
                const owned = profile.unlockedItems.includes(item.id);
                return (
                  <div key={item.id} className={`rounded-xl border-2 p-2 text-xs text-center ${owned ? "border-teal bg-teal/10" : "border-ink/20"}`}>
                    <p className="font-semibold">{item.label}</p>
                    {item.legendary ? (
                      <p className="opacity-60 mt-0.5">✨ %100 test ödülü</p>
                    ) : (
                      <p className="opacity-60 mt-0.5">🪙 {item.price}</p>
                    )}
                    {owned && <p className="text-teal font-bold mt-0.5">Sende! ✓</p>}
                  </div>
                );
              })}
              {getWorldRewards(selectedWorld.id).length === 0 && <p className="text-xs opacity-50 col-span-2">Bu dünyaya özel ödül yok, genel mağazadan alışveriş yapılabilir.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
