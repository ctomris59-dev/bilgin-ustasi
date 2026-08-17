import { STICKER_ALBUM, STICKER_SEQUENCE } from "../data/stickers";
import { BADGES } from "../lib/gamification";
import { getLevelInfo } from "../data/levels";

export default function StickerAlbum({ profile }) {
  const unlocked = new Set(profile.stickerAlbum?.unlockedIds || []);
  const total = STICKER_SEQUENCE.length;
  const count = unlocked.size;
  const pct = total ? Math.round((count / total) * 100) : 0;
  const badges = BADGES.filter((badge) => (profile.badges || []).includes(badge.id));
  const { current } = getLevelInfo(profile.xp || 0);

  return (
    <div className="v4x-archive-screen">
      <section className="v4x-archive-hero">
        <div><span className="v4x-eyebrow">KEŞİF ARŞİVİ</span><h2>Çalıştıkça koleksiyonun büyür</h2><p>Her tamamlanan görev bir keşif kartı açar; özel başarılar rozetlere dönüşür.</p></div>
        <div className="v4x-archive-progress"><strong>{count}<small>/{total}</small></strong><span>Koleksiyon</span><div><i style={{ width: `${pct}%` }} /></div><em>%{pct} tamamlandı</em></div>
      </section>

      <section className="v4x-archive-stats">
        <Stat value={current.level} label="Seviye" color="#52E3FF" />
        <Stat value={badges.length} label="Rozet" color="#FFD166" />
        <Stat value={(profile.history || []).length} label="Tamamlanan test" color="#52E3C2" />
        <Stat value={(profile.unlockedItems || []).length} label="Açılan item" color="#A98CFF" />
      </section>

      <div className="v4x-archive-layout">
        <section className="v4x-archive-main">
          <div className="v4x-section-title"><div><small>KEŞİF KARTLARI</small><strong>Sticker Koleksiyonu</strong></div><span>{count}/{total}</span></div>
          <div className="v4x-sticker-categories">
            {STICKER_ALBUM.map((cat, ci) => (
              <article key={cat.category}>
                <header><strong>{cat.category}</strong><span>{cat.stickers.filter((_, i) => unlocked.has(`sticker-${ci}-${i}`)).length}/{cat.stickers.length}</span></header>
                <div>{cat.stickers.map((emoji, i) => { const id = `sticker-${ci}-${i}`; const owned = unlocked.has(id); return <div key={id} className={owned ? "is-owned" : "is-locked"}><span>{owned ? emoji : "?"}</span>{owned && <b>✓</b>}</div>; })}</div>
              </article>
            ))}
          </div>
        </section>

        <aside className="v4x-badge-vault">
          <div className="v4x-section-title"><div><small>BAŞARILAR</small><strong>Rozet Kasası</strong></div></div>
          <div className="v4x-badge-list">
            {BADGES.map((badge) => { const owned = badges.some((b) => b.id === badge.id); return <div key={badge.id} className={owned ? "is-owned" : "is-locked"}><span>⬡</span><div><strong>{badge.label}</strong><small>{badge.desc}</small></div><b>{owned ? "✓" : "Kilitli"}</b></div>; })}
          </div>
        </aside>
      </div>
    </div>
  );
}
function Stat({ value, label, color }) { return <div><strong style={{ color }}>{value}</strong><small>{label}</small></div>; }
