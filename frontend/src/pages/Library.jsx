import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Wand2 } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { api, CATEGORIES, accentMap } from "@/lib/api";
import { ContentCard } from "@/components/ContentCard";
import { AdBanner } from "@/components/AdBanner";
import { GeneratorDialog } from "@/components/GeneratorDialog";
import { PromptGenerator } from "@/components/PromptGenerator";
import { Button } from "@/components/ui/button";

export default function Library() {
  const { category } = useParams();
  const { t, tf } = useLang();
  const [dialects, setDialects] = useState([]);
  const [items, setItems] = useState([]);
  const [activeDialect, setActiveDialect] = useState("all");
  const [loading, setLoading] = useState(true);

  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const accent = accentMap[cat.accent];

  useEffect(() => {
    api.get("/dialects").then((r) => setDialects(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setActiveDialect("all");
    api
      .get("/content", { params: { category: cat.id } })
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [cat.id]);

  const filtered = useMemo(
    () => (activeDialect === "all" ? items : items.filter((i) => i.dialect === activeDialect)),
    [items, activeDialect]
  );

  // Insert an in-feed ad after every 6 cards
  const withAds = [];
  filtered.forEach((item, idx) => {
    withAds.push(<ContentCard key={item.id} item={item} dialects={dialects} />);
    if ((idx + 1) % 6 === 0 && idx !== filtered.length - 1) {
      withAds.push(
        <div key={`ad-${idx}`} className="sm:col-span-2 lg:col-span-3">
          <AdBanner variant="infeed" />
        </div>
      );
    }
  });

  const availableDialects = dialects.filter((d) => items.some((i) => i.dialect === d.code));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <span className={`text-xs uppercase ${accent.text}`}>
          {tf(cat.badge)}
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">
              {tf(cat.title)}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">{tf(cat.desc)}</p>
          </div>
          <GeneratorDialog
            dialects={dialects}
            defaultCategory={cat.id}
            trigger={
              <Button
                data-testid="library-generate-btn"
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-pink text-[#0B0C10] font-bold hover:opacity-90"
              >
                <Wand2 className="w-4 h-4" /> {t("hero_cta2")}
              </Button>
            }
          />
        </div>
      </div>

      {/* Dynamic prompt generator (AI Prompts only) */}
      {cat.id === "ai-prompts" && <PromptGenerator dialects={dialects} />}

      {/* Dialect filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          data-testid="dialect-filter-all"
          onClick={() => setActiveDialect("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
            activeDialect === "all"
              ? "bg-foreground text-[#0B0C10] border-foreground"
              : "border-ink-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("all_dialects")}
        </button>
        {availableDialects.map((d) => (
          <button
            key={d.code}
            data-testid={`dialect-filter-${d.code}`}
            onClick={() => setActiveDialect(d.code)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeDialect === d.code
                ? "bg-foreground text-[#0B0C10] border-foreground"
                : "border-ink-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.name_native}
          </button>
        ))}
      </div>

      {/* Content + sidebar */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          {loading ? (
            <p className="text-muted-foreground py-20 text-center">…</p>
          ) : filtered.length === 0 ? (
            <p data-testid="library-empty" className="text-muted-foreground py-20 text-center">
              {t("empty")}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{withAds}</div>
          )}
        </div>

        {/* Sticky sidebar ad */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <AdBanner variant="rectangle" />
            <div className="rounded-2xl border border-ink-border bg-ink-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-5 h-5 text-neon-cyan" />
                <h3 className="font-heading font-bold">{t("generate_title")}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t("generate_desc")}</p>
              <GeneratorDialog
                dialects={dialects}
                defaultCategory={cat.id}
                trigger={
                  <Button
                    data-testid="sidebar-generate-btn"
                    className="w-full rounded-xl bg-gradient-to-r from-neon-cyan to-neon-pink text-[#0B0C10] font-bold hover:opacity-90"
                  >
                    <Wand2 className="w-4 h-4" /> {t("btn_generate")}
                  </Button>
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
