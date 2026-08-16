// Seviye sistemi: her seviye için gereken toplam kümülatif XP.
// İlk 12 seviye dünyalarla (worlds.js) birebir eşleşir. 12'nin ötesinde
// sistem PROSEDÜREL olarak yeni seviyeler üretir (asla "bitmez") - böylece
// aylarca oynansa bile her zaman bir sonraki hedef olur.
export const LEVELS = [
  { level: 1, title: "Çaylak Öğrenci", minXp: 0 },
  { level: 2, title: "Meraklı Çırak", minXp: 1000 },
  { level: 3, title: "Bilgi Çırağı", minXp: 2600 },
  { level: 4, title: "Yetenekli Öğrenci", minXp: 5200 },
  { level: 5, title: "Uzman Adayı", minXp: 9200 },
  { level: 6, title: "Uzman", minXp: 14400 },
  { level: 7, title: "Usta Bilgin", minXp: 21000 },
  { level: 8, title: "Bilgin", minXp: 29500 },
  { level: 9, title: "Bilgin Ustası", minXp: 40600 },
  { level: 10, title: "Bilgelik Şövalyesi", minXp: 54400 },
  { level: 11, title: "Bilgi Büyücüsü", minXp: 72000 },
  { level: 12, title: "Efsanevi Bilgin", minXp: 95000 },
];

const LAST_STATIC = LEVELS[LEVELS.length - 1];

// 12. seviyeden sonrası için prosedürel üretim: her seviye bir öncekinden
// %35 daha fazla XP ister, sonsuz bir "hep bir hedef var" hissi yaratır.
function generateLevel(levelNumber) {
  if (levelNumber <= LEVELS.length) return LEVELS[levelNumber - 1];
  let minXp = LAST_STATIC.minXp;
  let prevSpan = LAST_STATIC.minXp - LEVELS[LEVELS.length - 2].minXp;
  for (let l = LAST_STATIC.level + 1; l <= levelNumber; l++) {
    prevSpan = Math.round(prevSpan * 1.35);
    minXp += prevSpan;
  }
  const tier = levelNumber - LAST_STATIC.level;
  return { level: levelNumber, title: `Efsanevi Bilgin ✦${tier + 1}`, minXp };
}

export function getLevelInfo(totalXp) {
  let levelNumber = 1;
  // Tablodaki seviyeleri tara
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
      // güvenlik freni - pratikte asla ulaşılmaz
      return { current: lvl, next: null, progressPct: 100 };
    }
  }
}
