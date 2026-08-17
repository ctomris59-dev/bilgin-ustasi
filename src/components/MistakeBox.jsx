export default function MistakeBox({ profile, onStartRetryTest }) {
  const active=(profile.mistakeBox||[]).filter((m)=>!m.resolved);
  const bySubject=active.reduce((acc,m)=>{(acc[m.subject] ||= []).push(m);return acc;},{});
  const resolved=(profile.mistakeBox||[]).filter((m)=>m.resolved).length;
  return <div className="v4x-repeat-screen">
    <section className="v4x-repeat-hero"><div><span className="v4x-eyebrow">TEKRAR MERKEZİ</span><h2>Yanlışlar öğrenme fırsatına dönüşür</h2><p>Zorlandığın sorular otomatik olarak burada tutulur. Rövanş görevinde doğru yaptığında listeden çözülmüş olarak çıkar.</p></div><div className="v4x-repeat-score"><strong>{active.length}</strong><small>bekleyen soru</small><span>{resolved} soru ustalaştırıldı</span></div></section>
    <section className="v4x-repeat-stats"><Stat value={active.length} label="Bekleyen" color="#ff789e"/><Stat value={Object.keys(bySubject).length} label="Aktif ders" color="#a98cff"/><Stat value={resolved} label="Çözülen" color="#52e3c2"/><Stat value={profile.stats?.retryTestsPassed||0} label="Rövanş başarısı" color="#52e3ff"/></section>
    {active.length===0 ? <div className="v4x-empty v4x-repeat-empty"><span>✓</span><strong>Şu an bekleyen tekrar yok</strong><small>Yeni bir testte zorlandığın soru olursa otomatik olarak burada görünür.</small></div> : <div className="v4x-repeat-grid">{Object.entries(bySubject).map(([subject,items])=><article key={subject}><header><div><small>DERS</small><strong>{subject}</strong></div><span>{items.length} soru</span></header><div className="v4x-repeat-preview">{items.slice(0,3).map((item,index)=><div key={item.id}><b>{index+1}</b><p>{item.question?.text||"Tekrar sorusu"}</p></div>)}</div><div className="v4x-repeat-progress"><span style={{width:`${Math.min(100,35+items.length*8)}%`}}/></div><button onClick={()=>onStartRetryTest(subject,items)}>Rövanş Görevini Başlat →</button></article>)}</div>}
  </div>;
}
function Stat({value,label,color}){return <div><strong style={{color}}>{value}</strong><small>{label}</small></div>}
