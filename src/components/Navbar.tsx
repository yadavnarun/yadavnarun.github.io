import { useState, useEffect } from "react";
import { HiMenuAlt3, HiX, HiSun, HiMoon } from "react-icons/hi";
import { themes, ColorMode, applyTheme } from "../lib/themes";

const MODE_STORAGE_KEY = "narun-mode";

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Proof", href: "#proof" },
  { name: "Resume", href: "https://l.narun.in/resume", external: true },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ColorMode | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const mode = savedMode || (systemPrefersDark ? "dark" : "light");
    setColorMode(mode);
    setMounted(true);
  }, []);

  const toggleMode = () => {
    const newMode = colorMode === "dark" ? "light" : "dark";
    setColorMode(newMode);
    applyTheme(themes[0], newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar--visible" : ""}`}>
        <div className="navbar__inner">
          <a href="#home" className="navbar__logo">
            NARUN<span>.</span>
          </a>

          {/* Desktop Links + Theme Toggle */}
          <div className="navbar__links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="navbar__link"
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {link.name}
              </a>
            ))}
            {/* Theme Toggle - part of nav */}
            {mounted && (
              <button
                className="navbar__theme-toggle"
                onClick={toggleMode}
                aria-label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
              >
                {colorMode === "dark" ? <HiSun /> : <HiMoon />}
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="navbar__actions">
            <a href="#final-cta" className="navbar__cta">
              Let&apos;s Talk
            </a>

            {/* Mobile Theme Toggle */}
            {mounted && (
              <button
                className="navbar__theme-toggle navbar__theme-toggle--mobile"
                onClick={toggleMode}
                aria-label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
              >
                {colorMode === "dark" ? <HiSun /> : <HiMoon />}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="navbar__mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu mobile-menu--open">
          <div className="mobile-menu__content">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="mobile-menu__link"
                onClick={() => setIsMobileMenuOpen(false)}
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#final-cta"
              className="mobile-menu__cta"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
