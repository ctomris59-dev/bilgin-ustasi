// --- Erken Başlangıç Bonusu ---
// İlk 8 hafta (56 gün) boyunca tüm XP/coin kazanımlarına çarpan uygulanır.
// Amaç: yeni başlayan çocuğun hızlı "kazanım hissi" alıp bağlanması.
// Hesap oluşturulma tarihinden itibaren sayılır (hangi test/hafta çözüldüğünden bağımsız).
export const EARLY_BOOST_MULTIPLIER = 1.5;
export const EARLY_BOOST_DAYS = 56;

export function getBoostInfo(accountCreatedAt) {
  if (!accountCreatedAt) return { active: false, multiplier: 1, daysLeft: 0 };
  const created = new Date(accountCreatedAt).getTime();
  const now = Date.now();
  const daysSince = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  const active = daysSince < EARLY_BOOST_DAYS;
  return { active, multiplier: active ? EARLY_BOOST_MULTIPLIER : 1, daysLeft: Math.max(0, EARLY_BOOST_DAYS - daysSince) };
}

export function applyBoost(amount, multiplier) {
  return Math.round(amount * multiplier);
}

// XP her zaman ödül olarak verilir; yanlış cevap XP KAYBI yaratmaz (cesaret kırılmasın).
export function calcTestRewards({ correctCount, totalCount, isRetryTest = false }) {
  const base = correctCount * 12; // her doğru için 12 XP
  const completionBonus = 15; // testi bitirdiği için (sonuç ne olursa olsun)
  const fullScore = totalCount > 0 && correctCount === totalCount;
  const fullScoreBonus = fullScore ? 40 : 0;
  const retryBonus = isRetryTest ? 10 : 0; // rövanş testini çözdüğü için ekstra teşvik

  const xp = base + completionBonus + fullScoreBonus + retryBonus;
  const coins = correctCount * 8 + (fullScore ? 25 : 0);

  return { xp, coins, fullScore };
}

export function calcSpeedBonus({ avgSecondsPerQuestion, targetSeconds }) {
  if (!targetSeconds) return 0;
  if (avgSecondsPerQuestion <= targetSeconds) return 20;
  if (avgSecondsPerQuestion <= targetSeconds * 1.25) return 8;
  return 0;
}

// Streak: haftalık bazda, en az 1 test tamamlanan hafta = seri devam eder.
// "Dondurma hakkı" (freeze): ayda 1 hafta kaçırma hakkı, seriyi bozmaz.
export function updateStreak(profile, completionDateISO) {
  const today = new Date(completionDateISO);
  const weekKey = getIsoWeekKey(today);
  const lastWeekKey = profile.streak.lastWeekKey;

  if (lastWeekKey === weekKey) {
    // Bu hafta zaten çözülmüş, seri değişmez
    return profile.streak;
  }

  const prevWeek = getPreviousWeekKey(weekKey);

  if (lastWeekKey === prevWeek || lastWeekKey === null) {
    // Ardışık hafta -> seri +1
    return {
      current: profile.streak.current + 1,
      longest: Math.max(profile.streak.longest, profile.streak.current + 1),
      lastWeekKey: weekKey,
      freezesAvailable: profile.streak.freezesAvailable,
    };
  }

  // Bir hafta atlanmış - dondurma hakkı varsa kullan
  if (profile.streak.freezesAvailable > 0) {
    return {
      current: profile.streak.current + 1,
      longest: Math.max(profile.streak.longest, profile.streak.current + 1),
      lastWeekKey: weekKey,
      freezesAvailable: profile.streak.freezesAvailable - 1,
    };
  }

  // Seri bozuldu, yeniden başla
  return {
    current: 1,
    longest: profile.streak.longest,
    lastWeekKey: weekKey,
    freezesAvailable: profile.streak.freezesAvailable,
  };
}

function getIsoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}

function getPreviousWeekKey(weekKey) {
  const [year, week] = weekKey.split("-W").map(Number);
  const approxDate = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  approxDate.setUTCDate(approxDate.getUTCDate() - 7);
  return getIsoWeekKey(approxDate);
}

export const BADGES = [
  { id: "matematik-canavari", label: "Matematik Canavarı", desc: "Matematikte 5 test %100 tamamla", check: (stats) => (stats.fullScoreBySubject["Matematik"] || 0) >= 5 },
  { id: "kitap-kurdu", label: "Kitap Kurdu", desc: "Türkçe'de 10 test tamamla", check: (stats) => (stats.testsBySubject["Türkçe"] || 0) >= 10 },
  { id: "haftanin-sampiyonu", label: "Haftanın Şampiyonu", desc: "4 hafta üst üste seri yap", check: (stats) => stats.streakCurrent >= 4 },
  { id: "hiz-ustasi", label: "Hız Ustası", desc: "Süreli modda 3 hız bonusu kazan", check: (stats) => (stats.speedBonusCount || 0) >= 3 },
  { id: "rovans-galibi", label: "Rövanş Galibi", desc: "5 rövanş testini başarıyla tamamla", check: (stats) => (stats.retryTestsPassed || 0) >= 5 },
  { id: "bilgin", label: "Bilgin", desc: "8. seviyeye ulaş", check: (stats) => stats.level >= 8 },
];

export function evaluateNewBadges(stats, alreadyEarnedIds) {
  return BADGES.filter((b) => !alreadyEarnedIds.includes(b.id) && b.check(stats)).map((b) => b.id);
}
