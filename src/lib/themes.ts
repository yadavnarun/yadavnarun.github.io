export type ColorMode = "light" | "dark";

export interface Theme {
  id: string;
  name: string;
  className: string;
  fontUrl: string;
  baseVariables: Record<string, string>;
  light: Record<string, string>;
  dark: Record<string, string>;
}

// Neo-Brutalist Theme
export const themes: Theme[] = [
  {
    id: "brutalist",
    name: "Brutalist",
    className: "theme-brutalist",
    fontUrl: "Space+Grotesk:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600",
    baseVariables: {
      "--font-display": "'Space Grotesk', sans-serif",
      "--font-body": "'JetBrains Mono', monospace",
      "--font-mono": "'JetBrains Mono', monospace",
      "--letter-spacing": "0em",
      "--line-height": "1.6",
      "--border-width": "3px",
      "--shadow-offset": "5px",
      "--radius": "0px",
      "--transition-speed": "0.15s",
    },
    light: {
      "--bg": "#ffffff",
      "--bg-alt": "#f0f0e8",
      "--text": "#0a0a0a",
      "--text-muted": "#444444",
      "--accent": "#00cc6a",
      "--accent-2": "#e62650",
      "--accent-3": "#d9a800",
      "--accent-4": "#0099cc",
      "--border": "#0a0a0a",
      "--shadow": "#0a0a0a",
      "--glow-color": "rgba(0, 200, 100, 0.12)",
    },
    dark: {
      "--bg": "#050505",
      "--bg-alt": "#111111",
      "--text": "#ffffff",
      "--text-muted": "#b8b8b8",
      "--accent": "#00ff88",
      "--accent-2": "#ff3366",
      "--accent-3": "#ffcc00",
      "--accent-4": "#00ccff",
      "--border": "#ffffff",
      "--shadow": "#ffffff",
      "--glow-color": "rgba(0, 255, 136, 0.1)",
    },
  },
];

export const getRandomTheme = (): Theme => {
  return themes[0];
};

export const loadThemeFonts = (fontUrl: string) => {
  const existingLink = document.getElementById("theme-fonts") as HTMLLinkElement;
  const newHref = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`;

  if (existingLink && existingLink.href === newHref) {
    return;
  }

  if (existingLink) {
    existingLink.remove();
  }

  const link = document.createElement("link");
  link.id = "theme-fonts";
  link.rel = "stylesheet";
  link.href = newHref;
  document.head.appendChild(link);
};

export const applyTheme = (theme: Theme, mode: ColorMode = "dark") => {
  const root = document.documentElement;

  Object.entries(theme.baseVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  const colorVariables = mode === "dark" ? theme.dark : theme.light;
  Object.entries(colorVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  loadThemeFonts(theme.fontUrl);

  document.body.className = `${theme.className} mode-${mode}`;
};
