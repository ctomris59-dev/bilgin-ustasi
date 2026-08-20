import sprite0 from "./sprite0.js";
import sprite1 from "./sprite1.js";
import sprite2 from "./sprite2.js";
import sprite3 from "./sprite3.js";

export const STYLE_SPRITE = `data:image/avif;base64,${sprite0}${sprite1}${sprite2}${sprite3}`;
export const SPRITE_COLUMNS = 5;
export const SPRITE_ROWS = 4;

// Logical master-art standard used by the collection metadata.
export const STYLE_TILE_WIDTH = 1024;
export const STYLE_TILE_HEIGHT = 1536;

// Optimized runtime atlas dimensions. The 20 logical 1024×1536 masters are
// packed as 320×480 display tiles in a 5×4 AVIF atlas for fast delivery.
export const SPRITE_TILE_WIDTH = 320;
export const SPRITE_TILE_HEIGHT = 480;
export const SPRITE_PIXEL_WIDTH = SPRITE_TILE_WIDTH * SPRITE_COLUMNS;
export const SPRITE_PIXEL_HEIGHT = SPRITE_TILE_HEIGHT * SPRITE_ROWS;

export function getSpritePosition(index = 0) {
  const safe = Math.max(0, Math.min(19, Number(index) || 0));
  const col = safe % SPRITE_COLUMNS;
  const row = Math.floor(safe / SPRITE_COLUMNS);
  return {
    x: SPRITE_COLUMNS === 1 ? 0 : (col / (SPRITE_COLUMNS - 1)) * 100,
    y: SPRITE_ROWS === 1 ? 0 : (row / (SPRITE_ROWS - 1)) * 100,
  };
}
