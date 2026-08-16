const TABS = [
  { id: "dashboard", label: "Ana Sayfa", icon: "🏠", color: "bg-[#FF70A6]" },
  { id: "mistakes", label: "Hata Kutusu", icon: "📦", color: "bg-[#FF9EAA]" },
  { id: "wardrobe", label: "Karakterim", icon: "👗", color: "bg-[#B5838D]" },
  { id: "shop", label: "Mağaza", icon: "🛍️", color: "bg-[#FFD166]" },
  { id: "parent", label: "Ebeveyn", icon: "🔒", color: "bg-[#52E3C2]" },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FFF9FC] border-t-4 border-[#4A2E4B] flex justify-around py-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] z-30 shadow-2xl">
      {TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="flex flex-col items-center gap-0.5 px-2 py-0.5 text-xs font-black text-[#4A2E4B] transition-transform active:scale-95"
          >
            <span
              className={`text-xl w-11 h-11 flex items-center justify-center rounded-2xl border-3 border-[#4A2E4B] transition-all duration-200 ${
                isActive 
                  ? `${t.color} text-white scale-110 -translate-y-2 shadow-lg animate-bob` 
                  : "bg-[#FFFFFF] border-[#4A2E4B]/30 opacity-70"
              }`}
            >
              {t.icon}
            </span>
            <span className={`text-[10px] tracking-tight ${isActive ? "opacity-100 font-black text-[#4A2E4B]" : "opacity-50"}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
