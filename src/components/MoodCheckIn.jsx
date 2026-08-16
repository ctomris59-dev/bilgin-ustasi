import { MOODS, todayKey } from "../data/moods";
import { playPop } from "../lib/sound";
export default function MoodCheckIn({ profile, onLogMood }) {
  const today=todayKey(); const entry=(profile.moodLog||[]).find((m)=>m.date===today);
  if(entry){const mood=MOODS.find((m)=>m.id===entry.mood);return <div className="glass-card flex items-center gap-3 p-3.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.05] text-xl">{mood?.emoji}</div><div><p className="text-xs font-black">Bugünün durumu: {mood?.label}</p><p className="mt-1 text-[10px] text-[#8793B4]">Yarın yeniden soracağız.</p></div></div>;}
  return <div className="glass-card p-4"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#A98CFF]">Kısa Kontrol</p><p className="mt-1 text-sm font-black">Bugün nasıl hissediyorsun?</p></div><span className="text-[#A98CFF]">◇</span></div><div className="mt-3 grid grid-cols-5 gap-1.5">{MOODS.map((m)=><button key={m.id} onClick={()=>{playPop();onLogMood(m.id);}} className="rounded-2xl border border-white/[.07] bg-white/[.03] px-1 py-2 text-center transition hover:-translate-y-1 hover:bg-white/[.07]"><span className="block text-xl">{m.emoji}</span><span className="mt-1 block truncate text-[8px] font-bold text-[#9AA7C7]">{m.label}</span></button>)}</div></div>;
}
