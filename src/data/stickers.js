export const STICKER_ALBUM = [
  { category: "Doğa Keşifleri", stickers: ["🌲","🌿","🌻","🦋","🍀","🐝","🌙","⛰️"] },
  { category: "Keşif Dostları", stickers: ["🦊","🐱","🐰","🐼","🐬","🦉","🐨","🐉"] },
  { category: "Bilim & İpuçları", stickers: ["🔬","🧪","🧭","🔎","⚙️","💡","🧠","📐"] },
  { category: "Zaman Arşivi", stickers: ["🏛️","🗺️","⌛","📜","🪙","🛡️","🏺","🔑"] },
  { category: "Yıldız İstasyonu", stickers: ["🚀","🪐","🌟","👾","🛸","🌙","☄️","✨"] },
  { category: "Derin Deniz", stickers: ["🐬","🐙","🐠","🪸","🐚","🦀","🪼","🌊"] },
  { category: "Kamp Rotası", stickers: ["⛺","🧭","🥾","🗺️","🔥","🚲","🎒","🌌"] },
  { category: "Ustalık Sembolleri", stickers: ["⚡","⭐","🏹","🛡️","🔥","💫","🏅","🏆"] },
];
export const STICKER_SEQUENCE=STICKER_ALBUM.flatMap((cat,catIdx)=>cat.stickers.map((emoji,i)=>({id:`sticker-${catIdx}-${i}`,emoji,category:cat.category})));
export function getNextStickerToUnlock(unlockedIds){return STICKER_SEQUENCE.find((s)=>!unlockedIds.includes(s.id))||null;}
