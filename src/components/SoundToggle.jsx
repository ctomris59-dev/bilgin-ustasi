import { useState } from "react";
import { isSoundMuted, toggleSoundMuted, playPop } from "../lib/sound";

export default function SoundToggle() {
  const [muted, setMuted] = useState(isSoundMuted());

  function handleClick() {
    const next = toggleSoundMuted();
    setMuted(next);
    if (!next) playPop();
  }

  return (
    <button
      onClick={handleClick}
      aria-label={muted ? "Sesi aç" : "Sesi kapat"}
      className="w-8 h-8 rounded-full border-2 border-ink bg-white flex items-center justify-center text-sm shrink-0"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
