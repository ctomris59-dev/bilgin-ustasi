export default function MistakeBox({ profile, onStartRetryTest }) {
  const active = profile.mistakeBox.filter((m) => !m.resolved);
  const bySubject = active.reduce((acc, m) => {
    acc[m.subject] = acc[m.subject] || [];
    acc[m.subject].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="sticker-card p-4">
        <h2 className="font-display text-lg">📦 Hata Kutusu</h2>
        <p className="text-sm opacity-70">Yanlış yaptığın sorular burada birikir. Aralıklı olarak tekrar karşına çıkarlar — böylece gerçekten öğrenip unutmazsın.</p>
      </div>

      {active.length === 0 && (
        <div className="sticker-card p-6 text-center text-sm opacity-70">Hata kutun boş! Harika gidiyorsun. 🎉</div>
      )}

      {Object.entries(bySubject).map(([subject, items]) => (
        <div key={subject} className="sticker-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-base">{subject}</h3>
            <span className="text-sm opacity-60">{items.length} soru</span>
          </div>
          <button
            onClick={() => onStartRetryTest(subject, items)}
            className="w-full sticker-btn bg-coral text-white rounded-full py-2.5 font-bold text-sm"
          >
            ⚔️ {subject} Rövanş Testini Başlat
          </button>
        </div>
      ))}
    </div>
  );
}
