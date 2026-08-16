import { ROOM_ITEMS } from "../../data/petsAndRoom";

const INK = "#4A2E4B";

export default function RoomItemGlyph({ item, size = 54 }) {
  if (!item) return null;
  switch (item.slot) {
    case "desk":
      return (
        <div
          style={{ width: size, height: size * 0.62, backgroundColor: item.color, borderColor: INK }}
          className="rounded-t-2xl rounded-b-md border-3 shadow-sm"
        />
      );
    case "lamp":
      return (
        <div className="flex flex-col items-center">
          <div style={{ width: size * 0.6, height: size * 0.4, backgroundColor: item.color, borderColor: INK }} className="rounded-t-full border-3 shadow-sm" />
          <div style={{ width: 4, height: size * 0.45, backgroundColor: "#FF70A6" }} />
        </div>
      );
    case "rug":
      return (
        <div
          style={{ width: size * 1.5, height: size * 0.42, backgroundColor: item.color, borderColor: INK }}
          className="rounded-full border-3 opacity-95 shadow-sm"
        />
      );
    case "plant":
      return (
        <div className="flex flex-col items-center">
          <span style={{ fontSize: size * 0.55, lineHeight: 1 }}>{item.id === "plant-cactus" ? "🌵" : "🌸"}</span>
          <div style={{ width: size * 0.42, height: size * 0.24, backgroundColor: item.color, borderColor: INK }} className="rounded-b-lg border-3 -mt-0.5" />
        </div>
      );
    case "poster":
      return (
        <div
          style={{ width: size * 0.62, height: size * 0.78, backgroundColor: item.color, borderColor: INK }}
          className="rounded-2xl border-3 flex items-center justify-center shadow-sm"
        >
          <span style={{ fontSize: size * 0.32 }}>{item.id.includes("star") ? "⭐" : "🌈"}</span>
        </div>
      );
    default:
      return <div style={{ width: size, height: size, backgroundColor: item.color, borderColor: INK }} className="rounded-2xl border-3 shadow-sm" />;
  }
}
