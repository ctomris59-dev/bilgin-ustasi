import { useEffect, useMemo, useRef, useState } from "react";
import SpeakButton from "./SpeakButton";
import { playPop, playCorrect, playWrong } from "../lib/sound";

const SUBJECT_META = {
  Matematik: {
    icon: "◆",
    label: "Sayı Dağları",
    accent: "#70A1FF",
    accentSoft: "rgba(112,161,255,.14)",
  },
  Türkçe: {
    icon: "✦",
    label: "Kelime Ormanı",
    accent: "#FF78AA",
    accentSoft: "rgba(255,120,170,.14)",
  },
  Fen: {
    icon: "◇",
    label: "Keşif Vadisi",
    accent: "#52E3C2",
    accentSoft: "rgba(82,227,194,.14)",
  },
  "Fen Bilimleri": {
    icon: "◇",
    label: "Keşif Vadisi",
    accent: "#52E3C2",
    accentSoft: "rgba(82,227,194,.14)",
  },
  "Sosyal Bilgiler": {
    icon: "⬡",
    label: "Zaman Şehri",
    accent: "#FFD166",
    accentSoft: "rgba(255,209,102,.14)",
  },
  İngilizce: {
    icon: "◎",
    label: "Dil Limanı",
    accent: "#A98CFF",
    accentSoft: "rgba(169,140,255,.14)",
  },
};

const FALLBACK_META = {
  icon: "✦",
  label: "Bilgi Keşfi",
  accent: "#8B6CFF",
  accentSoft: "rgba(139,108,255,.14)",
};

