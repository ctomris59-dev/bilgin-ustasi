export const MEMORY_THEMES = [
  { id: "meyveler", label: "Tatlı Meyveler 🍓", emojis: ["🍓", "🍌", "🍇", "🍒", "🍑", "🍉"] },
  { id: "sevimli", label: "Sevimli Dostlar 🐱", emojis: ["🦄", "🐱", "🐰", "🐼", "🦊", "🐨"] },
  { id: "tatlilar", label: "Şeker & Tatlılar 🧁", emojis: ["🧁", "🍩", "🍦", "🍭", "🍰", "🍫"] },
  { id: "deniz", label: "Deniz Altı 🧜‍♀️", emojis: ["🧜‍♀️", "🐙", "🐠", "🐚", "🦀", "🪼"] },
  { id: "uzay", label: "Galaksi ✨", emojis: ["🚀", "🪐", "🌟", "🛸", "🌙", "☄️"] },
];

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildDeck(theme) {
  const pairs = theme.emojis.flatMap((emoji, i) => [
    { id: `${i}-a`, pairId: i, emoji },
    { id: `${i}-b`, pairId: i, emoji },
  ]);
  return shuffle(pairs);
}
