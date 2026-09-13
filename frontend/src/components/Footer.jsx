import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export const Footer = () => {
  const { t } = useLang();
  return (
    <footer data-testid="site-footer" className="border-t border-ink-border mt-24 grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-pink">
                <Sparkles className="w-4 h-4 text-[#0B0C10]" />
              </span>
              <span className="connected-text font-heading font-extrabold text-lg" style={{ letterSpacing: "0px", fontVariantLigatures: "normal", fontFeatureSettings: "'liga' 1, 'rlig' 1, 'dlig' 1" }}>{t("brand")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("footer_tag")}</p>
          </div>
          <div className="flex gap-12">
            <div className="space-y-2">
              <Link to="/library/tiktok-scripts" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">{t("nav_scripts")}</Link>
              <Link to="/library/ai-prompts" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">{t("nav_prompts")}</Link>
              <Link to="/library/content-ideas" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">{t("nav_ideas")}</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">{t("nav_contact")}</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ink-border text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("brand")}. {t("footer_rights")}
        </div>
      </div>
    </footer>
  );
};
