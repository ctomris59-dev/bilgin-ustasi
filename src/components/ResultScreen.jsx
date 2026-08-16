import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { playCelebrate, playCorrect } from "../lib/sound";

export default function ResultScreen({
  result,
  xpEarned,
  coinsEarned,
  speedBonus,
  newBadges,
  newLegendaryItems,
  newSticker,
  boostActive,
  onClose,
}) {
  const {
    correctCount,
    totalCount,
    fullScore,
    bonusCorrect,
    isRetryTest,
    subject,
  } = result;

  const percentage =
    totalCount > 0
      ? Math.round((correctCount / totalCount) * 100)
      : 0;

  const animatedXp = useCountUp(xpEarned, 1000, 250);
  const animatedCoins = useCountUp(coinsEarned, 1000, 430);
  const animatedScore = useCountUp(percentage, 850, 100);

  const performance = useMemo(
    () => getPerformanceInfo(percentage, fullScore),
    [percentage, fullScore]
  );

  const hasSpecialReward =
    Boolean(newSticker) ||
    (newBadges?.length || 0) > 0 ||
    (newLegendaryItems?.length || 0) > 0;

  useEffect(() => {
    if (fullScore) {
      playCelebrate();
      launchPerfectCelebration();
      return;
    }

    if (percentage >= 60) {
      playCorrect();
      launchSoftCelebration();
    }
  }, [fullScore, percentage]);

  return (
    <div className="app-shell relative min-h-[82vh] overflow-hidden pb-10 pt-4">

      {/* =====================================================
          AMBIENT LIGHTS
      ====================================================== */}

      <div
        className="pointer-events-none absolute left-1/2 top-[8%] h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-[90px]"
        style={{
          background: fullScore
            ? "rgba(255,209,102,.12)"
            : "rgba(139,108,255,.11)",
        }}
      />

      <div
        className="pointer-events-none absolute -left-24 top-[42%] h-60 w-60 rounded-full blur-[90px]"
        style={{
          background: "rgba(82,227,255,.07)",
        }}
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-[10%] h-60 w-60 rounded-full blur-[90px]"
        style={{
          background: "rgba(82,227,194,.06)",
        }}
      />


      {/* =====================================================
          FLOATING PARTICLES
      ====================================================== */}

      <ResultParticle
        left="8%"
        top="12%"
        delay="0s"
      />

      <ResultParticle
        left="91%"
        top="18%"
        delay=".8s"
      />

      <ResultParticle
        left="18%"
        top="45%"
        delay="1.6s"
      />

      <ResultParticle
        left="82%"
        top="56%"
        delay="2.3s"
      />

      <ResultParticle
        left="11%"
        top="78%"
        delay="3s"
      />

      <div className="relative z-10 mx-auto max-w-xl">

        {/* ===================================================
            RESULT TITLE
        ==================================================== */}

        <header className="mb-5 text-center">

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

            {/* outer ring */}

            <div
              className={`absolute inset-0 rounded-full ${
                fullScore
                  ? "animate-pulse-glow"
                  : ""
              }`}
              style={{
                background: fullScore
                  ? "radial-gradient(circle, rgba(255,209,102,.18), rgba(255,209,102,.03) 60%, transparent 72%)"
                  : "radial-gradient(circle, rgba(139,108,255,.17), rgba(139,108,255,.03) 60%, transparent 72%)",
              }}
            />

            <div
              className="animate-level-ring relative flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-black"
              style={{
                color: fullScore
                  ? "#FFD166"
                  : "#A98CFF",

                background: fullScore
                  ? "linear-gradient(145deg, rgba(255,209,102,.15), rgba(255,255,255,.025))"
                  : "linear-gradient(145deg, rgba(139,108,255,.17), rgba(255,255,255,.025))",

                borderColor: fullScore
                  ? "rgba(255,209,102,.32)"
                  : "rgba(169,140,255,.28)",

                boxShadow: fullScore
                  ? "0 0 40px rgba(255,209,102,.12)"
                  : "0 0 40px rgba(139,108,255,.10)",
              }}
            >
              {fullScore ? "✦" : "✓"}
            </div>

          </div>


          <p
            className="mt-3 text-[10px] font-black uppercase tracking-[0.24em]"
            style={{
              color: fullScore
                ? "#FFD166"
                : "#A98CFF",
            }}
          >
            {isRetryTest
              ? "Rövanş Tamamlandı"
              : "Görev Tamamlandı"}
          </p>


          <h1
            className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl"
            style={{
              fontFamily: "var(--font-display)",
            }}
          >
            {performance.title}
          </h1>


          <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-relaxed text-[#8793B4]">
            {performance.subtitle}
          </p>

        </header>


        {/* ===================================================
            MAIN RESULT CARD
        ==================================================== */}

        <section
          className="glass-card relative overflow-hidden p-5 sm:p-7"
          style={{
            background:
              "linear-gradient(145deg, rgba(24,33,67,.88), rgba(8,13,30,.95))",
          }}
        >

          {/* top glow */}

          <div
            className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full blur-3xl"
            style={{
              background: fullScore
                ? "#FFD166"
                : "#8B6CFF",
              opacity: 0.07,
            }}
          />


          {/* =================================================
              SCORE CIRCLE
          ================================================== */}

          <div className="relative z-10 flex flex-col items-center">

            <ScoreRing
              score={animatedScore}
              percentage={percentage}
              fullScore={fullScore}
            />


            <p className="mt-4 text-sm font-black text-white">
              {correctCount} / {totalCount} doğru
            </p>


            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#687494]">
              {subject || "Görev Sonucu"}
            </p>

          </div>


          {/* =================================================
              REWARD DIVIDER
          ================================================== */}

          <div className="relative z-10 my-6 flex items-center gap-3">

            <div className="h-px flex-1 bg-white/[0.07]" />

            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#687494]">
              Kazanımlar
            </span>

            <div className="h-px flex-1 bg-white/[0.07]" />

          </div>


          {/* =================================================
              XP + COINS
          ================================================== */}

          <div className="relative z-10 grid grid-cols-2 gap-3">

            <RewardCard
              type="xp"
              icon="✦"
              label="KAZANILAN XP"
              value={`+${animatedXp}`}
              color="#52E3FF"
              background="rgba(82,227,255,.08)"
              glow="rgba(82,227,255,.10)"
            />

            <RewardCard
              type="coin"
              icon="◈"
              label="KAZANILAN COIN"
              value={`+${animatedCoins}`}
              color="#FFD166"
              background="rgba(255,209,102,.08)"
              glow="rgba(255,209,102,.10)"
              delay=".15s"
            />

          </div>


          {/* =================================================
              BONUSES
          ================================================== */}

          {(speedBonus > 0 ||
            bonusCorrect ||
            boostActive) && (
            <div className="relative z-10 mt-4 space-y-2">

              {speedBonus > 0 && (
                <BonusRow
                  icon="⚡"
                  title="Hız Bonusu"
                  value={`+${speedBonus} XP`}
                  color="#52E3C2"
                />
              )}


              {bonusCorrect && (
                <BonusRow
                  icon="✦"
                  title="Gizli Keşif"
                  value="+10 Coin"
                  color="#FFD166"
                />
              )}


              {boostActive && (
                <BonusRow
                  icon="↑"
                  title="Keşif Güçlendirmesi"
                  value="1.5× aktif"
                  color="#A98CFF"
                />
              )}

            </div>
          )}


          {/* =================================================
              FULL SCORE MESSAGE
          ================================================== */}

          {fullScore && (
            <div
              className="animate-pop relative z-10 mt-5 overflow-hidden rounded-2xl border p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,209,102,.10), rgba(255,209,102,.035))",

                borderColor:
                  "rgba(255,209,102,.24)",
              }}
            >

              <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
                style={{
                  background:
                    "rgba(255,209,102,.12)",
                }}
              />


              <div className="relative flex items-center gap-3">

                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{
                    background:
                      "rgba(255,209,102,.12)",
                    color: "#FFD166",
                  }}
                >
                  ✦
                </div>


                <div>

                  <p className="text-sm font-black text-[#FFE29A]">
                    Kusursuz görev!
                  </p>

                  <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-[#A5AEC6]">
                    Tüm soruları doğru cevapladın.
                    Ustalık bonusun ödüllerine eklendi.
                  </p>

                </div>

              </div>

            </div>
          )}


          {/* =================================================
              SPECIAL REWARDS
          ================================================== */}

          {hasSpecialReward && (
            <div className="relative z-10 mt-7">

              <div className="mb-3 flex items-center gap-3">

                <div className="h-px flex-1 bg-white/[0.07]" />

                <p className="text-[9px] font-black uppercase tracking-[0.19em] text-[#FFD166]">
                  Yeni Keşifler
                </p>

                <div className="h-px flex-1 bg-white/[0.07]" />

              </div>


              <div className="space-y-3">

                {/* LEGENDARY */}

                {newLegendaryItems?.map(
                  (item, index) => (
                    <UnlockCard
                      key={item.id}
                      eyebrow="EFSANEVİ KEŞİF"
                      title={item.label}
                      description="Yeni bir özel eşya koleksiyonuna eklendi."
                      icon="◆"
                      accent="#FFD166"
                      delay={`${index * 0.12}s`}
                    />
                  )
                )}


                {/* BADGES */}

                {newBadges?.map(
                  (badge, index) => (
                    <UnlockCard
                      key={badge.id}
                      eyebrow="YENİ ROZET"
                      title={badge.label}
                      description={
                        badge.desc ||
                        "Yeni bir başarı kazandın."
                      }
                      icon="⬡"
                      accent="#52E3C2"
                      delay={`${
                        index * 0.12 + 0.15
                      }s`}
                    />
                  )
                )}


                {/* STICKER */}

                {newSticker && (
                  <UnlockCard
                    eyebrow="KOLEKSİYON KEŞFİ"
                    title={
                      newSticker.category ||
                      "Yeni Sticker"
                    }
                    description="Sticker albümüne yeni bir parça eklendi."
                    icon={newSticker.emoji || "✦"}
                    accent="#FF78AA"
                    largeIcon
                    delay=".3s"
                  />
                )}

              </div>

            </div>
          )}


          {/* =================================================
              RETRY INFORMATION
          ================================================== */}

          {isRetryTest && (
            <div
              className="relative z-10 mt-5 rounded-2xl border p-3.5"
              style={{
                borderColor:
                  "rgba(169,140,255,.14)",
                background:
                  "rgba(169,140,255,.045)",
              }}
            >

              <div className="flex items-center gap-3">

                <span className="text-base text-[#A98CFF]">
                  ↻
                </span>

                <p className="text-[11px] font-semibold leading-relaxed text-[#A5AEC6]">
                  Tekrar yaptığın sorular öğrenme
                  yolculuğunun bir parçası. Her tekrar
                  bilgiyi biraz daha güçlendirir.
                </p>

              </div>

            </div>
          )}


          {/* =================================================
              CONTINUE
          ================================================== */}

          <button
            onClick={onClose}
            className={`sticker-btn relative z-10 mt-7 w-full py-4 text-sm font-black ${
              fullScore ? "btn-gold" : ""
            }`}
          >

            <span className="flex items-center justify-center gap-2">

              <span>
                Ödülleri Topla
              </span>

              <span className="transition-transform duration-200">
                →
              </span>

            </span>

          </button>


          <p className="relative z-10 mt-2.5 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-[#56617E]">
            Ana üsse dön
          </p>

        </section>

      </div>

    </div>
  );
}