export default function TestSolver({
  test,
  isRetryTest = false,
  resumeState,
  onFinish,
  onCancel,
  onPause,
}) {
  const [phase, setPhase] = useState(resumeState?.phase || "intro");
  const [timedMode, setTimedMode] = useState(
    resumeState?.timedMode || false
  );

  const [index, setIndex] = useState(resumeState?.index || 0);
  const [selected, setSelected] = useState(null);

  const [answers, setAnswers] = useState(
    resumeState?.answers || []
  );

  const [hintsUsed, setHintsUsed] = useState(
    resumeState?.hintsUsed || 0
  );

  const [showHint, setShowHint] = useState(false);

  const [bonusAnswer, setBonusAnswer] = useState(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [feedback, setFeedback] = useState(null);

  const questionStartRef = useRef(null);

  const totalElapsedRef = useRef(
    resumeState?.elapsedSoFar || 0
  );

  const questions = test.questions || [];

  const q = questions[index];

  const hintsAllowed = test.hintsAllowed ?? 2;

  const subjectMeta =
    SUBJECT_META[test.subject] || FALLBACK_META;

  const questionProgress =
    questions.length > 0
      ? ((index + 1) / questions.length) * 100
      : 0;

  const correctSoFar = useMemo(
    () => answers.filter((answer) => answer.correct).length,
    [answers]
  );

  const currentStreak = useMemo(() => {
    let streak = 0;

    for (let i = answers.length - 1; i >= 0; i -= 1) {
      if (!answers[i].correct) break;
      streak += 1;
    }

    return streak;
  }, [answers]);

  useEffect(() => {
    if (phase !== "quiz") return;

    questionStartRef.current = Date.now();
    setElapsedSeconds(0);

    const timer = window.setInterval(() => {
      if (!questionStartRef.current) return;

      const elapsed =
        (Date.now() - questionStartRef.current) / 1000;

      setElapsedSeconds(elapsed);
    }, 200);

    return () => window.clearInterval(timer);
  }, [phase, index]);

  function startTest(withTimer) {
    playPop();

    setTimedMode(withTimer);
    setPhase("quiz");
  }

  function selectAnswer(i) {
    if (selected !== null || !q) return;

    setSelected(i);

    const elapsed = questionStartRef.current
      ? (Date.now() - questionStartRef.current) / 1000
      : 0;

    totalElapsedRef.current += elapsed;

    const isCorrect = i === q.correctIndex;

    if (isCorrect) {
      playCorrect();

      setFeedback({
        type: "correct",
        title: "Harika!",
        subtitle: "+12 XP",
      });
    } else {
      playWrong();

      setFeedback({
        type: "wrong",
        title: "Yaklaştın",
        subtitle: "Doğru cevabı keşfettin.",
      });
    }

    setAnswers((prev) => [
      ...prev,
      {
        qId: q.id,
        correct: isCorrect,
        chosenIndex: i,
        question: q,
      },
    ]);

    window.setTimeout(() => {
      setFeedback(null);
    }, 1600);
  }

  function nextQuestion() {
    playPop();

    setSelected(null);
    setShowHint(false);
    setFeedback(null);

    if (index + 1 < questions.length) {
      setIndex((value) => value + 1);
      return;
    }

    if (test.bonusQuestion) {
      setPhase("bonus");
      return;
    }

    finishUp();
  }

  function useHint() {
    if (
      hintsUsed >= hintsAllowed ||
      showHint ||
      !q?.hint
    ) {
      return;
    }

    playPop();

    setHintsUsed((value) => value + 1);
    setShowHint(true);
  }

  function submitBonus(i) {
    if (bonusAnswer !== null) return;

    playPop();

    setBonusAnswer(i);

    if (i === test.bonusQuestion.correctIndex) {
      playCorrect();
    } else {
      playWrong();
    }
  }

  function handlePause() {
    playPop();

    onPause?.({
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
    const correctCount =
      answers.filter((answer) => answer.correct).length;

    const totalCount = questions.length;

    const avgSecondsPerQuestion =
      totalCount > 0
        ? totalElapsedRef.current / totalCount
        : 0;

    const wrongQuestions = answers
      .filter((answer) => !answer.correct)
      .map((answer) => answer.question);

    setPhase("done");

    onFinish({
      testId: test.id,
      subject: test.subject,
      correctCount,
      totalCount,
      wrongQuestions,
      avgSecondsPerQuestion,
      targetSecondsPerQuestion: timedMode
        ? test.targetSecondsPerQuestion
        : null,
      isRetryTest,
      bonusCorrect: test.bonusQuestion
        ? bonusAnswer ===
          test.bonusQuestion.correctIndex
        : null,
    });
  }

  /* ========================================================
     INTRO
  ======================================================== */

  if (phase === "intro") {
    return (
      <div className="app-shell relative min-h-[75vh] py-4">

        {/* atmosphere */}

        <div
          className="magic-particle"
          style={{
            left: "9%",
            top: "18%",
          }}
        />

        <div
          className="magic-particle"
          style={{
            left: "88%",
            top: "24%",
            animationDelay: "1.2s",
          }}
        />

        <div
          className="magic-particle"
          style={{
            left: "74%",
            top: "72%",
            animationDelay: "2.4s",
          }}
        />

        <div className="mx-auto max-w-xl">

          {/* small location */}

          <div className="mb-4 text-center">

            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl animate-bob"
              style={{
                background: subjectMeta.accentSoft,
                border: `1px solid ${subjectMeta.accent}30`,
                boxShadow: `0 0 32px ${subjectMeta.accent}18`,
              }}
            >
              {subjectMeta.icon}
            </div>

            <p
              className="mt-3 text-[10px] font-black uppercase tracking-[0.22em]"
              style={{
                color: subjectMeta.accent,
              }}
            >
              {subjectMeta.label}
            </p>

          </div>


          {/* mission card */}

          <section
            className="glass-card relative overflow-hidden p-5 sm:p-7"
            style={{
              background:
                "linear-gradient(145deg, rgba(25,34,72,.86), rgba(8,13,30,.94))",
            }}
          >

            <div
              className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full blur-3xl"
              style={{
                background: subjectMeta.accent,
                opacity: 0.12,
              }}
            />

            <div
              className="pointer-events-none absolute -bottom-28 -left-24 h-60 w-60 rounded-full blur-3xl"
              style={{
                background: "#52E3FF",
                opacity: 0.06,
              }}
            />

            <div className="relative z-10">

              <div className="flex items-center justify-between">

                <span
                  className="rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em]"
                  style={{
                    color: subjectMeta.accent,
                    background: subjectMeta.accentSoft,
                  }}
                >
                  {isRetryTest
                    ? "Rövanş Görevi"
                    : "Yeni Görev"}
                </span>

                {test.gradeLevel && (
                  <span className="text-[10px] font-bold text-[#8793B4]">
                    {test.gradeLevel}
                  </span>
                )}

              </div>


              <h1
                className="mt-5 text-2xl font-black leading-tight text-white sm:text-3xl"
                style={{
                  fontFamily: "var(--font-display)",
                }}
              >
                {test.title}
              </h1>


              <p className="mt-2 text-sm font-medium leading-relaxed text-[#9AA7C7]">
                Görevi tamamla, bilgini güçlendir ve
                keşif yolculuğunda ilerle.
              </p>


              {/* mission info */}

              <div className="mt-6 grid grid-cols-3 gap-2">

                <MissionStat
                  label="SORU"
                  value={questions.length}
                  icon="◇"
                />

                <MissionStat
                  label="İPUCU"
                  value={hintsAllowed}
                  icon="✦"
                />

                <MissionStat
                  label="DERS"
                  value={shortSubject(test.subject)}
                  icon="◆"
                  compact
                />

              </div>


              {isRetryTest && (
                <div
                  className="mt-5 rounded-2xl border p-3.5"
                  style={{
                    background:
                      "rgba(255,112,166,.07)",
                    borderColor:
                      "rgba(255,112,166,.18)",
                  }}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "rgba(255,112,166,.12)",
                      }}
                    >
                      ⚔
                    </div>

                    <div>

                      <p className="text-xs font-black text-[#FF8BB6]">
                        Tekrar görevi
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-[#8793B4]">
                        Daha önce zorlandığın soruları
                        şimdi ustalaştırabilirsin.
                      </p>

                    </div>

                  </div>

                </div>
              )}


              {/* modes */}

              <div className="mt-7 space-y-2.5">

                <button
                  onClick={() => startTest(false)}
                  className="sticker-btn w-full py-3.5 text-sm font-black"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Göreve Başla</span>
                    <span>→</span>
                  </span>
                </button>


                {test.targetSecondsPerQuestion && (
                  <button
                    onClick={() => startTest(true)}
                    className="group w-full rounded-[15px] border border-white/10 bg-white/[0.045] px-4 py-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#FFD166]/30 hover:bg-white/[0.07]"
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{
                          background:
                            "rgba(255,209,102,.1)",
                        }}
                      >
                        ⏱
                      </div>

                      <div className="flex-1">

                        <p className="text-xs font-black text-white">
                          Hız Görevi
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium text-[#8793B4]">
                          Soru başına hedef{" "}
                          {test.targetSecondsPerQuestion} sn
                        </p>

                      </div>

                      <span className="text-[#FFD166] transition-transform group-hover:translate-x-1">
                        →
                      </span>

                    </div>

                  </button>
                )}


                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="w-full py-2 text-xs font-bold text-[#687494] transition-colors hover:text-[#C5CEE7]"
                  >
                    Ana üsse dön
                  </button>
                )}

              </div>

            </div>

          </section>

        </div>

      </div>
    );
  }

  /* ========================================================
     QUIZ
  ======================================================== */

  if (phase === "quiz" && q) {
    const selectedIsCorrect =
      selected !== null &&
      selected === q.correctIndex;

    const targetSeconds =
      test.targetSecondsPerQuestion || 40;

    const timeProgress = Math.min(
      100,
      (elapsedSeconds / targetSeconds) * 100
    );

    return (
      <div className="app-shell relative min-h-[80vh] pb-10 pt-2">

        {/* ambience */}

        <div
          className="magic-particle"
          style={{
            left: "5%",
            top: "30%",
          }}
        />

        <div
          className="magic-particle"
          style={{
            right: "7%",
            top: "17%",
            animationDelay: "1.4s",
          }}
        />


        <div className="mx-auto max-w-2xl">

          {/* top game HUD */}

          <header className="mb-3">

            <div className="flex items-center justify-between gap-3">

              <button
                onClick={handlePause}
                className="glass-card flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm transition hover:-translate-y-0.5"
                aria-label="Duraklat ve ana sayfaya dön"
              >
                ←
              </button>


              <div className="min-w-0 flex-1 text-center">

                <p
                  className="truncate text-[9px] font-black uppercase tracking-[0.18em]"
                  style={{
                    color: subjectMeta.accent,
                  }}
                >
                  {subjectMeta.label}
                </p>

                <p className="mt-0.5 truncate text-xs font-black text-white">
                  {test.title}
                </p>

              </div>


              <div
                className="glass-card flex h-10 min-w-[52px] items-center justify-center rounded-xl px-2 text-[11px] font-black"
                style={{
                  color: subjectMeta.accent,
                }}
              >
                {index + 1}/{questions.length}
              </div>

            </div>


            {/* global mission progress */}

            <div className="mt-3">

              <div className="xp-track">

                <div
                  className="xp-fill"
                  style={{
                    width: `${questionProgress}%`,
                    background: `linear-gradient(90deg, ${subjectMeta.accent}, #52E3FF)`,
                  }}
                />

              </div>

            </div>

          </header>


          {/* mini HUD */}

          <div className="mb-3 grid grid-cols-3 gap-2">

            <HUDStat
              icon="✓"
              value={correctSoFar}
              label="Doğru"
              color="#52E3C2"
            />

            <HUDStat
              icon="✦"
              value={Math.max(
                0,
                hintsAllowed - hintsUsed
              )}
              label="İpucu"
              color="#FFD166"
            />

            <HUDStat
              icon="⚡"
              value={currentStreak}
              label="Seri"
              color="#A98CFF"
            />

          </div>


          {/* timed mode */}

          {timedMode && (
            <div className="glass-card mb-3 p-3">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8793B4]">
                    Hız Görevi
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-white">
                    {elapsedSeconds.toFixed(1)} sn
                  </p>

                </div>


                <span className="text-[10px] font-bold text-[#8793B4]">
                  Hedef ≤ {targetSeconds} sn
                </span>

              </div>


              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                <div
                  className="h-full rounded-full transition-[width] duration-200"
                  style={{
                    width: `${timeProgress}%`,
                    background:
                      timeProgress < 75
                        ? "linear-gradient(90deg,#52E3C2,#52E3FF)"
                        : timeProgress < 100
                        ? "linear-gradient(90deg,#FFD166,#FF9D66)"
                        : "linear-gradient(90deg,#FF647F,#FF70A6)",
                  }}
                />

              </div>

            </div>
          )}


          {/* question card */}

          <section
            className={`glass-card relative overflow-hidden p-5 sm:p-7 ${
              selected !== null &&
              !selectedIsCorrect
                ? "animate-shake"
                : ""
            }`}
            style={{
              background:
                "linear-gradient(145deg, rgba(22,31,64,.9), rgba(8,14,31,.94))",
            }}
          >

            {/* ambient subject glow */}

            <div
              className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full blur-3xl"
              style={{
                background: subjectMeta.accent,
                opacity: 0.08,
              }}
            />


            {/* question label */}

            <div className="relative z-10 flex items-center justify-between gap-3">

              <span
                className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: subjectMeta.accent,
                  background: subjectMeta.accentSoft,
                }}
              >
                Soru {index + 1}
              </span>


              <div className="flex items-center gap-2">

                {q.hint && (
                  <button
                    onClick={useHint}
                    disabled={
                      hintsUsed >= hintsAllowed ||
                      showHint ||
                      selected !== null
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[10px] font-black text-[#FFD166] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ✦ İpucu
                  </button>
                )}

                <SpeakButton
                  text={`${q.text}. Seçenekler: ${q.options
                    .map(
                      (option, optionIndex) =>
                        `${optionIndex + 1}. ${option}`
                    )
                    .join(", ")}`}
                />

              </div>

            </div>


            {/* question */}

            <h2
              className="relative z-10 mt-5 text-lg font-black leading-[1.55] text-white sm:text-xl"
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              {q.text}
            </h2>


            {/* hint */}

            {showHint && (
              <div
                className="animate-pop relative z-10 mt-4 rounded-2xl border p-3.5"
                style={{
                  background:
                    "rgba(255,209,102,.07)",
                  borderColor:
                    "rgba(255,209,102,.18)",
                }}
              >

                <div className="flex items-start gap-2.5">

                  <div className="mt-0.5 text-sm">
                    ✦
                  </div>

                  <div>

                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#FFD166]">
                      Keşif İpucu
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-relaxed text-[#D7DCEE]">
                      {q.hint}
                    </p>

                  </div>

                </div>

              </div>
            )}


            {/* answers */}

            <div className="relative z-10 mt-6 space-y-2.5">

              {q.options.map((opt, i) => {

                const optionLetter =
                  String.fromCharCode(65 + i);

                const isCorrectOption =
                  selected !== null &&
                  i === q.correctIndex;

                const isWrongSelected =
                  selected !== null &&
                  i === selected &&
                  i !== q.correctIndex;

                const isInactive =
                  selected !== null &&
                  !isCorrectOption &&
                  !isWrongSelected;

                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    disabled={selected !== null}
                    className={`group relative w-full overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                      selected === null
                        ? "hover:-translate-y-0.5 hover:bg-white/[0.075]"
                        : ""
                    }`}
                    style={{
                      background: isCorrectOption
                        ? "linear-gradient(135deg, rgba(82,227,194,.17), rgba(82,227,194,.07))"
                        : isWrongSelected
                        ? "linear-gradient(135deg, rgba(255,100,127,.16), rgba(255,100,127,.06))"
                        : "rgba(255,255,255,.035)",

                      borderColor: isCorrectOption
                        ? "rgba(82,227,194,.52)"
                        : isWrongSelected
                        ? "rgba(255,100,127,.52)"
                        : selected === null
                        ? "rgba(255,255,255,.10)"
                        : "rgba(255,255,255,.05)",

                      opacity: isInactive
                        ? 0.42
                        : 1,

                      boxShadow: isCorrectOption
                        ? "0 0 28px rgba(82,227,194,.10)"
                        : isWrongSelected
                        ? "0 0 22px rgba(255,100,127,.08)"
                        : "none",
                    }}
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all duration-300"
                        style={{
                          background:
                            isCorrectOption
                              ? "rgba(82,227,194,.20)"
                              : isWrongSelected
                              ? "rgba(255,100,127,.18)"
                              : "rgba(255,255,255,.06)",

                          color:
                            isCorrectOption
                              ? "#52E3C2"
                              : isWrongSelected
                              ? "#FF7A94"
                              : "#C5CEE7",
                        }}
                      >
                        {isCorrectOption
                          ? "✓"
                          : isWrongSelected
                          ? "×"
                          : optionLetter}
                      </div>


                      <span
                        className={`flex-1 text-sm font-bold leading-relaxed ${
                          isInactive
                            ? "text-[#8793B4]"
                            : "text-[#F4F7FF]"
                        }`}
                      >
                        {opt}
                      </span>


                      {selected === null && (
                        <span className="translate-x-1 text-xs text-[#687494] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                          →
                        </span>
                      )}

                    </div>

                  </button>
                );
              })}

            </div>


            {/* answer feedback text */}

            {selected !== null && (
              <div
                className="animate-pop relative z-10 mt-5 rounded-2xl border p-4"
                style={{
                  background: selectedIsCorrect
                    ? "rgba(82,227,194,.07)"
                    : "rgba(255,100,127,.055)",

                  borderColor: selectedIsCorrect
                    ? "rgba(82,227,194,.18)"
                    : "rgba(255,100,127,.16)",
                }}
              >

                <div className="flex items-center gap-3">

                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-black"
                    style={{
                      color: selectedIsCorrect
                        ? "#52E3C2"
                        : "#FF8AA0",

                      background: selectedIsCorrect
                        ? "rgba(82,227,194,.12)"
                        : "rgba(255,100,127,.10)",
                    }}
                  >
                    {selectedIsCorrect
                      ? "✓"
                      : "↻"}
                  </div>


                  <div className="flex-1">

                    <p
                      className="text-sm font-black"
                      style={{
                        color: selectedIsCorrect
                          ? "#72E9B2"
                          : "#FFA0B2",
                      }}
                    >
                      {selectedIsCorrect
                        ? "Doğru keşif!"
                        : "Bu kez olmadı."}
                    </p>

                    <p className="mt-0.5 text-[11px] font-medium text-[#8793B4]">
                      {selectedIsCorrect
                        ? "Bilgi puanın yükseliyor."
                        : "Doğru cevabı gördün. Tekrar Merkezi'nde yeniden karşılaşabilirsin."}
                    </p>

                  </div>

                </div>

              </div>
            )}


            {/* next button */}

            {selected !== null && (
              <button
                onClick={nextQuestion}
                className="sticker-btn relative z-10 mt-4 w-full py-3.5 text-sm font-black"
              >
                <span className="flex items-center justify-center gap-2">

                  <span>
                    {index + 1 < questions.length
                      ? "Macereye Devam Et"
                      : test.bonusQuestion
                      ? "Bonus Keşfe Geç"
                      : "Görevi Tamamla"}
                  </span>

                  <span>→</span>

                </span>
              </button>
            )}

          </section>

        </div>


        {/* cinematic answer feedback */}

        {feedback && (
          <AnswerFeedback
            feedback={feedback}
            color={
              feedback.type === "correct"
                ? "#52E3C2"
                : "#FF7893"
            }
          />
        )}

      </div>
    );
  }

  /* ========================================================
     BONUS
  ======================================================== */

  if (phase === "bonus") {
    const bq = test.bonusQuestion;

    const bonusIsCorrect =
      bonusAnswer !== null &&
      bonusAnswer === bq.correctIndex;

    return (
      <div className="app-shell relative min-h-[80vh] pb-10 pt-5">

        <div className="mx-auto max-w-2xl">

          {/* bonus title */}

          <div className="mb-4 text-center">

            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl animate-pulse-glow"
              style={{
                color: "#FFD166",
                background:
                  "rgba(255,209,102,.10)",
                border:
                  "1px solid rgba(255,209,102,.20)",
              }}
            >
              ✦
            </div>

            <p className="mt-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#FFD166]">
              Gizli Keşif
            </p>

            <h2
              className="mt-1 text-xl font-black text-white"
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              Bonus Soru
            </h2>

            <p className="mt-1 text-xs font-medium text-[#8793B4]">
              Ek coin kazanma şansı.
            </p>

          </div>


          <section
            className="glass-card relative overflow-hidden p-5 sm:p-7"
            style={{
              background:
                "linear-gradient(145deg, rgba(50,42,30,.55), rgba(9,14,31,.95))",
              borderColor:
                "rgba(255,209,102,.22)",
            }}
          >

            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
              style={{
                background: "#FFD166",
                opacity: 0.09,
              }}
            />


            <div className="relative z-10 flex items-start justify-between gap-3">

              <h3
                className="flex-1 text-lg font-black leading-relaxed text-white"
                style={{
                  fontFamily:
                    "var(--font-display)",
                }}
              >
                {bq.text}
              </h3>

              <SpeakButton
                text={`${bq.text}. Seçenekler: ${bq.options
                  .map(
                    (option, i) =>
                      `${i + 1}. ${option}`
                  )
                  .join(", ")}`}
              />

            </div>


            <div className="relative z-10 mt-6 space-y-2.5">

              {bq.options.map((opt, i) => {

                const isCorrect =
                  bonusAnswer !== null &&
                  i === bq.correctIndex;

                const isSelectedWrong =
                  bonusAnswer !== null &&
                  i === bonusAnswer &&
                  i !== bq.correctIndex;

                return (
                  <button
                    key={i}
                    onClick={() =>
                      submitBonus(i)
                    }
                    disabled={
                      bonusAnswer !== null
                    }
                    className="w-full rounded-2xl border p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: isCorrect
                        ? "rgba(82,227,194,.12)"
                        : isSelectedWrong
                        ? "rgba(255,100,127,.10)"
                        : "rgba(255,255,255,.035)",

                      borderColor: isCorrect
                        ? "rgba(82,227,194,.45)"
                        : isSelectedWrong
                        ? "rgba(255,100,127,.45)"
                        : "rgba(255,255,255,.09)",
                    }}
                  >

                    <div className="flex items-center gap-3">

                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black"
                        style={{
                          background:
                            "rgba(255,209,102,.08)",
                          color:
                            "#FFD166",
                        }}
                      >
                        {String.fromCharCode(
                          65 + i
                        )}
                      </span>

                      <span className="text-sm font-bold text-white">
                        {opt}
                      </span>

                    </div>

                  </button>
                );
              })}

            </div>


            {bonusAnswer !== null && (
              <>
                <div
                  className="animate-pop relative z-10 mt-5 rounded-2xl border p-3.5 text-center"
                  style={{
                    background: bonusIsCorrect
                      ? "rgba(82,227,194,.07)"
                      : "rgba(255,100,127,.055)",

                    borderColor:
                      bonusIsCorrect
                        ? "rgba(82,227,194,.18)"
                        : "rgba(255,100,127,.16)",
                  }}
                >

                  <p
                    className="text-sm font-black"
                    style={{
                      color: bonusIsCorrect
                        ? "#52E3C2"
                        : "#FF8AA0",
                    }}
                  >
                    {bonusIsCorrect
                      ? "Bonus keşif tamamlandı! +10 Coin"
                      : "Bonus kaçtı ama görev tamamlandı."}
                  </p>

                </div>


                <button
                  onClick={finishUp}
                  className="sticker-btn btn-gold relative z-10 mt-4 w-full py-3.5 text-sm font-black"
                >
                  Görev Sonucunu Gör →
                </button>
              </>
            )}

          </section>


          <button
            onClick={handlePause}
            className="mt-4 w-full py-2 text-xs font-bold text-[#687494] transition hover:text-white"
          >
            Ana üsse dön
          </button>

        </div>

      </div>
    );
  }

  return null;
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function MissionStat({
  icon,
  value,
  label,
  compact = false,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 text-center">

      <div className="text-xs text-[#A98CFF]">
        {icon}
      </div>

      <p
        className={`mt-1 font-black text-white ${
          compact
            ? "truncate text-[11px]"
            : "text-base"
        }`}
      >
        {value}
      </p>

      <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-[#687494]">
        {label}
      </p>

    </div>
  );
}


function HUDStat({
  icon,
  value,
  label,
  color,
}) {
  return (
    <div className="glass-card flex items-center justify-center gap-2 px-2 py-2.5">

      <span
        className="text-xs font-black"
        style={{ color }}
      >
        {icon}
      </span>

      <div>

        <p className="text-xs font-black text-white">
          {value}
        </p>

        <p className="text-[7px] font-black uppercase tracking-wider text-[#687494]">
          {label}
        </p>

      </div>

    </div>
  );
}


function AnswerFeedback({
  feedback,
  color,
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">

      {/* soft flash */}

      <div
        className="absolute inset-0 animate-pop"
        style={{
          background: `radial-gradient(circle at center, ${color}14, transparent 48%)`,
        }}
      />


      {/* floating particles */}

      {feedback.type === "correct" && (
        <>
          <span
            className="magic-particle"
            style={{
              left: "43%",
              top: "43%",
              background: color,
            }}
          />

          <span
            className="magic-particle"
            style={{
              left: "55%",
              top: "45%",
              background: "#FFD166",
              animationDelay: "120ms",
            }}
          />

          <span
            className="magic-particle"
            style={{
              left: "48%",
              top: "52%",
              background: "#FFFFFF",
              animationDelay: "260ms",
            }}
          />

          {/* sword/slash impression */}

          <div
            className="absolute h-[2px] w-40 rotate-[-28deg] animate-pop"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, #ffffff, transparent)`,
              boxShadow: `0 0 18px ${color}`,
            }}
          />
        </>
      )}


      <div
        className="animate-pop relative rounded-2xl border px-6 py-4 text-center"
        style={{
          background:
            "rgba(7,11,29,.90)",
          borderColor: `${color}55`,
          boxShadow: `0 18px 70px rgba(0,0,0,.38), 0 0 36px ${color}20`,
          backdropFilter: "blur(18px)",
        }}
      >

        <p
          className="text-lg font-black"
          style={{
            color,
            fontFamily:
              "var(--font-display)",
          }}
        >
          {feedback.title}
        </p>

        <p className="mt-1 text-xs font-black text-white">
          {feedback.subtitle}
        </p>

      </div>

    </div>
  );
}


function shortSubject(subject) {
  if (!subject) return "Ders";

  if (subject === "Fen Bilimleri") {
    return "Fen";
  }

  if (subject === "Sosyal Bilgiler") {
    return "Sosyal";
  }

  return subject.length > 9
    ? `${subject.slice(0, 8)}…`
    : subject;
}
