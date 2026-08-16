import { ROOM_ITEMS } from "../../data/petsAndRoom";
import RoomItemGlyph from "./RoomItemGlyph";
function findItem(id){return ROOM_ITEMS.find((i)=>i.id===id)||null;}
export default function RoomBackground({ room, children, compact=false }) {
  const wallpaper=findItem(room?.wallpaper); const c=wallpaper?.color || '#26345F'; const items=room?.items||[];
  return <div className="relative overflow-hidden rounded-2xl border border-white/10" style={{minHeight:compact?205:235,background:`linear-gradient(180deg,${c}38 0%,rgba(18,28,58,.92) 67%,rgba(8,13,29,.96) 67%)`,boxShadow:'inset 0 1px 0 rgba(255,255,255,.06),0 18px 42px rgba(0,0,0,.24)'}}>
    <div className="absolute inset-x-0 top-[67%] h-px bg-white/10"/><div className="absolute left-5 top-5 h-12 w-16 rounded-xl border border-white/10 bg-[#07101f]/40"><div className="absolute inset-2 rounded-lg bg-gradient-to-br from-[#52E3FF]/20 to-[#8B6CFF]/10"/><span className="absolute right-2 top-1 text-[8px] text-white/45">✦</span></div>
    <div className="absolute right-5 top-5 h-9 w-9 rounded-full bg-[#FFD166]/12 blur-[1px]"/><div className="absolute right-7 top-7 h-5 w-5 rounded-full bg-[#FFD166]/25"/>
    {items.map((placed)=>{const item=findItem(placed.itemId); if(!item)return null; return <div key={placed.uid} className="absolute -translate-x-1/2 -translate-y-1/2" style={{left:`${placed.x}%`,top:`${placed.y}%`}}><RoomItemGlyph item={item} size={compact?38:45}/></div>;})}
    <div className="relative z-10 flex min-h-[inherit] items-end justify-center pb-2">{children}</div>
  </div>;
}
