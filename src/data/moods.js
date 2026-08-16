export const MOODS = [
  { id: "harika", emoji: "⚡", label: "Enerjik" },
  { id: "mutlu", emoji: "😊", label: "Keyifli" },
  { id: "iyi", emoji: "🙂", label: "İyi" },
  { id: "yorgun", emoji: "😴", label: "Yorgun" },
  { id: "uzgun", emoji: "😕", label: "Düşük" },
];
export function todayKey(date=new Date()){return date.toISOString().slice(0,10);}
