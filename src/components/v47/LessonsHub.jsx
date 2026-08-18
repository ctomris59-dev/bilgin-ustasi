import { useMemo } from "react";

const SUBJECT_META = {
  "Türkçe": { icon: "📘", accent: "#55b7ff", desc: "Okuma, anlam, dil bilgisi ve sözcük becerileri" },
  "Matematik": { icon: "📐", accent: "#8b75ff", desc: "Problemler, işlemler, geometri ve mantık" },
  "Fen Bilimleri": { icon: "🧪", accent: "#43dfb5", desc: "Doğa, madde, canlılar ve deneyler" },
  "Sosyal Bilgiler": { icon: "🌍", accent: "#ffb84d", desc: "Toplum, tarih, coğrafya ve kültür" },
  "İngilizce": { icon: "💬", accent: "#ff6fae", desc: "Kelime, okuma ve günlük ifadeler" },
  "Din Kültürü": { icon: "📖", accent: "#ffd65b", desc: "Değerler, kültür ve temel bilgiler" },
};

export default function LessonsHub({ profile, tests = [], onStartTest, onGeneratePractice }) {
  const subjects = useMemo(() => {
    const names = [...new Set(tests.map((test) => test.subject).filter(Boolean))];
    if (!names.length) return Object.keys(SUBJECT_META).slice(0, 4);
    return names;
  }, [tests]);

  const history = profile?.history || [];
  const totalTests = history.length;
  const totalCorrect = history.reduce((sum, h) => sum + Number(h.correctCount || 0), 0);
  const totalQuestions = history.reduce((sum, h) => sum + Number(h.totalCount || 0), 0);
  const success = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  function startSubject(subject) {
    const test = tests.find((entry) => entry.subject === subject);
    if (test) onStartTest?.(test);
    else onGeneratePractice?.(subject);
  }

  return (
    <section className="v47-lessons-page">
      <div className="v47-lessons-hero">
        <div>
          <span className="v47-eyebrow">DERSLER & ÖĞRENME</span>
          <h1>Bilgini güçlendir, kahramanını geliştir.</h1>
          <p>Her tamamlanan ders XP, coin ve yeni ödüller kazandırır. Ders seç, konuya gir ve doğrudan teste başla.</p>
        </div>
        <div className="v47-learning-score">
          <strong>{success}%</strong>
          <span>Genel Başarı</span>
          <small>{totalTests} tamamlanan görev</small>
        </div>
      </div>

      <div className="v47-subject-grid">
        {subjects.map((subject) => {
          const meta = SUBJECT_META[subject] || { icon: "📚", accent: "#55b7ff", desc: "Konu anlatımı ve test görevleri" };
          const completed = history.filter((h) => h.subject === subject).length;
          const available = tests.filter((t) => t.subject === subject).length;
          const pct = Math.min(100, completed * 20);
          return (
            <article className="v47-subject-card" key={subject} style={{ "--subject-accent": meta.accent }}>
              <div className="v47-subject-icon">{meta.icon}</div>
              <div className="v47-subject-copy">
                <span>DERS</span>
                <h3>{subject}</h3>
                <p>{meta.desc}</p>
                <div className="v47-progress"><i style={{ width: `${pct}%` }} /></div>
                <small>{completed} tamamlandı · {available || "Pratik"} görev</small>
              </div>
              <button type="button" onClick={() => startSubject(subject)}>Derse Başla <b>▶</b></button>
            </article>
          );
        })}
      </div>

      <div className="v47-learning-bottom">
        <article><span>🔥</span><div><strong>Günlük Hedef</strong><p>Bugün en az 1 ders tamamla.</p></div><b>{profile?.streak?.current || 0} gün</b></article>
        <article><span>⭐</span><div><strong>Hızlı Pratik</strong><p>Zayıf olduğun dersten kısa bir test oluştur.</p></div><button onClick={() => onGeneratePractice?.(subjects[0])}>Pratik Yap</button></article>
        <article><span>🏆</span><div><strong>Ödül Zinciri</strong><p>Tam puan → kristal, XP ve özel ekipman şansı.</p></div><b>{profile?.gems || 0} kristal</b></article>
      </div>
    </section>
  );
}
