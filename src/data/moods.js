export const MOODS = [
  { id: "harika", emoji: "🤩", label: "Harika" },
  { id: "iyi", emoji: "🙂", label: "İyi" },
  { id: "normal", emoji: "😐", label: "Fena değil" },
  { id: "uzgun", emoji: "😔", label: "Üzgün" },
  { id: "sinirli", emoji: "😠", label: "Sinirli" },
];

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}
