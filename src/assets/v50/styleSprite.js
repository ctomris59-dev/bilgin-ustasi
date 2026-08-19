const modules = import.meta.glob('./sprite-chunks/*.js', { eager: true, import: 'default' });
const keys = Object.keys(modules).sort();
const payload = keys.map((key) => modules[key]).join('');
export const STYLE_SPRITE = payload ? `data:image/avif;base64,${payload}` : '';
export const SPRITE_COLUMNS = 5;
export const SPRITE_ROWS = 4;
export const STYLE_TILE_WIDTH = 1024;
export const STYLE_TILE_HEIGHT = 1536;
