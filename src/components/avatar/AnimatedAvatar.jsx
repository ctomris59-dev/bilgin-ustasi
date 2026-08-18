import LayeredHero from "./LayeredHero";

// Compatibility shell: every screen in the app keeps importing AnimatedAvatar,
// while the implementation is now the single neutral-master layered renderer.
export default function AnimatedAvatar(props) {
  return <LayeredHero {...props} />;
}
