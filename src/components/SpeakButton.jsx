import { speak, isSpeechSupported } from "../lib/speech";
import { playPop } from "../lib/sound";

export default function SpeakButton({ text, size = 34, className = "" }) {
  if (!isSpeechSupported()) return null;

  function handleClick(e) {
    e.stopPropagation();
    playPop();
    speak(text);
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Sesli oku"
      className={`shrink-0 rounded-full border-2 border-ink bg-sky flex items-center justify-center sticker-btn ${className}`}
      style={{ width: size, height: size }}
    >
      🔊
    </button>
  );
}
