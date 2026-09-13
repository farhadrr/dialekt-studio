import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { LANGS } from "@/i18n";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/library/tiktok-scripts", label: t("nav_scripts") },
    { to: "/library/ai-prompts", label: t("nav_prompts") },
    { to: "/library/content-ideas", label: t("nav_ideas") },
    { to: "/contact", label: t("nav_contact") },
  ];

  const isActive = (to) =>
    to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0C10]/80 border-b border-ink-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-2 shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-pink">
            <Sparkles className="w-5 h-5 text-[#0B0C10]" />
          </span>
          <span className="connected-text font-heading font-extrabold text-lg" style={{ letterSpacing: "0px", fontVariantLigatures: "normal", fontFeatureSettings: "'liga' 1, 'rlig' 1, 'dlig' 1" }}>
            {t("brand")}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.to === "/" ? "home" : l.to.split("/").pop()}`}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(l.to)
                  ? "text-neon-cyan"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-ink-border p-0.5 bg-ink-surface">
            {LANGS.map((l) => (
              <button
                key={l.code}
                data-testid={`lang-${l.code}`}
                onClick={() => setLang(l.code)}
                className={`w-8 h-7 rounded-full text-xs font-semibold transition-colors ${
                  lang === l.code
                    ? "bg-neon-cyan text-[#0B0C10]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-ink-border bg-[#0B0C10] px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              data-testid={`mobile-nav-${l.to === "/" ? "home" : l.to.split("/").pop()}`}
              className={`block px-3 py-3 rounded-lg text-sm ${
                isActive(l.to) ? "text-neon-cyan bg-ink-surface" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