/* =========================================================
   SCORE RING
========================================================= */

function ScoreRing({
  score,
  percentage,
  fullScore,
}) {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (Math.min(100, percentage) / 100) *
      circumference;

  const ringColor = fullScore
    ? "#FFD166"
    : percentage >= 70
    ? "#52E3C2"
    : percentage >= 50
    ? "#A98CFF"
    : "#70A1FF";

  return (
    <div className="relative h-[150px] w-[150px]">

      {/* background aura */}

      <div
        className="absolute inset-5 rounded-full blur-2xl"
        style={{
          background: ringColor,
          opacity: 0.08,
        }}
      />


      <svg
        viewBox="0 0 140 140"
        className="absolute inset-0 h-full w-full -rotate-90"
      >

        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,.06)"
          strokeWidth="9"
        />


        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition:
              "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)",
            filter: `drop-shadow(0 0 7px ${ringColor}55)`,
          }}
        />

      </svg>


      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <p
          className="text-4xl font-black tracking-tight text-white"
          style={{
            fontFamily:
              "var(--font-display)",
          }}
        >
          {score}
          <span className="text-lg text-[#8793B4]">
            %
          </span>
        </p>


        <p
          className="mt-1 text-[8px] font-black uppercase tracking-[0.18em]"
          style={{
            color: ringColor,
          }}
        >
          Başarı
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   REWARD CARD
========================================================= */

