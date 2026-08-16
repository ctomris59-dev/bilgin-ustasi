// Her "Dünya", belirli bir seviyeye ulaşınca (yani yeterince soru çözüp XP
// kazanınca) açılan bir bölüm. Her dünyanın kendine özel avatar/pet/oda
// ödülleri var (catalog item'larındaki "world" alanıyla eşleşir).
// Yeni dünya eklemek: bu diziye bir obje eklemek + ilgili item'lara
// world id'sini işaretlemek yeterli, harita otomatik büyür.

export const WORLDS = [
  { id: "w1", order: 1, unlockLevel: 1, title: "Başlangıç Köyü", emoji: "🏡", color: "#8c6fff", blurb: "Yolculuğun başladığı yer. Günlük kıyafetler burada." },
  { id: "w2", order: 2, unlockLevel: 2, title: "Büyülü Orman", emoji: "🌲", color: "#45d6b5", blurb: "Büyücü şapkaları, cübbeler ve sihirli değnekler." },
  { id: "w3", order: 3, unlockLevel: 3, title: "Bilim Laboratuvarı", emoji: "🔬", color: "#4fc3f7", blurb: "Dedektif ve bilim insanı ekipmanları." },
  { id: "w4", order: 4, unlockLevel: 4, title: "Gökkuşağı Sahili", emoji: "🏖️", color: "#ffc93c", blurb: "Yaz temalı özel kıyafetler ve aksesuarlar." },
  { id: "w5", order: 5, unlockLevel: 5, title: "Yıldız Kalesi", emoji: "🏰", color: "#ff8fc7", blurb: "Işıltılı taç burada saklı — tam puanla kazanılır." },
  { id: "w6", order: 6, unlockLevel: 6, title: "Ejderha Vadisi", emoji: "🐉", color: "#2fa88c", blurb: "Efsanevi ejderha dostun burada bekliyor." },
  { id: "w7", order: 7, unlockLevel: 7, title: "Bulutların Ötesi", emoji: "☁️", color: "#a9c8ff", blurb: "Gökyüzü temalı yepyeni kıyafet ve oda eşyaları." },
  { id: "w8", order: 8, unlockLevel: 8, title: "Bilgin Zirvesi", emoji: "⛰️", color: "#f6d778", blurb: "Zirveye ulaştın! Ama yolculuk daha bitmedi..." },
  { id: "w9", order: 9, unlockLevel: 9, title: "Kristal Mağaralar", emoji: "💎", color: "#c9a8ff", blurb: "Parıldayan kristal temalı özel setler." },
  { id: "w10", order: 10, unlockLevel: 10, title: "Gökada Kulesi", emoji: "🌌", color: "#6b5fc9", blurb: "Uzay temalı en yeni koleksiyon." },
  { id: "w11", order: 11, unlockLevel: 11, title: "Altın Şehir", emoji: "🏛️", color: "#e8b84b", blurb: "Efsanevi Bilginlere özel altın koleksiyonu." },
  { id: "w12", order: 12, unlockLevel: 12, title: "Sonsuzluk Kapısı", emoji: "🌠", color: "#ff8fc7", blurb: "Buradan sonrası senin efsanen — her yeni seviye yeni bir hikaye!" },
];

export function isWorldUnlocked(worldId, currentLevel) {
  const world = WORLDS.find((w) => w.id === worldId);
  if (!world) return true; // world etiketi olmayan item'lar her zaman açık
  return currentLevel >= world.unlockLevel;
}

export function getWorldById(worldId) {
  return WORLDS.find((w) => w.id === worldId) || null;
}

export function getWorldForLevel(level) {
  return [...WORLDS].reverse().find((w) => level >= w.unlockLevel) || WORLDS[0];
}
