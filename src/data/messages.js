export const GREETING_MESSAGES = [
  'Bugünkü görev hazır. Küçük bir adım bile ilerleme demek.',
  'Yeni bir keşfe başlayalım mı? Bugünkü hedefin seni bekliyor.',
  'Yanlış cevaplar ipucudur. Öğrenmenin en güçlü kısmı tekrar etmektir.',
  'Bugün hangi bölgede biraz daha ustalaşmak istersin?',
  'Düzenli çalışmak en güçlü özel yeteneklerden biridir.',
  'Tekrar Merkezi’nde birkaç soru seni bekliyor. Rövanş zamanı olabilir.',
  'Yeni bir bölgenin kilidini açmaya sandığından daha yakın olabilirsin.',
  'Görevi tamamla, XP kazan ve keşif haritanı genişlet.',
];

export const NO_TEST_MESSAGES = [
  'Şimdilik yeni görev görünmüyor. Tekrar Merkezi’ndeki sorularla bilgini güçlendirebilirsin.',
  'Yeni görev gelene kadar karakterini ve Kaşif Üssü’nü geliştirebilirsin.',
];

export function getRandomGreeting() {
  return GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
}
