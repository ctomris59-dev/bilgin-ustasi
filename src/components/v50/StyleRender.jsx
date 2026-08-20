import { STYLE_SPRITE, SPRITE_COLUMNS, SPRITE_ROWS } from "../../assets/v50/styleSprite";

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
    <div
      role="img"
      aria-label={style.label}
      className={`v50-sprite-render ${className}`}
      data-style-index={idx + 1}
    >
      <img
        src={STYLE_SPRITE}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          width: `${SPRITE_COLUMNS * 100}%`,
          height: `${SPRITE_ROWS * 100}%`,
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
        }}
      />
      {label && <span className="v50-render-label">{style.shortLabel}</span>}
    </div>
  );
}
