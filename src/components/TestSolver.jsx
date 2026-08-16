import { useState, useEffect, useRef } from "react";
import SpeakButton from "./SpeakButton";
import { playPop, playCorrect, playWrong } from "../lib/sound";

export default function TestSolver({ test, isRetryTest = false, resumeState, onFinish, onCancel, onPause }) {
  const [phase, setPhase] = useState(resumeState?.phase || "intro"); // intro | quiz | bonus | done
  const [timedMode, setTimedMode] = useState(resumeState?.timedMode || false);
  const [index, setIndex] = useState(resumeState?.index || 0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState(resumeState?.answers || []); // { qId, correct, chosenIndex }
  const [hintsUsed, setHintsUsed] = useState(resumeState?.hintsUsed || 0);
  const [showHint, setShowHint] = useState(false);
  const [bonusAnswer, setBonusAnswer] = useState(null);
  const questionStartRef = useRef(null);
  const totalElapsedRef = useRef(resumeState?.elapsedSoFar || 0);

  const questions = test.questions;
  const q = questions[index];
  const hintsAllowed = test.hintsAllowed ?? 2;

  useEffect(() => {
    if (phase === "quiz") questionStartRef.current = Date.now();
  }, [phase, index]);

  function startTest(withTimer) {
    playPop();
    setTimedMode(withTimer);
    setPhase("quiz");
  }

  function selectAnswer(i) {
    if (selected !== null) return;
    setSelected(i);
    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    totalElapsedRef.current += elapsed;
    const isCorrect = i === q.correctIndex;
    if (isCorrect) playCorrect();
    else playWrong();
    setAnswers((prev) => [...prev, { qId: q.id, correct: isCorrect, chosenIndex: i, question: q }]);
  }

  function nextQuestion() {
    playPop();
    setSelected(null);
    setShowHint(false);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else if (test.bonusQuestion) {
      setPhase("bonus");
    } else {
      finishUp();
    }
  }

  function useHint() {
    if (hintsUsed >= hintsAllowed || showHint) return;
    playPop();
    setHintsUsed((h) => h + 1);
    setShowHint(true);
  }

  function submitBonus(i) {
    playPop();
    setBonusAnswer(i);
  }

  function handlePause() {
    playPop();
    onPause({
      test,
      isRetryTest,
      phase,
      timedMode,
      index,
      answers,
      hintsUsed,
      elapsedSoFar: totalElapsedRef.current,
    });
  }

  function finishUp() {
    const correctCount = answers.filter((a) => a.correct).length;
    const totalCount = questions.length;
    const avgSecondsPerQuestion = totalElapsedRef.current / totalCount;
    const wrongQuestions = answers.filter((a) => !a.correct).map((a) => a.question);
    setPhase("done");
    onFinish({
      testId: test.id,
      subject: test.subject,
      correctCount,
      totalCount,
      wrongQuestions,
      avgSecondsPerQuestion,
      targetSecondsPerQuestion: timedMode ? test.targetSecondsPerQuestion : null,
      isRetryTest,
      bonusCorrect: test.bonusQuestion ? bonusAnswer === test.bonusQuestion.correctIndex : null,
    });
  }

  if (phase === "intro") {
    return (
      <div className="sticker-card p-5 space-y-4">
        <h2 className="font-display text-xl">{test.title}</h2>
        <p className="text-sm opacity-70">
          {test.subject} · {questions.length} soru · {hintsAllowed} ipucu jokeri {test.gradeLevel && `· ${test.gradeLevel}`}
        </p>
        {isRetryTest && <p className="text-sm text-coral font-semibold">⚔️ Bu bir Rövanş Testi — daha önce yanlış yaptığın sorular!</p>}
        <div className="flex flex-col gap-2">
          <button onClick={() => startTest(false)} className="sticker-btn bg-violet text-white rounded-full py-3 font-bold">
            Normal Modda Başla
          </button>
          {test.targetSecondsPerQuestion && (
            <button onClick={() => startTest(true)} className="sticker-btn bg-gold text-ink rounded-full py-3 font-bold">
              ⏱️ Süreli Modda Başla (Hız Puanı Kazan!)
            </button>
          )}
          {onCancel && (
            <button onClick={onCancel} className="text-sm opacity-60 py-2">
              Vazgeç
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="sticker-card p-5 space-y-4">
        <div className="flex items-center justify-between text-sm opacity-60">
          <button onClick={handlePause} className="flex items-center gap-1 text-ink font-semibold" aria-label="Duraklat ve Ana Sayfaya dön">
            🏠 <span className="hidden xs:inline">Ana Sayfa</span>
          </button>
          <span>Soru {index + 1} / {questions.length}</span>
          <button onClick={useHint} disabled={hintsUsed >= hintsAllowed || showHint} className="text-violet font-semibold disabled:opacity-30">
            💡 İpucu ({hintsAllowed - hintsUsed})
          </button>
        </div>
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-lg flex-1">{q.text}</p>
          <SpeakButton text={`${q.text}. Seçenekler: ${q.options.map((o, i) => `${i + 1}. ${o}`).join(", ")}`} />
        </div>
        {showHint && <p className="text-sm bg-gold/20 rounded-lg p-2 italic">💡 {q.hint}</p>}
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = "border-ink/15 hover:border-violet/50";
            if (selected !== null) {
              if (i === q.correctIndex) style = "border-teal bg-teal/15";
              else if (i === selected) style = "border-coral bg-coral/15";
              else style = "border-ink/10 opacity-50";
            }
            return (
              <button key={i} onClick={() => selectAnswer(i)} disabled={selected !== null} className={`w-full text-left p-3 rounded-xl border-2 transition ${style}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <button onClick={nextQuestion} className="w-full sticker-btn bg-violet text-white rounded-full py-3 font-bold">
            {index + 1 < questions.length ? "Sonraki Soru →" : test.bonusQuestion ? "Bonus Soru →" : "Testi Bitir"}
          </button>
        )}
      </div>
    );
  }

  if (phase === "bonus") {
    const bq = test.bonusQuestion;
    return (
      <div className="sticker-card p-5 space-y-4 border-2 border-gold">
        <div className="flex items-center justify-between">
          <button onClick={handlePause} className="flex items-center gap-1 text-sm text-ink font-semibold" aria-label="Duraklat ve Ana Sayfaya dön">
            🏠 Ana Sayfa
          </button>
          <p className="text-xs font-bold text-gold-bright bg-ink rounded-full px-3 py-1 inline-block">✨ SÜRPRİZ BONUS SORU</p>
        </div>
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-lg flex-1">{bq.text}</p>
          <SpeakButton text={`${bq.text}. Seçenekler: ${bq.options.map((o, i) => `${i + 1}. ${o}`).join(", ")}`} />
        </div>
        <div className="space-y-2">
          {bq.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => submitBonus(i)}
              disabled={bonusAnswer !== null}
              className={`w-full text-left p-3 rounded-xl border-2 ${
                bonusAnswer === null ? "border-ink/15 hover:border-gold" : i === bonusAnswer ? "border-gold bg-gold/20" : "border-ink/10 opacity-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {bonusAnswer !== null && (
          <button onClick={finishUp} className="w-full sticker-btn bg-gold text-ink rounded-full py-3 font-bold">
            Testi Bitir 🎉
          </button>
        )}
      </div>
    );
  }

  return null;
}
