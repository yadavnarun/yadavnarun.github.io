import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import Lenis from "lenis";
import * as gtag from "../lib/gtag";
import { themes, ColorMode, applyTheme } from "../lib/themes";
import WorkshopBackground from "../components/WorkshopBackground";
import { HiViewGrid, HiAdjustments } from "react-icons/hi";

const MODE_STORAGE_KEY = "narun-mode";
const GRID_STORAGE_KEY = "narun-grid";
const GRID_SETTINGS_KEY = "narun-grid-settings";

type GridStyle = "wave" | "pulse" | "vortex" | "glitch" | "hex" | "circuit" | "noise" | "radial" | "floor";
type HoverEffect = "glow" | "repel" | "attract" | "ripple" | "warp";

const GRID_STYLES: GridStyle[] = ["wave", "pulse", "vortex", "glitch", "hex", "circuit", "noise", "radial", "floor"];
const HOVER_EFFECTS: HoverEffect[] = ["repel", "attract", "warp", "ripple", "glow"];

interface GridSettings {
  intensity: number;
  hoverEffect: HoverEffect;
  hoverRadius: number;
  hoverStrength: number;
  glowEnabled: boolean;
  glowIntensity: number;
}

const DEFAULT_SETTINGS: GridSettings = {
  intensity: 50,
  hoverEffect: "repel",
  hoverRadius: 150,
  hoverStrength: 50,
  glowEnabled: true,
  glowIntensity: 50,
};

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [gridStyle, setGridStyle] = useState<GridStyle>("wave");
  const [gridSettings, setGridSettings] = useState<GridSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  // Console easter egg
  useEffect(() => {
    console.log(
      "%c> narun@console:~$ %cwhoami",
      "color: #00ff88; font-family: monospace; font-size: 14px;",
      "color: #fff; font-family: monospace; font-size: 14px;"
    );
    console.log(
      "%cFounder-grade engineer. If you're reading this, we should talk.\nhttps://l.narun.in/meet",
      "color: #b8b8b8; font-family: monospace; font-size: 12px;"
    );
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ColorMode | null;
    const savedGrid = localStorage.getItem(GRID_STORAGE_KEY) as GridStyle | null;
    const savedSettings = localStorage.getItem(GRID_SETTINGS_KEY);

    // Follow system theme by default
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const modeToApply: ColorMode = savedMode || (systemPrefersDark ? "dark" : "light");

    // Detect mobile
    const isMobile = window.innerWidth <= 768;

    // Default grid styles based on device and theme
    // Desktop: light = hex, dark = pulse
    // Mobile: light = glitch, dark = pulse
    let defaultGrid: GridStyle;
    let defaultSettings = { ...DEFAULT_SETTINGS };

    if (isMobile) {
      defaultGrid = modeToApply === "light" ? "glitch" : "pulse";
      defaultSettings.hoverEffect = "ripple";
    } else {
      defaultGrid = modeToApply === "light" ? "hex" : "pulse";
    }

    const gridToApply = savedGrid || defaultGrid;

    setColorMode(modeToApply);
    setGridStyle(gridToApply);
    if (savedSettings) {
      try {
        setGridSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch {}
    } else if (isMobile) {
      setGridSettings(defaultSettings);
    }
    applyTheme(themes[0], modeToApply);
    setIsLocal(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Expose globally for nav links
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href !== "#") {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            lenis.scrollTo(element as HTMLElement, { offset: -80 });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  const cycleGrid = () => {
    const currentIndex = GRID_STYLES.indexOf(gridStyle);
    const nextIndex = (currentIndex + 1) % GRID_STYLES.length;
    const newStyle = GRID_STYLES[nextIndex];
    setGridStyle(newStyle);
    localStorage.setItem(GRID_STORAGE_KEY, newStyle);
  };

  const updateGridSettings = (updates: Partial<GridSettings>) => {
    const newSettings = { ...gridSettings, ...updates };
    setGridSettings(newSettings);
    localStorage.setItem(GRID_SETTINGS_KEY, JSON.stringify(newSettings));
  };

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* Workshop Background */}
      {mounted && (
        <WorkshopBackground
          style={gridStyle}
          intensity={gridSettings.intensity}
          hoverEffect={gridSettings.hoverEffect}
          hoverRadius={gridSettings.hoverRadius}
          hoverStrength={gridSettings.hoverStrength}
          glowEnabled={gridSettings.glowEnabled}
          glowIntensity={gridSettings.glowIntensity}
        />
      )}

      <Component {...pageProps} />

      {/* Control Panel - only on localhost */}
      {mounted && isLocal && (
        <div className="controls">
          {/* Settings Toggle */}
          <button
            className="control-btn"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Grid settings"
            title="Settings"
          >
            <HiAdjustments />
          </button>

          {/* Grid Style Toggle */}
          <button
            className="control-btn"
            onClick={cycleGrid}
            aria-label={`Grid style: ${gridStyle}`}
            title={`Grid: ${gridStyle}`}
          >
            <HiViewGrid />
            <span className="control-btn__label">{gridStyle}</span>
          </button>
        </div>
      )}

      {/* Settings Panel - only on localhost */}
      {mounted && isLocal && showSettings && (
        <div className="settings-panel settings-panel--open">
          <div className="settings-panel__header">
            <span>Grid Settings</span>
            <button onClick={() => setShowSettings(false)}>&times;</button>
          </div>

          <div className="settings-panel__group">
            <label>Grid Style</label>
            <div className="settings-panel__buttons">
              {GRID_STYLES.map((s) => (
                <button
                  key={s}
                  className={gridStyle === s ? "active" : ""}
                  onClick={() => {
                    setGridStyle(s);
                    localStorage.setItem(GRID_STORAGE_KEY, s);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-panel__group">
            <label>Intensity: {gridSettings.intensity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={gridSettings.intensity}
              onChange={(e) => updateGridSettings({ intensity: Number(e.target.value) })}
            />
          </div>

          <div className="settings-panel__group">
            <label>Hover Effect</label>
            <div className="settings-panel__buttons">
              {HOVER_EFFECTS.map((effect) => (
                <button
                  key={effect}
                  className={gridSettings.hoverEffect === effect ? "active" : ""}
                  onClick={() => updateGridSettings({ hoverEffect: effect })}
                >
                  {effect}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-panel__group">
            <label>Hover Radius: {gridSettings.hoverRadius}px</label>
            <input
              type="range"
              min="50"
              max="300"
              value={gridSettings.hoverRadius}
              onChange={(e) => updateGridSettings({ hoverRadius: Number(e.target.value) })}
            />
          </div>

          <div className="settings-panel__group">
            <label>Hover Strength: {gridSettings.hoverStrength}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={gridSettings.hoverStrength}
              onChange={(e) => updateGridSettings({ hoverStrength: Number(e.target.value) })}
            />
          </div>

          <div className="settings-panel__group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={gridSettings.glowEnabled}
                onChange={(e) => updateGridSettings({ glowEnabled: e.target.checked })}
                style={{ width: "auto", margin: 0 }}
              />
              Mouse Glow
            </label>
          </div>

          {gridSettings.glowEnabled && (
            <div className="settings-panel__group">
              <label>Glow Intensity: {gridSettings.glowIntensity}%</label>
              <input
                type="range"
                min="10"
                max="100"
                value={gridSettings.glowIntensity}
                onChange={(e) => updateGridSettings({ glowIntensity: Number(e.target.value) })}
              />
            </div>
          )}

          <button
            className="settings-panel__reset"
            onClick={() => {
              setGridSettings(DEFAULT_SETTINGS);
              localStorage.setItem(GRID_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
            }}
          >
            Reset to Defaults
          </button>
        </div>
      )}
    </>
  );
};

export default App;
