export const GREETING_MESSAGES = [
  "Bugünkü testte sana başarılar dilerim! Harika işler çıkaracaksın! 💕",
  "Hazır mısın? Birlikte sihirli yeni şeyler öğrenelim! ✨",
  "Kombinin bugün muhteşem görünüyor! Çok şıksın! 💖",
  "Unutma, yanlış yapmak öğrenmenin en tatlı parçası! 🌟",
  "Bugün hangi dersten yıldız toplamak istersin? ⭐",
  "Alevli serini bozma, harika gidiyorsun! 🔥",
  "Hata Kutusu'ndaki soruları temizleyip ekstra coin kazanalım mı? 📦",
  "Yeni bir rozet kazanmana çok az kaldı, sabırsızlanıyorum! 🏅",
];

export const NO_TEST_MESSAGES = [
  "Bu hafta henüz yeni test yok, ama karakterini giydirip odanı süsleyebilirsin! 🛋️",
  "Ebeveynin yeni bir test yükleyene kadar mağazadaki tatlı eşyalara göz atabilirsin! 🛍️",
];

export function getRandomGreeting() {
  return GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
}
