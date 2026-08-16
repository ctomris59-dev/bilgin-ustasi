import { getItemAsset } from "../../data/gameAssets";

export default function RoomItemGlyph({ item, size = 54 }) {
  if (!item) return null;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size * 1.2, height: size }}
      title={item.label}
    >
      <div
        className="absolute bottom-1 h-3 w-3/4 rounded-full blur-md"
        style={{ background: `${item.color || "#52E3FF"}2A` }}
      />
      <img
        src={getItemAsset(item)}
        alt=""
        draggable="false"
        className="relative z-10 h-full w-full object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,.32)]"
      />
    </div>
  );
}
