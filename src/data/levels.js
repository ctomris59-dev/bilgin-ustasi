export const LEVELS = [
  { level: 1, title: 'Meraklı Kaşif', minXp: 0 },
  { level: 2, title: 'Bilgi Avcısı', minXp: 150 },
  { level: 3, title: 'İz Sürücü', minXp: 400 },
  { level: 4, title: 'Keşifçi', minXp: 800 },
  { level: 5, title: 'Usta Çırak', minXp: 1400 },
  { level: 6, title: 'Bilgi Gezgini', minXp: 2200 },
  { level: 7, title: 'Macera Ustası', minXp: 3200 },
  { level: 8, title: 'Bilgin', minXp: 4500 },
  { level: 9, title: 'Bilgi Kâşifi', minXp: 6200 },
  { level: 10, title: 'Usta Bilgin', minXp: 8300 },
  { level: 11, title: 'Arşiv Muhafızı', minXp: 11000 },
  { level: 12, title: 'Efsane Bilgin', minXp: 14500 },
];

const LAST_STATIC = LEVELS[LEVELS.length - 1];

function generateLevel(levelNumber) {
  if (levelNumber <= LEVELS.length) return LEVELS[levelNumber - 1];
  let minXp = LAST_STATIC.minXp;
  let prevSpan = LAST_STATIC.minXp - LEVELS[LEVELS.length - 2].minXp;
  for (let l = LAST_STATIC.level + 1; l <= levelNumber; l += 1) {
    prevSpan = Math.round(prevSpan * 1.35);
    minXp += prevSpan;
  }
  return { level: levelNumber, title: `Efsane Bilgin ${levelNumber - LAST_STATIC.level + 1}`, minXp };
}

export function getLevelInfo(totalXp) {
  let levelNumber = 1;
  while (true) {
    const lvl = generateLevel(levelNumber);
    const nextLvl = generateLevel(levelNumber + 1);
    if (totalXp < nextLvl.minXp) {
      const progressInLevel = totalXp - lvl.minXp;
      const spanOfLevel = nextLvl.minXp - lvl.minXp;
      const progressPct = Math.min(100, Math.max(0, Math.round((progressInLevel / spanOfLevel) * 100)));
      return { current: lvl, next: nextLvl, progressPct };
    }
    levelNumber += 1;
    if (levelNumber > 500) return { current: lvl, next: null, progressPct: 100 };
  }
}
