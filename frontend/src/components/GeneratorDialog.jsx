import React, { useState } from "react";
import { Wand2, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";
import { CATEGORIES } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const VIBES = ["viral", "funny", "emotional", "educational", "cinematic"];

export const GeneratorDialog = ({ trigger, defaultCategory = "tiktok-scripts" }) => {
  const { t, tf } = useLang();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(defaultCategory);
  const [topic, setTopic] = useState("");
  const [vibe, setVibe] = useState("viral");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error(t("field_topic"));
      return;
    }
    setLoading(true);
    setResult("");
    
    try {
      // دمج الخيارات لإرسالها للذكاء الاصطناعي في كلاودفلير
      const combinedIdea = `القسم: ${category} - الموضوع: ${topic} - الطابع: ${vibe}`;
      
      const response = await fetch("https://dialekt-ai-proxy.farhad10180.workers.dev/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idea: combinedIdea })
      });

      const data = await response.json();

      if (data.error) {
        toast.error("حدث خطأ: " + data.error);
      } else {
        setResult(data.text);
      }
    } catch (e) {
      toast.error("فشل التوليد، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        data-testid="generator-dialog"
        className="bg-ink-card border-ink-border max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-neon-cyan" />
            {t("generate_title")}
          </DialogTitle>
          <DialogDescription>{t("generate_desc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>{t("field_category")}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="gen-category-select" className="bg-ink-surface border-ink-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{tf(c.title)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{t("field_topic")}</Label>
            <Input
              data-testid="gen-topic-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("field_topic_ph")}
              className="bg-ink-surface border-ink-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("field_vibe")}</Label>
            <div className="flex flex-wrap gap-2">
              {VIBES.map((v) => (
                <button
                  key={v}
                  data-testid={`gen-vibe-${v}`}
                  onClick={() => setVibe(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    vibe === v
                      ? "bg-neon-cyan text-[#0B0C10] border-neon-cyan"
                      : "border-ink-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(`vibe_${v}`)}
                </button>
              ))}
            </div>
          </div>

          <Button
            data-testid="gen-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-neon-cyan to-neon-pink text-[#0B0C10] font-bold hover:opacity-90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? t("generating") : t("btn_generate")}
          </Button>

          {result && (
            <div data-testid="gen-result" className="rounded-xl border border-ink-border bg-ink-surface p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-neon-cyan font-mono">
                  {t("result")}
                </span>
                <button
                  data-testid="gen-copy-btn"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t("copied") : t("copy")}
                </button>
              </div>
              <pre dir="auto" className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-mono">
                {result}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
