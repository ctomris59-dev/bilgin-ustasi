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
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: "2 / 3",
      }}
    >
      <img
        src={STYLE_SPRITE}
        alt=""
        aria-hidden="true"
        draggable="false"
        decoding="async"
        style={{
          position: "absolute",
          width: `${SPRITE_COLUMNS * 100}%`,
          height: `${SPRITE_ROWS * 100}%`,
          maxWidth: "none",
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
          objectFit: "fill",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      {label && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 6,
            transform: "translateX(-50%)",
            zIndex: 2,
            padding: "2px 6px",
            borderRadius: 999,
            background: "rgba(2, 17, 31, .72)",
            color: "#dff7ff",
            fontSize: 8,
            fontWeight: 900,
            whiteSpace: "nowrap",
          }}
        >
          {style.shortLabel}
        </span>
      )}
    </div>
  );
}
