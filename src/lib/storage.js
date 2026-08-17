import { STARTER_UNLOCKED, DEFAULT_AVATAR } from "../data/avatarParts";
import { DEFAULT_PET_STATE } from "../data/petsAndRoom";
import { createDefaultRooms, createEmptyRoomState, migrateLegacyRoom, ROOM_TYPES } from "../data/houseRooms";

const LOCAL_KEY = "bilginustasi_profile_v1";

export function createDefaultProfile(childName = "Bilgin Adayı") {
  return {
    childName,
    accountCreatedAt: new Date().toISOString(),
    xp: 0,
    coins: 0,
    gems: 0,
    streak: { current: 0, longest: 0, lastWeekKey: null, freezesAvailable: 1 },
    unlockedItems: [...STARTER_UNLOCKED],
    avatar: { ...DEFAULT_AVATAR },
    pet: { ...DEFAULT_PET_STATE },
    rooms: createDefaultRooms(),
    completedRooms: [],
    badges: [],
    mistakeBox: [],
    history: [],
    stats: { testsBySubject: {}, fullScoreBySubject: {}, speedBonusCount: 0, retryTestsPassed: 0 },
    rewardsCatalog: [
      { id: "r1", label: "Hafta sonu sinema seçimi", cost: 150 },
      { id: "r2", label: "1 saat ekstra tablet süresi", cost: 120 },
      { id: "r3", label: "En sevdiğin tatlıyı yapma hakkı", cost: 100 },
    ],
    redemptions: [],
    parentNotes: [],
    stickerAlbum: { unlockedIds: [] },
    miniGame: { lastRewardDate: null, bestMoves: {} },
    lastSyncedAt: null,
  };
}

// Eski profillerde (önceki fazlarda) yeni alanlar olmayabilir - güvenli tamamlama
export function normalizeProfile(profile) {
  if (!profile) return profile;
  let rooms = profile.rooms;
  if (!rooms) {
    // Çok eski (tek odalı, Faz 3) veriden göç: yatak odasına taşı
    rooms = createDefaultRooms();
    if (profile.room) rooms.bedroom = migrateLegacyRoom(profile.room);
  } else {
    // Her oda için: eksikse oluştur, slot-bazlı eski formatsa (items dizisi yoksa) göç ettir
    ROOM_TYPES.forEach((rt) => {
      const r = rooms[rt.id];
      if (!r) {
        rooms[rt.id] = createEmptyRoomState();
      } else if (!Array.isArray(r.items)) {
        rooms[rt.id] = migrateLegacyRoom(r);
      }
    });
  }
  const profileWithoutLegacyCheckIn = { ...profile };
  delete profileWithoutLegacyCheckIn["mood" + "Log"];
  return {
    ...profileWithoutLegacyCheckIn,
    accountCreatedAt: profile.accountCreatedAt || new Date().toISOString(),
    gems: Number(profile.gems || 0),
    avatar: { ...DEFAULT_AVATAR, ...(profile.avatar || {}), characterStyle: profile.avatar?.characterStyle || "auto" },
    pet: profile.pet || { ...DEFAULT_PET_STATE },
    rooms,
    completedRooms: profile.completedRooms || [],
    stickerAlbum: profile.stickerAlbum || { unlockedIds: [] },
    miniGame: profile.miniGame || { lastRewardDate: null, bestMoves: {} },
  };
}

export function getLocalProfile() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveLocalProfile(profile) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
}

export function clearLocalProfile() {
  localStorage.removeItem(LOCAL_KEY);
}
// --- Duraklatılmış Test ---
// Test ortasında "Ana Sayfa"ya dönülürse ilerlemenin kaybolmaması için
// yerel olarak (localStorage) saklanır. Bulut senkronuna dahil değildir.
const PAUSED_TEST_KEY = "bilginustasi_paused_test_v1";

export function getPausedTest() {
  try {
    const raw = localStorage.getItem(PAUSED_TEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePausedTest(snapshot) {
  localStorage.setItem(PAUSED_TEST_KEY, JSON.stringify(snapshot));
}

export function clearPausedTest() {
  localStorage.removeItem(PAUSED_TEST_KEY);
}
