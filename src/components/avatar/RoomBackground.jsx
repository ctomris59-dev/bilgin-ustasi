import { ROOM_ITEMS } from "../../data/petsAndRoom";
import RoomItemGlyph from "./RoomItemGlyph";

const INK = "#3a3153";

function findItem(id) {
  return ROOM_ITEMS.find((i) => i.id === id) || null;
}

export default function RoomBackground({ room, children }) {
  const wallpaper = findItem(room?.wallpaper);
  const wallColor = wallpaper ? wallpaper.color : "#bfe8ff";
  const items = room?.items || [];

  return (
    <div
      className="relative rounded-[1.75rem] overflow-hidden flex items-end justify-center border-4"
      style={{
        background: `linear-gradient(180deg, ${wallColor}55 0%, ${wallColor}30 65%, #fff7e0 65%, #fff7e0 100%)`,
        minHeight: 230,
        borderColor: INK,
      }}
    >
      {/* Güneş - her zaman neşeli bir gündüz hissi */}
      <div className="absolute top-4 right-5 w-12 h-12 rounded-full border-4" style={{ backgroundColor: "#ffe066", borderColor: INK }} />
      {/* Bulutlar */}
      <div className="absolute top-6 left-4 w-10 h-6 rounded-full bg-white border-[3px]" style={{ borderColor: INK }} />
      <div className="absolute top-9 left-9 w-7 h-5 rounded-full bg-white border-[3px]" style={{ borderColor: INK }} />

      {/* Yıldızlar (yıldızlı duvar kağıdı seçiliyse) */}
      {room?.wallpaper === "wallpaper-stars" &&
        [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-lg animate-twinkle"
            style={{ top: `${14 + ((i * 11) % 40)}%`, left: `${8 + (i * 15) % 80}%`, animationDelay: `${i * 0.3}s` }}
          >
            ✨
          </div>
        ))}

      {/* Serbest konumlu eşyalar */}
      {items.map((placed) => {
        const item = findItem(placed.itemId);
        if (!item) return null;
        return (
          <div key={placed.uid} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${placed.x}%`, top: `${placed.y}%` }}>
            <RoomItemGlyph item={item} size={44} />
          </div>
        );
      })}

      <div className="relative z-10 pb-3">{children}</div>
    </div>
  );
}
