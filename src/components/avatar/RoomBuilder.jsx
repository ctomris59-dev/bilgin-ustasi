import { useState, useEffect, useRef } from "react";
import { ROOM_ITEMS } from "../../data/petsAndRoom";
import { makePlacedItem } from "../../data/houseRooms";
import RoomItemGlyph from "./RoomItemGlyph";
import { playPop } from "../../lib/sound";

const INK = "#4A2E4B";

function findItem(id) {
  return ROOM_ITEMS.find((i) => i.id === id) || null;
}

export default function RoomBuilder({ room, roomId, unlockedIds, onCommit }) {
  const [localRoom, setLocalRoom] = useState(room);
  const [draggingUid, setDraggingUid] = useState(null);
  const canvasRef = useRef(null);
  const localRoomRef = useRef(room);

  useEffect(() => {
    setLocalRoom(room);
    localRoomRef.current = room;
  }, [roomId]);

  function applyUpdate(updater) {
    setLocalRoom((prev) => {
      const next = updater(prev);
      localRoomRef.current = next;
      return next;
    });
  }

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
  const wallColor = localRoom.wallpaper ? findItem(localRoom.wallpaper)?.color : "#FF9EAA";

  return (
    <div className="space-y-3 font-['Fredoka',sans-serif]">
      <div className="sticker-card p-3 bg-[#FFFFFF]">
        <p className="text-xs font-black mb-2 text-[#4A2E4B]">Duvar Kağıdı Seç ✨</p>
        <div className="flex gap-2 flex-wrap">
          {wallpaperOptions.length === 0 && <p className="text-xs font-bold text-[#4A2E4B]/50">Henüz duvar kağıdın yok, mağazadan alabilirsin!</p>}
          {wallpaperOptions.map((w) => (
            <button
              key={w.id}
              onClick={() => handleSelectWallpaper(w.id)}
              className={`w-9 h-9 rounded-2xl border-3 transition-transform ${localRoom.wallpaper === w.id ? "border-[#4A2E4B] scale-110 shadow-md" : "border-[#4A2E4B]/30"}`}
              style={{ backgroundColor: w.color }}
              aria-label={w.label}
            />
          ))}
        </div>
      </div>

      <div
        ref={canvasRef}
        className="relative rounded-[2rem] overflow-hidden border-4 touch-none select-none shadow-inner"
        style={{
          background: `linear-gradient(180deg, ${wallColor}66 0%, ${wallColor}35 65%, #FFF0F5 65%, #FFF0F5 100%)`,
          height: 280,
          borderColor: INK,
        }}
      >
        <p className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black bg-[#FFFFFF] border-2 border-[#4A2E4B] rounded-full px-3 py-0.5 z-20 text-[#4A2E4B]">
          👆 Eşyaları dokunup sürükleyerek odaya diz!
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
              <RoomItemGlyph item={item} size={52} />
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => handleRemove(placed.uid, e)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#FF70A6] text-white text-xs font-black border-2 border-[#4A2E4B] flex items-center justify-center shadow"
                aria-label="Kaldır"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <div className="sticker-card p-3 bg-[#FFFFFF]">
        <p className="text-xs font-black mb-2 text-[#4A2E4B]">Eşyalarım — dokunarak odaya ekle ✨</p>
        {paletteItems.length === 0 && <p className="text-xs font-bold text-[#4A2E4B]/50">Tüm eşyaların odada! Mağazadan yenilerini alabilirsin.</p>}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {paletteItems.map((item) => (
            <button key={item.id} onClick={() => handlePlace(item)} className="shrink-0 flex flex-col items-center gap-1 p-2 rounded-2xl border-2 border-[#4A2E4B]/20 hover:border-[#FF70A6] bg-[#FFE8EC]">
              <RoomItemGlyph item={item} size={42} />
              <span className="text-[9px] font-black text-center w-14 leading-tight text-[#4A2E4B]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
