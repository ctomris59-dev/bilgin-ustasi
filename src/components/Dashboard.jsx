import { useMemo } from "react";
import AvatarCanvas from "./avatar/AvatarCanvas";
import PetCanvas from "./avatar/PetCanvas";
import RoomBackground from "./avatar/RoomBackground";
import MoodCheckIn from "./MoodCheckIn";
import SpeakButton from "./SpeakButton";
import { getLevelInfo } from "../data/levels";
import { BADGES, getBoostInfo } from "../lib/gamification";
import { getRandomGreeting } from "../data/messages";
import { getAvailableSubjects } from "../lib/practiceGenerator";
import { getWorldForLevel, WORLDS } from "../data/worlds";
import { ROOM_TYPES, isRoomComplete } from "../data/houseRooms";

export default function Dashboard({ profile, tests, onStartTest, onGeneratePractice, onOpenMistakeBox, onLogMood, onStartMiniGame, onOpenWorldMap }) {
  const { current, next, progressPct } = getLevelInfo(profile.xp);
  const availableTests = tests;
  const subjects = useMemo(() => getAvailableSubjects(tests), [tests]);
  const earnedBadges = BADGES.filter((b) => profile.badges.includes(b.id));
  const greeting = useMemo(() => getRandomGreeting(), []);
  const currentWorld = getWorldForLevel(current.level);
  const nextWorld = WORLDS.find((w) => w.order === currentWorld.order + 1);
  const completedRoomsCount = ROOM_TYPES.filter((r) => isRoomComplete(profile.rooms[r.id])).length;
  const boost = getBoostInfo(profile.accountCreatedAt);

  return (
    <div className="space-y-4">
      {/* Günün Kombini - karşılama */}
      <RoomBackground room={profile.rooms.bedroom}>
        <div className="flex items-end gap-1">
          <div className="animate-bob"><AvatarCanvas avatar={profile.avatar} size={150} /></div>
          <PetCanvas pet={profile.pet} size={64} />
        </div>
      </RoomBackground>
      <div className="sticker-card p-3 relative -mt-6 mx-4 flex items-start gap-2">
        <div
          className="absolute -top-2 left-8 w-4 h-4 bg-parchment rotate-45"
          aria-hidden="true"
        />
        <p className="text-sm font-semibold flex-1">💬 {profile.childName}, {greeting}</p>
        <SpeakButton text={`${profile.childName}, ${greeting}`} size={30} />
      </div>

      <MoodCheckIn profile={profile} onLogMood={onLogMood} />

      {boost.active && (
        <div className="sticker-card p-3 flex items-center gap-2 bg-gold/20 border-gold animate-pop">
          <span className="text-2xl">🚀</span>
          <div className="flex-1">
            <p className="text-sm font-bold">Erken Başlangıç Bonusu Aktif! XP & Coin x{boost.multiplier}</p>
            <p className="text-xs opacity-70">{boost.daysLeft} gün kaldı — bu dönemde her test daha fazla kazandırır!</p>
          </div>
        </div>
      )}

      <button onClick={onOpenWorldMap} className="w-full sticker-card p-3.5 flex items-center gap-3" style={{ backgroundColor: `${currentWorld.color}30` }}>
        <span className="text-3xl">{currentWorld.emoji}</span>
        <div className="text-left flex-1">
          <p className="font-display text-sm leading-tight">{currentWorld.title}</p>
          <p className="text-xs opacity-60">{nextWorld ? `Sonraki: ${nextWorld.emoji} ${nextWorld.title} (Seviye ${nextWorld.unlockLevel})` : "Yolun sonuna geldin, ama macera bitmedi!"}</p>
        </div>
        <span className="text-violet font-bold text-sm">Harita →</span>
      </button>

      <button onClick={onStartMiniGame} className="w-full sticker-card p-3.5 flex items-center justify-between bg-sky/40">
        <span className="font-semibold">🎮 Mola Zamanı! Hafıza oyunu oyna</span>
        <span>→</span>
      </button>

      <div className="sticker-card p-4 flex gap-4 items-center">
        <div className="flex-1">
          <p className="font-display text-lg leading-tight">{profile.childName}</p>
          <p className="text-sm text-violet font-semibold">{current.title} · Seviye {current.level}</p>
          <div className="w-full bg-ink/10 rounded-full h-2.5 mt-1.5">
            <div className="bg-violet h-2.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs opacity-60 mt-1">{next ? `${next.title}'a ${next.minXp - profile.xp} XP kaldı` : "En yüksek seviyedesin! 🎉"}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="sticker-card p-2.5 text-center">
          <p className="text-xl">🪙</p>
          <p className="font-display text-base">{profile.coins}</p>
          <p className="text-[10px] opacity-60">Coin</p>
        </div>
        <div className="sticker-card p-2.5 text-center">
          <p className="text-xl">🔥</p>
          <p className="font-display text-base">{profile.streak.current}</p>
          <p className="text-[10px] opacity-60">Seri</p>
        </div>
        <div className="sticker-card p-2.5 text-center">
          <p className="text-xl">📦</p>
          <p className="font-display text-base">{profile.mistakeBox.filter((m) => !m.resolved).length}</p>
          <p className="text-[10px] opacity-60">Hata</p>
        </div>
        <div className="sticker-card p-2.5 text-center">
          <p className="text-xl">🏠</p>
          <p className="font-display text-base">{completedRoomsCount}/{ROOM_TYPES.length}</p>
          <p className="text-[10px] opacity-60">Oda</p>
        </div>
      </div>

      {profile.mistakeBox.filter((m) => !m.resolved).length >= 3 && (
        <button onClick={onOpenMistakeBox} className="w-full sticker-card p-3 flex items-center justify-between border-2 border-coral">
          <span className="font-semibold text-coral">⚔️ Rövanş Testi hazır! Yanlışlarını telafi et</span>
          <span>→</span>
        </button>
      )}

      <div>
        <h2 className="font-display text-lg mb-2 px-1">📚 Bu Haftanın Testleri</h2>
        <div className="space-y-2">
          {availableTests.length === 0 && (
            <p className="sticker-card p-4 text-center text-sm">Henüz test yüklenmedi. Ebeveyn panelinden yeni bir test eklenebilir.</p>
          )}
          {availableTests.map((test) => (
            <button key={test.id} onClick={() => onStartTest(test)} className="w-full sticker-card p-3.5 text-left flex items-center justify-between hover:brightness-95">
              <div>
                <p className="font-semibold">{test.title}</p>
                <p className="text-xs opacity-60">
                  {test.subject} · {test.questions.length} soru
                  {test.gradeLevel && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-parchment-dim text-[10px] font-semibold">{test.gradeLevel.split(" ")[0]} {test.gradeLevel.split(" ")[1]}</span>}
                </p>
              </div>
              <span className="text-violet font-bold">Başla →</span>
            </button>
          ))}
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <div>
          <h2 className="font-display text-lg mb-2 px-1">🏅 Rozetlerin</h2>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((b) => (
              <div key={b.id} className="sticker-card px-3 py-2 text-sm font-semibold">
                {b.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {subjects.length > 0 && (
        <div>
          <h2 className="font-display text-lg mb-1 px-1">🔄 Pratik Testi (Sınırsız!)</h2>
          <p className="text-xs opacity-60 px-1 mb-2">İstediğin kadar çöz — her seferinde farklı sorularla karışır, daha fazla XP ve coin kazan!</p>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => onGeneratePractice(subject)}
                className="sticker-btn bg-bubblegum text-ink rounded-2xl p-3 text-sm font-bold text-left"
              >
                {subject}
                <div className="text-xs font-normal opacity-70">Yeni pratik oluştur →</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
