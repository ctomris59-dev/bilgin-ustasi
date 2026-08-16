import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpeakButton from "./SpeakButton";
import { playPop, playCorrect, playWrong } from "../lib/sound";

export default function TestSolver({ test, isRetryTest = false, resumeState, onFinish, onCancel, onPause }) {
  const [phase, setPhase] = useState(resumeState?.phase || "intro"); // intro | quiz | bonus | done
  const [timedMode, setTimedMode] = useState(resumeState?.timedMode || false);
  const [index, setIndex] = useState(resumeState?.index || 0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState(resumeState?.answers || []); 
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

  // --- 1. AŞAMA: GİRİŞ EKRANI ---
  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 font-['Fredoka',sans-serif]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", bounce: 0.5 }}
          className="sticker-card p-6 md:p-8 bg-[#FFFFFF] text-center max-w-md w-full relative z-10"
        >
          <span className="absolute -top-6 -left-4 text-5xl animate-bob">📚</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#4A2E4B] mb-2 leading-tight">{test.title}</h2>
          
          <div className="bg-[#FFE8EC] p-3 rounded-xl border-2 border-[#4A2E4B] mb-4 inline-block">
            <p className="text-sm font-bold text-[#4A2E4B]/80">
              {test.subject} · {questions.length} soru · {hintsAllowed} ipucu {test.gradeLevel && `· ${test.gradeLevel}`}
            </p>
          </div>

          {isRetryTest && (
            <div className="bg-[#FF70A6] text-white p-3 rounded-xl border-3 border-[#4A2E4B] mb-6 shadow-sm animate-pop">
              <p className="text-sm font-black">⚔️ Rövanş Testi — Daha önce yanlış yaptığın sorular!</p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4 w-full">
            <motion.button 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={() => startTest(false)} 
              className="sticker-btn bg-[#70D6FF] text-[#4A2E4B] py-4 text-lg font-black w-full"
            >
              Normal Modda Başla ✨
            </motion.button>
            
            {test.targetSecondsPerQuestion && (
              <motion.button 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => startTest(true)} 
                className="sticker-btn bg-[#FFD166] text-[#4A2E4B] py-4 text-lg font-black w-full relative overflow-hidden"
              >
                ⏱️ Süreli Mod (Hız Puanı!)
              </motion.button>
            )}
            
            {onCancel && (
              <button 
                onClick={onCancel} 
                className="text-sm font-bold text-[#4A2E4B]/50 hover:text-[#FF70A6] transition-colors py-2 mt-2 w-full"
              >
                Şimdilik Vazgeç
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- 2. AŞAMA: TEST ÇÖZÜMÜ ---
  if (phase === "quiz") {
    return (
      <div className="flex flex-col items-center min-h-[85vh] py-6 px-4 font-['Fredoka',sans-serif]">
        <div className="w-full max-w-2xl flex justify-between items-center mb-6 gap-2">
          <button onClick={handlePause} className="bg-[#FFFFFF] px-4 py-2 rounded-2xl border-3 border-[#4A2E4B] shadow-sm flex items-center gap-2 font-black text-[#4A2E4B] transition-transform hover:scale-105 active:scale-95" aria-label="Duraklat ve Ana Sayfaya dön">
            🏠 <span className="hidden sm:inline">Mola</span>
          </button>
          
          <div className="bg-[#FFFFFF] px-4 py-2 rounded-2xl border-3 border-[#4A2E4B] shadow-sm flex items-center gap-2">
            <span className="font-black text-[#4A2E4B]">Soru {index + 1} / {questions.length}</span>
          </div>

          <button onClick={useHint} disabled={hintsUsed >= hintsAllowed || showHint || selected !== null} className={`bg-[#FFF275] px-4 py-2 rounded-2xl border-3 border-[#4A2E4B] shadow-sm flex items-center gap-2 font-black text-[#4A2E4B] transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100`}>
            💡 <span className="hidden sm:inline">{hintsAllowed - hintsUsed} İpucu</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-2xl"
          >
            <div className="sticker-card p-6 md:p-8 bg-[#FFFFFF] mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              <h2 className="text-xl md:text-2xl font-black text-[#4A2E4B] leading-snug flex-1">
                {q.text}
              </h2>
              <div className="shrink-0 scale-125 origin-top-right">
                <SpeakButton text={`${q.text}. Seçenekler: ${q.options.map((o, i) => `${i + 1}. ${o}`).join(", ")}`} />
              </div>
            </div>

            {showHint && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-[#FFF275] text-[#4A2E4B] p-4 rounded-2xl border-3 border-[#4A2E4B] shadow-sm flex items-start gap-3">
                <span className="text-2xl animate-bob">💡</span>
                <p className="font-bold text-sm">{q.hint}</p>
              </motion.div>
            )}

            <div className="space-y-4">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrectOption = i === q.correctIndex;
                const showCorrect = selected !== null && isCorrectOption;
                const showWrong = selected !== null && isSelected && !isCorrectOption;

                let btnClass = "bg-[#FFFFFF] text-[#4A2E4B] border-[#4A2E4B]/20";
                if (showCorrect) btnClass = "bg-[#52E3C2] text-white border-[#4A2E4B] ring-4 ring-[#52E3C2]/40 z-10 animate-pop shadow-lg";
                else if (showWrong) btnClass = "bg-[#FF70A6] text-white border-[#4A2E4B] ring-4 ring-[#FF70A6]/40 z-10 animate-shake shadow-lg";
                else if (selected !== null) btnClass = "bg-[#FFFFFF] text-[#4A2E4B] border-[#4A2E4B]/10 opacity-40";

                return (
                  <motion.button
                    key={i}
                    disabled={selected !== null}
                    onClick={() => selectAnswer(i)}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.96 } : {}}
                    className={`w-full p-4 flex items-center justify-between text-left rounded-2xl border-3 font-black transition-colors duration-200 relative ${btnClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border-3 border-[#4A2E4B] font-black text-lg ${showCorrect || showWrong ? 'bg-[#4A2E4B] text-white' : 'bg-[#FFE8EC] text-[#4A2E4B]'}`}>
                        {["A", "B", "C", "D"][i]}
                      </span>
                      <span className="text-base md:text-lg leading-tight">{opt}</span>
                    </div>
                    {showCorrect && <motion.span initial={{scale:0}} animate={{scale:1}} className="text-3xl drop-shadow-md">🌟</motion.span>}
                    {showWrong && <motion.span initial={{scale:0}} animate={{scale:1}} className="text-3xl drop-shadow-md">❌</motion.span>}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 min-h-[80px]">
              <AnimatePresence>
                {selected !== null && (
                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="w-full sticker-btn py-4 bg-[#70D6FF] text-[#4A2E4B] text-lg md:text-xl font-black shadow-lg"
                  >
                    {index + 1 < questions.length ? "Sıradaki Soruya Geç ➔" : test.bonusQuestion ? "Sürpriz Bonus Soruya Geç 🎁" : "Testi Bitir & Ödülleri Gör 🎉"}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // --- 3. AŞAMA: BONUS SORU ---
  if (phase === "bonus") {
    const bq = test.bonusQuestion;
    return (
      <div className="flex flex-col items-center min-h-[85vh] py-6 px-4 font-['Fredoka',sans-serif]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl sticker-card p-6 md:p-8 bg-[#FFD166] border-4 border-[#4A2E4B] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePause} className="bg-[#FFFFFF] px-3 py-1.5 rounded-xl border-2 border-[#4A2E4B] font-black text-[#4A2E4B] text-xs transition-transform hover:scale-105 active:scale-95" aria-label="Mola">
              🏠 Mola
            </button>
            <p className="text-xs font-black text-white bg-[#4A2E4B] rounded-full px-4 py-1.5 shadow-sm animate-pulse">✨ SÜRPRİZ BONUS SORU</p>
          </div>

          <div className="flex items-start justify-between gap-2 bg-[#FFFFFF] p-5 rounded-2xl border-3 border-[#4A2E4B] mb-6 shadow-sm">
            <p className="text-xl md:text-2xl font-black text-[#4A2E4B] flex-1">{bq.text}</p>
            <div className="shrink-0 scale-125 origin-top-right">
              <SpeakButton text={`${bq.text}. Seçenekler: ${bq.options.map((o, i) => `${i + 1}. ${o}`).join(", ")}`} />
            </div>
          </div>

          <div className="space-y-4">
            {bq.options.map((opt, i) => {
              const isSelected = bonusAnswer === i;
              const isAnswered = bonusAnswer !== null;
              
              let btnClass = "bg-[#FFFFFF] text-[#4A2E4B] border-[#4A2E4B]/20";
              if (isSelected) btnClass = "bg-[#52E3C2] text-white border-[#4A2E4B] animate-pop shadow-md ring-4 ring-[#52E3C2]/40";
              else if (isAnswered) btnClass = "opacity-40";

              return (
                <motion.button
                  key={i}
                  onClick={() => submitBonus(i)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.96 } : {}}
                  className={`w-full p-4 flex items-center justify-between text-left rounded-2xl border-3 font-black transition-colors duration-200 ${btnClass}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 flex items-center justify-center rounded-xl border-3 border-[#4A2E4B] font-black text-lg ${isSelected ? 'bg-[#4A2E4B] text-white' : 'bg-[#FFE8EC] text-[#4A2E4B]'}`}>
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <span className="text-base md:text-lg">{opt}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {bonusAnswer !== null && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={finishUp}
                className="w-full sticker-btn py-4 mt-8 bg-[#4A2E4B] text-white text-lg md:text-xl font-black shadow-lg"
              >
                Testi Tamamla & Ödülleri Gör 🎉
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return null;
}
