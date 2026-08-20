import {
  STYLE_SPRITE,
  SPRITE_COLUMNS,
  SPRITE_ROWS,
  SPRITE_TILE_WIDTH,
  SPRITE_TILE_HEIGHT,
  SPRITE_PIXEL_WIDTH,
  SPRITE_PIXEL_HEIGHT,
} from "../../assets/v50/styleSprite";

export default function StyleRender({ style, className = "", label = true }) {
  if (!style) return null;

  const idx = Math.max(0, Math.min(19, (style.index || 1) - 1));
  const col = idx % SPRITE_COLUMNS;
  const row = Math.floor(idx / SPRITE_COLUMNS);

  if (!STYLE_SPRITE) {
    return (
      <div className={`v50-image-fallback ${className}`}>
        <span>★</span>
        {label && <b>{style.shortLabel}</b>}
      </div>
    );
  }

  return (
    <svg
      role="img"
      aria-label={style.label}
      className={`v50-sprite-render ${className}`}
      data-style-index={idx + 1}
      viewBox={`0 0 ${SPRITE_TILE_WIDTH} ${SPRITE_TILE_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <image
        href={STYLE_SPRITE}
        x={-col * SPRITE_TILE_WIDTH}
        y={-row * SPRITE_TILE_HEIGHT}
        width={SPRITE_PIXEL_WIDTH}
        height={SPRITE_PIXEL_HEIGHT}
        preserveAspectRatio="none"
      />
      {label && (
        <text
          x={SPRITE_TILE_WIDTH / 2}
          y={SPRITE_TILE_HEIGHT - 12}
          textAnchor="middle"
          className="v50-render-label"
        >
          {style.shortLabel}
        </text>
      )}
    </svg>
  );
}
