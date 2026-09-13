import React from "react";
import { useLang } from "@/context/LanguageContext";

// variant: "leaderboard" | "infeed" | "rectangle"
export const AdBanner = ({ variant = "leaderboard", className = "" }) => {
  const { t } = useLang();

  const sizes = {
    leaderboard: "h-[90px] sm:h-[90px]",
    infeed: "h-[110px]",
    rectangle: "h-[250px]",
  };

  const label = variant === "infeed" ? t("ad_sponsored") : t("ad_label");

  return (
    <div
      data-testid={`ad-banner-${variant}`}
      className={`relative w-full rounded-2xl border border-dashed border-ink-border overflow-hidden bg-gradient-to-r from-cyan-950/20 via-slate-900/30 to-pink-950/20 ${sizes[variant]} ${className}`}
    >
      <span className="absolute top-2 left-3 rtl:left-auto rtl:right-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
        {label}
      </span>
      <div className="w-full h-full grid place-items-center">
        <span className="text-sm text-muted-foreground/60 font-medium">{t("ad_your")}</span>
      </div>
      <div className="absolute inset-0 grain pointer-events-none opacity-60" />
    </div>
  );
};
