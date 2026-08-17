import { useMemo } from "react";
import { getLevelInfo } from "../data/levels";
import { BADGES } from "../lib/gamification";
import { getRandomGreeting } from "../data/messages";
import { getWorldForLevel } from "../data/worlds";
import { getWorldAsset } from "../data/gameAssets";

const SUBJECT_META = {
  Matematik: { icon: "△", accent: "#70A1FF", place: "Sayı Dağları" },
  Türkçe: { icon: "♣", accent: "#52E3C2", place: "Kelime Ormanı" },
  "Fen Bilimleri": { icon: "◇", accent: "#65F0D7", place: "Keşif Vadisi" },
  Fen: { icon: "◇", accent: "#65F0D7", place: "Keşif Vadisi" },
  "Sosyal Bilgiler": { icon: "⬡", accent: "#FFD166", place: "Zaman Şehri" },
  İngilizce: { icon: "≈", accent: "#70D6FF", place: "Dil Limanı" },
};

export default function Dashboard({ profile, tests = [], onStartTest, onGeneratePractice, onOpenMistakeBox, onStartMiniGame, onOpenWorldMap, onOpenShop, onOpenCharacter, pausedTest, onResumeTest, onDiscardPausedTest }) {
  const { current, next, progressPct } = getLevelInfo(profile.xp || 0);
  const greeting = useMemo(() => getRandomGreeting(), []);
  const world = getWorldForLevel(current.level);
  const worldArt = getWorldAsset(world.id);
  const activeMistakes = (profile.mistakeBox || []).filter((m) => !m.resolved).length;
  const earnedBadges = BADGES.filter((b) => (profile.badges || []).includes(b.id));
  const mainTest = tests[0] || null;
  const mainMeta = SUBJECT_META[mainTest?.subject] || { icon: "✦", accent: "#A98CFF", place: world.title };
  const totalTests = (profile.history || []).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayHistory = (profile.history || []).filter((h) => String(h.date || "").slice(0, 10) === today);
  const todayCorrect = todayHistory.reduce((sum, h) => sum + (h.correctCount || 0), 0);

  return (
    <div className="v4-dashboard">
      {pausedTest && (
        <section className="v4-dashboard-resume">
          <div className="v4-resume-icon">▶</div>
          <div className="v4-resume-copy">
            <p>KALDIĞIN GÖREV</p>
            <strong>{pausedTest.test.title}</strong>
            <small>Soru {pausedTest.index + 1}/{pausedTest.test.questions.length}</small>
          </div>
          <button onClick={onResumeTest} className="v4-dashboard-button">Devam Et →</button>
          <button onClick={onDiscardPausedTest} className="v4-resume-discard" aria-label="Görev kaydını kaldır">×</button>
        </section>
      )}

      <section className="v4-mission-hero">
        <img src={worldArt} alt="" className="v4-mission-bg" />
        <div className="v4-mission-overlay" />
        <div className="v4-mission-content">
          <div className="v4-mission-copy">
            <p className="v4-mission-kicker">SIRADAKİ GÖREV · {mainMeta.place}</p>
            <h2>{mainTest?.title || "Yeni bir keşif görevi hazırlanıyor"}</h2>
            <p>{mainTest ? `${mainTest.subject} · ${mainTest.questions?.length || 0} soru. Testi bitir, XP ve coin kazan; yeni ekipmanlara yaklaş.` : greeting}</p>
            <div className="v4-mission-actions">
              <button disabled={!mainTest} onClick={() => mainTest && onStartTest(mainTest)} className="v4-mission-primary">{mainTest ? "Göreve Başla" : "Görev Bekleniyor"}<span>→</span></button>
              <button onClick={onOpenWorldMap} className="v4-mission-secondary">Dünya Haritası</button>
            </div>
          </div>

          <div className="v4-mission-progress-card">
            <span>AKTİF BÖLGE</span>
            <strong>{world.title}</strong>
            <div className="v4-mission-world-row"><span style={{ color: world.accent }}>{world.emoji}</span><small>Seviye {current.level}</small></div>
            <div className="v4-mission-progress"><span style={{ width: `${progressPct}%` }} /></div>
            <small>{next ? `${next.minXp - profile.xp} XP sonra seviye ${next.level}` : "Usta seviyedesin"}</small>
          </div>
        </div>
      </section>

      <section className="v4-dashboard-stat-grid">
        <DashboardStat icon="✓" value={todayCorrect} label="Bugün doğru" detail={`${todayHistory.length} test tamamlandı`} color="#52E3C2" />
        <DashboardStat icon="ϟ" value={profile.streak?.current || 0} label="Çalışma serisi" detail="Düzenli çalışmayı sürdür" color="#FF789E" />
        <DashboardStat icon="◈" value={profile.coins || 0} label="Coin bakiyesi" detail="Dükkânda kullan" color="#FFD166" />
        <DashboardStat icon="↻" value={activeMistakes} label="Tekrar sorusu" detail="Öğrenmeyi güçlendir" color="#70D6FF" />
      </section>

      <div className="v4-dashboard-columns">
        <section className="v4-dashboard-panel">
          <div className="v4-panel-heading">
            <div><p>KEŞİF GÖREVLERİ</p><h3>Ders Çalışma Merkezi</h3></div>
            <span>{tests.length} görev</span>
          </div>
          <div className="v4-task-list">
            {tests.slice(0, 6).map((test, index) => {
              const meta = SUBJECT_META[test.subject] || { icon: "✦", accent: "#A98CFF", place: "Keşif" };
              return (
                <button key={test.id} onClick={() => onStartTest(test)} className={`v4-task-row ${index === 0 ? "is-featured" : ""}`}>
                  <span className="v4-task-icon" style={{ color: meta.accent, background: `${meta.accent}12`, borderColor: `${meta.accent}24` }}>{meta.icon}</span>
                  <span className="v4-task-copy"><small>{meta.place}</small><strong>{test.title}</strong><em>{test.subject} · {test.questions?.length || 0} soru</em></span>
                  <span className="v4-task-reward">+XP<br/><b>+Coin</b></span>
                  <span className="v4-task-go">→</span>
                </button>
              );
            })}
            {tests.length === 0 && <div className="v4-empty-task"><span>✦</span><strong>Yeni görevler hazırlanıyor</strong><small>Testler geldiğinde burada görünecek.</small></div>}
          </div>
          {tests[0]?.subject && onGeneratePractice && <button onClick={() => onGeneratePractice(tests[0].subject)} className="v4-panel-footer-button">{tests[0].subject} için ekstra pratik üret →</button>}
        </section>

        <section className="v4-dashboard-panel">
          <div className="v4-panel-heading"><div><p>BUGÜNKÜ ROTA</p><h3>Öğren & Geliştir</h3></div><span>{totalTests} toplam test</span></div>
          <div className="v4-route-list">
            <RouteCard number="01" title="Ders çalış" text="Bir test seç ve görevi tamamla." done={todayHistory.length > 0} accent="#52E3FF" onClick={() => mainTest && onStartTest(mainTest)} />
            <RouteCard number="02" title="Tekrar yap" text={`${activeMistakes} soru ustalaşmayı bekliyor.`} done={activeMistakes === 0} accent="#FF789E" onClick={onOpenMistakeBox} />
            <RouteCard number="03" title="Ödülleri kullan" text={`${profile.coins || 0} coinin yeni itemlere dönüşebilir.`} done={false} accent="#FFD166" onClick={onOpenShop} />
          </div>

          <button onClick={onStartMiniGame} className="v4-break-card">
            <span className="v4-break-icon">▦</span>
            <span><small>KISA MOLA</small><strong>Hafıza Görevi</strong><em>Bugünün ders hedefinden sonra zihnini tazele.</em></span>
            <b>Oyna →</b>
          </button>

          {earnedBadges.length > 0 && (
            <div className="v4-badge-strip">
              <p>SON KAZANIMLAR</p>
              <div>{earnedBadges.slice(-4).map((badge) => <span key={badge.id}>⬡ {badge.label}</span>)}</div>
            </div>
          )}
        </section>
      </div>

      <section className="v4x-dashboard-actions">
        <button onClick={() => mainTest && onStartTest(mainTest)}><span>▤</span><div><small>DERS ÇALIŞ</small><strong>Test çözmeye devam et</strong></div><b>Başla →</b></button>
        <button onClick={onOpenWorldMap}><span>◉</span><div><small>DÜNYA HARİTASI</small><strong>Yeni bölgeleri keşfet</strong></div><b>Harita →</b></button>
        <button onClick={onOpenShop}><span>◈</span><div><small>KAŞİF DÜKKÂNI</small><strong>Coinleri iteme dönüştür</strong></div><b>Dükkan →</b></button>
        <button onClick={onOpenCharacter}><span>◇</span><div><small>KARAKTER</small><strong>Itemlerini kuşan</strong></div><b>Ekipman →</b></button>
      </section>
    </div>
  );
}

function DashboardStat({ icon, value, label, detail, color }) {
  return <article className="v4-dashboard-stat"><span style={{ color, background: `${color}12`, borderColor: `${color}22` }}>{icon}</span><div><strong style={{ color }}>{value}</strong><p>{label}</p><small>{detail}</small></div></article>;
}

function RouteCard({ number, title, text, done, accent, onClick }) {
  return <button type="button" onClick={onClick} className={`v4-route-card ${done ? "is-done" : ""}`}><span className="v4-route-number" style={{ color: done ? "#071C17" : accent, background: done ? "#52E3C2" : `${accent}10`, borderColor: done ? "transparent" : `${accent}25` }}>{done ? "✓" : number}</span><span className="v4-route-copy"><strong>{title}</strong><small>{text}</small></span><span className="v4-route-arrow">→</span></button>;
}
