// (Gerekli importlar ve state tanımlamaları aynı kalacak, sadece UI render kısmını güncelliyoruz)
// Return kısmındaki şıklar döngüsünü şu şekilde değiştir:

<div className="space-y-3 mt-6">
  {q.options.map((opt, i) => {
    const isSelected = selectedOption === i;
    const isCorrect = isAnswered && i === q.correct;
    const isWrong = isAnswered && isSelected && i !== q.correct;

    // Renk mantığı
    let btnClass = "bg-[#FFFFFF] text-[#4A2E4B]"; // Standart tuş
    if (isSelected && !isAnswered) btnClass = "bg-[#FFF275] border-[#FFD166] scale-105"; // Seçili ama onaylanmamış
    if (isCorrect) btnClass = "bg-[#52E3C2] text-white animate-pop"; // Doğruysa zıpla ve yeşil ol
    if (isWrong) btnClass = "bg-[#FF70A6] text-white animate-shake"; // Yanlışsa titremeye başla

    return (
      <button
        key={i}
        disabled={isAnswered}
        onClick={() => setSelectedOption(i)}
        className={`w-full sticker-btn text-left p-5 flex items-center justify-between text-base font-black transition-all duration-200 ${btnClass}`}
      >
        <div className="flex items-center gap-4">
          <span className={`w-8 h-8 flex items-center justify-center rounded-xl border-2 border-[#4A2E4B] font-black ${isSelected ? 'bg-[#4A2E4B] text-white' : 'bg-[#FFE8EC] text-[#4A2E4B]'}`}>
            {["A", "B", "C", "D"][i]}
          </span>
          <span className="leading-tight">{opt}</span>
        </div>
        {isCorrect && <span className="text-2xl animate-pop">✨</span>}
        {isWrong && <span className="text-2xl">❌</span>}
      </button>
    );
  })}
</div>

{/* Onay Butonu */}
{selectedOption !== null && !isAnswered && (
  <button 
    onClick={handleAnswer} 
    className="w-full sticker-btn py-4 mt-6 bg-[#FFD166] text-[#4A2E4B] text-lg font-black animate-pop"
  >
    Kararım Kesin! 🎯
  </button>
)}

{/* Sonraki Soru Butonu */}
{isAnswered && (
  <button 
    onClick={handleNext} 
    className="w-full sticker-btn py-4 mt-6 bg-[#70D6FF] text-[#4A2E4B] text-lg font-black animate-pop"
  >
    {currentQ === test.questions.length - 1 ? "Testi Bitir & Ödülleri Gör 🎁" : "Sıradaki Soruya Geç ➔"}
  </button>
)}
