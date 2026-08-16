import { MOODS, todayKey } from "../data/moods";
import { playPop } from "../lib/sound";

export default function MoodCheckIn({ profile, onLogMood }) {
  const today = todayKey();
  const todayEntry = profile.moodLog.find((m) => m.date === today);

  function handleSelect(moodId) {
    playPop();
    onLogMood(moodId);
  }

  if (todayEntry) {
    const mood = MOODS.find((m) => m.id === todayEntry.mood);
    return (
      <div className="sticker-card p-3 flex items-center gap-2">
        <span className="text-2xl">{mood?.emoji}</span>
        <p className="text-sm font-semibold">Bugün "{mood?.label}" hissediyorsun. Yarın tekrar sorarız!</p>
      </div>
    );
  }

  return (
    <div className="sticker-card p-4 animate-pop">
      <p className="font-display text-base mb-3">Bugün nasıl hissediyorsun?</p>
      <div className="flex justify-between gap-1">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m.id)}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl border-2 border-transparent hover:border-ink hover:bg-parchment-dim transition"
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-[10px] font-semibold">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
