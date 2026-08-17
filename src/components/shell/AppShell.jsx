import SideNav from "./SideNav";
import TopBar from "./TopBar";
import RightRail from "./RightRail";
import AnimatedAvatar from "../avatar/AnimatedAvatar";

const SECTION_META = {
  dashboard: { eyebrow: "GÜNLÜK MACERA", title: "Ana Üs" },
  mistakes: { eyebrow: "ÖĞRENMEYİ GÜÇLENDİR", title: "Tekrar Merkezi" },
  wardrobe: { eyebrow: "KAHRAMANINI GELİŞTİR", title: "Bilgin Kaşif Üssü" },
  shop: { eyebrow: "ÖDÜLLERİ KULLAN", title: "Kaşif Dükkânı" },
  archive: { eyebrow: "KAZANIMLAR", title: "Keşif Arşivi" },
  parent: { eyebrow: "İLERLEME & KONTROL", title: "Ebeveyn Paneli" },
  test: { eyebrow: "AKTİF GÖREV", title: "Test Görevi" },
  result: { eyebrow: "GÖREV SONUCU", title: "Ödül Merkezi" },
  world: { eyebrow: "KEŞİF ROTASI", title: "Dünya Haritası" },
  minigame: { eyebrow: "KISA MOLA", title: "Hafıza Görevi" },
};

const FOCUS_ANIMATIONS = {
  test: { animation: "thinking", label: "Düşünüyor" },
  result: { animation: "victory", label: "Görev tamamlandı" },
  world: { animation: "levelup", label: "Yeni keşif" },
  minigame: { animation: "happy", label: "Mola modu" },
};

export default function AppShell({
  profile, tests, syncStatus, activeSection, tab, onChangeTab, onOpenWorldMap,
  onStartMiniGame, onOpenMistakes, onStartTest, children, focusMode = false,
  selectedItem, onSelectItem, onBuyItem, onEquipItem, onOpenShop, onOpenCharacter,
}) {
  const meta = SECTION_META[activeSection] || SECTION_META.dashboard;
  const focusHero = focusMode ? FOCUS_ANIMATIONS[activeSection] : null;
  const characterMode = activeSection === "wardrobe";

  return (
    <div className={`v4-root v4x-root ${focusMode ? "is-focus-mode" : ""} ${characterMode ? "is-character-mode" : ""}`}>
      <div className="v4-ambient v4-ambient-one" /><div className="v4-ambient v4-ambient-two" />
      <SideNav active={tab} onChange={onChangeTab} onOpenWorldMap={onOpenWorldMap} onStartMiniGame={onStartMiniGame} compact={focusMode} />
      <div className="v4-workspace v4x-workspace">
        <TopBar profile={profile} syncStatus={syncStatus} title={meta.title} eyebrow={meta.eyebrow} />
        <main className="v4-main-scroll v4x-main-scroll"><div className="v4-content-canvas v4x-content-canvas">{children}</div></main>
      </div>
      {!focusMode && !characterMode && <RightRail profile={profile} tests={tests} activeSection={activeSection} selectedItem={selectedItem} onSelectItem={onSelectItem} onOpenWorldMap={onOpenWorldMap} onOpenMistakes={onOpenMistakes} onStartTest={onStartTest} onBuyItem={onBuyItem} onEquipItem={onEquipItem} onOpenShop={onOpenShop} onOpenCharacter={onOpenCharacter} />}
      {focusHero && (
        <aside className={`v5-focus-hero is-${activeSection}`} aria-label={`Bilgin Kaşif · ${focusHero.label}`}>
          <span>{focusHero.label}</span>
          <AnimatedAvatar avatar={profile.avatar} size={124} animation={focusHero.animation} showEquipment compact />
        </aside>
      )}
    </div>
  );
}
