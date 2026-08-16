import { useState } from "react";
import { setParentKey } from "../lib/github";
import { MOODS } from "../data/moods";

const emptyQuestion = () => ({ text: "", options: ["", "", "", ""], correctIndex: 0, hint: "" });

function LoginGate({ onUnlock }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setParentKey(key);
    try {
      const res = await fetch("/api/verify-parent", { method: "POST", headers: { "x-parent-key": key } });
      const data = await res.json();
      if (data.ok) {
        onUnlock();
      } else {
        setError("Anahtar yanlış. Vercel'de ayarladığın PARENT_ACCESS_KEY değerini gir.");
      }
    } catch {
      setError("Sunucuya ulaşılamadı. Çevrimdışı modda ebeveyn paneli sınırlıdır.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="sticker-card p-5 space-y-3">
      <h2 className="font-display text-lg">🔒 Ebeveyn Paneli</h2>
      <p className="text-sm opacity-70">Bu alan sadece sana özel. Vercel ortam değişkenlerinde tanımladığın anahtarı gir.</p>
      <input
        type="password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Ebeveyn anahtarı"
        className="w-full rounded-lg border border-ink/20 p-2.5"
      />
      {error && <p className="text-sm text-coral">{error}</p>}
      <button disabled={loading} className="w-full sticker-btn bg-violet text-white rounded-full py-2.5 font-bold">
        {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}

function TestBuilder({ onUpload }) {
  const [subject, setSubject] = useState("Matematik");
  const [title, setTitle] = useState("");
  const [week, setWeek] = useState(1);
  const [gradeLevel, setGradeLevel] = useState("4. Sınıf (Kolay Başlangıç)");
  const [targetSeconds, setTargetSeconds] = useState(40);
  const [hintsAllowed, setHintsAllowed] = useState(2);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [status, setStatus] = useState("");

  function updateQuestion(i, patch) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }
  function updateOption(i, optIdx, value) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, options: q.options.map((o, oi) => (oi === optIdx ? value : o)) } : q)));
  }
  function addQuestion() {
    setQuestions((qs) => [...qs, emptyQuestion()]);
  }
  function removeQuestion(i) {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  }

  async function submit() {
    if (!title.trim() || questions.some((q) => !q.text.trim() || q.options.some((o) => !o.trim()))) {
      setStatus("Lütfen başlığı ve tüm soru/şık alanlarını doldur.");
      return;
    }
    const id = `${subject.toLowerCase().replace(/\s/g, "-")}-hafta${week}-${Date.now().toString().slice(-5)}`;
    const test = {
      id,
      subject,
      title,
      week: Number(week),
      gradeLevel,
      targetSecondsPerQuestion: Number(targetSeconds),
      hintsAllowed: Number(hintsAllowed),
      questions: questions.map((q, i) => ({ id: `q${i + 1}`, ...q })),
    };
    setStatus("Yükleniyor...");
    try {
      await onUpload(test);
      setStatus("✅ Test başarıyla yüklendi!");
      setTitle("");
      setQuestions([emptyQuestion()]);
    } catch (e) {
      setStatus(`Hata: ${e.message}`);
    }
  }

  return (
    <div className="sticker-card p-4 space-y-3">
      <h3 className="font-display text-base">📝 Yeni Test Yükle</h3>
      <div className="grid grid-cols-2 gap-2">
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-ink/20 p-2">
          <option>Matematik</option>
          <option>Türkçe</option>
          <option>Fen Bilimleri</option>
          <option>Sosyal Bilgiler</option>
          <option>İngilizce (Orta 2 Seviyesi)</option>
        </select>
        <input type="number" min="1" value={week} onChange={(e) => setWeek(e.target.value)} placeholder="Hafta" className="rounded-lg border border-ink/20 p-2" />
      </div>
      <div>
        <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} className="w-full rounded-lg border border-ink/20 p-2">
          <option>4. Sınıf (Kolay Başlangıç)</option>
          <option>Orta 1 (Standart)</option>
          <option>Orta 2 (İleri)</option>
        </select>
        {Number(week) <= 8 ? (
          <p className="text-xs bg-teal/15 rounded-lg p-2 mt-1.5">
            💡 Hafta {week}/8 — yumuşak başlangıç dönemindesin. İlk 2 ay (~8 hafta) 4. Sınıf seviyesinde kalman, özgüven inşa edip sıkılmasını önler; sonra kademeli olarak Orta 1'e geçebilirsin.
          </p>
        ) : (
          <p className="text-xs bg-gold/15 rounded-lg p-2 mt-1.5">
            💡 Yumuşak başlangıç dönemi (8 hafta) geride kaldı — artık Orta 1 standart seviyesine geçebilirsin.
          </p>
        )}
      </div>
      {subject === "İngilizce (Orta 2 Seviyesi)" && (
        <p className="text-xs bg-gold/20 rounded-lg p-2">
          💡 Bu ders bilinçli olarak bir sınıf üstü (Orta 2) seviyesinde tutuluyor çünkü İngilizcesi güçlü. Diğer derslerde Orta 1 müfredatına sadık kalabilirsin.
        </p>
      )}
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Test başlığı (örn. Hafta 2 - Kesirler)" className="w-full rounded-lg border border-ink/20 p-2" />
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs">
          Hedef süre/soru (sn)
          <input type="number" value={targetSeconds} onChange={(e) => setTargetSeconds(e.target.value)} className="w-full rounded-lg border border-ink/20 p-2 mt-1" />
        </label>
        <label className="text-xs">
          İpucu jokeri sayısı
          <input type="number" value={hintsAllowed} onChange={(e) => setHintsAllowed(e.target.value)} className="w-full rounded-lg border border-ink/20 p-2 mt-1" />
        </label>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="border border-ink/15 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold">Soru {i + 1}</p>
              {questions.length > 1 && (
                <button onClick={() => removeQuestion(i)} className="text-xs text-coral">
                  Sil
                </button>
              )}
            </div>
            <input value={q.text} onChange={(e) => updateQuestion(i, { text: e.target.value })} placeholder="Soru metni" className="w-full rounded-lg border border-ink/20 p-2 text-sm" />
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input type="radio" checked={q.correctIndex === oi} onChange={() => updateQuestion(i, { correctIndex: oi })} />
                <input value={opt} onChange={(e) => updateOption(i, oi, e.target.value)} placeholder={`Şık ${oi + 1}`} className="flex-1 rounded-lg border border-ink/20 p-1.5 text-sm" />
              </div>
            ))}
            <input value={q.hint} onChange={(e) => updateQuestion(i, { hint: e.target.value })} placeholder="İpucu metni (opsiyonel)" className="w-full rounded-lg border border-ink/20 p-2 text-sm" />
          </div>
        ))}
      </div>
      <button onClick={addQuestion} className="text-sm text-violet font-semibold">
        + Soru Ekle
      </button>
      {status && <p className="text-sm">{status}</p>}
      <button onClick={submit} className="w-full sticker-btn bg-teal text-white rounded-full py-2.5 font-bold">
        Testi Yayınla
      </button>
    </div>
  );
}

