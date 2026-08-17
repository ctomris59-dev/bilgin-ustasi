export const PET_SLOTS = { SPECIES: "petSpecies", ACCESSORY: "petAccessory" };
export const ROOM_SLOTS = { WALLPAPER: "wallpaper", RUG: "rug", DESK: "desk", LAMP: "lamp", PLANT: "plant", POSTER: "poster" };

const CORE_PETS = [
  { id: "pet-cat-orange", slot: PET_SLOTS.SPECIES, world: "w1", label: "Turuncu Keşif Kedisi", price: 160, color: "#FF9EAA", type: "cat" },
  { id: "pet-cat-gray", slot: PET_SLOTS.SPECIES, world: "w1", label: "Gri Keşif Kedisi", price: 160, color: "#B5838D", type: "cat" },
  { id: "pet-dog-brown", slot: PET_SLOTS.SPECIES, world: "w2", label: "Altın İzci Köpeği", price: 160, color: "#FFD166", type: "dog" },
  { id: "pet-dog-white", slot: PET_SLOTS.SPECIES, world: "w2", label: "Beyaz İzci Köpeği", price: 160, color: "#FFFFFF", type: "dog" },
  { id: "pet-owl-purple", slot: PET_SLOTS.SPECIES, world: "w3", label: "Orman Baykuşu", price: 160, color: "#52E3C2", type: "owl" },
  { id: "pet-owl-teal", slot: PET_SLOTS.SPECIES, world: "w3", label: "Gökyüzü Baykuşu", price: 160, color: "#70D6FF", type: "owl" },
  { id: "pet-phoenix", slot: PET_SLOTS.SPECIES, world: "w10", label: "Kozmik Dost", price: 260, color: "#E0A3FF", type: "dragon" },
  // Efsanevi
  { id: "pet-dragon", slot: PET_SLOTS.SPECIES, world: "w6", label: "Mini Ejderha", price: 0, color: "#52E3C2", type: "dragon", legendary: true, unlock: { type: "fullScore", subject: "Fen Bilimleri" } },
];

