const O="#17213E";
export default function RoomItemGlyph({ item, size=54 }) {
  if(!item)return null; const base={filter:'drop-shadow(0 5px 5px rgba(0,0,0,.22))'};
  if(item.slot==='desk')return <svg viewBox="0 0 80 55" width={size*1.25} height={size*.86} style={base}><rect x="10" y="10" width="60" height="26" rx="5" fill={item.color} stroke={O} strokeWidth="3"/><path d="M18 36 V52 M62 36 V52" stroke={O} strokeWidth="4"/><path d="M17 17 H63" stroke="#fff" strokeOpacity=".35" strokeWidth="3"/></svg>;
  if(item.slot==='lamp')return <svg viewBox="0 0 55 80" width={size*.72} height={size} style={base}><path d="M14 28 Q27 5 41 28 Z" fill={item.color} stroke={O} strokeWidth="3"/><path d="M27 29 V64" stroke="#8b96b4" strokeWidth="4"/><ellipse cx="27" cy="68" rx="14" ry="5" fill="#59627b" stroke={O} strokeWidth="2"/><circle cx="27" cy="25" r="4" fill="#fff2aa" opacity=".75"/></svg>;
  if(item.slot==='rug')return <svg viewBox="0 0 90 38" width={size*1.5} height={size*.63} style={base}><ellipse cx="45" cy="19" rx="40" ry="14" fill={item.color} stroke={O} strokeWidth="3"/><path d="M25 19 H65" stroke="#fff" strokeOpacity=".32" strokeWidth="3" strokeDasharray="6 5"/></svg>;
  if(item.slot==='plant')return <svg viewBox="0 0 60 80" width={size*.75} height={size} style={base}><path d="M30 42 Q8 26 18 10 Q35 21 30 42 Z M30 43 Q50 26 44 9 Q27 22 30 43 Z M30 39 Q18 13 29 5 Q40 18 30 39 Z" fill="#52E3C2" stroke={O} strokeWidth="2"/><path d="M18 45 H43 L39 72 H22 Z" fill={item.color} stroke={O} strokeWidth="3"/></svg>;
  if(item.slot==='poster')return <svg viewBox="0 0 60 80" width={size*.75} height={size} style={base}><rect x="6" y="5" width="48" height="68" rx="6" fill={item.color} stroke={O} strokeWidth="3"/><path d="M14 58 L28 38 L38 49 L49 29" stroke="#fff" strokeOpacity=".55" strokeWidth="3" fill="none"/><circle cx="19" cy="20" r="5" fill="#FFD166"/></svg>;
  return <div style={{width:size,height:size,background:item.color,border:`2px solid ${O}`,borderRadius:14,...base}}/>;
}
