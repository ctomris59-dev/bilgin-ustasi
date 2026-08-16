import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpeakButton from "./SpeakButton";
import { playPop, playCorrect, playWrong } from "../lib/sound";

export default function TestSolver({ test, isRetryTest = false, resumeState, onFinish, onCancel, onPause }) {
  const [phase, setPhase] = useState(resumeState?.phase || "intro");
  const [timedMode, setTimedMode] = useState(resumeState?.timedMode || false);
  const [index, setIndex] = useState(resumeState?.index || 0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState(resumeState?.answers || []); 
  const [hintsUsed, setHintsUsed] = useState(resumeState?.hintsUsed || 0);
  const [showHint, setShowHint] = useState(false);
  const [bonusAnswer, setBonusAnswer] = useState(null);
  
  const questionStartRef = useRef(null);
  const totalElapsedRef = useRef(resumeState?.elapsedSoFar || 0);

  const questions = test?.questions || [];
  const q = questions[index];
  const hintsAllowed = test?.hintsAllowed ?? 2;

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
    const elapsed = (Date.now() - (questionStartRef.current || Date.now())) / 1000;
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
    const avgSecondsPerQuestion = totalElapsedRef.current / (totalCount || 1);
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

  // --- 1. GİRİŞ EKRANI (AÇILIŞ) ---
  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 font-['Fredoka',sans-serif]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", bounce: 0.4 }}
          className="sticker-card p-6 md:p-8 text-center max-w-md w-full relative z-10"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <span className="absolute -top-6 -left-4 text-5xl animate-bob">📚</span>
          <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight" style={{ color: "#4A2E4B" }}>
            {test.title}
          </h2>
          
          <div className="p-3 rounded-xl border-2 mb-4 inline-block" style={{ backgroundColor: "#FFE8EC", borderColor: "#4A2E4B" }}>
            <p className="text-sm font-bold" style={{ color: "#4A2E4B" }}>
              {test.subject} · {questions.length} soru · {hintsAllowed} ipucu joker {test.gradeLevel && `· ${test.gradeLevel}`}
            </p>
          </div>

          {isRetryTest && (
            <div className="p-3 rounded-xl border-3 mb-6 shadow-sm animate-pop" style={{ backgroundColor: "#FF70A6", borderColor: "#4A2E4B", color: "#FFFFFF" }}>
              <p className="text-sm font-black">⚔️ Rövanş Testi — Daha önce yanlış yaptığın sorular!</p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4 w-full">
            {/* Üstteki "Normal Modda Başla" Butonu - Mor renkli ve beyaz yazılı */}
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.96 }} 
              onClick={() => startTest(false)} 
              className="sticker-btn py-4 text-lg font-black w-full"
              style={{ backgroundColor: "#8C6FFF", color: "#FFFFFF", borderColor: "#4A2E4B" }}
            >
              ✨ Normal Modda Başla ✨
            </motion.button>
            
            {/* Süreli Mod Butonu */}
            {test.targetSecondsPerQuestion && (
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }} 
                onClick={() => startTest(true)} 
                className="sticker-btn py-4 text-lg font-black w-full"
                style={{ backgroundColor: "#FFD166", color: "#4A2E4B", borderColor: "#4A2E4B" }}
              >
                ⏱️ Süreli Modda Başla (Hız Puanı Kazan!)
              </motion.button>
            )}
            
            {onCancel && (
              <button 
                onClick={onCancel} 
                className="text-sm font-bold transition-colors py-2 mt-2 w-full"
                style={{ color: "#4A2E4B", opacity: 0.6 }}
              >
                Vazgeç
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- 2. SOUR ÇÖZÜM EKRANI ---
  if (phase === "quiz") {
    return (
      <div className="flex flex-col items-center min-h-[85vh] py-6 px-4 font-['Fredoka',sans-serif]">
        <div className="w-full max-w-2xl flex justify-between items-center mb-6 gap-2">
          <button 
            onClick={handlePause} 
            className="px-4 py-2 rounded-2xl border-3 shadow-sm flex items-center gap-2 font-black transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#FFFFFF", color: "#4A2E4B", borderColor: "#4A2E4B" }}
          >
            🏠 <span className="hidden sm:inline">Mola</span>
          </button>
          
          <div className="px-4 py-2 rounded-2xl border-3 shadow-sm flex items-center gap-2" style={{ backgroundColor: "#FFFFFF", color: "#4A2E4B", borderColor: "#4A2E4B" }}>
            <span className="font-black">Soru {index + 1} / {questions.length}</span>
          </div>

          <button 
            onClick={useHint} 
            disabled={hintsUsed >= hintsAllowed || showHint || selected !== null} 
            className="px-4 py-2 rounded-2xl border-3 shadow-sm flex items-center gap-2 font-black transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: "#FFF275", color: "#4A2E4B", borderColor: "#4A2E4B" }}
          >
            💡 <span className="hidden sm:inline">{hintsAllowed - hintsUsed} İpucu</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-2xl"
          >
            <div className="sticker-card p-6 md:p-8 mb-6 flex flex-col sm:flex-row items-start justify-between gap-4" style={{ backgroundColor: "#FFFFFF" }}>
              <h2 className="text-xl md:text-2xl font-black leading-snug flex-1" style={{ color: "#4A2E4B" }}>
                {q.text}
              </h2>
              <div className="shrink-0 scale-125 origin-top-right">
                <SpeakButton text={`${q.text}. Seçenekler: ${q.options.map((o, i) => `${i + 1}. ${o}`).join(", ")}`} />
              </div>
            </div>

            {showHint && (
              <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl border-3 shadow-sm flex items-start gap-3" style={{ backgroundColor: "#FFF275", color: "#4A2E4B", borderColor: "#4A2E4B" }}>
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

                let bg = "#FFFFFF";
                let text = "#4A2E4B";
                let border = "rgba(74, 46, 75, 0.2)";

                if (showCorrect) { bg = "#52E3C2"; text = "#FFFFFF"; border = "#4A2E4B"; }
                else if (showWrong) { bg = "#FF70A6"; text = "#FFFFFF"; border = "#4A2E4B"; }
                else if (selected !== null) { bg = "#FFFFFF"; text = "#4A2E4B"; border = "rgba(74, 46, 75, 0.1)"; }

                return (
                  <motion.button
                    key={i}
                    disabled={selected !== null}
                    onClick={() => selectAnswer(i)}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.96 } : {}}
                    className="w-full p-4 flex items-center justify-between text-left rounded-2xl border-3 font-black transition-colors duration-200 relative shadow-sm"
                    style={{ backgroundColor: bg, color: text, borderColor: border, opacity: (selected !== null && !showCorrect && !showWrong) ? 0.4 : 1 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border-3 font-black text-lg" style={{ backgroundColor: (showCorrect || showWrong) ? "#4A2E4B" : "#FFE8EC", color: (showCorrect || showWrong) ? "#FFFFFF" : "#4A2E4B", borderColor: "#4A2E4B" }}>
                        {["A", "B", "C", "D"][i]}
                      </span>
                      <span className="text-base md:text-lg leading-tight">{opt}</span>
                    </div>
                    {showCorrect && <motion.span initial={{scale:0}} animate={{scale:1}} className="text-3xl">🌟</motion.span>}
                    {showWrong && <motion.span initial={{scale:0}} animate={{scale:1}} className="text-3xl">❌</motion.span>}
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
                    className="sticker-btn py-4 text-lg md:text-xl font-black shadow-lg w-full"
                    style={{ backgroundColor: "#8C6FFF", color: "#FFFFFF", borderColor: "#4A2E4B" }}
                  >
                    {index + 1 < questions.length ? "Sonraki Soru →" : test.bonusQuestion ? "Bonus Soru →" : "Testi Bitir 🎉"}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // --- 3. BONUS SORU EKRANI ---
  if (phase === "bonus") {
    const bq = test.bonusQuestion;
    return (
      <div className="flex flex-col items-center min-h-[85vh] py-6 px-4 font-['Fredoka',sans-serif]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl sticker-card p-6 md:p-8 border-4 shadow-xl" style={{ backgroundColor: "#FFD166", borderColor: "#4A2E4B" }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePause} className="px-3 py-1.5 rounded-xl border-2 font-black text-xs" style={{ backgroundColor: "#FFFFFF", color: "#4A2E4B", borderColor: "#4A2E4B" }}>
              🏠 Mola
            </button>
            <p className="text-xs font-black text-white rounded-full px-4 py-1.5 shadow-sm animate-pulse" style={{ backgroundColor: "#4A2E4B" }}>✨ SÜRPRİZ BONUS SORU</p>
          </div>

          <div className="flex items-start justify-between gap-2 p-5 rounded-2xl border-3 mb-6 shadow-sm" style={{ backgroundColor: "#FFFFFF", borderColor: "#4A2E4B" }}>
            <p className="text-xl md:text-2xl font-black flex-1" style={{ color: "#4A2E4B" }}>{bq.text}</p>
            <div className="shrink-0 scale-125 origin-top-right">
              <SpeakButton text={`${bq.text}. Seçenekler: ${bq.options.map((o, i) => `${i + 1}. ${o}`).join(", ")}`} />
            </div>
          </div>

          <div className="space-y-4">
            {bq.options.map((opt, i) => {
              const isSelected = bonusAnswer === i;
              const isAnswered = bonusAnswer !== null;
              
              let bg = "#FFFFFF";
              let text = "#4A2E4B";
              if (isSelected) { bg = "#52E3C2"; text = "#FFFFFF"; }

              return (
                <motion.button
                  key={i}
                  onClick={() => submitBonus(i)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.96 } : {}}
                  className="w-full p-4 flex items-center justify-between text-left rounded-2xl border-3 font-black transition-colors duration-200 shadow-sm"
                  style={{ backgroundColor: bg, color: text, borderColor: "#4A2E4B", opacity: (isAnswered && !isSelected) ? 0.4 : 1 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 flex items-center justify-center rounded-xl border-3 font-black text-lg" style={{ backgroundColor: isSelected ? "#4A2E4B" : "#FFE8EC", color: isSelected ? "#FFFFFF" : "#4A2E4B", borderColor: "#4A2E4B" }}>
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
                className="sticker-btn py-4 mt-8 text-lg md:text-xl font-black shadow-lg w-full"
                style={{ backgroundColor: "#4A2E4B", color: "#FFFFFF", borderColor: "#4A2E4B" }}
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
