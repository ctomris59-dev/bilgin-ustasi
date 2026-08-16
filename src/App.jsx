import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import MistakeBox from "./components/MistakeBox";
import Wardrobe from "./components/avatar/Wardrobe";
import Shop from "./components/Shop";
import ParentPanel from "./components/ParentPanel";
import TestSolver from "./components/TestSolver";
import ResultScreen from "./components/ResultScreen";
import BottomNav from "./components/BottomNav";
import MemoryGame from "./components/MemoryGame";
import WorldMap from "./components/WorldMap";
import SoundToggle from "./components/SoundToggle";
import { playCoin, playPop, playCelebrate } from "./lib/sound";
import { createDefaultProfile, getLocalProfile, saveLocalProfile, normalizeProfile, getPausedTest, savePausedTest, clearPausedTest } from "./lib/storage";
import { fetchCloudData, pushProfile, uploadTest } from "./lib/github";
import { calcTestRewards, calcSpeedBonus, updateStreak, evaluateNewBadges, BADGES, getBoostInfo, applyBoost } from "./lib/gamification";
import { ITEMS } from "./data/avatarParts";
import { PETS } from "./data/petsAndRoom";
import { getLevelInfo } from "./data/levels";
import { getNextStickerToUnlock } from "./data/stickers";
import { todayKey } from "./data/moods";
import { generatePracticeTest } from "./lib/practiceGenerator";
import { getWorldForLevel } from "./data/worlds";
import { isRoomComplete } from "./data/houseRooms";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tests, setTests] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [activeTest, setActiveTest] = useState(null); // { test, isRetryTest }
  const [pendingResult, setPendingResult] = useState(null);
  const [syncStatus, setSyncStatus] = useState("loading"); // loading | synced | offline | error
  const [loading, setLoading] = useState(true);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [pausedTest, setPausedTest] = useState(() => getPausedTest());
  const [toast, setToast] = useState(null);
  const [worldUnlock, setWorldUnlock] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function init() {
    const local = getLocalProfile();
    try {
      const cloud = await fetchCloudData();
      const cloudProfile = normalizeProfile(cloud.profile);
      const finalProfile = cloudProfile || local || createDefaultProfile();
      setProfile(finalProfile);
      setTests(cloud.tests || []);
      saveLocalProfile(finalProfile);
      if (!cloudProfile) {
        // Bulutta profil yok, ilkini oluşturup gönder
        await pushProfile(finalProfile).catch(() => {});
      }
      setSyncStatus("synced");
    } catch (e) {
      // Bulut yok / env değişkenleri ayarlanmamış -> yerel modda devam
      setProfile(local || createDefaultProfile());
      setSyncStatus("offline");
    } finally {
      setLoading(false);
    }
  }

  async function persist(newProfile) {
    setProfile(newProfile);
    saveLocalProfile(newProfile);
    try {
      await pushProfile(newProfile);
      setSyncStatus("synced");
    } catch {
      setSyncStatus("offline");
    }
  }

  function handleStartTest(test) {
    setActiveTest({ test, isRetryTest: false });
  }

  function handlePauseTest(snapshot) {
    savePausedTest(snapshot);
    setPausedTest(snapshot);
    setActiveTest(null);
  }

  function handleResumeTest() {
    if (!pausedTest) return;
    setActiveTest({ test: pausedTest.test, isRetryTest: pausedTest.isRetryTest, resumeState: pausedTest });
  }

  function handleDiscardPausedTest() {
    clearPausedTest();
    setPausedTest(null);
  }

  function handleGeneratePractice(subject) {
    const practiceTest = generatePracticeTest(subject, tests);
    if (!practiceTest) return;
    playPop();
    setActiveTest({ test: practiceTest, isRetryTest: false });
  }

  function handleStartRetryTest(subject, mistakeItems) {
    const retryTest = {
      id: `retry-${subject}-${Date.now()}`,
      subject,
      title: `${subject} Rövanş Testi`,
      hintsAllowed: 1,
      targetSecondsPerQuestion: null,
      questions: mistakeItems.map((m, i) => ({ ...m.question, id: `retry-q${i}` })),
      _mistakeIds: mistakeItems.map((m) => m.id),
    };
    setActiveTest({ test: retryTest, isRetryTest: true });
  }

  function handleFinishTest(result) {
    const rewards = calcTestRewards({
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      isRetryTest: result.isRetryTest,
    });
    const speedBonus = result.targetSecondsPerQuestion
      ? calcSpeedBonus({ avgSecondsPerQuestion: result.avgSecondsPerQuestion, targetSeconds: result.targetSecondsPerQuestion })
      : 0;
    const bonusCoins = result.bonusCorrect ? 10 : 0;

    const boost = getBoostInfo(profile.accountCreatedAt);
    const xpEarned = applyBoost(rewards.xp + speedBonus, boost.multiplier);
    const coinsEarned = applyBoost(rewards.coins + bonusCoins, boost.multiplier);

    let next = { ...profile };
    next.xp += xpEarned;
    next.coins += coinsEarned;

    const prevLevel = getLevelInfo(profile.xp).current.level;

    // Geçmişe ekle
    next.history = [
      ...next.history,
      {
        id: `h${Date.now()}`,
        testId: result.testId,
        subject: result.subject,
        date: new Date().toISOString(),
        correctCount: result.correctCount,
        totalCount: result.totalCount,
        xpEarned,
        coinsEarned,
        isRetry: result.isRetryTest,
      },
    ];

    // Hata kutusu güncelle
    if (result.isRetryTest && activeTest?.test?._mistakeIds) {
      const solvedNowIds = new Set(); // rövanşta doğru yapılanları kutudan çıkar
      result.wrongQuestions.forEach(() => {}); // wrongQuestions kalanlar hala yanlış
      const stillWrongQIds = new Set(result.wrongQuestions.map((q) => q.id));
      next.mistakeBox = next.mistakeBox.map((m, idx) => {
        if (!activeTest.test._mistakeIds.includes(m.id)) return m;
        const retryQId = `retry-q${activeTest.test._mistakeIds.indexOf(m.id)}`;
        const stillWrong = stillWrongQIds.has(retryQId);
        return stillWrong ? m : { ...m, resolved: true };
      });
      if (result.correctCount === result.totalCount) {
        next.stats.retryTestsPassed = (next.stats.retryTestsPassed || 0) + 1;
      }
    } else {
      const newMistakes = result.wrongQuestions.map((q) => ({
        id: `m${Date.now()}-${q.id}`,
        testId: result.testId,
        subject: result.subject,
        question: q,
        addedAt: new Date().toISOString(),
        resolved: false,
      }));
      next.mistakeBox = [...next.mistakeBox, ...newMistakes];
    }

    // İstatistikler
    next.stats = { ...next.stats };
    next.stats.testsBySubject = { ...next.stats.testsBySubject };
    next.stats.testsBySubject[result.subject] = (next.stats.testsBySubject[result.subject] || 0) + 1;
    if (result.correctCount === result.totalCount) {
      next.stats.fullScoreBySubject = { ...next.stats.fullScoreBySubject };
      next.stats.fullScoreBySubject[result.subject] = (next.stats.fullScoreBySubject[result.subject] || 0) + 1;
    }
    if (speedBonus > 0) next.stats.speedBonusCount = (next.stats.speedBonusCount || 0) + 1;

    // Streak
    next.streak = updateStreak(next, new Date().toISOString());

    // Efsanevi parça kilidi aç (deterministik, rastgele değil)
    const newLegendaryItems = [];
    if (result.correctCount === result.totalCount) {
      [...ITEMS, ...PETS].filter((i) => i.legendary && !next.unlockedItems.includes(i.id)).forEach((item) => {
        const cond = item.unlock;
        if (cond?.type === "fullScore" && (cond.subject === "any" || cond.subject === result.subject)) {
          next.unlockedItems = [...next.unlockedItems, item.id];
          newLegendaryItems.push(item);
        }
      });
    }

    // Rozetler
    const { current } = getLevelInfo(next.xp);
    const badgeStats = {
      fullScoreBySubject: next.stats.fullScoreBySubject,
      testsBySubject: next.stats.testsBySubject,
      streakCurrent: next.streak.current,
      speedBonusCount: next.stats.speedBonusCount,
      retryTestsPassed: next.stats.retryTestsPassed,
      level: current.level,
    };
    const newBadgeIds = evaluateNewBadges(badgeStats, next.badges);
    next.badges = [...next.badges, ...newBadgeIds];
    const newBadges = BADGES.filter((b) => newBadgeIds.includes(b.id));

    // Sticker Albümü - her tamamlanan test sırada bekleyen bir sonraki sticker'ı garanti açar
    const newSticker = getNextStickerToUnlock(next.stickerAlbum.unlockedIds);
    if (newSticker) {
      next.stickerAlbum = { unlockedIds: [...next.stickerAlbum.unlockedIds, newSticker.id] };
    }

    persist(next);
    setActiveTest(null);
    clearPausedTest();
    setPausedTest(null);

    // Yeni dünya açıldı mı? (seviye atlayıp bir sonraki dünyanın eşiğini geçtiyse kutla)
    const newLevel = getLevelInfo(next.xp).current.level;
    if (newLevel > prevLevel) {
      const newWorld = getWorldForLevel(newLevel);
      if (newWorld.unlockLevel === newLevel) {
        setTimeout(() => setWorldUnlock(newWorld), 700);
      }
    }

    setPendingResult({
      result: { ...result, fullScore: result.correctCount === result.totalCount },
      xpEarned,
      coinsEarned,
      speedBonus,
      newBadges,
      newLegendaryItems,
      newSticker,
      boostActive: boost.active,
    });
  }

  function handleBuyItem(item) {
    if (profile.coins < item.price) return;
    playCoin();
    const next = {
      ...profile,
      coins: profile.coins - item.price,
      unlockedItems: [...profile.unlockedItems, item.id],
    };
    persist(next);
  }

  function handleRedeemReward(reward) {
    if (profile.coins < reward.cost) return;
    playCoin();
    const next = {
      ...profile,
      coins: profile.coins - reward.cost,
      redemptions: [...profile.redemptions, { id: `red${Date.now()}`, rewardId: reward.id, label: reward.label, date: new Date().toISOString(), fulfilled: false }],
    };
    persist(next);
  }

  function handleChangeAvatar(newAvatar) {
    persist({ ...profile, avatar: newAvatar });
  }

  function handleChangePet(newPet) {
    persist({ ...profile, pet: newPet });
  }

  function handleChangeRoomSlot(roomId, newRoomState) {
    const next = { ...profile, rooms: { ...profile.rooms, [roomId]: newRoomState } };

    const alreadyCounted = profile.completedRooms.includes(roomId);
    if (!alreadyCounted && isRoomComplete(newRoomState)) {
      const boost = getBoostInfo(profile.accountCreatedAt);
      const bonusXp = applyBoost(40, boost.multiplier);
      const bonusCoins = applyBoost(60, boost.multiplier);
      next.completedRooms = [...profile.completedRooms, roomId];
      next.coins += bonusCoins;
      next.xp += bonusXp;
      showToast(`Üs bölümü tamamlandı · +${bonusXp} XP · +${bonusCoins} coin`);
      playCelebrate();
    }

    persist(next);
  }

  function handleLogMood(moodId) {
    const today = todayKey();
    if (profile.moodLog.some((m) => m.date === today)) return;
    persist({ ...profile, moodLog: [...profile.moodLog, { date: today, mood: moodId }] });
  }

  function handleFinishMiniGame({ moves }) {
    const today = todayKey();
    let coinsEarned = 0;
    let next = { ...profile };
    if (profile.miniGame.lastRewardDate !== today) {
      const boost = getBoostInfo(profile.accountCreatedAt);
      coinsEarned = applyBoost(15, boost.multiplier);
      next.coins += coinsEarned;
      next.miniGame = { ...next.miniGame, lastRewardDate: today };
      persist(next);
    }
    setShowMiniGame(false);
    showToast(coinsEarned > 0 ? `Hafıza görevi tamamlandı · ${moves} hamle · +${coinsEarned} coin` : `Hafıza görevi tamamlandı · ${moves} hamle`);
  }

  async function handleUploadTest(test) {
    await uploadTest(test);
    setTests((prev) => [...prev, test]);
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display text-xl animate-pulse">✨ Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen pb-28">
      <header className="px-4 sm:px-8 pt-4 pb-3 max-w-3xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#8B6CFF]/20 to-[#52E3FF]/10 text-[#A98CFF] shadow-lg">✦</div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-[.22em] text-[#687494]">Keşfet · Öğren · Ustalaş</p>
            <h1 className="font-display text-lg font-black tracking-tight">Bilgin Ustası</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <span className="game-chip" style={{ color: syncStatus === "synced" ? "#52E3C2" : syncStatus === "offline" ? "#FFD166" : "#A98CFF" }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: syncStatus === "synced" ? "#52E3C2" : syncStatus === "offline" ? "#FFD166" : "#A98CFF" }} />
            {syncStatus === "synced" ? "Senkron" : syncStatus === "offline" ? "Yerel" : "Bağlanıyor"}
          </span>
        </div>
      </header>

      {toast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 glass-card px-4 py-2.5 text-xs font-black animate-pop shadow-2xl">{toast}</div>
      )}

      <main className="px-4 sm:px-8 max-w-3xl mx-auto w-full">
        {activeTest ? (
          <TestSolver
            test={activeTest.test}
            isRetryTest={activeTest.isRetryTest}
            resumeState={activeTest.resumeState}
            onFinish={handleFinishTest}
            onCancel={() => setActiveTest(null)}
            onPause={handlePauseTest}
          />
        ) : pendingResult ? (
          <ResultScreen {...pendingResult} onClose={() => setPendingResult(null)} />
        ) : showMiniGame ? (
          <MemoryGame
            rewardAvailable={profile.miniGame.lastRewardDate !== todayKey()}
            onFinish={handleFinishMiniGame}
            onExit={() => setShowMiniGame(false)}
          />
        ) : showWorldMap ? (
          <WorldMap profile={profile} onClose={() => setShowWorldMap(false)} />
        ) : (
          <>
            {tab === "dashboard" && (
              <Dashboard
                profile={profile}
                tests={tests}
                onStartTest={handleStartTest}
                onGeneratePractice={handleGeneratePractice}
                onOpenMistakeBox={() => setTab("mistakes")}
                onLogMood={handleLogMood}
                onStartMiniGame={() => setShowMiniGame(true)}
                onOpenWorldMap={() => setShowWorldMap(true)}
                pausedTest={pausedTest}
                onResumeTest={handleResumeTest}
                onDiscardPausedTest={handleDiscardPausedTest}
              />
            )}
            {tab === "mistakes" && <MistakeBox profile={profile} onStartRetryTest={handleStartRetryTest} />}
            {tab === "wardrobe" && (
              <Wardrobe profile={profile} onChangeAvatar={handleChangeAvatar} onChangePet={handleChangePet} onChangeRoomSlot={handleChangeRoomSlot} />
            )}
            {tab === "shop" && <Shop profile={profile} onBuyItem={handleBuyItem} onRedeemReward={handleRedeemReward} />}
            {tab === "parent" && <ParentPanel profile={profile} onUpdateProfile={persist} onUploadTest={handleUploadTest} />}
          </>
        )}
      </main>

      {!activeTest && !pendingResult && !showMiniGame && !showWorldMap && <BottomNav active={tab} onChange={setTab} />}
      {worldUnlock && <WorldUnlockReveal world={worldUnlock} onClose={() => setWorldUnlock(null)} />}
    </div>
  );
}

function WorldUnlockReveal({ world, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#030612]/80 p-5 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at center, ${world.accent || world.color}18, transparent 45%)` }} />
      <div className="glass-card animate-pop relative w-full max-w-md overflow-hidden p-6 text-center" style={{ borderColor: `${world.accent || world.color}40`, background: "linear-gradient(145deg,rgba(22,30,61,.96),rgba(6,10,24,.97))" }}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl animate-pulse-glow" style={{ color: world.accent, background: `${world.accent}12`, border: `1px solid ${world.accent}30` }}>{world.emoji}</div>
        <p className="mt-4 text-[9px] font-black uppercase tracking-[.24em]" style={{ color: world.accent }}>Yeni Bölge Keşfedildi</p>
        <h2 className="font-display mt-1 text-2xl font-black">{world.title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-[#8793B4]">{world.blurb}</p>
        <button onClick={onClose} className="sticker-btn mt-5 w-full py-3 text-sm">Haritaya Eklendi ✓</button>
      </div>
    </div>
  );
}
