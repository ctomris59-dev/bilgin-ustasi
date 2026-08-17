import logo from "../../assets/game-assets/logo.jpg";
import { playPop } from "../../lib/sound";

const NAV_ITEMS = [
  { id: "dashboard", label: "Ana Üs", icon: "home", hint: "Bugünün görevleri" },
  { id: "mistakes", label: "Tekrar", icon: "repeat", hint: "Yanlışları ustalaştır" },
  { id: "wardrobe", label: "Karakter", icon: "user", hint: "Ekipman · pet · üs" },
  { id: "shop", label: "Dükkan", icon: "bag", hint: "Coinleri iteme dönüştür" },
  { id: "archive", label: "Arşiv", icon: "archive", hint: "Rozet ve koleksiyon" },
  { id: "parent", label: "Ebeveyn", icon: "shield", hint: "İlerleme ve ayarlar" },
];
export default function SideNav({ active, onChange, onOpenWorldMap, onStartMiniGame, compact = false }) {
  const go = (id) => { playPop(); onChange(id); };
  return <aside className={`v4-side-nav v4x-side-nav ${compact ? "is-compact" : ""}`}>
    <div className="v4-brand-block v4x-brand-block"><div className="v4-logo-frame"><img src={logo} alt="Bilgin Ustası" className="v4-logo-image" /></div><div className="v4-brand-copy"><p>OYNA · KEŞFET · ÖĞREN</p><strong>Bilgin Ustası</strong></div></div>
    <nav className="v4-nav-stack v4x-nav-stack" aria-label="Ana navigasyon">{NAV_ITEMS.map((item) => <button key={item.id} onClick={() => go(item.id)} className={`v4-nav-item v4x-nav-item ${active === item.id ? "is-active" : ""}`}><span className="v4-nav-icon"><NavIcon name={item.icon} /></span><span className="v4-nav-copy"><strong>{item.label}</strong><small>{item.hint}</small></span><span className="v4-nav-chevron">›</span></button>)}</nav>
    <div className="v4-nav-divider" />
    <div className="v4-nav-stack v4-nav-stack-secondary">
      <button onClick={() => { playPop(); onOpenWorldMap(); }} className="v4-nav-item v4x-nav-item v4-nav-action"><span className="v4-nav-icon"><NavIcon name="world" /></span><span className="v4-nav-copy"><strong>Dünya Haritası</strong><small>Yeni bölgeleri aç</small></span><span className="v4-nav-chevron">›</span></button>
      <button onClick={() => { playPop(); onStartMiniGame(); }} className="v4-nav-item v4x-nav-item v4-nav-action"><span className="v4-nav-icon"><NavIcon name="game" /></span><span className="v4-nav-copy"><strong>Mini Oyun</strong><small>Kısa bir mola</small></span><span className="v4-nav-chevron">›</span></button>
    </div>
    <div className="v4-side-footer"><span className="v4-online-dot" /><div className="v4-nav-copy"><strong>Öğrenme Modu</strong><small>Test → XP → Item</small></div></div>
  </aside>;
}
function NavIcon({ name }) { const p={home:<><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.8V21h13V9.8"/><path d="M9.5 21v-6h5v6"/></>,repeat:<><path d="M20 7h-9a5 5 0 0 0-5 5"/><path d="m17 4 3 3-3 3"/><path d="M4 17h9a5 5 0 0 0 5-5"/><path d="m7 20-3-3 3-3"/></>,user:<><circle cx="12" cy="7.5" r="3.2"/><path d="M5.5 21v-2.2A6.5 6.5 0 0 1 12 12.3a6.5 6.5 0 0 1 6.5 6.5V21"/></>,bag:<><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,archive:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 5V3h8v2M8 10h8M9 14h6"/></>,shield:<><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z"/><path d="M9.5 12 11 13.5l3.5-4"/></>,world:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,game:<><path d="M7.2 8h9.6a4.2 4.2 0 0 1 4 5.4l-1.1 3.7a2 2 0 0 1-3.3.9l-2.1-1.8H9.7L7.6 18a2 2 0 0 1-3.3-.9l-1.1-3.7A4.2 4.2 0 0 1 7.2 8Z"/><path d="M8 11v4M6 13h4M16.5 12h.01M18 14h.01"/></>}; return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]||p.home}</svg>; }
