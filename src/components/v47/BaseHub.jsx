import { ROOM_TYPES } from "../../data/houseRooms";

export default function BaseHub({ profile }) {
  const completed = new Set(profile?.completedRooms || []);
  return <section className="v47-simple-page"><header><span className="v47-eyebrow">ÜS</span><h1>Bilgin Kaşif Üssü'nü geliştir.</h1><p>Her bölüm keşif yolculuğunun başka bir parçasını temsil eder. Tamamlanan odalar ekstra XP ve coin kazandırır.</p></header><div className="v47-base-grid">{ROOM_TYPES.map((room)=><article key={room.id} className={completed.has(room.id)?"is-complete":""}><div className="v47-room-art"><span>{room.emoji}</span></div><small>ÜS BÖLÜMÜ</small><h3>{room.title}</h3><p>{completed.has(room.id)?"Tamamlandı · Ödüller kazanıldı":"Yeni eşyalarla bu alanı tamamla."}</p><button>{completed.has(room.id)?"✓ Tamamlandı":"Düzenle"}</button></article>)}</div></section>;
}