const CORE_PET_ACCESSORIES = [
  { id: "pet-collar", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Mercan Tasma", price: 35, color: "#FF70A6" },
  { id: "pet-collar-blue", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Mavi Tasma", price: 35, color: "#70D6FF" },
  { id: "pet-bow", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Altın İşaret", price: 35, color: "#FFD166" },
  { id: "pet-scarf", slot: PET_SLOTS.ACCESSORY, world: "w2", label: "Orman Atkısı", price: 35, color: "#52E3C2" },
];

const CORE_ROOM_ITEMS = [
  { id: "wallpaper-stars", slot: ROOM_SLOTS.WALLPAPER, world: "w2", label: "Gece Yıldızları", price: 80, color: "#FF9EAA" },
  { id: "wallpaper-forest", slot: ROOM_SLOTS.WALLPAPER, world: "w2", label: "Orman Duvarı", price: 80, color: "#52E3C2" },
  { id: "wallpaper-candy", slot: ROOM_SLOTS.WALLPAPER, world: "w1", label: "Gökyüzü Bulutları", price: 80, color: "#70D6FF" },
  { id: "wallpaper-sunny", slot: ROOM_SLOTS.WALLPAPER, world: "w4", label: "Güneş Duvarı", price: 80, color: "#FFD166" },

  { id: "rug-round", slot: ROOM_SLOTS.RUG, world: "w1", label: "Pusula Halısı", price: 60, color: "#FFD166" },
  { id: "rug-striped", slot: ROOM_SLOTS.RUG, world: "w4", label: "Kızıl Çizgili Halı", price: 60, color: "#FF70A6" },
  { id: "rug-mint", slot: ROOM_SLOTS.RUG, world: "w3", label: "Bulut Halısı", price: 60, color: "#70D6FF" },

  { id: "desk-wood", slot: ROOM_SLOTS.DESK, world: "w1", label: "Keşif Masası", price: 100, color: "#FF9EAA" },
  { id: "desk-white", slot: ROOM_SLOTS.DESK, world: "w3", label: "Araştırma Masası", price: 100, color: "#B5838D" },
  { id: "desk-pink", slot: ROOM_SLOTS.DESK, world: "w4", label: "Laboratuvar Masası", price: 100, color: "#52E3C2" },

  { id: "lamp-star", slot: ROOM_SLOTS.LAMP, world: "w2", label: "Yıldız Lambası", price: 50, color: "#FFF275" },
  { id: "lamp-moon", slot: ROOM_SLOTS.LAMP, world: "w5", label: "Ay Lambası", price: 50, color: "#FF9EAA" },

  { id: "plant-cactus", slot: ROOM_SLOTS.PLANT, world: "w4", label: "Saksı Kaktüs", price: 45, color: "#52E3C2" },
  { id: "plant-flower", slot: ROOM_SLOTS.PLANT, world: "w2", label: "Renkli Bitki", price: 45, color: "#FF8FC7" },

  { id: "poster-stars", slot: ROOM_SLOTS.POSTER, world: "w7", label: "Yıldız Haritası", price: 55, color: "#B5838D" },
  { id: "poster-rainbow", slot: ROOM_SLOTS.POSTER, world: "w4", label: "Keşif Rotası Posteri", price: 55, color: "#FF70A6" },
  { id: "wallpaper-galaxy", slot: ROOM_SLOTS.WALLPAPER, world: "w10", label: "Yıldız İstasyonu Duvarı", price: 110, color: "#B5838D" },
  { id: "rug-gold", slot: ROOM_SLOTS.RUG, world: "w11", label: "Altın Arşiv Halısı", price: 130, color: "#FFD166" },
];


// ===== V4.3 PREMIUM CATALOG EXPANSION =====
const V43_PETS = [
  { id: "pet-v4-husky", slot: PET_SLOTS.SPECIES, world: "w1", label: "Kaya Husky", price: 220, color: "#52E3FF", type: "dog" },
  { id: "pet-v4-fox-red", slot: PET_SLOTS.SPECIES, world: "w2", label: "Kızıl Tilki", price: 260, color: "#FF826E", type: "fox" },
  { id: "pet-v4-fox-snow", slot: PET_SLOTS.SPECIES, world: "w3", label: "Kar Tilkisi", price: 300, color: "#FFD166", type: "fox" },
  { id: "pet-v4-owl-gold", slot: PET_SLOTS.SPECIES, world: "w4", label: "Altın Baykuş", price: 340, color: "#9A7BFF", type: "owl" },
  { id: "pet-v4-owl-night", slot: PET_SLOTS.SPECIES, world: "w5", label: "Gece Baykuşu", price: 380, color: "#52E3C2", type: "owl" },
  { id: "pet-v4-drone-blue", slot: PET_SLOTS.SPECIES, world: "w6", label: "Mavi Drone", price: 220, color: "#E0A3FF", type: "drone" },
  { id: "pet-v4-drone-gold", slot: PET_SLOTS.SPECIES, world: "w7", label: "Altın Drone", price: 260, color: "#52E3FF", type: "drone" },
  { id: "pet-v4-dragon-blue", slot: PET_SLOTS.SPECIES, world: "w8", label: "Mavi Mini Ejderha", price: 300, color: "#FF826E", type: "dragon" },
  { id: "pet-v4-dragon-crystal", slot: PET_SLOTS.SPECIES, world: "w9", label: "Kristal Ejderha", price: 340, color: "#FFD166", type: "dragon" },
  { id: "pet-v4-cat-space", slot: PET_SLOTS.SPECIES, world: "w10", label: "Uzay Kedisi", price: 380, color: "#9A7BFF", type: "cat" },
  { id: "pet-v4-rabbit", slot: PET_SLOTS.SPECIES, world: "w11", label: "Keşif Tavşanı", price: 220, color: "#52E3C2", type: "rabbit" },
  { id: "pet-v4-phoenix-gold", slot: PET_SLOTS.SPECIES, world: "w12", label: "Altın Anka", price: 260, color: "#E0A3FF", type: "phoenix" },
];
const V43_PET_ACCESSORIES = [
  { id: "pet-v4-scarf-blue", slot: PET_SLOTS.ACCESSORY, world: "w1", label: "Mavi Keşif Atkısı", price: 55, color: "#52E3FF" },
  { id: "pet-v4-scarf-red", slot: PET_SLOTS.ACCESSORY, world: "w2", label: "Kızıl Keşif Atkısı", price: 65, color: "#FF826E" },
  { id: "pet-v4-goggles", slot: PET_SLOTS.ACCESSORY, world: "w3", label: "Dost Pilot Gözlüğü", price: 75, color: "#FFD166" },
  { id: "pet-v4-cap", slot: PET_SLOTS.ACCESSORY, world: "w4", label: "Dost Kaşif Şapkası", price: 85, color: "#9A7BFF" },
  { id: "pet-v4-medal", slot: PET_SLOTS.ACCESSORY, world: "w5", label: "Dost Ustalık Madalyası", price: 95, color: "#52E3C2" },
  { id: "pet-v4-crystal-collar", slot: PET_SLOTS.ACCESSORY, world: "w6", label: "Kristal Tasma", price: 105, color: "#E0A3FF" },
];
const V43_ROOM_ITEMS = [
  { id: "room-v4-desk-tech", slot: ROOM_SLOTS.DESK, world: "w1", label: "Teknoloji Çalışma Masası", price: 80, color: "#52E3FF" },
  { id: "room-v4-desk-archive", slot: ROOM_SLOTS.DESK, world: "w2", label: "Arşiv Yazı Masası", price: 100, color: "#FF826E" },
  { id: "room-v4-telescope", slot: ROOM_SLOTS.LAMP, world: "w3", label: "Keşif Teleskobu", price: 120, color: "#FFD166" },
  { id: "room-v4-orb-lamp", slot: ROOM_SLOTS.LAMP, world: "w4", label: "Kristal Küre Lambası", price: 140, color: "#9A7BFF" },
  { id: "room-v4-fern", slot: ROOM_SLOTS.PLANT, world: "w5", label: "Keşif Eğreltisi", price: 160, color: "#52E3C2" },
  { id: "room-v4-bonsai", slot: ROOM_SLOTS.PLANT, world: "w6", label: "Bilgi Bonsaisi", price: 180, color: "#E0A3FF" },
  { id: "room-v4-world-map", slot: ROOM_SLOTS.POSTER, world: "w7", label: "Dünya Keşif Haritası", price: 80, color: "#52E3FF" },
  { id: "room-v4-space-map", slot: ROOM_SLOTS.POSTER, world: "w8", label: "Yıldız Rotası Haritası", price: 100, color: "#FF826E" },
  { id: "room-v4-compass-rug", slot: ROOM_SLOTS.RUG, world: "w9", label: "Büyük Pusula Halısı", price: 120, color: "#FFD166" },
  { id: "room-v4-galaxy-rug", slot: ROOM_SLOTS.RUG, world: "w10", label: "Galaksi Halısı", price: 140, color: "#9A7BFF" },
  { id: "room-v4-aurora-wall", slot: ROOM_SLOTS.WALLPAPER, world: "w11", label: "Aurora Duvarı", price: 160, color: "#52E3C2" },
  { id: "room-v4-library-wall", slot: ROOM_SLOTS.WALLPAPER, world: "w12", label: "Bilgi Arşivi Duvarı", price: 180, color: "#E0A3FF" },
];

export const PETS = [...CORE_PETS, ...V43_PETS];
export const PET_ACCESSORIES = [...CORE_PET_ACCESSORIES, ...V43_PET_ACCESSORIES];
export const ROOM_ITEMS = [...CORE_ROOM_ITEMS, ...V43_ROOM_ITEMS];

export const DEFAULT_PET_STATE = { activeSpecies: null, accessory: null };
export const DEFAULT_ROOM_STATE = { wallpaper: null, rug: null, desk: null, lamp: null, plant: null, poster: null };

export const ALL_PET_ROOM_ITEMS = [...PETS, ...PET_ACCESSORIES, ...ROOM_ITEMS];
