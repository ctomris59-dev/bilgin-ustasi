const INK = "#3a3153";

// Bir oda eşyasının (item) küçük bir simge/şekil olarak render edilmesi.
// size: piksel cinsinden yaklaşık genişlik referansı.
export default function RoomItemGlyph({ item, size = 54 }) {
  if (!item) return null;
  switch (item.slot) {
    case "desk":
      return (
        <div
          style={{ width: size, height: size * 0.62, backgroundColor: item.color, borderColor: INK }}
          className="rounded-t-xl rounded-b-sm border-[3px]"
        />
      );
    case "lamp":
      return (
        <div className="flex flex-col items-center">
          <div style={{ width: size * 0.6, height: size * 0.4, backgroundColor: item.color, borderColor: INK }} className="rounded-t-full border-[3px]" />
          <div style={{ width: 4, height: size * 0.45, backgroundColor: "#a9764a" }} />
        </div>
      );
    case "rug":
      return (
        <div
          style={{ width: size * 1.5, height: size * 0.42, backgroundColor: item.color, borderColor: INK }}
          className="rounded-full border-[3px] opacity-95"
        />
      );
    case "plant":
      return (
        <div className="flex flex-col items-center">
          <span style={{ fontSize: size * 0.55, lineHeight: 1 }}>{item.id === "plant-cactus" ? "🌵" : "🌸"}</span>
          <div style={{ width: size * 0.42, height: size * 0.24, backgroundColor: item.color, borderColor: INK }} className="rounded-b-md border-[3px] -mt-0.5" />
        </div>
      );
    case "poster":
      return (
        <div
          style={{ width: size * 0.62, height: size * 0.78, backgroundColor: item.color, borderColor: INK }}
          className="rounded-lg border-[3px] flex items-center justify-center"
        >
          <span style={{ fontSize: size * 0.32 }}>{item.id.includes("star") ? "⭐" : "🌈"}</span>
        </div>
      );
    default:
      return <div style={{ width: size, height: size, backgroundColor: item.color, borderColor: INK }} className="rounded-lg border-[3px]" />;
  }
}
