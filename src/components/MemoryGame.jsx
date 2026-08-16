import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { MEMORY_THEMES, buildDeck } from "../data/miniGames";
import { playPop, playCorrect, playWrong, playCelebrate } from "../lib/sound";

export default function MemoryGame({ rewardAvailable, onFinish, onExit }) {
  const [theme, setTheme] = useState(null);
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]); // en fazla 2 kart id'si
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (theme) setDeck(buildDeck(theme));
  }, [theme]);

  const isWon = deck.length > 0 && matched.length === deck.length;

  useEffect(() => {
    if (isWon) {
      playCelebrate();
      confetti({ particleCount: 70, spread: 75, origin: { y: 0.4 }, colors: ["#ff8fc7", "#ffc93c", "#45d6b5", "#8c6fff"] });
      const timer = setTimeout(() => onFinish({ moves, won: true }), 900);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWon]);

  function flipCard(card) {
    if (locked || flipped.includes(card.id) || matched.includes(card.pairId)) return;
    playPop();
    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const first = deck.find((c) => c.id === firstId);
      const second = deck.find((c) => c.id === secondId);
      if (first.pairId === second.pairId) {
        playCorrect();
        setMatched((m) => [...m, first.pairId]);
        setFlipped([]);
      } else {
        playWrong();
        setLocked(true);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 700);
      }
    }
  }

  if (!theme) {
    return (
      <div className="sticker-card p-5 space-y-4 text-center">
        <p className="text-4xl">🎮</p>
        <h2 className="font-display text-xl">Mola Zamanı! Hafıza Oyunu</h2>
        <p className="text-sm opacity-70">Kartları eşleştir, beynini dinlendir. {rewardAvailable && "İlk kazanışında bugün için bonus coin var! 🪙"}</p>
        <div className="grid grid-cols-1 gap-2">
          {MEMORY_THEMES.map((t) => (
            <button key={t.id} onClick={() => { playPop(); setTheme(t); }} className="sticker-btn bg-sky text-ink rounded-full py-3 font-bold">
              {t.emojis.slice(0, 3).join(" ")} {t.label}
            </button>
          ))}
        </div>
        {onExit && (
          <button onClick={onExit} className="text-sm opacity-60 py-2">
            Vazgeç
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="sticker-card p-4 space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{theme.label}</span>
        <span className="opacity-60">Hamle: {moves}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.pairId);
          return (
            <button
              key={card.id}
              onClick={() => flipCard(card)}
              disabled={isFlipped}
              className={`aspect-square rounded-2xl flex items-center justify-center text-2xl border-2 border-ink transition-all ${
                isFlipped ? "bg-parchment-dim" : "bg-violet"
              }`}
            >
              {isFlipped ? card.emoji : ""}
            </button>
          );
        })}
      </div>
      {isWon && <p className="text-center font-display text-lg text-teal animate-pop">🎉 Harika! {moves} hamlede bitirdin!</p>}
      {onExit && !isWon && (
        <button onClick={onExit} className="w-full text-sm opacity-60 py-2">
          Oyundan Çık
        </button>
      )}
    </div>
  );
}
