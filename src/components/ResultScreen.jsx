import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { playCelebrate, playCorrect } from "../lib/sound";

export default function ResultScreen({ result, xpEarned = 0, coinsEarned = 0, gemsEarned = 0, speedBonus = 0, newBadges = [], newLegendaryItems = [], newSticker, boostActive, onClose }) {
  const { correctCount, totalCount, fullScore, bonusCorrect, isRetryTest, subject } = result;
  const percentage = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;
  const animatedXp = useCountUp(xpEarned, 950, 180);
  const animatedCoins = useCountUp(coinsEarned, 950, 360);
  const animatedGems = useCountUp(gemsEarned, 850, 520);
  const animatedScore = useCountUp(percentage, 850, 80);
  const performance = useMemo(() => getPerformanceInfo(percentage, fullScore), [percentage, fullScore]);
  const special = Boolean(newSticker) || newBadges.length > 0 || newLegendaryItems.length > 0;

  useEffect(() => {
    if (fullScore) { playCelebrate(); celebrate(true); }
    else if (percentage >= 60) { playCorrect(); celebrate(false); }
  }, [fullScore, percentage]);

  return <div className="app-shell relative min-h-[82vh] overflow-hidden pb-10 pt-4">
    <div className="pointer-events-none absolute left-1/2 top-[8%] h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-[90px]" style={{ background: fullScore ? "rgba(255,209,102,.12)" : "rgba(139,108,255,.11)" }} />
    {[['8%','12%','0s'],['91%','18%','.8s'],['18%','45%','1.6s'],['82%','56%','2.3s']].map(([left,top,delay],i)=><span key={i} className="magic-particle" style={{ left, top, animationDelay:delay }} />)}
    <div className="relative z-10 mx-auto max-w-3xl">
      <header className="mb-5 text-center"><div className="relative mx-auto flex h-20 w-20 items-center justify-center"><div className={`absolute inset-0 rounded-full ${fullScore ? "animate-pulse-glow" : ""}`} style={{ background: `radial-gradient(circle,${fullScore?'rgba(255,209,102,.18)':'rgba(139,108,255,.17)'},transparent 68%)` }} /><div className="animate-level-ring relative flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-black" style={{ color:fullScore?'#FFD166':'#A98CFF', background:fullScore?'rgba(255,209,102,.11)':'rgba(139,108,255,.12)', borderColor:fullScore?'rgba(255,209,102,.3)':'rgba(169,140,255,.28)' }}>{fullScore?'✦':'✓'}</div></div><p className="mt-3 text-base font-black uppercase tracking-[.24em]" style={{ color:fullScore?'#FFD166':'#A98CFF' }}>{isRetryTest?'Rövanş Tamamlandı':'Görev Tamamlandı'}</p><h1 className="font-display mt-1 text-3xl font-black">{performance.title}</h1><p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-[#8793B4]">{performance.subtitle}</p></header>
      <section className="glass-card relative overflow-hidden p-5 sm:p-7" style={{ background:"linear-gradient(145deg,rgba(24,33,67,.89),rgba(8,13,30,.96))" }}>
        <div className="relative z-10 flex flex-col items-center"><ScoreRing score={animatedScore} percentage={percentage} fullScore={fullScore} /><p className="mt-4 text-base font-black">{correctCount} / {totalCount} doğru</p><p className="mt-1 text-base font-black uppercase tracking-[.14em] text-[#687494]">{subject || 'Görev Sonucu'}</p></div>
        <Divider label="Kazanımlar" />
        <div className={`relative z-10 grid gap-3 ${gemsEarned > 0 ? "grid-cols-3" : "grid-cols-2"}`}><RewardCard icon="✦" label="Kazanılan XP" value={`+${animatedXp}`} color="#52E3FF" /><RewardCard icon="◈" label="Kazanılan Coin" value={`+${animatedCoins}`} color="#FFD166" delay=".15s" />{gemsEarned > 0 && <RewardCard icon="◆" label="Kristal" value={`+${animatedGems}`} color="#D277FF" delay=".28s" />}</div>
        {(speedBonus > 0 || bonusCorrect || boostActive) && <div className="relative z-10 mt-4 space-y-2">{speedBonus > 0 && <BonusRow title="Hız Bonusu" value={`+${speedBonus} XP`} color="#52E3C2" />}{bonusCorrect && <BonusRow title="Gizli Keşif" value="+10 Coin" color="#FFD166" />}{boostActive && <BonusRow title="Keşif Güçlendirmesi" value="1.5× aktif" color="#A98CFF" />}</div>}
        {fullScore && <div className="animate-pop relative z-10 mt-5 rounded-2xl border border-[#FFD166]/20 bg-[#FFD166]/5 p-4"><p className="text-base font-black text-[#FFE29A]">✦ Kusursuz görev</p><p className="mt-1 text-base leading-relaxed text-[#9AA7C7]">Tüm soruları doğru cevapladın. Ustalık bonusun ve 1 kristal ödülün eklendi.</p></div>}
        {special && <div className="relative z-10 mt-7"><Divider label="Yeni Keşifler" gold /> <div className="space-y-2.5">{newLegendaryItems.map((item)=><UnlockCard key={item.id} eyebrow="Efsanevi Keşif" title={item.label} accent="#FFD166" />)}{newBadges.map((b)=><UnlockCard key={b.id} eyebrow="Yeni Rozet" title={b.label} description={b.desc} accent="#52E3C2" />)}{newSticker && <UnlockCard eyebrow="Koleksiyon Keşfi" title={newSticker.category || 'Yeni Sticker'} description="Arşiv koleksiyonuna yeni bir parça eklendi." accent="#FF78AA" icon={newSticker.emoji} />}</div></div>}
        {isRetryTest && <div className="relative z-10 mt-5 rounded-2xl border border-[#A98CFF]/15 bg-[#A98CFF]/5 p-3.5 text-base leading-relaxed text-[#A5AEC6]">↻ Tekrar yaptığın her soru bilgiyi daha kalıcı hale getirir.</div>}
        <button onClick={onClose} className={`sticker-btn relative z-10 mt-7 w-full py-4 text-base ${fullScore?'btn-gold':''}`}>Ödülleri Topla →</button>
      </section>
    </div>
  </div>;
}

function ScoreRing({ score, percentage, fullScore }) {
  const r=55, c=2*Math.PI*r, color=fullScore?'#FFD166':percentage>=70?'#52E3C2':percentage>=50?'#A98CFF':'#70A1FF';
  return <div className="relative h-[150px] w-[150px]"><svg viewBox="0 0 140 140" className="absolute inset-0 h-full w-full -rotate-90"><circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="9"/><circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c-(Math.min(100,percentage)/100)*c} style={{ transition:'stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)', filter:`drop-shadow(0 0 7px ${color}55)` }}/></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><p className="font-display text-4xl font-black">{score}<span className="text-lg text-[#8793B4]">%</span></p><p className="mt-1 text-base font-black uppercase tracking-[.18em]" style={{ color }}>Başarı</p></div></div>;
}
function RewardCard({ icon,label,value,color,delay='0s' }) { return <div className="animate-pop rounded-2xl border border-white/[.08] p-4 text-center" style={{ background:`${color}0D`, animationDelay:delay, animationFillMode:'both' }}><div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.045] text-lg font-black" style={{ color }}>{icon}</div><p className="font-display mt-2.5 text-2xl font-black" style={{ color }}>{value}</p><p className="mt-1 text-base font-black uppercase tracking-[.14em] text-[#687494]">{label}</p></div>; }
function BonusRow({ title,value,color }) { return <div className="flex items-center gap-3 rounded-xl border border-white/[.06] bg-white/[.028] px-3.5 py-2.5"><span className="text-base" style={{ color }}>◆</span><p className="flex-1 text-base font-bold text-[#A5AEC6]">{title}</p><p className="text-base font-black" style={{ color }}>{value}</p></div>; }
function Divider({ label,gold }) { return <div className="relative z-10 my-6 flex items-center gap-3"><div className="h-px flex-1 bg-white/[.07]"/><span className="text-base font-black uppercase tracking-[.2em]" style={{ color:gold?'#FFD166':'#687494' }}>{label}</span><div className="h-px flex-1 bg-white/[.07]"/></div>; }
function UnlockCard({ eyebrow,title,description='Yeni bir başarı koleksiyonuna eklendi.',accent,icon='◆' }) { return <div className="animate-pop rounded-2xl border p-4" style={{ background:`${accent}0D`, borderColor:`${accent}30` }}><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg" style={{ color:accent, background:`${accent}12` }}>{icon}</div><div className="min-w-0 flex-1"><p className="text-base font-black uppercase tracking-[.16em]" style={{ color:accent }}>{eyebrow}</p><p className="mt-1 truncate text-base font-black">{title}</p><p className="mt-1 text-base leading-relaxed text-[#8793B4]">{description}</p></div></div></div>; }
function useCountUp(target,duration=900,delay=0) { const [v,setV]=useState(0); useEffect(()=>{ let id,start,timer; const end=Number(target)||0; timer=setTimeout(()=>{ const step=(time)=>{ if(!start)start=time; const p=Math.min((time-start)/duration,1),e=1-Math.pow(1-p,3); setV(Math.round(end*e)); if(p<1)id=requestAnimationFrame(step); }; id=requestAnimationFrame(step); },delay); return()=>{clearTimeout(timer); if(id)cancelAnimationFrame(id);}; },[target,duration,delay]); return v; }
function getPerformanceInfo(p,full) { if(full)return{title:'Kusursuz Görev',subtitle:'Tüm soruları doğru cevapladın. Bu bölgedeki bilgini gerçekten ustalaştırdın.'}; if(p>=80)return{title:'Güçlü Keşif',subtitle:'Çok iyi ilerledin. Birkaç tekrar ile bu konuyu tamamen ustalaştırabilirsin.'}; if(p>=60)return{title:'Görev Başarılı',subtitle:'İyi ilerleme. Zorlandığın sorular Tekrar Merkezi’nde seni yeniden bekleyecek.'}; return{title:'Keşif Tamamlandı',subtitle:'Bugünkü çalışma tamamlandı. Zorlandığın soruları tekrar ederek bilgini güçlendirebilirsin.'}; }
function celebrate(perfect) { confetti({ particleCount:perfect?75:35, spread:perfect?75:58, startVelocity:perfect?34:26, origin:{x:.5,y:.5}, colors:perfect?['#FFD166','#52E3C2','#52E3FF','#A98CFF']:['#52E3C2','#52E3FF','#A98CFF'], gravity:.9, scalar:.75, ticks:150 }); }
