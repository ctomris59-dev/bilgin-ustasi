import { getLevelInfo } from "../../data/levels";

export default function LeaderboardHub({ profile }) {
  const level = getLevelInfo(profile?.xp || 0).current.level;
  const rows = [
    ["Ada Kaşif", Math.max(level + 3, 7), 2980, "🥇"],
    ["Mert Bilgin", Math.max(level + 2, 6), 2630, "🥈"],
    ["Bilgin Adayı", level, profile?.xp || 0, "⭐"],
    ["Deniz Gezgin", Math.max(level - 1, 1), 1740, "4"],
    ["Ece Meraklı", Math.max(level - 1, 1), 1510, "5"],
  ];
  return <section className="v47-simple-page"><header><span className="v47-eyebrow">LİDERLİK</span><h1>Bilgi liginde yüksel.</h1><p>Dersler, görevler ve tam puanlar lig puanını artırır.</p></header><div className="v47-leader-card"><div className="v47-leader-head"><span>Sıra</span><span>Kaşif</span><span>Seviye</span><span>XP</span></div>{rows.map(([name,lvl,xp,rank],i)=><div key={`${name}-${i}`} className={name==="Bilgin Adayı"?"is-me":""}><b>{rank}</b><strong>{name}</strong><span>Lv. {lvl}</span><em>{xp} XP</em></div>)}</div></section>;
}
