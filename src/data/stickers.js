export const STICKER_ALBUM = [
  {
    category: "Sihirli Bahçe 🌸",
    stickers: ["🌸", "🌈", "🌻", "🦋", "🌷", "🍀", "🐝", "🐞"],
  },
  {
    category: "Sevimli Dostlar 🐱",
    stickers: ["🦄", "🐱", "🐰", "🐼", "🦊", "🐬", "🦉", "🐨"],
  },
  {
    category: "Tatlı Dünyası 🧁",
    stickers: ["🧁", "🍩", "🍓", "🍦", "🍭", "🎂", "🎈", "🥞"],
  },
  {
    category: "Prenses & Şato 👑",
    stickers: ["👑", "🏰", "💎", "🔮", "🪄", "🎀", "📜", "👗"],
  },
  {
    category: "Uzay & Galaksi 🚀",
    stickers: ["🚀", "🪐", "🌟", "👾", "🛸", "🌙", "☄️", "✨"],
  },
  {
    category: "Deniz Altı Macerası 🧜‍♀️",
    stickers: ["🧜‍♀️", "🐙", "🐠", "🪸", "🐚", "🦀", "🪼", "🌊"],
  },
  {
    category: "Piknik & Doğa 🍉",
    stickers: ["🍉", "🧺", "🍋", "🥪", "🧃", "⛺", "🎸", "🚲"],
  },
  {
    category: "Süper Kızlar 🦸‍♀️",
    stickers: ["🦸‍♀️", "⚡", "⭐", "🏹", "🛡️", "🔥", "💫", "🏅"],
  },
];

export const STICKER_SEQUENCE = STICKER_ALBUM.flatMap((cat, catIdx) =>
  cat.stickers.map((emoji, i) => ({ id: `sticker-${catIdx}-${i}`, emoji, category: cat.category }))
);

export function getNextStickerToUnlock(unlockedIds) {
  return STICKER_SEQUENCE.find((s) => !unlockedIds.includes(s.id)) || null;
}
