import { useEffect } from "react";
import confetti from "canvas-confetti";
import { playCelebrate, playCorrect } from "../lib/sound";

export default function ResultScreen({ result, xpEarned, coinsEarned, speedBonus, newBadges, newLegendaryItems, newSticker, boostActive, onClose }) {
  const { correctCount, totalCount, fullScore } = result;

  useEffect(() => {
    if (fullScore) playCelebrate();
    else if (correctCount / totalCount >= 0.6) playCorrect();

    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FF70A6", "#FFD166", "#52E3C2", "#70D6FF"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FF70A6", "#FFD166", "#52E3C2", "#70D6FF"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] font-['Fredoka',sans-serif] space-y-6 p-4">
      <div className="sticker-card p-8 bg-[#FFFFFF] text-center max-w-sm w-full animate-pop">
        <h2 className="text-3xl font-black text-[#4A2E4B] mb-2">Harika İş! 🌟</h2>
        <p className="text-lg font-bold text-[#4A2E4B]/80 mb-2">
          {totalCount} soruda {correctCount} doğru yaptın!
        </p>
        {boostActive && (
          <p className="text-xs font-black text-[#4A2E4B] bg-[#FFD166] inline-block px-3 py-1 rounded-full mb-4">
            🚀 Erken Başlangıç Bonusu uygulandı!
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="sticker-card p-4 bg-[#FFF275] border-3 border-[#4A2E4B] animate-bob">
            <p className="text-xs font-black text-[#4A2E4B]">Kazanılan XP</p>
            <p className="text-2xl font-black text-[#4A2E4B]">+{xpEarned}</p>
          </div>
          <div className="sticker-card p-4 bg-[#FF9EAA] border-3 border-[#4A2E4B] animate-bob" style={{ animationDelay: "0.2s" }}>
            <p className="text-xs font-black text-[#4A2E4B]">Coin 🪙</p>
            <p className="text-2xl font-black text-[#4A2E4B]">+{coinsEarned}</p>
          </div>
        </div>

        {speedBonus > 0 && (
          <p className="text-sm font-bold text-[#52E3C2] mb-4">⚡ +{speedBonus} Hız Bonusu dahil!</p>
        )}

        {newLegendaryItems?.length > 0 && (
          <div className="mb-6 p-4 bg-[#FFF0F5] border-3 border-[#FFD166] rounded-2xl animate-pop">
            <p className="text-xs font-black text-[#4A2E4B] mb-1">✨ YENİ EFSANEVİ PARÇA!</p>
            <p className="text-sm font-bold text-[#4A2E4B]">{newLegendaryItems.map((i) => i.label).join(", ")}</p>
          </div>
        )}

        {newSticker && (
          <div className="mb-6 p-4 bg-[#FFE8EC] border-3 border-[#4A2E4B] rounded-2xl animate-pop">
            <p className="text-xs font-black text-[#FF70A6] mb-1">YENİ STİCKER KAZANDIN!</p>
            <span className="text-5xl animate-bob block">{newSticker.emoji}</span>
          </div>
        )}

        {newBadges?.length > 0 && (
          <div className="mb-6 p-4 bg-[#52E3C2] border-3 border-[#4A2E4B] rounded-2xl animate-pop">
            <p className="text-xs font-black text-[#4A2E4B] mb-1">🏅 YENİ ROZET!</p>
            <p className="text-sm font-bold text-[#4A2E4B]">{newBadges.map((b) => b.label).join(", ")}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full sticker-btn py-4 bg-[#70D6FF] text-[#4A2E4B] text-lg font-black mt-4"
        >
          Ödüllerimi Al & Devam Et ➔
        </button>
      </div>
    </div>
  );
}
