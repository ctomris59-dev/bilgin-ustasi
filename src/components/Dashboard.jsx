import { useMemo } from "react";
import AvatarCanvas from "./avatar/AvatarCanvas";
import PetCanvas from "./avatar/PetCanvas";
import RoomBackground from "./avatar/RoomBackground";
import { getLevelInfo } from "../data/levels";
import { BADGES } from "../lib/gamification";
import { getRandomGreeting } from "../data/messages";
import { getWorldForLevel } from "../data/worlds";

const SUBJECT_META = {
  Matematik: { icon: "△", accent: "#70A1FF", place: "Sayı Dağları" },
  Türkçe: { icon: "♣", accent: "#52E3C2", place: "Kelime Ormanı" },
  "Fen Bilimleri": { icon: "◇", accent: "#65F0D7", place: "Keşif Vadisi" },
  Fen: { icon: "◇", accent: "#65F0D7", place: "Keşif Vadisi" },
  "Sosyal Bilgiler": { icon: "⬡", accent: "#FFD166", place: "Zaman Şehri" },
  İngilizce: { icon: "≈", accent: "#70D6FF", place: "Dil Limanı" },
};

export default function Dashboard({ profile, tests = [], onStartTest, onGeneratePractice, onOpenMistakeBox, onStartMiniGame, onOpenWorldMap, pausedTest, onResumeTest, onDiscardPausedTest }) {
  const { current, next, progressPct } = getLevelInfo(profile.xp || 0);
  const greeting = useMemo(() => getRandomGreeting(), []);
  const world = getWorldForLevel(current.level);
  const activeMistakes = (profile.mistakeBox || []).filter((m) => !m.resolved).length;
  const earnedBadges = BADGES.filter((b) => (profile.badges || []).includes(b.id));
  const mainTest = tests[0] || null;
  const mainMeta = SUBJECT_META[mainTest?.subject] || { icon: "✦", accent: "#A98CFF", place: world.title };

  return (
    <div className="app-shell space-y-5 pb-5">
      <span className="magic-particle" style={{ left: "6%", top: "8%" }} />
      <span className="magic-particle" style={{ right: "9%", top: "19%", animationDelay: "1.2s" }} />

      {pausedTest && (
        <section className="glass-card animate-pop p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet/15 text-violet">▶</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black">Kaldığın görev hazır</p>
              <p className="mt-1 truncate text-xs text-[#8793B4]">{pausedTest.test.title} · Soru {pausedTest.index + 1}/{pausedTest.test.questions.length}</p>
            </div>
            <button onClick={onResumeTest} className="sticker-btn px-4 py-2 text-xs">Devam</button>
          </div>
          <button onClick={onDiscardPausedTest} className="mt-2 text-[10px] font-bold text-[#65718e] hover:text-white">Kaydı kaldır</button>
        </section>
      )}

      <section className="glass-card relative overflow-hidden p-4 sm:p-5" style={{ background: "linear-gradient(145deg,rgba(27,36,75,.88),rgba(8,13,31,.94))" }}>
        <div className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-violet/20 blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#A98CFF]">Ana Üs · {world.title}</p>
            <h1 className="font-display mt-1 text-2xl font-black">{profile.childName}</h1>
            <p className="mt-1 max-w-sm text-xs font-medium leading-relaxed text-[#9AA7C7]">{greeting}</p>
          </div>
          <div className="game-chip">LVL {current.level}</div>
        </div>

        <div className="relative z-10 mt-4">
          <RoomBackground room={profile.rooms?.bedroom} compact>
            <div className="flex items-end justify-center gap-1 pt-3">
              <div className="animate-bob"><AvatarCanvas avatar={profile.avatar} size={154} /></div>
              {profile.pet && <div style={{ animationDelay: ".35s" }} className="animate-bob"><PetCanvas pet={profile.pet} size={70} /></div>}
            </div>
          </RoomBackground>
        </div>

        <div className="relative z-10 mt-3 rounded-2xl border border-white/8 bg-[#070c1d]/75 p-3.5 backdrop-blur-xl">
          <div className="flex items-end justify-between gap-3">
            <div><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#8793B4]">{current.title}</p><p className="mt-1 text-sm font-black">{profile.xp} XP</p></div>
            <p className="text-[10px] font-bold text-[#8793B4]">{next ? `${next.minXp - profile.xp} XP sonra seviye ${next.level}` : "Maksimum seviye"}</p>
          </div>
          <div className="xp-track mt-2"><div className="xp-fill" style={{ width: `${progressPct}%` }} /></div>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-end justify-between px-1"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-[#8B6CFF]">Bugünün hedefi</p><h2 className="font-display text-xl font-black">Bugünün Macerası</h2></div><span className="text-lg text-[#A98CFF]">✦</span></div>
        <button disabled={!mainTest} onClick={() => mainTest && onStartTest(mainTest)} className="glass-card group w-full overflow-hidden p-4 text-left transition duration-300 hover:-translate-y-1 disabled:opacity-60" style={{ background: `linear-gradient(135deg,${mainMeta.accent}18,rgba(139,108,255,.05))` }}>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ color: mainMeta.accent, background: `${mainMeta.accent}16`, boxShadow: `0 0 28px ${mainMeta.accent}12` }}>{mainMeta.icon}</div>
            <div className="min-w-0 flex-1"><p className="text-[9px] font-black uppercase tracking-[.16em]" style={{ color: mainMeta.accent }}>{mainMeta.place}</p><p className="mt-1 truncate text-base font-black">{mainTest?.title || "Yeni görev hazırlanıyor"}</p><p className="mt-1 text-[11px] font-medium text-[#8793B4]">{mainTest ? `${mainTest.subject} · ${mainTest.questions?.length || 0} soru` : "Tekrar Merkezi ve keşif haritası açık."}</p></div>
            <span className="text-xl text-[#C5CEE7] transition group-hover:translate-x-1">→</span>
          </div>
        </button>
      </section>

      <div className="grid grid-cols-3 gap-2.5">
        <StatCard icon="◈" value={profile.coins || 0} label="Coin" color="#FFD166" />
        <StatCard icon="ϟ" value={profile.streak?.current || 0} label="Seri" color="#FF789E" />
        <StatCard icon="↻" value={activeMistakes} label="Tekrar" color="#52E3C2" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <ActionCard onClick={onOpenWorldMap} icon="⌁" title="Keşif Haritası" subtitle="Bölgeleri aç" accent="#52E3C2" />
        <ActionCard onClick={onOpenMistakeBox} icon="↻" title="Tekrar Merkezi" subtitle={`${activeMistakes} soru bekliyor`} accent="#FF789E" />
      </div>


      <button onClick={onStartMiniGame} className="glass-card group flex w-full items-center gap-3 p-3.5 text-left transition hover:-translate-y-0.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-[#52E3FF]">▦</div>
        <div className="flex-1"><p className="text-sm font-black">Kısa mola</p><p className="mt-0.5 text-[11px] text-[#8793B4]">Hafıza oyunuyla zihnini tazele.</p></div><span className="text-xs font-black text-[#52E3FF]">Oyna →</span>
      </button>

      {tests.length > 1 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1"><h2 className="font-display text-lg font-black">Diğer Görevler</h2><span className="text-[10px] font-bold text-[#8793B4]">{tests.length - 1} görev</span></div>
          {tests.slice(1, 5).map((test) => {
            const meta = SUBJECT_META[test.subject] || { icon: "✦", accent: "#A98CFF", place: "Keşif" };
            return <button key={test.id} onClick={() => onStartTest(test)} className="glass-card group flex w-full items-center gap-3 p-3.5 text-left transition hover:-translate-y-0.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ color: meta.accent, background: `${meta.accent}12` }}>{meta.icon}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{test.title}</p><p className="mt-0.5 text-[10px] text-[#8793B4]">{test.subject} · {test.questions?.length || 0} soru</p></div><span className="text-[#8793B4] transition group-hover:translate-x-1">→</span></button>;
          })}
          {tests[0]?.subject && onGeneratePractice && <button onClick={() => onGeneratePractice(tests[0].subject)} className="w-full py-2 text-xs font-bold text-[#8f9bbb] hover:text-white">Aynı dersten pratik görev üret</button>}
        </section>
      )}

      {earnedBadges.length > 0 && <div className="flex flex-wrap gap-2">{earnedBadges.slice(-5).map((b) => <span key={b.id} className="game-chip">⬡ {b.label}</span>)}</div>}
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return <div className="glass-card p-3 text-center"><div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black" style={{ color, background: `${color}12` }}>{icon}</div><p className="mt-2 text-lg font-black" style={{ color }}>{value}</p><p className="text-[8px] font-black uppercase tracking-[.14em] text-[#8793B4]">{label}</p></div>;
}
function ActionCard({ onClick, icon, title, subtitle, accent }) {
  return <button onClick={onClick} className="glass-card group p-3.5 text-left transition hover:-translate-y-1"><div className="flex h-10 w-10 items-center justify-center rounded-xl font-black" style={{ color: accent, background: `${accent}12` }}>{icon}</div><p className="mt-2 text-sm font-black">{title}</p><p className="mt-1 text-[10px] text-[#8793B4]">{subtitle}</p><div className="mt-2 text-xs font-black transition group-hover:translate-x-1" style={{ color: accent }}>Keşfet →</div></button>;
}
