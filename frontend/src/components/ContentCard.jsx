import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";
import { CATEGORIES, accentMap } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export const ContentCard = ({ item, dialects }) => {
  const { t, tf } = useLang();
  const [copied, setCopied] = useState(false);

  const cat = CATEGORIES.find((c) => c.id === item.category);
  const accent = accentMap[cat?.accent || "cyan"];
  const dialect = dialects?.find((d) => d.code === item.dialect);
  const isPrompt = item.category === "ai-prompts";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.body);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article
      data-testid={`content-card-${item.id}`}
      className={`group relative flex flex-col rounded-2xl border border-ink-border bg-ink-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-opacity-60 ${accent.border} hover:shadow-[0_0_28px_-6px_var(--tw-shadow-color)]`}
      style={{ "--tw-shadow-color": accent.ring + "40" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-heading font-bold text-lg leading-snug truncate">{item.title_native}</h3>
          <p className="text-xs text-muted-foreground truncate">{item.title}</p>
        </div>
        {item.badge && (
          <Badge className={`shrink-0 border ${accent.border} bg-transparent ${accent.text}`}>
            {item.badge}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        {dialect && (
          <span className="text-[11px] px-2 py-1 rounded-md bg-ink-surface text-muted-foreground">
            {dialect.name_native}
          </span>
        )}
        {item.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-1 rounded-md bg-ink-surface text-muted-foreground">
            #{tag}
          </span>
        ))}
      </div>

      <pre
        dir="auto"
        className={`flex-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 mb-4 max-h-56 overflow-y-auto ${
          isPrompt ? "font-mono text-[13px]" : ""
        }`}
      >
        {item.body}
      </pre>

      <button
        data-testid={`copy-btn-${item.id}`}
        onClick={handleCopy}
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors border border-ink-border hover:border-transparent ${
          copied ? "bg-neon-cyan text-[#0B0C10]" : "hover:bg-ink-surface"
        }`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? t("copied") : t("copy")}
      </button>
    </article>
  );
};
