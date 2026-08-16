import { useMemo } from "react";
import AvatarCanvas from "./avatar/AvatarCanvas";
import PetCanvas from "./avatar/PetCanvas";
import RoomBackground from "./avatar/RoomBackground";
import MoodCheckIn from "./MoodCheckIn";
import { getLevelInfo } from "../data/levels";
import { BADGES } from "../lib/gamification";
import { getRandomGreeting } from "../data/messages";

export default function Dashboard({ profile, tests, onStartTest, onGeneratePractice, onOpenMistakeBox, onLogMood, onStartMiniGame, onOpenWorldMap, pausedTest, onResumeTest, onDiscardPausedTest }) {
  const { current, next, progressPct } = getLevelInfo(profile.xp);
  const availableTests = tests;
  const earnedBadges = BADGES.filter((b) => profile.badges.includes(b.id));
  const greeting = useMemo(() => getRandomGreeting(), []);

  return (
    <div className="space-y-4 font-['Fredoka',sans-serif]">
      {pausedTest && (
        <div className="sticker-card p-4 bg-[#FFFFFF] border-3 border-[#B5838D] animate-pop">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏸️</span>
            <div className="flex-1">
              <p className="font-black text-sm text-[#4A2E4B] leading-tight">Kaldığın yerden devam et</p>
              <p className="text-xs text-[#4A2E4B]/70 font-bold mt-0.5">
                {pausedTest.test.title} · Soru {pausedTest.index + 1}/{pausedTest.test.questions.length}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={onResumeTest} className="flex-1 sticker-btn bg-[#B5838D] text-white rounded-full py-2 font-black text-sm">
              Devam Et →
            </button>
            <button onClick={onDiscardPausedTest} className="px-4 py-2 text-xs text-[#4A2E4B]/60 font-bold">
              Sil
            </button>
          </div>
        </div>
      )}

      {/* Sahne / Karakter Alanı */}
      <div className="sticker-card p-3 bg-[#FFE8EC] relative overflow-hidden">
        <RoomBackground room={profile.rooms?.bedroom}>
          <div className="flex items-end justify-center gap-3 pt-4 pb-2">
            <div className="animate-bob">
              <AvatarCanvas avatar={profile.avatar} size={165} />
            </div>
            {profile.pet && (
              <div className="animate-bob" style={{ animationDelay: "0.3s" }}>
                <PetCanvas pet={profile.pet} size={75} />
              </div>
            )}
          </div>
        </RoomBackground>
        
        {/* Konuşma Balonu */}
        <div className="sticker-card p-3 relative -mt-5 bg-[#FFFFFF] border-3 border-[#4A2E4B] text-center shadow-lg animate-pop">
          <p className="text-sm font-extrabold text-[#4A2E4B]">
            💬 {profile.childName}, {greeting} ✨
          </p>
        </div>
      </div>

      {/* Harita / Dünya Butonu */}
      <button
        onClick={onOpenWorldMap}
        className="w-full sticker-btn p-4 flex items-center justify-between bg-[#FFD166] text-[#4A2E4B] animate-pulse-glow hover:brightness-105"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🗺️</span>
          <div className="text-left">
            <p className="font-black text-base leading-tight">Sihirli Yol Haritası</p>
            <p className="text-xs font-bold opacity-80">Dünyaları Keşfet & Ödülleri Gör</p>
          </div>
        </div>
        <span className="text-xl font-black bg-[#FFFFFF] px-3 py-1 rounded-xl border-2 border-[#4A2E4B]">Keşfet →</span>
      </button>

      {/* Mood Check-In */}
      <MoodCheckIn profile={profile} onLogMood={onLogMood} />

      {/* Mini Oyun Mola Butonu */}
      <button 
        onClick={onStartMiniGame} 
        className="w-full sticker-btn p-3.5 flex items-center justify-between bg-[#70D6FF] text-[#4A2E4B]"
      >
        <span className="font-black flex items-center gap-2 text-sm">🎮 Mola Zamanı! Hafıza Oyunu Oyna</span>
        <span className="text-base font-black bg-[#FFFFFF] px-2.5 py-0.5 rounded-lg border-2 border-[#4A2E4B]">Oyna ✨</span>
      </button>

      {/* Profil Seviye & İlerleme Çubuğu */}
      <div className="sticker-card p-4 bg-[#FFFFFF]">
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className="font-display text-xl text-[#4A2E4B] font-black">{profile.childName} 💖</p>
            <p className="text-xs text-[#FF70A6] font-extrabold uppercase tracking-wide">{current.title} · Seviye {current.level}</p>
          </div>
          <span className="text-2xl animate-bounce">⭐</span>
        </div>
        <div className="w-full bg-[#FFE8EC] rounded-full h-4 mt-2 border-3 border-[#4A2E4B] overflow-hidden p-0.5">
          <div 
            className="bg-[#FF70A6] h-full rounded-full transition-all duration-500 shadow-inner" 
            style={{ width: `${progressPct}%` }} 
          />
        </div>
        <p className="text-[11px] text-[#4A2E4B]/80 mt-1.5 font-bold text-right">
          {next ? `${next.title}'a ${next.minXp - profile.xp} XP kaldı ✨` : "En yüksek seviyedesin! 👑"}
        </p>
      </div>

      {/* Oyun İçi Para & İstatistik Kartları */}
      <div className="grid grid-cols-3 gap-3">
        <div className="sticker-card p-3 text-center bg-[#FFF275]">
          <p className="text-3xl animate-bob">🪙</p>
          <p className="font-display text-xl text-[#4A2E4B] font-black">{profile.coins}</p>
          <p className="text-[11px] font-black text-[#4A2E4B]/70">Coin</p>
        </div>
        <div className="sticker-card p-3 text-center bg-[#FF9EAA]">
          <p className="text-3xl animate-bob" style={{ animationDelay: "0.2s" }}>🔥</p>
          <p className="font-display text-xl text-[#4A2E4B] font-black">{profile.streak.current}</p>
          <p className="text-[11px] font-black text-[#4A2E4B]/70">Günlük Seri</p>
        </div>
        <div className="sticker-card p-3 text-center bg-[#52E3C2]">
          <p className="text-3xl animate-bob" style={{ animationDelay: "0.4s" }}>📦</p>
          <p className="font-display text-xl text-[#4A2E4B] font-black">{profile.mistakeBox.filter((m) => !m.resolved).length}</p>
          <p className="text-[11px] font-black text-[#4A2E4B]/70">Hata Kutusu</p>
        </div>
      </div>

      {/* Rövanş Testi Uyarısı */}
      {profile.mistakeBox.filter((m) => !m.resolved).length >= 3 && (
        <button onClick={onOpenMistakeBox} className="w-full sticker-btn p-3.5 flex items-center justify-between bg-[#FF70A6] text-white">
          <span className="font-black text-sm">🥊 Rövanş Testi Hazır! Yanlışlarını Düzelt</span>
          <span className="text-xs bg-[#FFFFFF] text-[#FF70A6] px-2.5 py-1 rounded-xl font-black">Başla →</span>
        </button>
      )}

      {/* Test Listesi */}
      <div>
        <h2 className="font-display text-lg mb-2 px-1 text-[#4A2E4B] font-black flex items-center gap-2">
          <span>📚</span> Bu Haftanın Testleri
        </h2>
        <div className="space-y-2.5">
          {availableTests.length === 0 && (
            <p className="sticker-card p-4 text-center text-sm bg-[#FFFFFF] font-bold">
              Henüz test yüklenmedi. Ebeveyn panelinden yeni test eklenebilir! ✨
            </p>
          )}
          {availableTests.map((test) => (
            <button 
              key={test.id} 
              onClick={() => onStartTest(test)} 
              className="w-full sticker-card p-4 text-left flex items-center justify-between bg-[#FFFFFF] hover:bg-[#FFE8EC]"
            >
              <div>
                <p className="font-black text-base text-[#4A2E4B]">{test.title}</p>
                <p className="text-xs text-[#4A2E4B]/70 font-bold mt-0.5">{test.subject} · {test.questions.length} soru</p>
              </div>
              <span className="sticker-btn bg-[#FF70A6] text-white text-xs px-3 py-1.5 font-black">Başla ➔</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rozetler */}
      {earnedBadges.length > 0 && (
        <div>
          <h2 className="font-display text-lg mb-2 px-1 text-[#4A2E4B] font-black">🏅 Rozetlerin</h2>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((b) => (
              <div key={b.id} className="sticker-card px-3.5 py-2 text-xs font-black bg-[#FFF275] text-[#4A2E4B] animate-pop">
                {b.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
