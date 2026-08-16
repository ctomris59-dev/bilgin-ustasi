import { ITEMS } from "../data/avatarParts";
import { ALL_PET_ROOM_ITEMS } from "../data/petsAndRoom";
import { useState } from "react";

const ALL_SHOP_ITEMS = [...ITEMS, ...ALL_PET_ROOM_ITEMS];

export default function Shop({ profile, onBuy }) {
  const [filter, setFilter] = useState("all");

  const filteredItems = ALL_SHOP_ITEMS.filter((i) => {
    if (i.legendary) return false; // Efsanevi eşyalar mağazada satılmaz
    if (filter === "clothes") return i.slot === "outfit" || i.slot === "shoes" || i.slot === "headwear" || i.slot === "face";
    if (filter === "pets") return i.type || i.slot === "petAccessory";
    if (filter === "room") return i.slot === "wallpaper" || i.slot === "rug" || i.slot === "desk" || i.slot === "lamp" || i.slot === "plant" || i.slot === "poster";
    return true;
  });

  return (
    <div className="space-y-4 font-['Fredoka',sans-serif] pb-10">
      <div className="sticker-card p-4 bg-[#FFD166] text-center shadow-md">
        <h2 className="text-2xl font-black text-[#4A2E4B] animate-bob">Mağaza 🛍️</h2>
        <p className="text-sm font-bold text-[#4A2E4B]/80 mt-1">Cüzdanın: <span className="text-xl font-black">🪙 {profile.coins}</span></p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "all", label: "Hepsi ✨" },
          { id: "clothes", label: "Kıyafet 👗" },
          { id: "pets", label: "Dostlar 🐾" },
          { id: "room", label: "Ev 🏠" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-4 py-2 rounded-2xl border-3 font-black transition-all ${
              filter === f.id ? "bg-[#FF70A6] border-[#4A2E4B] text-white shadow-md" : "bg-[#FFFFFF] border-[#4A2E4B]/20 text-[#4A2E4B]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isOwned = profile.unlockedItems.includes(item.id);
          const canAfford = profile.coins >= item.price;

          return (
            <div 
              key={item.id} 
              className={`sticker-card flex flex-col p-3 bg-[#FFFFFF] transition-transform ${isOwned ? "opacity-60" : "hover:border-[#FF70A6] hover:-translate-y-1"}`}
            >
              <div className="h-20 bg-[#FFE8EC] rounded-xl border-2 border-[#4A2E4B] flex items-center justify-center mb-3 relative overflow-hidden">
                <span className="text-4xl animate-bob">{item.emoji || "🎁"}</span>
              </div>
              
              <h4 className="font-black text-sm text-[#4A2E4B] leading-tight mb-auto text-center">{item.label}</h4>
              
              <div className="mt-3">
                {isOwned ? (
                  <button disabled className="w-full sticker-btn py-2 bg-gray-200 text-gray-500 text-xs font-black">
                    Sende Var ✓
                  </button>
                ) : (
                  <button
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    className={`w-full sticker-btn py-2 text-xs flex justify-center items-center gap-1 font-black transition-all ${
                      canAfford ? "bg-[#52E3C2] text-[#4A2E4B] hover:bg-[#43c4a6]" : "bg-[#FF9EAA] text-white"
                    }`}
                  >
                    <span className="text-sm">🪙</span> {item.price}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
