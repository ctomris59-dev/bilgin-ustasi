import { useState, useEffect, useRef } from "react";
import { ROOM_ITEMS } from "../../data/petsAndRoom";
import { makePlacedItem } from "../../data/houseRooms";
import RoomItemGlyph from "./RoomItemGlyph";
import { playPop } from "../../lib/sound";

const INK = "#3a3153";

function findItem(id) {
  return ROOM_ITEMS.find((i) => i.id === id) || null;
}

export default function RoomBuilder({ room, roomId, unlockedIds, onCommit }) {
  const [localRoom, setLocalRoom] = useState(room);
  const [draggingUid, setDraggingUid] = useState(null);
  const canvasRef = useRef(null);
  const localRoomRef = useRef(room);

  // Oda değiştirildiğinde (sekme geçişi) yerel state'i sıfırla
  useEffect(() => {
    setLocalRoom(room);
    localRoomRef.current = room;
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  function applyUpdate(updater) {
    setLocalRoom((prev) => {
      const next = updater(prev);
      localRoomRef.current = next;
      return next;
    });
  }

  // Sürükleme sırasında window'a dinleyici ekle - parmak/imleç kanvas dışına çıksa bile takip etsin
  useEffect(() => {
    if (!draggingUid) return;

    function onMove(e) {
      if (!canvasRef.current) return;
      const point = e.touches ? e.touches[0] : e;
      const rect = canvasRef.current.getBoundingClientRect();
      let x = ((point.clientX - rect.left) / rect.width) * 100;
      let y = ((point.clientY - rect.top) / rect.height) * 100;
      x = Math.min(95, Math.max(5, x));
      y = Math.min(94, Math.max(8, y));
      applyUpdate((prev) => ({ ...prev, items: prev.items.map((it) => (it.uid === draggingUid ? { ...it, x, y } : it)) }));
    }
    function onUp() {
      setDraggingUid(null);
      onCommit(localRoomRef.current);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingUid]);

  function handlePlace(item) {
    playPop();
    const x = 25 + Math.random() * 50;
    const y = 35 + Math.random() * 40;
    const next = { ...localRoomRef.current, items: [...localRoomRef.current.items, makePlacedItem(item.id, x, y)] };
    localRoomRef.current = next;
    setLocalRoom(next);
    onCommit(next);
  }

  function handleRemove(uid, e) {
    e.stopPropagation();
    playPop();
    const next = { ...localRoomRef.current, items: localRoomRef.current.items.filter((it) => it.uid !== uid) };
    localRoomRef.current = next;
    setLocalRoom(next);
    onCommit(next);
  }

  function handleSelectWallpaper(itemId) {
    playPop();
    const prev = localRoomRef.current;
    const next = { ...prev, wallpaper: prev.wallpaper === itemId ? null : itemId };
    localRoomRef.current = next;
    setLocalRoom(next);
    onCommit(next);
  }

  const wallpaperOptions = ROOM_ITEMS.filter((i) => i.slot === "wallpaper" && unlockedIds.has(i.id));
  const placedIds = new Set(localRoom.items.map((it) => it.itemId));
  const paletteItems = ROOM_ITEMS.filter((i) => i.slot !== "wallpaper" && unlockedIds.has(i.id) && !placedIds.has(i.id));
  const wallColor = localRoom.wallpaper ? findItem(localRoom.wallpaper)?.color : "#bfe8ff";

  return (
    <div className="space-y-3">
      {/* Duvar kağıdı seçici */}
      <div className="sticker-card p-3">
        <p className="text-xs font-semibold mb-2 opacity-70">Duvar Kağıdı Seç</p>
        <div className="flex gap-2 flex-wrap">
          {wallpaperOptions.length === 0 && <p className="text-xs opacity-50">Henüz duvar kağıdın yok, mağazadan al.</p>}
          {wallpaperOptions.map((w) => (
            <button
              key={w.id}
              onClick={() => handleSelectWallpaper(w.id)}
              className={`w-9 h-9 rounded-full border-2 ${localRoom.wallpaper === w.id ? "border-ink scale-110" : "border-ink/20"}`}
              style={{ backgroundColor: w.color }}
              aria-label={w.label}
            />
          ))}
        </div>
      </div>

      {/* Kanvas: sürükle-bırak alanı */}
      <div
        ref={canvasRef}
        className="relative rounded-[1.5rem] overflow-hidden border-4 touch-none select-none"
        style={{
          background: `linear-gradient(180deg, ${wallColor}55 0%, ${wallColor}30 65%, #fff7e0 65%, #fff7e0 100%)`,
          height: 280,
          borderColor: INK,
        }}
      >
        <p className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-white/70 rounded-full px-2 py-0.5 z-20">
          👆 Eşyaları sürükleyerek taşı
        </p>
        {localRoom.items.map((placed) => {
          const item = findItem(placed.itemId);
          if (!item) return null;
          const isDragging = draggingUid === placed.uid;
          return (
            <div
              key={placed.uid}
              onPointerDown={(e) => {
                e.preventDefault();
                setDraggingUid(placed.uid);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing ${isDragging ? "z-30 scale-110" : "z-10"}`}
              style={{ left: `${placed.x}%`, top: `${placed.y}%`, touchAction: "none" }}
            >
              <RoomItemGlyph item={item} size={50} />
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => handleRemove(placed.uid, e)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-coral text-white text-xs font-bold border-2 border-ink flex items-center justify-center"
                aria-label="Kaldır"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Eşya paleti */}
      <div className="sticker-card p-3">
        <p className="text-xs font-semibold mb-2 opacity-70">Eşyalarım — dokunarak odaya ekle</p>
        {paletteItems.length === 0 && <p className="text-xs opacity-50">Tüm eşyaların odada! Mağazadan yeni eşya alabilirsin.</p>}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {paletteItems.map((item) => (
            <button key={item.id} onClick={() => handlePlace(item)} className="shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-ink/15 hover:border-violet/50">
              <RoomItemGlyph item={item} size={40} />
              <span className="text-[9px] font-semibold text-center w-14 leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
