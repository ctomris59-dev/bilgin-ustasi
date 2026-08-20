import { STYLE_SPRITE, getSpritePosition } from "../../assets/v50/styleSprite";
import { getStyle } from "../../data/styleCollection";

export function getSpriteRootStyle(){return {"--v50-sprite":`url("${STYLE_SPRITE}")`};}

export default function StyleAvatar({styleId,className="",label}){
  const style=getStyle(styleId);
  const pos=getSpritePosition(style.index);
  return <span
    className={`v50-style-avatar ${className}`.trim()}
    style={{"--v50-x":`${pos.x}%`,"--v50-y":`${pos.y}%`}}
    role="img"
    aria-label={label||style.label}
  />;
}
