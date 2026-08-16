// Sticker'lar RASTGELE değil, SIRAYLA açılır: her test tamamlandığında
// albümdeki bir sonraki sticker garanti olarak kilidini açar. Gacha değildir.

export const STICKER_ALBUM = [
  {
    category: "Doğa",
    stickers: ["🌸", "🌈", "🌻", "🍀", "🌊", "⭐", "🌙", "☀️"],
  },
  {
    category: "Hayvanlar",
    stickers: ["🦋", "🐬", "🦄", "🐢", "🦔", "🐝", "🦉", "🐙"],
  },
  {
    category: "Tatlı & Eğlence",
    stickers: ["🍭", "🧁", "🍩", "🍓", "🎈", "🎨", "🎪", "🎁"],
  },
  {
    category: "Uzay & Macera",
    stickers: ["🚀", "🪐", "🌟", "🧭", "🗺️", "🏰", "🔭", "💎"],
  },
];

// Düz (kategori sınırı olmayan) sıralı dizi - unlock sırası bu diziye göre işler
export const STICKER_SEQUENCE = STICKER_ALBUM.flatMap((cat, catIdx) =>
  cat.stickers.map((emoji, i) => ({ id: `sticker-${catIdx}-${i}`, emoji, category: cat.category }))
);

export function getNextStickerToUnlock(unlockedIds) {
  return STICKER_SEQUENCE.find((s) => !unlockedIds.includes(s.id)) || null;
}
