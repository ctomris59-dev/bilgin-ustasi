export const MEMORY_THEMES = [
  { id: "meyveler", label: "Meyveler", emojis: ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉"] },
  { id: "hayvanlar", label: "Hayvanlar", emojis: ["🐶", "🐱", "🐰", "🦊", "🐼", "🐨"] },
  { id: "okul", label: "Okul Eşyaları", emojis: ["📚", "✏️", "🎒", "📐", "🖍️", "📏"] },
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
