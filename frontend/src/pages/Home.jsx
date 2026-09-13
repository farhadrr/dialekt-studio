import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clapperboard, Sparkles, Lightbulb, ArrowRight, Wand2, ArrowLeft } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { api, CATEGORIES, accentMap } from "@/lib/api";
import { AdBanner } from "@/components/AdBanner";
import { ContentCard } from "@/components/ContentCard";
import { GeneratorDialog } from "@/components/GeneratorDialog";
import { Button } from "@/components/ui/button";

const ICONS = { Clapperboard, Sparkles, Lightbulb };

const HERO_IMG =
  "https://images.unsplash.com/photo-1673767298248-b128f17f89af?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";

export default function Home() {
  const { t, tf, lang, dir } = useLang();
  const [dialects, setDialects] = useState([]);
  const [featured, setFeatured] = useState([]);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    api.get("/dialects").then((r) => setDialects(r.data)).catch(() => {});
    api.get("/content").then((r) => setFeatured(r.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-neon-cyan/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-neon-pink/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-neon-cyan mb-5">
              {t("hero_eyebrow")}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              {t("hero_title_1")}{" "}
              <span className="text-gradient">{t("hero_title_2")}</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t("hero_sub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/library/tiktok-scripts">
                <Button
                  data-testid="hero-browse-btn"
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-pink text-[#0B0C10] font-bold hover:opacity-90"
                >
                  {t("hero_cta")} <Arrow className="w-4 h-4" />
                </Button>
              </Link>
              <GeneratorDialog
                dialects={dialects}
                trigger={
                  <Button
                    data-testid="hero-generate-btn"
                    variant="outline"
                    className="h-12 px-6 rounded-xl border-ink-border bg-transparent hover:bg-ink-surface font-semibold"
                  >
                    <Wand2 className="w-4 h-4 text-neon-cyan" /> {t("hero_cta2")}
                  </Button>
                }
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-ink-border">
              <img src={HERO_IMG} alt="Creator studio" className="w-full h-[340px] lg:h-[440px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* TOP LEADERBOARD AD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdBanner variant="leaderboard" />
      </div>

      {/* CATEGORIES BENTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t("explore")}</h2>
          <p className="text-muted-foreground mt-2">{t("explore_sub")}</p>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.icon];
            const accent = accentMap[cat.accent];
            const span =
              cat.id === "tiktok-scripts"
                ? "col-span-12 md:col-span-7"
                : cat.id === "ai-prompts"
                ? "col-span-12 md:col-span-5"
                : "col-span-12";
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={span}
              >
                <Link
                  to={`/library/${cat.id}`}
                  data-testid={`category-card-${cat.id}`}
                  className={`group relative flex flex-col h-full min-h-[200px] rounded-3xl border ${accent.border} border-opacity-30 bg-ink-card p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                >
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ background: accent.ring }}
                  />
                  <span className={`grid place-items-center w-12 h-12 rounded-2xl bg-ink-surface border ${accent.border} border-opacity-40 mb-5`}>
                    <Icon className={`w-6 h-6 ${accent.text}`} />
                  </span>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold">{tf(cat.title)}</h3>
                    <span className={`text-[11px] px-2 py-1 rounded-md border ${accent.border} border-opacity-40 ${accent.text}`}>
                      {tf(cat.badge)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{tf(cat.desc)}</p>
                  <span className={`mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold ${accent.text}`}>
                    {t("view_all")} <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t("featured")}</h2>
            <p className="text-muted-foreground mt-2">{t("featured_sub")}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((item) => (
            <ContentCard key={item.id} item={item} dialects={dialects} />
          ))}
        </div>
      </section>
    </div>
  );
}
