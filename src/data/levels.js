export const LEVELS = [
  { level: 1, title: "Minik Keşifçi 🌸", minXp: 0 },
  { level: 2, title: "Meraklı Yıldız ⭐", minXp: 150 },
  { level: 3, title: "Akıllı Şeker 🍬", minXp: 400 },
  { level: 4, title: "Sihirli Öğrenci ✨", minXp: 800 },
  { level: 5, title: "Süper Kahraman Kız 🦸‍♀️", minXp: 1400 },
  { level: 6, title: "Bilgi Peri Kızı 🧚‍♀️", minXp: 2200 },
  { level: 7, title: "Prenses Bilgin 👑", minXp: 3200 },
  { level: 8, title: "Galaksi Ustası 🌌", minXp: 4500 },
  { level: 9, title: "Kristal Kraliçe 💎", minXp: 6200 },
  { level: 10, title: "Sonsuzluk Peri Kızı 🌟", minXp: 8300 },
  { level: 11, title: "Efsanevi Bilgin 👑", minXp: 11000 },
  { level: 12, title: "Galaksi Kraliçesi 🌠", minXp: 14500 },
];

const LAST_STATIC = LEVELS[LEVELS.length - 1];

function generateLevel(levelNumber) {
  if (levelNumber <= LEVELS.length) return LEVELS[levelNumber - 1];
  let minXp = LAST_STATIC.minXp;
  let prevSpan = LAST_STATIC.minXp - LEVELS[LEVELS.length - 2].minXp;
  for (let l = LAST_STATIC.level + 1; l <= levelNumber; l++) {
    prevSpan = Math.round(prevSpan * 1.35);
    minXp += prevSpan;
  }
  const tier = levelNumber - LAST_STATIC.level;
  return { level: levelNumber, title: `Galaksi Kraliçesi ✦${tier + 1}`, minXp };
}

export function getLevelInfo(totalXp) {
  let levelNumber = 1;
  while (true) {
    const lvl = generateLevel(levelNumber);
    const nextLvl = generateLevel(levelNumber + 1);
    if (totalXp < nextLvl.minXp) {
      const progressInLevel = totalXp - lvl.minXp;
      const spanOfLevel = nextLvl.minXp - lvl.minXp;
      const progressPct = Math.min(100, Math.round((progressInLevel / spanOfLevel) * 100));
      return { current: lvl, next: nextLvl, progressPct };
    }
    levelNumber++;
    if (levelNumber > 500) {
      return { current: lvl, next: null, progressPct: 100 };
    }
  }
}
