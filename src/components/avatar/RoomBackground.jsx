import { ROOM_ITEMS } from "../../data/petsAndRoom";
import { GAME_ASSETS, getWorldAsset } from "../../data/gameAssets";
import RoomItemGlyph from "./RoomItemGlyph";

function findItem(id) {
  return ROOM_ITEMS.find((item) => item.id === id) || null;
}

export default function RoomBackground({ room, children, compact = false }) {
  const wallpaper = findItem(room?.wallpaper);
  const items = room?.items || [];
  const backgroundImage = wallpaper ? getWorldAsset(wallpaper.world) : (GAME_ASSETS.premiumBaseRoom || GAME_ASSETS.roomBackground);

  return (
    <div
      className="room-background relative w-full h-full overflow-hidden rounded-2xl border border-white/10"
      style={{
        width: "100%",
        minWidth: 0,
        minHeight: compact ? 205 : 255,
        backgroundImage: `linear-gradient(180deg, rgba(4,8,20,.05), rgba(4,8,20,.54)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.08), 0 18px 42px rgba(0,0,0,.28)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050914]/55" />
      <div className="absolute left-[8%] top-[10%] h-[2px] w-[34%] rounded-full bg-white/20 blur-[1px]" />

      {items.map((placed) => {
        const item = findItem(placed.itemId);
        if (!item) return null;
        return (
          <div
            key={placed.uid}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${placed.x}%`, top: `${placed.y}%` }}
          >
            <RoomItemGlyph item={item} size={compact ? 40 : 52} />
          </div>
        );
      })}

      <div className="relative z-20 flex min-h-[inherit] w-full items-end justify-center pb-2">{children}</div>
    </div>
  );
}
