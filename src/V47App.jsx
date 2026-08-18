import { useEffect, useState } from "react";
import AppShell from "./components/shell/AppShell";
import HeroHub from "./components/v47/HeroHub";
import LessonsHub from "./components/v47/LessonsHub";
import TasksHub from "./components/v47/TasksHub";
import TestSolver from "./components/TestSolver";
import ResultScreen from "./components/ResultScreen";
import StickerAlbum from "./components/StickerAlbum";
import ParentPanel from "./components/ParentPanel";
import { createDefaultProfile, getLocalProfile, saveLocalProfile, normalizeProfile } from "./lib/storage";
import { fetchCloudData, pushProfile, uploadTest } from "./lib/github";
import { calcTestRewards, updateStreak } from "./lib/gamification";
import { generatePracticeTest } from "./lib/practiceGenerator";
import { getWorldById } from "./data/worlds";
import { getLevelInfo } from "./data/levels";
import { playCoin, playPop } from "./lib/sound";

export default function V47App() {
  const [profile, setProfile] = useState(null);
  const [tests, setTests] = useState([]);
  const [tab, setTab] = useState("wardrobe");
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("loading");
  const [activeTest, setActiveTest] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { init(); }, []);

  async function init() {
    const local = getLocalProfile();
    try {
      const cloud = await fetchCloudData();
      const cloudProfile = normalizeProfile(cloud.profile);
      const next = cloudProfile || local || createDefaultProfile();
      setProfile(next);
      setTests(cloud.tests || []);
      saveLocalProfile(next);
      setSyncStatus("synced");
    } catch {
      setProfile(local || createDefaultProfile());
      setSyncStatus("offline");
    } finally {
      setLoading(false);
    }
  }

  async function persist(next) {
    setProfile(next);
    saveLocalProfile(next);
    try { await pushProfile(next); setSyncStatus("synced"); }
    catch { setSyncStatus("offline"); }
  }

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  }

  function startTest(test) {
    if (!test) return;
    playPop();
    setActiveTest({ test, isRetryTest: false });
  }

  function generatePractice(subject) {
    const test = generatePracticeTest(subject, tests);
    if (!test) { notify("Bu ders için soru havuzu hazırlanıyor."); return; }
    startTest(test);
  }

  function finishTest(result) {
    const rewards = calcTestRewards({ correctCount: result.correctCount, totalCount: result.totalCount, isRetryTest: false });
    const gemsEarned = result.correctCount === result.totalCount ? 1 : 0;
    const next = {
      ...profile,
      xp: (profile.xp || 0) + rewards.xp,
      coins: (profile.coins || 0) + rewards.coins,
      gems: (profile.gems || 0) + gemsEarned,
      history: [...(profile.history || []), {
        id: `h${Date.now()}`, testId: result.testId, subject: result.subject, date: new Date().toISOString(),
        correctCount: result.correctCount, totalCount: result.totalCount, xpEarned: rewards.xp, coinsEarned: rewards.coins, isRetry: false,
      }],
      mistakeBox: [...(profile.mistakeBox || []), ...(result.wrongQuestions || []).map((q) => ({
        id: `m${Date.now()}-${q.id}`, testId: result.testId, subject: result.subject, question: q, addedAt: new Date().toISOString(), resolved: false,
      }))],
      stats: {
        ...(profile.stats || {}),
        testsBySubject: { ...(profile.stats?.testsBySubject || {}), [result.subject]: (profile.stats?.testsBySubject?.[result.subject] || 0) + 1 },
        fullScoreBySubject: { ...(profile.stats?.fullScoreBySubject || {}), ...(result.correctCount === result.totalCount ? { [result.subject]: (profile.stats?.fullScoreBySubject?.[result.subject] || 0) + 1 } : {}) },
      },
    };
    next.streak = updateStreak(next, new Date().toISOString());
    persist(next);
    setActiveTest(null);
    setPendingResult({ result: { ...result, fullScore: result.correctCount === result.totalCount }, xpEarned: rewards.xp, coinsEarned: rewards.coins, speedBonus: 0, newBadges: [], newLegendaryItems: [], newSticker: null, boostActive: false, gemsEarned });
  }

  function changeAvatar(avatar) { persist({ ...profile, avatar }); }

  function buyItem(item) {
    if (!item || item.legendary || (profile.unlockedItems || []).includes(item.id)) return;
    const requiredLevel = getWorldById(item.world)?.unlockLevel || 1;
    if (getLevelInfo(profile.xp || 0).current.level < requiredLevel) { notify(`Bu eşya için Seviye ${requiredLevel} gerekiyor.`); return; }
    if ((profile.coins || 0) < (item.price || 0)) { notify("Yeterli coin yok."); return; }
    playCoin();
    persist({ ...profile, coins: profile.coins - item.price, unlockedItems: [...(profile.unlockedItems || []), item.id] });
    notify(`${item.label} açıldı!`);
  }

  async function handleUploadTest(test) {
    await uploadTest(test);
    setTests((prev) => [...prev, test]);
  }

  if (loading || !profile) return <div className="v47-loading"><span>✦</span><h1>Bilgin Kaşif Üssü hazırlanıyor...</h1></div>;

  const focusMode = Boolean(activeTest || pendingResult);
  const activeSection = activeTest ? "test" : pendingResult ? "result" : tab;

  return <>
    <AppShell profile={profile} tests={tests} syncStatus={syncStatus} activeSection={activeSection} tab={tab} onChangeTab={setTab} focusMode={focusMode}>
      {activeTest ? <TestSolver test={activeTest.test} isRetryTest={false} onFinish={finishTest} onCancel={() => setActiveTest(null)} onPause={() => setActiveTest(null)} />
      : pendingResult ? <ResultScreen {...pendingResult} onClose={() => { setPendingResult(null); setTab("lessons"); }} />
      : tab === "wardrobe" || tab === "shop" ? <HeroHub profile={profile} onChangeAvatar={changeAvatar} onOpenLessons={() => setTab("lessons")} onBuyItem={buyItem} />
      : tab === "lessons" ? <LessonsHub profile={profile} tests={tests} onStartTest={startTest} onGeneratePractice={generatePractice} />
      : tab === "dashboard" ? <TasksHub profile={profile} tests={tests} onStartTest={startTest} onOpenLessons={() => setTab("lessons")} />
      : tab === "archive" ? <div className="v47-legacy-wrap"><StickerAlbum profile={profile} /></div>
      : tab === "parent" ? <div className="v47-legacy-wrap"><ParentPanel profile={profile} onUpdateProfile={persist} onUploadTest={handleUploadTest} /></div>
      : <HeroHub profile={profile} onChangeAvatar={changeAvatar} onOpenLessons={() => setTab("lessons")} onBuyItem={buyItem} />}
    </AppShell>
    {toast && <div className="v47-toast">{toast}</div>}
  </>;
}
