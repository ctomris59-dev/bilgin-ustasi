import { STYLE_SPRITE, SPRITE_COLUMNS, SPRITE_ROWS } from '../../assets/v50/styleSprite';

export default function StyleRender({ style, className='', label=true }) {
  if (!style) return null;
  const idx=Math.max(0,(style.index||1)-1);
  const col=idx%SPRITE_COLUMNS;
  const row=Math.floor(idx/SPRITE_COLUMNS);
  const x=SPRITE_COLUMNS===1?0:(col/(SPRITE_COLUMNS-1))*100;
  const y=SPRITE_ROWS===1?0:(row/(SPRITE_ROWS-1))*100;
  if(!STYLE_SPRITE)return <div className={`v50-image-fallback ${className}`}><span>★</span>{label&&<b>{style.shortLabel}</b>}</div>;
  return <div role="img" aria-label={style.label} className={`v50-sprite-render ${className}`} style={{backgroundImage:`url(${STYLE_SPRITE})`,backgroundSize:`${SPRITE_COLUMNS*100}% ${SPRITE_ROWS*100}%`,backgroundPosition:`${x}% ${y}%`}}/>;
}
