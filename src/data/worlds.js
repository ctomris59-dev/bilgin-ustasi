export const WORLDS = [
  { id: "w1", order: 1, unlockLevel: 1, title: "Pamuk Şeker Köyü 🌸", emoji: "🏡", color: "#FF70A6", blurb: "Yolculuğun başladığı sevimli yer. Günlük kıyafetler burada." },
  { id: "w2", order: 2, unlockLevel: 2, title: "Sihirli Peri Ormanı ✨", emoji: "🌲", color: "#B5838D", blurb: "Peri elbiseleri, taçlar ve sihirli değnekler." },
  { id: "w3", order: 3, unlockLevel: 3, title: "Tatlı Dedektif Odası 🔍", emoji: "🔬", color: "#52E3C2", blurb: "Gözlükler, önlükler ve dedektif şapkaları." },
  { id: "w4", order: 4, unlockLevel: 4, title: "Denizkızı Sahili 🧜‍♀️", emoji: "🏖️", color: "#70D6FF", blurb: "Denizkızı kostümleri ve yaz aksesuarları." },
  { id: "w5", order: 5, unlockLevel: 5, title: "Yıldızlı Prenses Şatosu 🏰", emoji: "🏰", color: "#FFD166", blurb: "Işıltılı kristal taç burada saklı — tam puanla kazanılır." },
  { id: "w6", order: 6, unlockLevel: 6, title: "Bebek Ejderha Vadisi 🐉", emoji: "🐉", color: "#52E3C2", blurb: "Efsanevi ejderha dostun ve kelebek kanatları burada." },
  { id: "w7", order: 7, unlockLevel: 7, title: "Bulutların Ötesi ☁️", emoji: "☁️", color: "#E0A3FF", blurb: "Pofuduk bulut elbiseleri ve melek haleleri." },
  { id: "w8", order: 8, unlockLevel: 8, title: "Bilgin Zirvesi ⭐", emoji: "⛰️", color: "#FFF275", blurb: "Büyük başarı! Yıldızlar seninle parlıyor." },
  { id: "w9", order: 9, unlockLevel: 9, title: "Kristal Peri Mağaraları 💎", emoji: "💎", color: "#E0A3FF", blurb: "Parıldayan kristal balo elbiseleri." },
  { id: "w10", order: 10, unlockLevel: 10, title: "Galaksi Kulesi 🌌", emoji: "🌌", color: "#B5838D", blurb: "Uzay ve simli galaksi koleksiyonu." },
  { id: "w11", order: 11, unlockLevel: 11, title: "Altın Şehir 👑", emoji: "🏛️", color: "#FFD166", blurb: "Kraliçelere özel altın balo kostümleri." },
  { id: "w12", order: 12, unlockLevel: 12, title: "Sonsuzluk Kapısı 🌠", emoji: "🌠", color: "#FF8FC7", blurb: "Galaksi peri kanatları ve en efsanevi ödüller!" },
];

export function isWorldUnlocked(worldId, currentLevel) {
  const world = WORLDS.find((w) => w.id === worldId);
  if (!world) return true;
  return currentLevel >= world.unlockLevel;
}

export function getWorldById(worldId) {
  return WORLDS.find((w) => w.id === worldId) || null;
}

export function getWorldForLevel(level) {
  return [...WORLDS].reverse().find((w) => level >= w.unlockLevel) || WORLDS[0];
}
