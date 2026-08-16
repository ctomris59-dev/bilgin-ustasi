import { playPop } from "../lib/sound";

const TABS = [
  {
    id: "dashboard",
    label: "Ana Üs",
    shortLabel: "Üs",
    accent: "#8B6CFF",
    glow: "rgba(139,108,255,.30)",
    Icon: HomeIcon,
  },
  {
    id: "mistakes",
    label: "Tekrar",
    shortLabel: "Tekrar",
    accent: "#52E3C2",
    glow: "rgba(82,227,194,.25)",
    Icon: RepeatIcon,
  },
  {
    id: "wardrobe",
    label: "Karakter",
    shortLabel: "Karakter",
    accent: "#70D6FF",
    glow: "rgba(112,214,255,.24)",
    Icon: ExplorerIcon,
  },
  {
    id: "shop",
    label: "Dükkan",
    shortLabel: "Dükkan",
    accent: "#FFD166",
    glow: "rgba(255,209,102,.24)",
    Icon: ShopIcon,
  },
  {
    id: "parent",
    label: "Ebeveyn",
    shortLabel: "Ebeveyn",
    accent: "#A98CFF",
    glow: "rgba(169,140,255,.24)",
    Icon: ShieldIcon,
  },
];

export default function BottomNav({ active, onChange }) {
  function handleChange(tabId) {
    if (active === tabId) return;
    playPop();
    onChange(tabId);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(.65rem+env(safe-area-inset-bottom))] sm:px-4">
      {/* Dock aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-[92%] max-w-xl -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,108,255,.12), transparent 68%)",
        }}
      />

      <nav
        aria-label="Ana gezinme"
        className="pointer-events-auto relative mx-auto max-w-xl overflow-hidden rounded-[24px] border border-white/[0.10] bg-[#080D1D]/[0.82] px-2 py-2 shadow-[0_18px_55px_rgba(0,0,0,.48),inset_0_1px_0_rgba(255,255,255,.07)] backdrop-blur-2xl"
      >
        {/* top glass highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)",
          }}
        />

        <div className="grid grid-cols-5 gap-1">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            const Icon = tab.Icon;

            return (
              <button
                key={tab.id}
                type="button"
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleChange(tab.id)}
                className="group relative flex min-w-0 flex-col items-center justify-center rounded-[18px] px-1 py-1.5 outline-none transition-transform duration-200 active:scale-[.94]"
              >
                {/* Active background */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-[18px] transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`}
                  style={{
                    background: isActive
                      ? `linear-gradient(180deg, ${tab.accent}16, rgba(255,255,255,.025))`
                      : "rgba(255,255,255,.035)",
                    border: isActive
                      ? `1px solid ${tab.accent}25`
                      : "1px solid transparent",
                  }}
                />

                {/* Active light beam */}
                <span
                  aria-hidden="true"
                  className={`absolute -top-2 left-1/2 h-8 w-14 -translate-x-1/2 rounded-full blur-xl transition-all duration-500 ${
                    isActive ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                  style={{ background: tab.glow }}
                />

                {/* Active top indicator */}
                <span
                  aria-hidden="true"
                  className={`absolute top-0 h-[2px] rounded-full transition-all duration-300 ${
                    isActive ? "w-7 opacity-100" : "w-0 opacity-0"
                  }`}
                  style={{
                    background: tab.accent,
                    boxShadow: `0 0 12px ${tab.accent}`,
                  }}
                />

                {/* Icon capsule */}
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-[14px] transition-all duration-300 sm:h-11 sm:w-11 ${
                    isActive
                      ? "-translate-y-1 scale-[1.05]"
                      : "group-hover:-translate-y-0.5 group-hover:scale-[1.03]"
                  }`}
                  style={{
                    color: isActive ? tab.accent : "#7F8AAA",
                    background: isActive
                      ? `linear-gradient(145deg, ${tab.accent}1C, rgba(255,255,255,.035))`
                      : "rgba(255,255,255,.025)",
                    boxShadow: isActive
                      ? `0 8px 22px ${tab.glow}, inset 0 1px 0 rgba(255,255,255,.07)`
                      : "inset 0 1px 0 rgba(255,255,255,.035)",
                  }}
                >
                  <Icon active={isActive} />

                  {/* Tiny orbital sparkle for selected tab */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full"
                      style={{
                        background: tab.accent,
                        boxShadow: `0 0 8px ${tab.accent}`,
                      }}
                    />
                  )}
                </span>

                <span
                  className={`relative z-10 mt-0.5 max-w-full truncate text-[9px] font-black tracking-tight transition-all duration-300 sm:text-[10px] ${
                    isActive ? "translate-y-0 opacity-100" : "opacity-55"
                  }`}
                  style={{ color: isActive ? "#F4F7FF" : "#8793B4" }}
                >
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function BaseIcon({ children, active }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={`h-[21px] w-[21px] transition-all duration-300 sm:h-[22px] sm:w-[22px] ${
        active ? "drop-shadow-[0_0_5px_currentColor]" : ""
      }`}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function HomeIcon({ active }) {
  return (
    <BaseIcon active={active}>
      <path d="M3.6 10.6 12 3.9l8.4 6.7" />
      <path d="M5.7 9.4v10.1h12.6V9.4" />
      <path d="M9.3 19.5v-5.7h5.4v5.7" />
      {active && <path d="M17.1 5.9h2.2v2.2" opacity=".75" />}
    </BaseIcon>
  );
}

function RepeatIcon({ active }) {
  return (
    <BaseIcon active={active}>
      <path d="M4.4 8.3A7.7 7.7 0 0 1 18 6.4l1.8 2" />
      <path d="M19.8 4.8v3.6h-3.6" />
      <path d="M19.6 15.7A7.7 7.7 0 0 1 6 17.6l-1.8-2" />
      <path d="M4.2 19.2v-3.6h3.6" />
      {active && <path d="m9.4 12 1.7 1.7 3.6-3.8" />}
    </BaseIcon>
  );
}

function ExplorerIcon({ active }) {
  return (
    <BaseIcon active={active}>
      <circle cx="12" cy="8.1" r="3.1" />
      <path d="M5.7 20c.7-4.2 3-6.2 6.3-6.2s5.6 2 6.3 6.2" />
      <path d="M8.8 5.9c.8-1.7 2-2.5 3.7-2.5 1.4 0 2.5.6 3.3 1.8" />
      {active && <path d="m17.5 11.3.6 1.1 1.1.6-1.1.6-.6 1.1-.6-1.1-1.1-.6 1.1-.6Z" />}
    </BaseIcon>
  );
}

function ShopIcon({ active }) {
  return (
    <BaseIcon active={active}>
      <path d="M5.1 9.2h13.8l-.8 10.3H5.9L5.1 9.2Z" />
      <path d="M8.5 9.2V7a3.5 3.5 0 0 1 7 0v2.2" />
      {active && <path d="M9.4 13.3h5.2" opacity=".85" />}
    </BaseIcon>
  );
}

function ShieldIcon({ active }) {
  return (
    <BaseIcon active={active}>
      <path d="M12 3.3c2.2 1.5 4.5 2.1 7 2.3v5.2c0 4.4-2.4 7.5-7 9.9-4.6-2.4-7-5.5-7-9.9V5.6c2.5-.2 4.8-.8 7-2.3Z" />
      <rect x="9.1" y="10.6" width="5.8" height="4.5" rx="1.1" />
      <path d="M10.4 10.6V9.4a1.6 1.6 0 0 1 3.2 0v1.2" />
      {active && <path d="M12 12.4v1" opacity=".9" />}
    </BaseIcon>
  );
}
