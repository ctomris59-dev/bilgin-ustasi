import AnimatedAvatar from "./AnimatedAvatar";

// V5 compatibility bridge: existing screens keep using AvatarCanvas while the
// renderer underneath is the new single-hero SVG rig.
export default function AvatarCanvas(props) {
  return <AnimatedAvatar {...props} />;
}
