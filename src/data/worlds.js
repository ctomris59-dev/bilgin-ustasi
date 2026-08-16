export const WORLDS = [
  {
    id: "w1",
    order: 1,
    unlockLevel: 1,

    title: "Bilgi Köyü",
    shortTitle: "Bilgi Köyü",

    emoji: "⌂",

    color: "#6F8CFF",
    accent: "#52E3FF",

    terrain: "village",

    mapX: 50,
    mapY: 90,

    blurb:
      "Her maceranın bir başlangıç noktası vardır. İlk görevlerin ve keşif yolculuğun burada başlıyor.",
  },

  {
    id: "w2",
    order: 2,
    unlockLevel: 2,

    title: "Kelime Ormanı",
    shortTitle: "Kelime Ormanı",

    emoji: "♣",

    color: "#3FC69B",
    accent: "#52E3C2",

    terrain: "forest",

    mapX: 28,
    mapY: 80,

    blurb:
      "Sözcüklerin, anlamların ve gizli ipuçlarının arasında ilerleyen yemyeşil bir keşif bölgesi.",
  },

  {
    id: "w3",
    order: 3,
    unlockLevel: 3,

    title: "Sayı Dağları",
    shortTitle: "Sayı Dağları",

    emoji: "▲",

    color: "#648DFF",
    accent: "#70D6FF",

    terrain: "mountain",

    mapX: 68,
    mapY: 72,

    blurb:
      "Her doğru çözüm seni biraz daha yukarı taşıyor. Zirveye ulaşmak dikkat ve strateji gerektiriyor.",
  },

  {
    id: "w4",
    order: 4,
    unlockLevel: 4,

    title: "Keşif Vadisi",
    shortTitle: "Keşif Vadisi",

    emoji: "◇",

    color: "#3CCFBA",
    accent: "#65F0D7",

    terrain: "science",

    mapX: 35,
    mapY: 63,

    blurb:
      "Doğanın sırları, deneyler ve merak uyandıran keşifler bu vadide seni bekliyor.",
  },

  {
    id: "w5",
    order: 5,
    unlockLevel: 5,

    title: "Zaman Şehri",
    shortTitle: "Zaman Şehri",

    emoji: "⬡",

    color: "#D8A84E",
    accent: "#FFD166",

    terrain: "ancient-city",

    mapX: 72,
    mapY: 54,

    blurb:
      "Geçmişin izleri arasında ilerle. Eski yapılar, olaylar ve kültürler burada yeniden canlanıyor.",
  },

  {
    id: "w6",
    order: 6,
    unlockLevel: 6,

    title: "Dil Limanı",
    shortTitle: "Dil Limanı",

    emoji: "≈",

    color: "#5ABCD8",
    accent: "#70D6FF",

    terrain: "harbor",

    mapX: 32,
    mapY: 45,

    blurb:
      "Farklı dillerden kelimelerin ve yeni ifadelerin dünyaya açıldığı hareketli keşif limanı.",
  },

  {
    id: "w7",
    order: 7,
    unlockLevel: 7,

    title: "Fırtına Adaları",
    shortTitle: "Fırtına Adaları",

    emoji: "ϟ",

    color: "#8C73E6",
    accent: "#A98CFF",

    terrain: "islands",

    mapX: 66,
    mapY: 37,

    blurb:
      "Hızlı düşünme ve dikkat gerektiren görevlerin bulunduğu zorlu adalar zinciri.",
  },

  {
    id: "w8",
    order: 8,
    unlockLevel: 8,

    title: "Bilgin Zirvesi",
    shortTitle: "Bilgin Zirvesi",

    emoji: "△",

    color: "#E2B957",
    accent: "#FFE38A",

    terrain: "summit",

    mapX: 42,
    mapY: 29,

    blurb:
      "Buraya kadar gelmek gerçek bir başarı. Zorlu görevler artık bilgini ustalık seviyesinde sınayacak.",
  },

  {
    id: "w9",
    order: 9,
    unlockLevel: 9,

    title: "Kristal Mağaraları",
    shortTitle: "Kristal Mağaraları",

    emoji: "◆",

    color: "#9879E8",
    accent: "#C39BFF",

    terrain: "cave",

    mapX: 72,
    mapY: 22,

    blurb:
      "Derinlerde saklanan nadir ödüllere ulaşmak için karanlık geçitleri ve bilgi görevlerini aş.",
  },

  {
    id: "w10",
    order: 10,
    unlockLevel: 10,

    title: "Yıldız İstasyonu",
    shortTitle: "Yıldız İstasyonu",

    emoji: "✦",

    color: "#536DDF",
    accent: "#7DE4FF",

    terrain: "space",

    mapX: 38,
    mapY: 15,

    blurb:
      "Dünya sınırlarının ötesine geçtin. Artık daha gelişmiş görevler ve özel koleksiyonlar açılıyor.",
  },

  {
    id: "w11",
    order: 11,
    unlockLevel: 11,

    title: "Altın Arşiv",
    shortTitle: "Altın Arşiv",

    emoji: "▣",

    color: "#C99A3F",
    accent: "#FFD166",

    terrain: "archive",

    mapX: 63,
    mapY: 8,

    blurb:
      "En değerli bilgiler ve ustalık ödülleri yalnızca deneyimli keşifçilerin ulaşabildiği bu arşivde saklanıyor.",
  },

  {
    id: "w12",
    order: 12,
    unlockLevel: 12,

    title: "Sonsuzluk Kapısı",
    shortTitle: "Sonsuzluk Kapısı",

    emoji: "✧",

    color: "#916FFF",
    accent: "#C9B5FF",

    terrain: "portal",

    mapX: 50,
    mapY: 2,

    blurb:
      "Bilgin Ustası yolculuğunun en ileri noktası. Burada artık yalnızca öğrenmez, ustalığını kanıtlarsın.",
  },
];


/* =========================================================
   WORLD HELPERS
========================================================= */

export function isWorldUnlocked(
  worldId,
  currentLevel
) {
  const world = WORLDS.find(
    (item) => item.id === worldId
  );

  if (!world) {
    return true;
  }

  return currentLevel >= world.unlockLevel;
}


export function getWorldById(worldId) {
  return (
    WORLDS.find(
      (item) => item.id === worldId
    ) || null
  );
}


export function getWorldForLevel(level) {
  return (
    [...WORLDS]
      .reverse()
      .find(
        (world) =>
          level >= world.unlockLevel
      ) || WORLDS[0]
  );
}


/* =========================================================
   CURRENT + NEXT WORLD
========================================================= */

export function getWorldProgress(level) {
  const currentWorld =
    getWorldForLevel(level);

  const nextWorld =
    WORLDS.find(
      (world) =>
        world.unlockLevel >
        currentWorld.unlockLevel
    ) || null;

  return {
    currentWorld,
    nextWorld,
  };
}


/* =========================================================
   WORLD STATUS
========================================================= */

export function getWorldStatus(
  world,
  currentLevel
) {
  const unlocked =
    currentLevel >= world.unlockLevel;

  const currentWorld =
    getWorldForLevel(currentLevel);

  const isCurrent =
    currentWorld.id === world.id;

  const completed =
    unlocked &&
    world.order < currentWorld.order;

  return {
    unlocked,
    isCurrent,
    completed,
    locked: !unlocked,
  };
}
