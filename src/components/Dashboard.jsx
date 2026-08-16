import { useMemo } from "react";
import AvatarCanvas from "./avatar/AvatarCanvas";
import PetCanvas from "./avatar/PetCanvas";
import RoomBackground from "./avatar/RoomBackground";
import MoodCheckIn from "./MoodCheckIn";
import { getLevelInfo } from "../data/levels";
import { BADGES } from "../lib/gamification";
import { getRandomGreeting } from "../data/messages";

export default function Dashboard({
  profile,
  tests,
  onStartTest,
  onGeneratePractice,
  onOpenMistakeBox,
  onLogMood,
  onStartMiniGame,
  onOpenWorldMap,
  pausedTest,
  onResumeTest,
  onDiscardPausedTest,
}) {
  const { current, next, progressPct } = getLevelInfo(profile.xp);

  const availableTests = tests || [];

  const earnedBadges = BADGES.filter((b) =>
    profile.badges?.includes(b.id)
  );

  const unresolvedMistakes =
    profile.mistakeBox?.filter((m) => !m.resolved).length || 0;

  const greeting = useMemo(() => getRandomGreeting(), []);

  const dailyGoal = Math.min(
    10,
    availableTests.length > 0
      ? Math.max(
          1,
          Math.round(
            availableTests.reduce(
              (total, test) => total + (test.questions?.length || 0),
              0
            ) / Math.max(availableTests.length, 1)
          )
        )
      : 10
  );

  const completedGoal = Math.min(
    dailyGoal,
    Math.max(0, Math.round((profile.xp || 0) % (dailyGoal + 1)))
  );

  const goalPercent = Math.min(
    100,
    Math.round((completedGoal / dailyGoal) * 100)
  );

  const firstTest = availableTests[0];

  return (
    <div className="app-shell relative space-y-5 pb-8">

      {/* =====================================================
          FLOATING ATMOSPHERE
      ====================================================== */}

      <div
        className="magic-particle"
        style={{ left: "8%", top: "9%" }}
      />

      <div
        className="magic-particle"
        style={{ left: "86%", top: "18%", animationDelay: "1s" }}
      />

      <div
        className="magic-particle"
        style={{ left: "74%", top: "42%", animationDelay: "2.1s" }}
      />

      <div
        className="magic-particle"
        style={{ left: "18%", top: "55%", animationDelay: "3s" }}
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="flex items-center justify-between px-1">

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8793B4]">
            Bilgin Ustası
          </p>

          <h1
            className="mt-0.5 text-2xl font-black tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hazır mısın, {profile.childName}?
          </h1>

          <p className="mt-1 text-xs font-medium text-[#8793B4]">
            Bugünkü maceran seni bekliyor.
          </p>
        </div>

        <div className="glass-card flex h-11 w-11 items-center justify-center rounded-2xl">
          <span className="text-lg">✦</span>
        </div>

      </header>


      {/* =====================================================
          DEVAM EDEN TEST
      ====================================================== */}

      {pausedTest && (
        <section className="glass-card animate-pop overflow-hidden p-4">

          <div className="flex items-center gap-3">

            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,108,255,.28), rgba(82,227,255,.16))",
              }}
            >
              <span className="text-xl">▶</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-white">
                Macerana devam et
              </p>

              <p className="mt-1 truncate text-xs font-medium text-[#8793B4]">
                {pausedTest.test.title} · Soru{" "}
                {pausedTest.index + 1}/
                {pausedTest.test.questions.length}
              </p>
            </div>

            <button
              onClick={onResumeTest}
              className="sticker-btn shrink-0 px-4 py-2 text-xs"
            >
              Devam
            </button>
          </div>

          <button
            onClick={onDiscardPausedTest}
            className="mt-3 px-1 text-[10px] font-bold text-[#687494] transition hover:text-white"
          >
            Bu görevi kaldır
          </button>

        </section>
      )}


      {/* =====================================================
          HERO / CHARACTER
      ====================================================== */}

      <section
        className="glass-card relative overflow-hidden p-4"
        style={{
          minHeight: "285px",
          background:
            "linear-gradient(145deg, rgba(30,38,78,.82), rgba(10,17,39,.9))",
        }}
      >

        {/* decorative glow */}

        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #8B6CFF 0%, transparent 70%)",
          }}
        />

        <div
          className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #52E3FF 0%, transparent 70%)",
          }}
        />

        {/* tiny stars */}

        <span className="absolute right-[22%] top-[15%] text-xs text-white/40 animate-pulse">
          ✦
        </span>

        <span
          className="absolute left-[14%] top-[28%] text-[9px] text-[#52E3FF]/50 animate-pulse"
          style={{ animationDelay: "700ms" }}
        >
          ✦
        </span>

        <span
          className="absolute right-[12%] top-[48%] text-[7px] text-[#FFD166]/60 animate-pulse"
          style={{ animationDelay: "1200ms" }}
        >
          ✦
        </span>

        {/* room */}

        <div className="relative z-10">

          <RoomBackground room={profile.rooms?.bedroom}>

            <div className="flex items-end justify-center gap-2 pt-3 pb-1">

              <div className="animate-bob">
                <AvatarCanvas
                  avatar={profile.avatar}
                  size={175}
                />
              </div>

              {profile.pet && (
                <div
                  className="animate-bob"
                  style={{
                    animationDelay: "450ms",
                  }}
                >
                  <PetCanvas
                    pet={profile.pet}
                    size={78}
                  />
                </div>
              )}

            </div>

          </RoomBackground>

        </div>


        {/* character information */}

        <div className="relative z-20 -mt-3">

          <div
            className="glass-card mx-auto max-w-md p-3.5"
            style={{
              background: "rgba(7,11,29,.76)",
              backdropFilter: "blur(20px)",
            }}
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8793B4]">
                  {current.title}
                </p>

                <p
                  className="mt-0.5 text-lg font-black text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Seviye {current.level}
                </p>

              </div>

              <div className="text-right">

                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8793B4]">
                  XP
                </p>

                <p className="text-sm font-black text-[#52E3FF]">
                  {profile.xp}
                </p>

              </div>

            </div>


            <div className="xp-track mt-3">

              <div
                className="xp-fill"
                style={{
                  width: `${progressPct}%`,
                }}
              />

            </div>


            <div className="mt-1.5 flex justify-between text-[10px] font-bold text-[#8793B4]">

              <span>
                {progressPct}% tamamlandı
              </span>

              <span>
                {next
                  ? `${next.minXp - profile.xp} XP kaldı`
                  : "Usta seviyesindesin"}
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TODAY'S ADVENTURE
      ====================================================== */}

      <section>

        <div className="mb-2 flex items-end justify-between px-1">

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B6CFF]">
              Bugünün görevi
            </p>

            <h2
              className="mt-0.5 text-xl font-black text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bugünün Macerası
            </h2>

          </div>

          <span className="text-xl animate-bob">
            ✦
          </span>

        </div>


        <button
          onClick={() => firstTest && onStartTest(firstTest)}
          disabled={!firstTest}
          className="glass-card group relative w-full overflow-hidden p-4 text-left transition-all duration-300 hover:-translate-y-1 disabled:cursor-default"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,108,255,.18), rgba(82,227,255,.07))",
          }}
        >

          {/* hover glow */}

          <div
            className="absolute -right-16 -top-16 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
            style={{
              background:
                "radial-gradient(circle, #8B6CFF, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex items-center gap-3">

            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(82,227,255,.2), rgba(139,108,255,.25))",
                boxShadow:
                  "0 0 24px rgba(82,227,255,.08)",
              }}
            >
              <span className="text-2xl">
                📐
              </span>
            </div>


            <div className="min-w-0 flex-1">

              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#52E3FF]">
                Keşif görevi
              </p>

              <p className="mt-0.5 truncate text-base font-black text-white">
                {firstTest?.title || "Yeni bir görev seni bekliyor"}
              </p>

              <p className="mt-1 text-xs font-medium text-[#8793B4]">
                {firstTest
                  ? `${firstTest.subject} · ${firstTest.questions?.length || 0} soru`
                  : "Bir görev hazır olduğunda burada görünecek."}
              </p>

            </div>


            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:translate-x-1"
              style={{
                background: "rgba(255,255,255,.08)",
              }}
            >
              →
            </div>

          </div>


          {/* progress */}

          <div className="relative z-10 mt-4">

            <div className="flex items-center justify-between text-[10px] font-bold text-[#8793B4]">
              <span>
                Günlük ilerleme
              </span>

              <span className="text-[#C5CEE7]">
                {completedGoal}/{dailyGoal}
              </span>
            </div>

            <div className="xp-track mt-1.5">

              <div
                className="xp-fill"
                style={{
                  width: `${goalPercent}%`,
                }}
              />

            </div>

          </div>

        </button>

      </section>


      {/* =====================================================
          QUICK STATS
      ====================================================== */}

      <div className="grid grid-cols-3 gap-2.5">

        {/* COINS */}

        <div className="glass-card p-3 text-center">

          <div
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "rgba(255,209,102,.12)",
            }}
          >
            <span className="text-lg">
              ◈
            </span>
          </div>

          <p className="mt-2 text-lg font-black text-[#FFD166]">
            {profile.coins}
          </p>

          <p className="text-[9px] font-black uppercase tracking-wider text-[#8793B4]">
            Coin
          </p>

        </div>


        {/* STREAK */}

        <div className="glass-card p-3 text-center">

          <div
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "rgba(255,112,166,.12)",
            }}
          >
            <span className="text-lg">
              🔥
            </span>
          </div>

          <p className="mt-2 text-lg font-black text-[#FF70A6]">
            {profile.streak?.current || 0}
          </p>

          <p className="text-[9px] font-black uppercase tracking-wider text-[#8793B4]">
            Seri
          </p>

        </div>


        {/* MISTAKES */}

        <div className="glass-card p-3 text-center">

          <div
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "rgba(82,227,194,.12)",
            }}
          >
            <span className="text-lg">
              ◆
            </span>
          </div>

          <p className="mt-2 text-lg font-black text-[#52E3C2]">
            {unresolvedMistakes}
          </p>

          <p className="text-[9px] font-black uppercase tracking-wider text-[#8793B4]">
            Tekrar
          </p>

        </div>

      </div>


      {/* =====================================================
          WORLD MAP
      ====================================================== */}

      <button
        onClick={onOpenWorldMap}
        className="glass-card group relative w-full overflow-hidden p-4 text-left transition-all duration-300 hover:-translate-y-1"
        style={{
          background:
            "linear-gradient(135deg, rgba(82,227,194,.11), rgba(82,227,255,.035))",
        }}
      >

        <div
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #52E3C2, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">

          <div className="text-3xl animate-float">
            🗺️
          </div>

          <div className="flex-1">

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#52E3C2]">
              Keşif haritası
            </p>

            <p className="mt-0.5 text-base font-black text-white">
              Dünyayı keşfet
            </p>

            <p className="mt-1 text-xs font-medium text-[#8793B4]">
              Yeni bölgeler ve maceralar seni bekliyor.
            </p>

          </div>

          <span className="text-xl text-[#52E3C2] transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>

        </div>

      </button>


      {/* =====================================================
          REVENGE / MISTAKE MISSION
      ====================================================== */}

      {unresolvedMistakes >= 3 && (
        <button
          onClick={onOpenMistakeBox}
          className="glass-card group relative w-full overflow-hidden p-4 text-left transition-all duration-300 hover:-translate-y-1"
          style={{
            borderColor: "rgba(255,112,166,.22)",
            background:
              "linear-gradient(135deg, rgba(255,112,166,.12), rgba(139,108,255,.05))",
          }}
        >

          <div className="flex items-center gap-3">

            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: "rgba(255,112,166,.12)",
              }}
            >
              <span className="text-xl">
                ⚔️
              </span>
            </div>

            <div className="flex-1">

              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FF70A6]">
                Yeni görev
              </p>

              <p className="mt-0.5 text-sm font-black text-white">
                Tekrar Merkezi hazır
              </p>

              <p className="mt-1 text-xs font-medium text-[#8793B4]">
                {unresolvedMistakes} soruyu yeniden ustalaştır.
              </p>

            </div>

            <span className="text-[#FF70A6] transition-transform group-hover:translate-x-1">
              →
            </span>

          </div>

        </button>
      )}


      {/* =====================================================
          BREAK / MINI GAME
      ====================================================== */}

      <button
        onClick={onStartMiniGame}
        className="glass-card group w-full p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5"
      >

        <div className="flex items-center gap-3">

          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "rgba(82,227,255,.1)",
            }}
          >
            🎮
          </div>

          <div className="flex-1">

            <p className="text-sm font-black text-white">
              Kısa bir mola?
            </p>

            <p className="mt-0.5 text-[11px] font-medium text-[#8793B4]">
              Hafıza oyunuyla biraz dinlen.
            </p>

          </div>

          <span className="text-sm font-black text-[#52E3FF]">
            Oyna →
          </span>

        </div>

      </button>


      {/* =====================================================
          MOOD
      ====================================================== */}

      <MoodCheckIn
        profile={profile}
        onLogMood={onLogMood}
      />


      {/* =====================================================
          TESTS
      ====================================================== */}

      <section>

        <div className="mb-3 flex items-end justify-between px-1">

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8793B4]">
              Görevler
            </p>

            <h2
              className="mt-0.5 text-xl font-black text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Keşif Görevleri
            </h2>

          </div>

          <span className="text-xs font-bold text-[#8793B4]">
            {availableTests.length} görev
          </span>

        </div>


        <div className="space-y-2.5">

          {availableTests.length === 0 && (
            <div className="glass-card p-5 text-center">

              <div className="mb-2 text-3xl opacity-70">
                🧭
              </div>

              <p className="text-sm font-black text-white">
                Yeni görevler hazırlanıyor
              </p>

              <p className="mt-1 text-xs font-medium text-[#8793B4]">
                Yeni bir test eklendiğinde burada görünecek.
              </p>

            </div>
          )}


          {availableTests.map((test, index) => (

            <button
              key={test.id}
              onClick={() => onStartTest(test)}
              className="glass-card group relative w-full overflow-hidden p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            >

              <div className="flex items-center gap-3">

                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      index % 3 === 0
                        ? "rgba(139,108,255,.13)"
                        : index % 3 === 1
                        ? "rgba(82,227,255,.1)"
                        : "rgba(82,227,194,.1)",
                  }}
                >
                  <span className="text-lg">
                    {index % 3 === 0
                      ? "✦"
                      : index % 3 === 1
                      ? "◇"
                      : "◆"}
                  </span>
                </div>


                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-black text-white">
                    {test.title}
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-[#8793B4]">
                    {test.subject} · {test.questions?.length || 0} soru
                  </p>

                </div>


                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#C5CEE7] transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                  style={{
                    background: "rgba(255,255,255,.06)",
                  }}
                >
                  →
                </div>

              </div>

            </button>

          ))}

        </div>

      </section>


      {/* =====================================================
          BADGES
      ====================================================== */}

      {earnedBadges.length > 0 && (
        <section>

          <div className="mb-3 px-1">

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8793B4]">
              Koleksiyon
            </p>

            <h2
              className="mt-0.5 text-xl font-black text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Kazandığın Rozetler
            </h2>

          </div>


          <div className="flex flex-wrap gap-2">

            {earnedBadges.map((badge) => (

              <div
                key={badge.id}
                className="glass-card animate-pop px-3 py-2 text-xs font-black text-[#FFD166]"
              >
                ✦ {badge.label}
              </div>

            ))}

          </div>

        </section>
      )}

    </div>
  );
}