function Analysis({ profile }) {
  const bySubject = {};
  profile.history.forEach((h) => {
    bySubject[h.subject] = bySubject[h.subject] || { correct: 0, total: 0, count: 0 };
    bySubject[h.subject].correct += h.correctCount;
    bySubject[h.subject].total += h.totalCount;
    bySubject[h.subject].count += 1;
  });

  return (
    <div className="sticker-card p-4 space-y-3">
      <h3 className="font-display text-base">📊 Ders Bazlı Analiz</h3>
      {Object.keys(bySubject).length === 0 && <p className="text-sm opacity-60">Henüz test çözülmedi.</p>}
      {Object.entries(bySubject).map(([subject, s]) => {
        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        return (
          <div key={subject}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">{subject}</span>
              <span>{pct}% · {s.count} test</span>
            </div>
            <div className="w-full bg-ink/10 rounded-full h-2.5">
              <div className={`h-2.5 rounded-full ${pct >= 80 ? "bg-teal" : pct >= 50 ? "bg-gold" : "bg-coral"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RewardsManager({ profile, onUpdateProfile }) {
  const [label, setLabel] = useState("");
  const [cost, setCost] = useState(100);

  function addReward() {
    if (!label.trim()) return;
    onUpdateProfile({
      ...profile,
      rewardsCatalog: [...profile.rewardsCatalog, { id: `r${Date.now()}`, label, cost: Number(cost) }],
    });
    setLabel("");
  }
  function removeReward(id) {
    onUpdateProfile({ ...profile, rewardsCatalog: profile.rewardsCatalog.filter((r) => r.id !== id) });
  }
  function markFulfilled(id) {
    onUpdateProfile({
      ...profile,
      redemptions: profile.redemptions.map((r) => (r.id === id ? { ...r, fulfilled: true } : r)),
    });
  }

  return (
    <div className="sticker-card p-4 space-y-3">
      <h3 className="font-display text-base">🎁 Ödül Mağazası Yönetimi</h3>
      <div className="flex gap-2">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Yeni ödül (örn. Sinema seçimi)" className="flex-1 rounded-lg border border-ink/20 p-2 text-sm" />
        <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-20 rounded-lg border border-ink/20 p-2 text-sm" />
        <button onClick={addReward} className="bg-violet text-white rounded-lg px-3 text-sm font-bold">
          Ekle
        </button>
      </div>
      <ul className="text-sm space-y-1">
        {profile.rewardsCatalog.map((r) => (
          <li key={r.id} className="flex justify-between items-center">
            <span>{r.label} · 🪙{r.cost}</span>
            <button onClick={() => removeReward(r.id)} className="text-coral text-xs">Kaldır</button>
          </li>
        ))}
      </ul>
      {profile.redemptions.filter((r) => !r.fulfilled).length > 0 && (
        <div className="pt-2 border-t border-ink/10">
          <p className="text-sm font-semibold mb-1">Bekleyen Talepler</p>
          {profile.redemptions.filter((r) => !r.fulfilled).map((r) => (
            <div key={r.id} className="flex justify-between items-center text-sm py-1">
              <span>{r.label}</span>
              <button onClick={() => markFulfilled(r.id)} className="sticker-btn bg-teal text-white rounded-full px-3 py-1 text-xs font-bold">
                Teslim Et ✓
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MoodHistory({ profile }) {
  const last14 = [...profile.moodLog].slice(-14).reverse();
  return (
    <div className="sticker-card p-4">
      <h3 className="font-display text-base mb-1">💬 Son Ruh Hali Kayıtları</h3>
      <p className="text-xs opacity-60 mb-3">Çocuğunun kendi seçtiği günlük duygu durumu — sohbet başlatmak için bir fikir olabilir.</p>
      {last14.length === 0 && <p className="text-sm opacity-60">Henüz kayıt yok.</p>}
      <div className="flex flex-wrap gap-2">
        {last14.map((entry) => {
          const mood = MOODS.find((m) => m.id === entry.mood);
          return (
            <div key={entry.date} className="flex flex-col items-center bg-parchment-dim rounded-xl px-2 py-1.5">
              <span className="text-lg">{mood?.emoji}</span>
              <span className="text-[10px] opacity-60">{entry.date.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ParentPanel({ profile, onUpdateProfile, onUploadTest }) {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <LoginGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="space-y-4">
      <TestBuilder onUpload={onUploadTest} />
      <Analysis profile={profile} />
      <MoodHistory profile={profile} />
      <RewardsManager profile={profile} onUpdateProfile={onUpdateProfile} />
    </div>
  );
}
