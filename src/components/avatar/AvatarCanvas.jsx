import AnimatedAvatar from "./AnimatedAvatar";

// V5.1 compatibility bridge: existing screens keep using AvatarCanvas while
// the renderer underneath is the premium single-hero master-art rig.
export default function AvatarCanvas(props) {
  return <AnimatedAvatar {...props} />;
}
