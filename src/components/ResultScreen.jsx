import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ResultScreen({ result, onContinue }) {
  const { score, total, xpEarned, newSticker, leveledUp, levelInfo } = result;

  useEffect(() => {
    // Test bitiminde muhteşem konfeti patlaması!
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF70A6', '#FFD166', '#52E3C2', '#70D6FF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF70A6', '#FFD166', '#52E3C2', '#70D6FF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] font-['Fredoka',sans-serif] space-y-6 p-4">
      <div className="sticker-card p-8 bg-[#FFFFFF] text-center max-w-sm w-full animate-pop">
        <h2 className="text-3xl font-black text-[#4A2E4B] mb-2">Harika İş! 🌟</h2>
        <p className="text-lg font-bold text-[#4A2E4B]/80 mb-6">
          {total} soruda {score} doğru yaptın!
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="sticker-card p-4 bg-[#FFF275] border-3 border-[#4A2E4B] animate-bob">
            <p className="text-xs font-black text-[#4A2E4B]">Kazanılan XP</p>
            <p className="text-2xl font-black text-[#4A2E4B]">+{xpEarned}</p>
          </div>
          <div className="sticker-card p-4 bg-[#FF9EAA] border-3 border-[#4A2E4B] animate-bob" style={{ animationDelay: '0.2s' }}>
            <p className="text-xs font-black text-[#4A2E4B]">Coin 🪙</p>
            <p className="text-2xl font-black text-[#4A2E4B]">+{score * 10}</p>
          </div>
        </div>

        {newSticker && (
          <div className="mb-6 p-4 bg-[#FFE8EC] border-3 border-[#4A2E4B] rounded-2xl animate-pop">
            <p className="text-xs font-black text-[#FF70A6] mb-1">YENİ STİCKER KAZANDIN!</p>
            <span className="text-5xl animate-bob block">{newSticker.emoji}</span>
          </div>
        )}

        {leveledUp && (
          <div className="mb-6 p-4 bg-[#52E3C2] border-3 border-[#4A2E4B] rounded-2xl animate-pop shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            <p className="text-sm font-black text-[#4A2E4B] mb-1 relative z-10">SEVİYE ATLADIN! 🎉</p>
            <p className="text-xl font-black text-[#4A2E4B] relative z-10">{levelInfo.current.title}</p>
            <p className="text-4xl mt-2 relative z-10 animate-bob">👑</p>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full sticker-btn py-4 bg-[#70D6FF] text-[#4A2E4B] text-lg font-black mt-4"
        >
          Ödüllerimi Al & Devam Et ➔
        </button>
      </div>
    </div>
  );
}
