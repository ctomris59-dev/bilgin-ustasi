export const MOODS = [
  { id: "harika", emoji: "✨", label: "Süperim!" },
  { id: "mutlu", emoji: "🥰", label: "Çok Mutlu" },
  { id: "iyi", emoji: "😊", label: "İyiyim" },
  { id: "yorgun", emoji: "😴", label: "Yorgun" },
  { id: "uzgun", emoji: "🥺", label: "Biraz Üzgün" },
];

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
