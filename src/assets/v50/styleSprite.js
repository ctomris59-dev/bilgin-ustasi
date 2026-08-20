import sprite0 from "./sprite0.js";
import sprite1 from "./sprite1.js";
import sprite2 from "./sprite2.js";
import sprite3 from "./sprite3.js";

export const STYLE_SPRITE = `data:image/avif;base64,${sprite0}${sprite1}${sprite2}${sprite3}`;
export const SPRITE_COLUMNS = 5;
export const SPRITE_ROWS = 4;
export const STYLE_TILE_WIDTH = 1024;
export const STYLE_TILE_HEIGHT = 1536;

export function getSpritePosition(index=0){
  const safe=Math.max(0,Math.min(19,Number(index)||0));
  const col=safe%SPRITE_COLUMNS;
  const row=Math.floor(safe/SPRITE_COLUMNS);
  return {
    x:SPRITE_COLUMNS===1?0:(col/(SPRITE_COLUMNS-1))*100,
    y:SPRITE_ROWS===1?0:(row/(SPRITE_ROWS-1))*100,
  };
}
