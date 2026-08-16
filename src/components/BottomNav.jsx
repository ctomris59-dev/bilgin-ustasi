import { playPop } from "../lib/sound";

const TABS = [
  { id: "dashboard", label: "Ana Sayfa", icon: "🏠", color: "bg-sky" },
  { id: "mistakes", label: "Hata Kutusu", icon: "📦", color: "bg-coral" },
  { id: "wardrobe", label: "Karakterim", icon: "👗", color: "bg-bubblegum" },
  { id: "shop", label: "Mağaza", icon: "🛒", color: "bg-gold" },
  { id: "parent", label: "Ebeveyn", icon: "🔒", color: "bg-violet" },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-night-deep border-t-4 border-ink flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-20">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => {
            playPop();
            onChange(t.id);
          }}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl text-xs font-bold text-ink"
        >
          <span
            className={`text-lg w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all ${
              active === t.id ? `${t.color} border-ink scale-110` : "bg-transparent border-transparent"
            }`}
          >
            {t.icon}
          </span>
          <span className={active === t.id ? "opacity-100" : "opacity-50"}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
