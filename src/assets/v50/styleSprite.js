export const STYLE_SPRITE = "/character-styles/v50-styles.avif";
export const SPRITE_COLUMNS = 5;
export const SPRITE_ROWS = 4;
export const STYLE_TILE_WIDTH = 640;
export const STYLE_TILE_HEIGHT = 960;
export const STYLE_ATLAS_WIDTH = 3200;
export const STYLE_ATLAS_HEIGHT = 3840;

export function getSpritePosition(index=0){
  const safe=Math.max(0,Math.min(19,Number(index)||0));
  const col=safe%SPRITE_COLUMNS;
  const row=Math.floor(safe/SPRITE_COLUMNS);
  return {x:SPRITE_COLUMNS===1?0:(col/(SPRITE_COLUMNS-1))*100,y:SPRITE_ROWS===1?0:(row/(SPRITE_ROWS-1))*100};
}
