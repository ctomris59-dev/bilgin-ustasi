import { GAME_ASSETS } from "../../data/gameAssets";
import { getLevelInfo } from "../../data/levels";

const NAV = [
  ["wardrobe", "Kahraman", "★"],
  ["pets", "Dost", "☻"],
  ["base", "Üs", "⌂"],
  ["dashboard", "Görevler", "✓"],
  ["lessons", "Dersler", "📖"],
  ["shop", "Dükkan", "▣"],
  ["leaderboard", "Liderlik", "✦"],
];

export default function AppShell({ profile, syncStatus, activeSection, tab, onChangeTab, children, focusMode = false }) {
  const level = getLevelInfo(profile?.xp || 0);
  const current = level.current;
  const next = level.next;
  const inLevel = Math.max(0, (profile?.xp || 0) - current.minXp);
  const levelSpan = Math.max(1, (next?.minXp || current.maxXp || current.minXp + 100) - current.minXp);
  const pct = Math.max(3, Math.min(100, Math.round((inLevel / levelSpan) * 100)));
  if (focusMode) return <div className="v47-focus-shell"><main>{children}</main></div>;

  return <div className="v47-root">
    <header className="v47-topbar">
      <button className="v47-brand" onClick={()=>onChangeTab("wardrobe")}><img src={GAME_ASSETS.logo} alt="Bilgin Ustası"/><span><strong>Bilgin Kaşif Üssü</strong><small>Kahramanını Geliştir · Keşfet · Öğren · Başar</small></span></button>
      <nav className="v47-main-nav" aria-label="Ana menü">{NAV.map(([id,label,icon])=><button key={id} className={tab===id||activeSection===id?"is-active":""} onClick={()=>onChangeTab(id)}><span>{icon}</span><b>{label}</b></button>)}</nav>
      <div className="v47-player-strip"><div className="v47-avatar-dot">B</div><div className="v47-player-copy"><strong>Bilgin Adayı <i>Lv. {current.level}</i></strong><div><span style={{width:`${pct}%`}}/></div><small>{profile?.xp||0} XP</small></div><div className="v47-currency"><span>◈</span><b>{profile?.coins||0}</b><small>COIN</small></div><div className="v47-currency"><span>◆</span><b>{profile?.gems||0}</b><small>KRİSTAL</small></div><div className="v47-currency"><span>✦</span><b>{profile?.badges?.length||0}</b><small>ROZET</small></div><div className={`v47-sync ${syncStatus==="synced"?"is-on":""}`}>●</div></div>
    </header>
    <main className="v47-main">{children}</main>
    <footer className="v47-footer"><div><b>18</b><span><strong>Premium Item</strong><i><em style={{width:"60%"}}/></i></span><small>12 / 20</small></div><p>✦ <strong>Bilgi güçtür.</strong> Keşfet, öğren, paylaş!</p><div className="v47-flags"><span>🇪🇺</span><span>🇹🇷</span><small>Birlikte daha güçlü bir gelecek için.</small><b>v4.7.0</b></div></footer>
  </div>;
}
