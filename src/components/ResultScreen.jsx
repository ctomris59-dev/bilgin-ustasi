import { useEffect } from "react";
import confetti from "canvas-confetti";
import { playCelebrate, playCorrect } from "../lib/sound";

export default function ResultScreen({ result, xpEarned, coinsEarned, speedBonus, newBadges, newLegendaryItems, newSticker, boostActive, onClose }) {
  const { correctCount, totalCount, fullScore } = result;

  useEffect(() => {
    if (fullScore) {
      playCelebrate();
      const colors = ["#ff8fc7", "#ffc93c", "#45d6b5", "#8c6fff", "#4fc3f7"];
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.4 }, colors, startVelocity: 45 });
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.3 }, colors }), 250);
    } else if (correctCount / totalCount >= 0.6) {
      playCorrect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sticker-card p-6 text-center space-y-4 animate-pop">
      <p className="text-5xl">{fullScore ? "🌟" : correctCount / totalCount >= 0.6 ? "🎉" : "💪"}</p>
      <h2 className="font-display text-2xl">
        {correctCount} / {totalCount} Doğru
      </h2>
      {fullScore && <p className="text-gold font-bold">Tam puan! Efsanevi ödül kazandın!</p>}
      {boostActive && <p className="text-xs bg-gold/20 rounded-full px-3 py-1 inline-block">🚀 Erken Başlangıç Bonusu uygulandı (x1.5)!</p>}

      <div className="flex justify-center gap-6">
        <div>
          <p className="font-display text-xl text-violet">+{xpEarned}</p>
          <p className="text-xs opacity-60">XP</p>
        </div>
        <div>
          <p className="font-display text-xl text-gold-bright">+{coinsEarned}</p>
          <p className="text-xs opacity-60">Coin</p>
        </div>
        {speedBonus > 0 && (
          <div>
            <p className="font-display text-xl text-teal">+{speedBonus}</p>
            <p className="text-xs opacity-60">Hız Bonusu</p>
          </div>
        )}
      </div>

      {newLegendaryItems.length > 0 && (
        <div className="bg-gold/15 rounded-xl p-3 text-sm">
          ✨ Yeni efsanevi parça: <span className="font-bold">{newLegendaryItems.map((i) => i.label).join(", ")}</span>
        </div>
      )}

      {newSticker && (
        <div className="bg-bubblegum/20 rounded-xl p-3 text-sm flex items-center justify-center gap-2">
          <span className="text-2xl">{newSticker.emoji}</span>
          <span>Sticker Albümüne eklendi! ({newSticker.category})</span>
        </div>
      )}

      {newBadges.length > 0 && (
        <div className="bg-violet/15 rounded-xl p-3 text-sm">
          🏅 Yeni rozet: <span className="font-bold">{newBadges.map((b) => b.label).join(", ")}</span>
        </div>
      )}

      {result.totalCount - result.correctCount > 0 && (
        <p className="text-sm opacity-70">
          {result.totalCount - result.correctCount} soru Hata Kutusu'na eklendi — birkaç gün sonra rövanşını alacaksın!
        </p>
      )}

      <button onClick={onClose} className="w-full sticker-btn bg-violet text-white rounded-full py-3 font-bold">
        Devam Et
      </button>
    </div>
  );
}
