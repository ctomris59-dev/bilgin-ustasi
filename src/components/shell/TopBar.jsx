import SoundToggle from "../SoundToggle";
import { getLevelInfo } from "../../data/levels";
export default function TopBar({ profile, syncStatus, title, eyebrow }) {
  const { current, next, progressPct } = getLevelInfo(profile.xp || 0);
  return <header className="v4-topbar v4x-topbar">
    <div className="v4-topbar-title"><p>{eyebrow}</p><h1>{title}</h1></div>
    <div className="v4-topbar-profile">
      <div className="v4-player-chip v4x-player-chip"><div className="v4-player-avatar">{String(profile.childName || "B").slice(0,1).toUpperCase()}</div><div className="v4-player-meta"><div className="v4-player-name-row"><strong>{profile.childName}</strong><span>Lv. {current.level}</span></div><div className="v4-mini-xp"><span style={{width:`${progressPct}%`}}/></div><small>{profile.xp} XP {next ? `· ${next.minXp-profile.xp} XP kaldı` : "· Usta seviye"}</small></div></div>
      <Resource icon="◈" value={profile.coins||0} label="Coin" color="#FFD166"/><Resource icon="◆" value={profile.gems||0} label="Kristal" color="#D277FF"/><Resource icon="✦" value={profile.badges?.length||0} label="Rozet" color="#52E3FF"/>
      <div className="v4-topbar-tools"><SoundToggle/><div className="v4-sync-chip"><span style={{background:syncStatus==="synced"?"#52E3C2":"#FFD166"}}/>{syncStatus==="synced"?"Senkron":"Yerel"}</div></div>
    </div>
  </header>;
}
function Resource({icon,value,label,color}){return <div className="v4-resource-chip v4x-resource-chip"><span className="v4-resource-icon" style={{color,background:`${color}16`,boxShadow:`0 0 22px ${color}12`}}>{icon}</span><span className="v4-resource-copy"><strong>{value}</strong><small>{label}</small></span></div>}