function RewardCard({
  icon,
  label,
  value,
  color,
  background,
  glow,
  delay = "0s",
}) {
  return (
    <div
      className="animate-pop relative overflow-hidden rounded-2xl border border-white/[0.08] p-4 text-center"
      style={{
        background,
        animationDelay: delay,
        animationFillMode: "both",
        boxShadow: `0 12px 30px ${glow}`,
      }}
    >

      <div
        className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black"
        style={{
          color,
          background:
            "rgba(255,255,255,.045)",
        }}
      >
        {icon}
      </div>


      <p
        className="mt-2.5 text-2xl font-black"
        style={{
          color,
          fontFamily:
            "var(--font-display)",
        }}
      >
        {value}
      </p>


      <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#687494]">
        {label}
      </p>

    </div>
  );
}


/* =========================================================
   BONUS ROW
========================================================= */

function BonusRow({
  icon,
  title,
  value,
  color,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.065] bg-white/[0.028] px-3.5 py-2.5">

      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black"
        style={{
          color,
          background: `${color}12`,
        }}
      >
        {icon}
      </div>


      <p className="flex-1 text-[11px] font-bold text-[#A5AEC6]">
        {title}
      </p>


      <p
        className="text-[11px] font-black"
        style={{
          color,
        }}
      >
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   UNLOCK CARD
========================================================= */

function UnlockCard({
  eyebrow,
  title,
  description,
  icon,
  accent,
  largeIcon = false,
  delay = "0s",
}) {
  return (
    <div
      className="animate-pop relative overflow-hidden rounded-2xl border p-4"
      style={{
        background: `linear-gradient(135deg, ${accent}12, rgba(255,255,255,.025))`,
        borderColor: `${accent}30`,
        animationDelay: delay,
        animationFillMode: "both",
      }}
    >

      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
        style={{
          background: accent,
          opacity: 0.08,
        }}
      />


      <div className="relative flex items-center gap-3">

        <div
          className={`flex shrink-0 items-center justify-center rounded-xl ${
            largeIcon
              ? "h-12 w-12 text-2xl"
              : "h-11 w-11 text-lg"
          }`}
          style={{
            color: accent,
            background: `${accent}12`,
            boxShadow: `0 0 20px ${accent}0C`,
          }}
        >
          {icon}
        </div>


        <div className="min-w-0 flex-1">

          <p
            className="text-[8px] font-black uppercase tracking-[0.17em]"
            style={{
              color: accent,
            }}
          >
            {eyebrow}
          </p>


          <p className="mt-0.5 truncate text-sm font-black text-white">
            {title}
          </p>


          <p className="mt-1 text-[10px] font-medium leading-relaxed text-[#8793B4]">
            {description}
          </p>

        </div>


        <span
          className="text-sm"
          style={{
            color: accent,
          }}
        >
          ✦
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   AMBIENT PARTICLE
========================================================= */

function ResultParticle({
  left,
  top,
  delay,
}) {
  return (
    <span
      className="magic-particle"
      style={{
        left,
        top,
        animationDelay: delay,
      }}
    />
  );
}


/* =========================================================
   COUNT-UP HOOK
========================================================= */

function useCountUp(
  target,
  duration = 900,
  delay = 0
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId;
    let startTime;
    let delayTimer;

    const finalValue =
      Number.isFinite(Number(target))
        ? Number(target)
        : 0;

    delayTimer = window.setTimeout(() => {

      const animate = (time) => {

        if (!startTime) {
          startTime = time;
        }

        const elapsed =
          time - startTime;

        const progress =
          Math.min(
            elapsed / duration,
            1
          );

        /*
          Ease-out cubic:
          hızlı başlar,
          son değere yaklaşırken yavaşlar.
        */

        const eased =
          1 -
          Math.pow(
            1 - progress,
            3
          );

        setValue(
          Math.round(
            finalValue * eased
          )
        );

        if (progress < 1) {
          frameId =
            requestAnimationFrame(
              animate
            );
        }

      };

      frameId =
        requestAnimationFrame(
          animate
        );

    }, delay);


    return () => {
      window.clearTimeout(delayTimer);

      if (frameId) {
        cancelAnimationFrame(
          frameId
        );
      }
    };

  }, [target, duration, delay]);


  return value;
}


/* =========================================================
   PERFORMANCE MESSAGE
========================================================= */

function getPerformanceInfo(
  percentage,
  fullScore
) {
  if (fullScore) {
    return {
      title: "Kusursuz Görev",
      subtitle:
        "Tüm soruları doğru cevapladın. Bu bölgedeki bilgini gerçekten ustalaştırdın.",
    };
  }


  if (percentage >= 80) {
    return {
      title: "Güçlü Keşif",
      subtitle:
        "Çok iyi ilerledin. Birkaç tekrar ile bu konuyu tamamen ustalaştırabilirsin.",
    };
  }


  if (percentage >= 60) {
    return {
      title: "Görev Başarılı",
      subtitle:
        "İyi ilerleme. Zorlandığın sorular Tekrar Merkezi'nde seni yeniden bekleyecek.",
    };
  }


  return {
    title: "Keşif Tamamlandı",
    subtitle:
      "Bugünkü çalışma tamamlandı. Zorlandığın soruları tekrar ederek bilgini güçlendirebilirsin.",
  };
}


/* =========================================================
   CELEBRATIONS
========================================================= */

function launchPerfectCelebration() {
  const colors = [
    "#FFD166",
    "#52E3C2",
    "#52E3FF",
    "#A98CFF",
  ];

  const end =
    Date.now() + 1600;


  const frame = () => {

    confetti({
      particleCount: 3,
      angle: 62,
      spread: 50,
      startVelocity: 34,
      origin: {
        x: 0,
        y: 0.75,
      },
      colors,
      ticks: 170,
      gravity: 0.8,
      scalar: 0.8,
    });


    confetti({
      particleCount: 3,
      angle: 118,
      spread: 50,
      startVelocity: 34,
      origin: {
        x: 1,
        y: 0.75,
      },
      colors,
      ticks: 170,
      gravity: 0.8,
      scalar: 0.8,
    });


    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }

  };


  frame();


  window.setTimeout(() => {

    confetti({
      particleCount: 70,
      spread: 75,
      startVelocity: 32,
      origin: {
        x: 0.5,
        y: 0.45,
      },
      colors,
      scalar: 0.75,
      gravity: 0.85,
    });

  }, 350);
}


function launchSoftCelebration() {
  confetti({
    particleCount: 35,
    spread: 58,
    startVelocity: 27,
    origin: {
      x: 0.5,
      y: 0.55,
    },
    colors: [
      "#52E3C2",
      "#52E3FF",
      "#A98CFF",
    ],
    gravity: 0.9,
    scalar: 0.7,
    ticks: 140,
  });
}
