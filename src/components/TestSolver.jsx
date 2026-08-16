import { useEffect, useMemo, useRef, useState } from "react";
import SpeakButton from "./SpeakButton";
import { playPop, playCorrect, playWrong } from "../lib/sound";

const SUBJECT_META = {
  Matematik: { icon: "△", label: "Sayı Dağları", accent: "#70A1FF" },
  Türkçe: { icon: "♣", label: "Kelime Ormanı", accent: "#52E3C2" },
  Fen: { icon: "◇", label: "Keşif Vadisi", accent: "#65F0D7" },
  "Fen Bilimleri": { icon: "◇", label: "Keşif Vadisi", accent: "#65F0D7" },
  "Sosyal Bilgiler": { icon: "⬡", label: "Zaman Şehri", accent: "#FFD166" },
  İngilizce: { icon: "≈", label: "Dil Limanı", accent: "#70D6FF" },
};
const FALLBACK = { icon: "✦", label: "Bilgi Keşfi", accent: "#A98CFF" };

export default function TestSolver({ test, isRetryTest = false, resumeState, onFinish, onCancel, onPause }) {
  const [phase, setPhase] = useState(resumeState?.phase || "intro");
  const [timedMode, setTimedMode] = useState(resumeState?.timedMode || false);
  const [index, setIndex] = useState(resumeState?.index || 0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState(resumeState?.answers || []);
  const [hintsUsed, setHintsUsed] = useState(resumeState?.hintsUsed || 0);
  const [showHint, setShowHint] = useState(false);
  const [bonusAnswer, setBonusAnswer] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const questionStartRef = useRef(null);
  const totalElapsedRef = useRef(resumeState?.elapsedSoFar || 0);

  const questions = test.questions || [];
  const q = questions[index];
  const hintsAllowed = test.hintsAllowed ?? 2;
  const meta = SUBJECT_META[test.subject] || FALLBACK;
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;
  const correctSoFar = useMemo(() => answers.filter((a) => a.correct).length, [answers]);
  const streak = useMemo(() => {
    let n = 0;
    for (let i = answers.length - 1; i >= 0; i -= 1) { if (!answers[i].correct) break; n += 1; }
    return n;
  }, [answers]);

  useEffect(() => {
    if (phase !== "quiz") return undefined;
    questionStartRef.current = Date.now();
    setElapsedSeconds(0);
    const timer = window.setInterval(() => {
      if (questionStartRef.current) setElapsedSeconds((Date.now() - questionStartRef.current) / 1000);
    }, 200);
    return () => window.clearInterval(timer);
  }, [phase, index]);

  function start(withTimer) { playPop(); setTimedMode(withTimer); setPhase("quiz"); }
  function choose(i) {
    if (selected !== null || !q) return;
    const elapsed = questionStartRef.current ? (Date.now() - questionStartRef.current) / 1000 : 0;
    totalElapsedRef.current += elapsed;
    const correct = i === q.correctIndex;
    setSelected(i);
    setAnswers((prev) => [...prev, { qId: q.id, correct, chosenIndex: i, question: q }]);
    if (correct) { playCorrect(); setFeedback({ type: "correct", title: "Doğru keşif", subtitle: "+12 XP" }); }
    else { playWrong(); setFeedback({ type: "wrong", title: "Yaklaştın", subtitle: "Doğru cevabı şimdi gördün." }); }
    window.setTimeout(() => setFeedback(null), 1300);
  }
  function next() {
    playPop(); setSelected(null); setShowHint(false); setFeedback(null);
    if (index + 1 < questions.length) setIndex((v) => v + 1);
    else if (test.bonusQuestion) setPhase("bonus");
    else finish();
  }
  function hint() {
    if (hintsUsed >= hintsAllowed || showHint || !q?.hint || selected !== null) return;
    playPop(); setHintsUsed((v) => v + 1); setShowHint(true);
  }
  function submitBonus(i) {
    if (bonusAnswer !== null) return;
    setBonusAnswer(i); playPop(); i === test.bonusQuestion.correctIndex ? playCorrect() : playWrong();
  }
  function pause() {
    playPop(); onPause?.({ test, isRetryTest, phase, timedMode, index, answers, hintsUsed, elapsedSoFar: totalElapsedRef.current });
  }
  function finish() {
    const correctCount = answers.filter((a) => a.correct).length;
    const totalCount = questions.length;
    setPhase("done");
    onFinish({
      testId: test.id, subject: test.subject, correctCount, totalCount,
      wrongQuestions: answers.filter((a) => !a.correct).map((a) => a.question),
      avgSecondsPerQuestion: totalCount ? totalElapsedRef.current / totalCount : 0,
      targetSecondsPerQuestion: timedMode ? test.targetSecondsPerQuestion : null,
      isRetryTest,
      bonusCorrect: test.bonusQuestion ? bonusAnswer === test.bonusQuestion.correctIndex : null,
    });
  }

  if (phase === "intro") return (
    <div className="app-shell py-5">
      <div className="mx-auto max-w-xl">
        <div className="mb-4 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl animate-bob" style={{ color: meta.accent, background: `${meta.accent}13`, border: `1px solid ${meta.accent}30` }}>{meta.icon}</div><p className="mt-3 text-[9px] font-black uppercase tracking-[.22em]" style={{ color: meta.accent }}>{meta.label}</p></div>
        <section className="glass-card relative overflow-hidden p-5 sm:p-7" style={{ background: "linear-gradient(145deg,rgba(25,34,72,.88),rgba(8,13,30,.95))" }}>
          <div className="relative z-10"><div className="flex items-center justify-between"><span className="game-chip" style={{ color: meta.accent }}>{isRetryTest ? "Rövanş Görevi" : "Yeni Görev"}</span><span className="text-[10px] font-bold text-[#8793B4]">{test.gradeLevel || "Keşif"}</span></div>
          <h1 className="font-display mt-5 text-2xl font-black leading-tight sm:text-3xl">{test.title}</h1><p className="mt-2 text-sm leading-relaxed text-[#9AA7C7]">Görevi tamamla, bilgini güçlendir ve keşif yolculuğunda ilerle.</p>
          <div className="mt-6 grid grid-cols-3 gap-2"><MiniStat label="Soru" value={questions.length} /><MiniStat label="İpucu" value={hintsAllowed} /><MiniStat label="Ders" value={shortSubject(test.subject)} /></div>
          {isRetryTest && <div className="mt-5 rounded-2xl border border-[#FF789E]/20 bg-[#FF789E]/5 p-3.5"><p className="text-xs font-black text-[#FF8FB0]">↻ Tekrar görevi</p><p className="mt-1 text-[11px] text-[#8793B4]">Daha önce zorlandığın soruları bu kez ustalaştırabilirsin.</p></div>}
          <div className="mt-7 space-y-2.5"><button onClick={() => start(false)} className="sticker-btn w-full py-3.5 text-sm">Göreve Başla →</button>{test.targetSecondsPerQuestion && <button onClick={() => start(true)} className="w-full rounded-2xl border border-white/10 bg-white/[.04] p-3 text-left transition hover:bg-white/[.07]"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFD166]/10 text-[#FFD166]">ϟ</div><div className="flex-1"><p className="text-xs font-black">Hız Görevi</p><p className="mt-0.5 text-[10px] text-[#8793B4]">Soru başına hedef {test.targetSecondsPerQuestion} sn</p></div><span className="text-[#FFD166]">→</span></div></button>}{onCancel && <button onClick={onCancel} className="w-full py-2 text-xs font-bold text-[#687494] hover:text-white">Ana üsse dön</button>}</div></div>
        </section>
      </div>
    </div>
  );

  if (phase === "quiz" && q) {
    const isCorrect = selected !== null && selected === q.correctIndex;
    const target = test.targetSecondsPerQuestion || 40;
    return (
      <div className="app-shell pb-10 pt-2"><div className="mx-auto max-w-2xl">
        <header className="mb-3"><div className="flex items-center gap-3"><button onClick={pause} className="glass-card flex h-10 w-10 items-center justify-center rounded-xl">←</button><div className="min-w-0 flex-1 text-center"><p className="truncate text-[9px] font-black uppercase tracking-[.18em]" style={{ color: meta.accent }}>{meta.label}</p><p className="mt-0.5 truncate text-xs font-black">{test.title}</p></div><div className="game-chip" style={{ color: meta.accent }}>{index + 1}/{questions.length}</div></div><div className="xp-track mt-3"><div className="xp-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${meta.accent},#52E3FF)` }} /></div></header>
        <div className="mb-3 grid grid-cols-3 gap-2"><Hud label="Doğru" value={correctSoFar} color="#52E3C2" /><Hud label="İpucu" value={Math.max(0, hintsAllowed - hintsUsed)} color="#FFD166" /><Hud label="Seri" value={streak} color="#A98CFF" /></div>
        {timedMode && <div className="glass-card mb-3 p-3"><div className="flex justify-between text-[10px]"><span className="font-black">Hız Görevi · {elapsedSeconds.toFixed(1)} sn</span><span className="text-[#8793B4]">Hedef ≤ {target} sn</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100,(elapsedSeconds/target)*100)}%`, background: elapsedSeconds <= target ? "linear-gradient(90deg,#52E3C2,#52E3FF)" : "linear-gradient(90deg,#FFD166,#FF647F)" }} /></div></div>}
        <section className={`glass-card relative overflow-hidden p-5 sm:p-7 ${selected !== null && !isCorrect ? "animate-shake" : ""}`} style={{ background: "linear-gradient(145deg,rgba(22,31,64,.91),rgba(8,14,31,.95))" }}>
          <div className="flex items-center justify-between gap-3"><span className="game-chip" style={{ color: meta.accent }}>Soru {index + 1}</span><div className="flex items-center gap-2">{q.hint && <button onClick={hint} disabled={hintsUsed >= hintsAllowed || showHint || selected !== null} className="game-chip text-[#FFD166] disabled:opacity-30">✦ İpucu</button>}<SpeakButton text={`${q.text}. Seçenekler: ${q.options.map((o,i)=>`${i+1}. ${o}`).join(", ")}`} /></div></div>
          <h2 className="font-display mt-5 text-lg font-black leading-[1.55] sm:text-xl">{q.text}</h2>
          {showHint && <div className="animate-pop mt-4 rounded-2xl border border-[#FFD166]/20 bg-[#FFD166]/5 p-3.5"><p className="text-[9px] font-black uppercase tracking-[.15em] text-[#FFD166]">Keşif İpucu</p><p className="mt-1 text-xs leading-relaxed text-[#D7DCEE]">{q.hint}</p></div>}
          <div className="mt-6 space-y-2.5">{q.options.map((opt,i)=>{
            const correctOpt = selected !== null && i === q.correctIndex;
            const wrongSelected = selected !== null && i === selected && i !== q.correctIndex;
            const inactive = selected !== null && !correctOpt && !wrongSelected;
            return <button key={i} onClick={()=>choose(i)} disabled={selected !== null} className="group w-full rounded-2xl border p-3.5 text-left transition duration-300 hover:-translate-y-0.5" style={{ background: correctOpt ? "rgba(82,227,194,.13)" : wrongSelected ? "rgba(255,100,127,.11)" : "rgba(255,255,255,.035)", borderColor: correctOpt ? "rgba(82,227,194,.45)" : wrongSelected ? "rgba(255,100,127,.45)" : "rgba(255,255,255,.09)", opacity: inactive ? .42 : 1 }}><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black" style={{ color: correctOpt ? "#52E3C2" : wrongSelected ? "#FF7A94" : "#C5CEE7", background: "rgba(255,255,255,.055)" }}>{correctOpt ? "✓" : wrongSelected ? "×" : String.fromCharCode(65+i)}</div><span className="flex-1 text-sm font-bold leading-relaxed">{opt}</span></div></button>;
          })}</div>
          {selected !== null && <div className="animate-pop mt-5 rounded-2xl border p-4" style={{ background: isCorrect ? "rgba(82,227,194,.06)" : "rgba(255,100,127,.05)", borderColor: isCorrect ? "rgba(82,227,194,.18)" : "rgba(255,100,127,.16)" }}><p className="text-sm font-black" style={{ color: isCorrect ? "#72E9B2" : "#FFA0B2" }}>{isCorrect ? "Doğru keşif!" : "Bu kez olmadı."}</p><p className="mt-1 text-[11px] text-[#8793B4]">{isCorrect ? "Bilgi puanın yükseliyor." : "Doğru cevap işaretlendi; Tekrar Merkezi’nde yeniden karşılaşabilirsin."}</p></div>}
          {selected !== null && <button onClick={next} className="sticker-btn mt-4 w-full py-3.5 text-sm">{index + 1 < questions.length ? "Macereye Devam Et" : test.bonusQuestion ? "Bonus Keşfe Geç" : "Görevi Tamamla"} →</button>}
        </section>
      </div>{feedback && <Feedback feedback={feedback} color={feedback.type === "correct" ? "#52E3C2" : "#FF7893"} />}</div>
    );
  }

  if (phase === "bonus") {
    const b = test.bonusQuestion; const correct = bonusAnswer === b.correctIndex;
    return <div className="app-shell py-5"><div className="mx-auto max-w-2xl"><div className="mb-4 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FFD166]/20 bg-[#FFD166]/10 text-2xl text-[#FFD166] animate-pulse-glow">✦</div><p className="mt-3 text-[9px] font-black uppercase tracking-[.22em] text-[#FFD166]">Gizli Keşif</p><h2 className="font-display mt-1 text-xl font-black">Bonus Soru</h2></div><section className="glass-card p-5 sm:p-7"><div className="flex gap-3"><h3 className="font-display flex-1 text-lg font-black leading-relaxed">{b.text}</h3><SpeakButton text={b.text} /></div><div className="mt-6 space-y-2.5">{b.options.map((o,i)=><button key={i} disabled={bonusAnswer !== null} onClick={()=>submitBonus(i)} className="w-full rounded-2xl border border-white/10 bg-white/[.035] p-3.5 text-left text-sm font-bold transition hover:bg-white/[.07]" style={bonusAnswer !== null && i === b.correctIndex ? { borderColor:"rgba(82,227,194,.45)", background:"rgba(82,227,194,.11)" } : bonusAnswer === i ? { borderColor:"rgba(255,100,127,.45)", background:"rgba(255,100,127,.09)" } : {}}>{String.fromCharCode(65+i)} · {o}</button>)}</div>{bonusAnswer !== null && <><div className="animate-pop mt-5 rounded-2xl border border-white/10 p-3.5 text-center text-sm font-black" style={{ color: correct ? "#52E3C2" : "#FF8AA0" }}>{correct ? "Bonus keşif tamamlandı! +10 Coin" : "Bonus kaçtı ama ana görev tamamlandı."}</div><button onClick={finish} className="sticker-btn btn-gold mt-4 w-full py-3.5 text-sm">Görev Sonucunu Gör →</button></>}</section></div></div>;
  }
  return null;
}

function MiniStat({ label, value }) { return <div className="rounded-2xl border border-white/[.07] bg-white/[.035] p-3 text-center"><p className="text-base font-black">{value}</p><p className="mt-1 text-[8px] font-black uppercase tracking-[.14em] text-[#687494]">{label}</p></div>; }
function Hud({ label, value, color }) { return <div className="glass-card flex items-center justify-center gap-2 p-2.5"><span className="text-xs font-black" style={{ color }}>◆</span><div><p className="text-xs font-black">{value}</p><p className="text-[7px] font-black uppercase tracking-wider text-[#687494]">{label}</p></div></div>; }
function Feedback({ feedback, color }) { return <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"><div className="absolute h-[2px] w-40 rotate-[-28deg] animate-pop" style={{ background:`linear-gradient(90deg,transparent,${color},#fff,transparent)`, boxShadow:`0 0 18px ${color}` }} /><div className="animate-pop rounded-2xl border bg-[#070b1de8] px-6 py-4 text-center backdrop-blur-xl" style={{ borderColor:`${color}55`, boxShadow:`0 18px 70px rgba(0,0,0,.38),0 0 36px ${color}20` }}><p className="font-display text-lg font-black" style={{ color }}>{feedback.title}</p><p className="mt-1 text-xs font-black">{feedback.subtitle}</p></div></div>; }
function shortSubject(subject) { if (subject === "Fen Bilimleri") return "Fen"; if (subject === "Sosyal Bilgiler") return "Sosyal"; return subject || "Ders"; }
