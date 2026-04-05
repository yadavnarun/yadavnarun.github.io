import { useState } from "react";
import { HiColorSwatch, HiX, HiSun, HiMoon } from "react-icons/hi";
import { themes, Theme, ColorMode } from "../lib/themes";

interface ThemeSwitcherProps {
  currentTheme: Theme;
  colorMode: ColorMode;
  onThemeChange: (theme: Theme) => void;
  onModeChange: (mode: ColorMode) => void;
}

const ThemeSwitcher = ({
  currentTheme,
  colorMode,
  onThemeChange,
  onModeChange,
}: ThemeSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMode = () => {
    onModeChange(colorMode === "dark" ? "light" : "dark");
  };

  const getSwatchColors = (theme: Theme) => {
    const colors = colorMode === "dark" ? theme.dark : theme.light;
    return colors;
  };

  return (
    <>
      {/* Mode Toggle Button */}
      <button
        className="mode-toggle"
        onClick={toggleMode}
        aria-label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
      >
        {colorMode === "dark" ? <HiSun /> : <HiMoon />}
      </button>

      {/* Theme Switcher Button */}
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme switcher"
      >
        {isOpen ? <HiX /> : <HiColorSwatch />}
      </button>

      {/* Theme Panel */}
      {isOpen && (
        <div className="theme-panel theme-panel--open">
          <div className="theme-panel__header">
            <span>Art Styles</span>
            <span className="theme-panel__count">{themes.length}</span>
          </div>
          <div className="theme-panel__list">
            {themes.map((theme) => {
              const swatchColors = getSwatchColors(theme);
              return (
                <button
                  key={theme.id}
                  className={`theme-panel__item ${
                    currentTheme.id === theme.id ? "theme-panel__item--active" : ""
                  }`}
                  onClick={() => {
                    onThemeChange(theme);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className="theme-panel__swatch"
                    style={{
                      background: swatchColors["--bg"],
                      borderColor: swatchColors["--border"],
                      borderRadius: theme.baseVariables["--radius"].split(" ")[0],
                    }}
                  >
                    <span
                      className="theme-panel__swatch-accent"
                      style={{
                        background: swatchColors["--accent"],
                      }}
                    />
                    <span
                      className="theme-panel__swatch-text"
                      style={{
                        color: swatchColors["--text"],
                        fontFamily: theme.baseVariables["--font-display"],
                      }}
                    >
                      Aa
                    </span>
                  </span>
                  <span className="theme-panel__name">{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeSwitcher;
