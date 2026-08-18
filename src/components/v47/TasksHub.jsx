export default function TasksHub({ profile, tests = [], onStartTest, onOpenLessons }) {
  const recent = tests.slice(0, 6);
  const completed = profile?.history?.length || 0;
  const streak = profile?.streak?.current || 0;
  return (
    <section className="v47-tasks-page">
      <div className="v47-lessons-hero">
        <div><span className="v47-eyebrow">GÖREVLER</span><h1>Bugünün keşif görevleri hazır.</h1><p>Ders testlerini tamamla, seri yap, XP ve coin kazan. Zorlandığın konular Dersler bölümüne otomatik bağlanır.</p></div>
        <div className="v47-learning-score"><strong>{streak}</strong><span>Günlük Seri</span><small>{completed} toplam görev</small></div>
      </div>
      <div className="v47-task-grid">
        {recent.map((test, index) => <article key={test.id || index}>
          <span>{index % 2 ? "🧪" : "📘"}</span><div><small>{test.subject || "Ders"}</small><h3>{test.title || `${test.subject} Görevi`}</h3><p>{test.questions?.length || 0} soru · XP + coin ödülü</p></div><button onClick={() => onStartTest?.(test)}>Başlat ▶</button>
        </article>)}
        {!recent.length && <article className="is-empty"><span>🧭</span><div><h3>Görevler hazırlanıyor</h3><p>Dersler bölümünden hızlı pratik başlatabilirsin.</p></div><button onClick={onOpenLessons}>Derslere Git</button></article>}
      </div>
    </section>
  );
}
