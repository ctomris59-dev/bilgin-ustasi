// Return içindeki item listeleme map'i:
<div className="grid grid-cols-2 gap-4">
  {filteredItems.map((item) => {
    const isOwned = profile.unlockedItems.includes(item.id);
    const canAfford = profile.coins >= item.price;

    return (
      <div 
        key={item.id} 
        className={`sticker-card flex flex-col p-3 bg-[#FFFFFF] ${isOwned ? "opacity-60" : "hover:border-[#FF70A6]"}`}
      >
        {/* Eşya İkonu Gösterimi (Glyph veya emoji koyduğun yer) */}
        <div className="h-20 bg-[#FFE8EC] rounded-xl border-2 border-[#4A2E4B] flex items-center justify-center mb-3 relative overflow-hidden">
          {item.legendary && <span className="absolute top-1 left-1 text-[10px] bg-[#FFD166] px-2 py-0.5 rounded-full font-black text-[#4A2E4B] border-2 border-[#4A2E4B]">Efsanevi</span>}
          {/* Eşya ikonu buraya gelecek */}
          <span className="text-3xl animate-bob">{item.emoji || "👗"}</span>
        </div>
        
        <h4 className="font-black text-sm text-[#4A2E4B] leading-tight mb-auto">{item.label}</h4>
        
        <div className="mt-3">
          {isOwned ? (
            <button disabled className="w-full sticker-btn py-2 bg-gray-200 text-gray-500 text-xs">
              Sende Var ✓
            </button>
          ) : (
            <button
              onClick={() => onBuy(item)}
              disabled={!canAfford}
              className={`w-full sticker-btn py-2 text-xs flex justify-center items-center gap-1 ${
                canAfford ? "bg-[#52E3C2] text-[#4A2E4B]" : "bg-[#FF9EAA] text-white"
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
