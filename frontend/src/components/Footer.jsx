import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";

export const Footer = () => {
  const { t, lang } = useLang();
  
  return (
    <footer data-testid="site-footer" className="border-t border-ink-border mt-24 grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <img src="https://i.postimg.cc/MnYztDhs/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="connected-text font-heading font-extrabold text-lg" style={{ letterSpacing: "0px", fontVariantLigatures: "normal", fontFeatureSettings: "'liga' 1, 'rlig' 1, 'dlig' 1" }}>{t("brand")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("footer_tag")}</p>
          </div>
          <div className="flex gap-12">
            <div className="space-y-2">
              <Link to="/library/tiktok-scripts" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">{t("nav_scripts")}</Link>
              <Link to="/library/ai-prompts" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">{t("nav_prompts")}</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">{t("nav_contact")}</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
                {lang === 'ar' ? 'من نحن' : lang === 'ku' ? 'دەربارە' : 'About Us'}
              </Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
                {lang === 'ar' ? 'سياسة الخصوصية' : lang === 'ku' ? 'سیاسەتی تایبەتمەندی' : 'Privacy Policy'}
              </Link>
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
