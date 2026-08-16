export const GREETING_MESSAGES = [
  "Bugünkü testte başarılar! Sana inanıyorum. 💪",
  "Hazır mısın? Birlikte yeni bir şeyler öğrenelim! ✨",
  "Az önce gardırobunu çok beğendim, harika görünüyorsun!",
  "Unutma, yanlış yapmak öğrenmenin bir parçası. Denemeye devam! 🌟",
  "Bugün hangi dersten test çözmek istersin?",
  "Serini bozma, bu hafta da devam edelim! 🔥",
  "Hata Kutusu'ndaki sorulara bir göz atalım mı?",
  "Yeni bir rozet kazanmana çok az kaldı!",
];

export const NO_TEST_MESSAGES = [
  "Bu hafta henüz test yok, ama gardırobunu düzenleyebilirsin!",
  "Ebeveynin yeni bir test yükleyene kadar mağazaya göz atabilirsin.",
];

export function getRandomGreeting() {
  return GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
}
