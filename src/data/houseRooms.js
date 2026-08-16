// "Ev" konsepti: birden fazla oda var, her biri belirli bir Dünya açılınca
// (worlds.js) kilidi açılıyor. Duvar kağıdı arka plan olarak tek seçimli
// kalıyor (bir odanın "temel rengi"), ama mobilya/dekor eşyaları artık
// SERBEST KONUMLANDIRILIYOR: her eşyanın kanvas üzerinde kendi x/y'si var,
// çocuk sürükleyip istediği yere koyabiliyor (Toca Life House mantığı).

export const ROOM_TYPES = [
  { id: "bedroom", title: "Yatak Odası", emoji: "🛏️", unlockWorld: "w1" },
  { id: "playroom", title: "Oyun Odası", emoji: "🧸", unlockWorld: "w2" },
  { id: "studyroom", title: "Çalışma Odası", emoji: "📚", unlockWorld: "w4" },
  { id: "livingroom", title: "Oturma Odası", emoji: "🛋️", unlockWorld: "w6" },
  { id: "garden", title: "Bahçe", emoji: "🌳", unlockWorld: "w8" },
  { id: "library", title: "Kütüphane", emoji: "📖", unlockWorld: "w10" },
];

// Bir odanın "tamamlandı" sayılması için gereken minimum eşya sayısı
export const COMPLETION_ITEM_THRESHOLD = 6;

export function createEmptyRoomState() {
  return { wallpaper: null, items: [] }; // items: [{ uid, itemId, x, y }] - x/y yüzde (0-100)
}

export function createDefaultRooms() {
  const rooms = {};
  ROOM_TYPES.forEach((r) => {
    rooms[r.id] = createEmptyRoomState();
  });
  return rooms;
}

export function getRoomItemCount(roomState) {
  return roomState?.items?.length || 0;
}

export function getRoomCompletion(roomState) {
  if (!roomState) return 0;
  const itemsPct = Math.min(1, getRoomItemCount(roomState) / COMPLETION_ITEM_THRESHOLD);
  const wallpaperPct = roomState.wallpaper ? 1 : 0;
  return Math.round(((itemsPct + wallpaperPct) / 2) * 100) / 100;
}

export function isRoomComplete(roomState) {
  return !!roomState?.wallpaper && getRoomItemCount(roomState) >= COMPLETION_ITEM_THRESHOLD;
}

export function makePlacedItem(itemId, x, y) {
  return { uid: `${itemId}-${Date.now()}-${Math.round(Math.random() * 999)}`, itemId, x, y };
}

// Eski slot-bazlı oda verisini ({wallpaper,rug,desk,lamp,plant,poster}) yeni
// serbest-konumlu formata ({wallpaper, items:[{uid,itemId,x,y}]}) çevirir.
// Eski görünümdeki yaklaşık konumları korur ki geçiş çocuğa garip gelmesin.
const LEGACY_SLOT_POSITIONS = {
  desk: { x: 15, y: 82 },
  lamp: { x: 18, y: 62 },
  rug: { x: 50, y: 90 },
  plant: { x: 85, y: 82 },
  poster: { x: 50, y: 15 },
};

export function migrateLegacyRoom(oldRoom) {
  if (!oldRoom) return createEmptyRoomState();
  const items = [];
  Object.entries(LEGACY_SLOT_POSITIONS).forEach(([slotKey, pos]) => {
    if (oldRoom[slotKey]) {
      items.push(makePlacedItem(oldRoom[slotKey], pos.x, pos.y));
    }
  });
  return { wallpaper: oldRoom.wallpaper || null, items };
}
