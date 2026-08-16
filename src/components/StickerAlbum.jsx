import { STICKER_ALBUM, STICKER_SEQUENCE } from "../data/stickers";

export default function StickerAlbum({ profile }) {
  const unlockedSet = new Set(profile.stickerAlbum.unlockedIds);
  const totalCount = STICKER_SEQUENCE.length;
  const unlockedCount = unlockedSet.size;

  return (
    <div className="space-y-4">
      <div className="sticker-card p-4 text-center">
        <p className="font-display text-lg">🎨 Sticker Albümüm</p>
        <p className="text-sm opacity-70">{unlockedCount} / {totalCount} sticker toplandı</p>
        <div className="w-full bg-parchment-dim rounded-full h-2.5 mt-2 border-2 border-ink/20">
          <div className="bg-bubblegum h-full rounded-full transition-all" style={{ width: `${(unlockedCount / totalCount) * 100}%` }} />
        </div>
        <p className="text-xs opacity-60 mt-2">Her test tamamladığında albüme yeni bir sticker eklenir — sırayla, garanti! ✨</p>
      </div>

      {STICKER_ALBUM.map((cat, catIdx) => (
        <div key={cat.category} className="sticker-card p-4">
          <h3 className="font-display text-base mb-3">{cat.category}</h3>
          <div className="grid grid-cols-4 gap-2">
            {cat.stickers.map((emoji, i) => {
              const id = `sticker-${catIdx}-${i}`;
              const owned = unlockedSet.has(id);
              return (
                <div
                  key={id}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-3xl border-2 ${
                    owned ? "border-ink bg-parchment-dim animate-pop" : "border-dashed border-ink/25 bg-transparent grayscale opacity-30"
                  }`}
                >
                  {owned ? emoji : "?"}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
