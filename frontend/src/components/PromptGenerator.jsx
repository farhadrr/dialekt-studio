import React, { useState } from "react";
import { Wand2, Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PromptGenerator = () => {
  const { t } = useLang();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!idea.trim()) {
      toast.error(t("pg_ph"));
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { data } = await api.post("/generate-prompt", { idea });
      setResult(data.text);
    } catch (e) {
      toast.error("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      data-testid="prompt-generator"
      className="relative rounded-3xl border border-neon-pink/30 bg-ink-card overflow-hidden mb-10"
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-neon-pink/15 blur-3xl pointer-events-none" />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-neon-pink" />
          <h2 className="font-heading text-xl sm:text-2xl font-bold">{t("pg_title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">{t("pg_desc")}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            data-testid="prompt-idea-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder={t("pg_ph")}
            className="flex-1 h-12 bg-ink-surface border-ink-border text-base"
          />
          <Button
            data-testid="prompt-generate-btn"
            onClick={generate}
            disabled={loading}
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-neon-pink to-neon-cyan text-[#0B0C10] font-bold hover:opacity-90 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? t("generating") : t("pg_btn")}
          </Button>
        </div>

        {result && (
          <div data-testid="prompt-result" className="mt-5 rounded-xl border border-ink-border bg-ink-surface p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-neon-pink">{t("pg_result")}</span>
              <button
                data-testid="prompt-copy-btn"
                onClick={copy}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t("copied") : t("copy")}
              </button>
            </div>
            <p dir="auto" className="font-mono text-[13px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
