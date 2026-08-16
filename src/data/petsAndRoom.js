// Faz 3: Evcil Hayvan ve Oda Dekorasyonu
// Aynı unlockedItems dizisini kullanır (avatar parçalarıyla aynı mantık:
// coin ile satın alınır, rastgele değildir).
// Pet türleri "type" alanına göre çizilir (PetCanvas.jsx) - aynı türün farklı
// renk varyantlarını eklemek sadece veri eklemek demektir, çizim kodu gerekmez.

export const PET_SLOTS = { SPECIES: "petSpecies", ACCESSORY: "petAccessory" };
export const ROOM_SLOTS = { WALLPAPER: "wallpaper", RUG: "rug", DESK: "desk", LAMP: "lamp", PLANT: "plant", POSTER: "poster" };

export const PETS = [
  { id: "pet-cat-orange", slot: PET_SLOTS.SPECIES, world: "w1", label: "Turuncu Kedi", price: 160, color: "#ffc93c", type: "cat" },
  { id: "pet-cat-gray", slot: PET_SLOTS.SPECIES, world: "w1", label: "Gri Kedi", price: 160, color: "#b7b3c9", type: "cat" },
  { id: "pet-dog-brown", slot: PET_SLOTS.SPECIES, world: "w2", label: "Kahverengi Köpek", price: 160, color: "#8a6b3f", type: "dog" },
  { id: "pet-dog-white", slot: PET_SLOTS.SPECIES, world: "w2", label: "Beyaz Köpek", price: 160, color: "#f5f0e6", type: "dog" },
  { id: "pet-owl-purple", slot: PET_SLOTS.SPECIES, world: "w3", label: "Mor Baykuş", price: 160, color: "#8c6fff", type: "owl" },
  { id: "pet-owl-teal", slot: PET_SLOTS.SPECIES, world: "w3", label: "Nane Yeşili Baykuş", price: 160, color: "#45d6b5", type: "owl" },
  { id: "pet-phoenix", slot: PET_SLOTS.SPECIES, world: "w10", label: "Anka Kuşu", price: 260, color: "#ff8f5c", type: "dragon" },
  // Efsanevi - sadece %100 tam puanla kazanılır. Dünya 6'nın ödülü.
  { id: "pet-dragon", slot: PET_SLOTS.SPECIES, world: "w6", label: "Ejderha", price: 0, color: "#2fa88c", type: "dragon", legendary: true, unlock: { type: "fullScore", subject: "Fen Bilimleri" } },
];

export const PET_ACCESSORIES = [
  { id: "pet-collar", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Turuncu Tasma", price: 35, color: "#f2765a" },
  { id: "pet-collar-blue", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Mavi Tasma", price: 35, color: "#4fc3f7" },
  { id: "pet-bow", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Fiyonk", price: 35, color: "#e8b84b" },
  { id: "pet-scarf", slot: PET_SLOTS.ACCESSORY, world: "w2", label: "Küçük Atkı", price: 35, color: "#2fa88c" },
];

export const ROOM_ITEMS = [
  { id: "wallpaper-stars", slot: ROOM_SLOTS.WALLPAPER, world: "w2", label: "Yıldızlı Gökyüzü Duvar Kağıdı", price: 80, color: "#8c6fff" },
  { id: "wallpaper-forest", slot: ROOM_SLOTS.WALLPAPER, world: "w2", label: "Orman Duvar Kağıdı", price: 80, color: "#45d6b5" },
  { id: "wallpaper-candy", slot: ROOM_SLOTS.WALLPAPER, world: "w1", label: "Şeker Pembesi Duvar Kağıdı", price: 80, color: "#ff8fc7" },
  { id: "wallpaper-sunny", slot: ROOM_SLOTS.WALLPAPER, world: "w4", label: "Güneşli Sarı Duvar Kağıdı", price: 80, color: "#ffc93c" },

  { id: "rug-round", slot: ROOM_SLOTS.RUG, world: "w1", label: "Sarı Yuvarlak Halı", price: 60, color: "#e8b84b" },
  { id: "rug-striped", slot: ROOM_SLOTS.RUG, world: "w4", label: "Mercan Halı", price: 60, color: "#f2765a" },
  { id: "rug-mint", slot: ROOM_SLOTS.RUG, world: "w3", label: "Nane Yeşili Halı", price: 60, color: "#45d6b5" },

  { id: "desk-wood", slot: ROOM_SLOTS.DESK, world: "w1", label: "Ahşap Çalışma Masası", price: 100, color: "#8a6b3f" },
  { id: "desk-white", slot: ROOM_SLOTS.DESK, world: "w3", label: "Beyaz Çalışma Masası", price: 100, color: "#eef3f0" },
  { id: "desk-pink", slot: ROOM_SLOTS.DESK, world: "w4", label: "Pembe Çalışma Masası", price: 100, color: "#ff8fc7" },

  { id: "lamp-star", slot: ROOM_SLOTS.LAMP, world: "w2", label: "Yıldız Lambader", price: 50, color: "#f6d778" },
  { id: "lamp-moon", slot: ROOM_SLOTS.LAMP, world: "w5", label: "Ay Lambader", price: 50, color: "#bfe9dc" },

  { id: "plant-cactus", slot: ROOM_SLOTS.PLANT, world: "w4", label: "Saksı Kaktüs", price: 45, color: "#45d6b5" },
  { id: "plant-flower", slot: ROOM_SLOTS.PLANT, world: "w2", label: "Çiçekli Saksı", price: 45, color: "#ff8fc7" },

  { id: "poster-stars", slot: ROOM_SLOTS.POSTER, world: "w7", label: "Yıldız Haritası Posteri", price: 55, color: "#8c6fff" },
  { id: "poster-rainbow", slot: ROOM_SLOTS.POSTER, world: "w4", label: "Gökkuşağı Posteri", price: 55, color: "#ff6f61" },
  { id: "wallpaper-galaxy", slot: ROOM_SLOTS.WALLPAPER, world: "w10", label: "Gökada Duvar Kağıdı", price: 110, color: "#6b5fc9" },
  { id: "rug-gold", slot: ROOM_SLOTS.RUG, world: "w11", label: "Altın Halı", price: 130, color: "#e8b84b" },
];

export const DEFAULT_PET_STATE = { activeSpecies: null, accessory: null };
export const DEFAULT_ROOM_STATE = { wallpaper: null, rug: null, desk: null, lamp: null, plant: null, poster: null };

export const ALL_PET_ROOM_ITEMS = [...PETS, ...PET_ACCESSORIES, ...ROOM_ITEMS];
