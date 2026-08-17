import { useEffect, useRef, useState } from "react";
import { ROOM_ITEMS } from "../../data/petsAndRoom";
import { makePlacedItem } from "../../data/houseRooms";
import { getItemCardAsset } from "../../data/gameAssets";
import RoomItemGlyph from "./RoomItemGlyph";
import { playPop } from "../../lib/sound";

function findItem(id) { return ROOM_ITEMS.find((item) => item.id === id) || null; }

export default function RoomBuilder({ room, roomId, unlockedIds, onCommit }) {
  const [localRoom, setLocalRoom] = useState(room || { wallpaper: null, items: [] });
  const [draggingUid, setDraggingUid] = useState(null);
  const canvasRef = useRef(null);
  const localRef = useRef(localRoom);

  useEffect(() => {
    const safe = room || { wallpaper: null, items: [] };
    setLocalRoom(safe); localRef.current = safe;
  }, [roomId, room]);

  function update(fn) {
    setLocalRoom((prev) => { const next = fn(prev); localRef.current = next; return next; });
  }

  useEffect(() => {
    if (!draggingUid) return undefined;
    function move(event) {
      const box = canvasRef.current?.getBoundingClientRect(); if (!box) return;
      const point = event.touches?.[0] || event;
      const x = Math.min(95, Math.max(5, ((point.clientX - box.left) / box.width) * 100));
      const y = Math.min(94, Math.max(8, ((point.clientY - box.top) / box.height) * 100));
      update((prev) => ({ ...prev, items: (prev.items || []).map((item) => item.uid === draggingUid ? { ...item, x, y } : item) }));
    }
    function up() { setDraggingUid(null); onCommit(localRef.current); }
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [draggingUid, onCommit]);

  function place(item) {
    playPop();
    const next = { ...localRef.current, items: [...(localRef.current.items || []), makePlacedItem(item.id, 25 + Math.random() * 50, 38 + Math.random() * 36)] };
    localRef.current = next; setLocalRoom(next); onCommit(next);
  }
  function remove(uid, event) {
    event.stopPropagation(); playPop();
    const next = { ...localRef.current, items: (localRef.current.items || []).filter((item) => item.uid !== uid) };
    localRef.current = next; setLocalRoom(next); onCommit(next);
  }
  function wallpaper(id) {
    playPop(); const prev = localRef.current; const next = { ...prev, wallpaper: prev.wallpaper === id ? null : id };
    localRef.current = next; setLocalRoom(next); onCommit(next);
  }

  const walls = ROOM_ITEMS.filter((item) => item.slot === "wallpaper" && unlockedIds.has(item.id));
  const placedIds = new Set((localRoom.items || []).map((item) => item.itemId));
  const palette = ROOM_ITEMS.filter((item) => item.slot !== "wallpaper" && unlockedIds.has(item.id) && !placedIds.has(item.id));
  const wall = findItem(localRoom.wallpaper)?.color || "#26345F";

  return <div className="v4x-room-builder">
    <div className="v4x-wall-themes">
      <div><small>DUVAR ATMOSFERİ</small><strong>Üssünün ana temasını seç</strong></div>
      <div className="v4x-wall-options">{walls.map((item) => <button key={item.id} onClick={() => wallpaper(item.id)} className={localRoom.wallpaper === item.id ? "is-active" : ""} title={item.label}><img src={getItemCardAsset(item)} alt=""/><span>{item.label}</span></button>)}{walls.length === 0 && <em>Henüz duvar teması açmadın.</em>}</div>
    </div>

    <div ref={canvasRef} className="v4x-room-canvas" style={{ "--wall-color": wall }}>
      <div className="v4x-room-window"><i/><i/></div><div className="v4x-room-floor"/><div className="v4x-room-hint">Eşyayı sürükleyerek yerleştir</div>
      {(localRoom.items || []).map((placed) => { const item = findItem(placed.itemId); if (!item) return null; const dragging = draggingUid === placed.uid; return <div key={placed.uid} onPointerDown={(e) => { e.preventDefault(); setDraggingUid(placed.uid); }} className={`v4x-placed-item ${dragging ? "is-dragging" : ""}`} style={{ left: `${placed.x}%`, top: `${placed.y}%` }}><RoomItemGlyph item={item} size={62}/><button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => remove(placed.uid, e)}>×</button></div>; })}
    </div>

    <div className="v4x-room-palette">
      <div className="v4x-section-title"><div><small>EKİPMAN DEPOSU</small><strong>Üs itemleri</strong></div><span>{palette.length} kullanılabilir</span></div>
      {palette.length ? <div>{palette.map((item) => <button key={item.id} onClick={() => place(item)}><img src={getItemCardAsset(item)} alt=""/><span>{item.label}</span><b>+ Yerleştir</b></button>)}</div> : <p>Açık tüm eşyaların odada. Yeni parçaları Kaşif Dükkânı'ndan açabilirsin.</p>}
    </div>
  </div>;
}
