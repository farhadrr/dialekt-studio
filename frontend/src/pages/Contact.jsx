import React, { useEffect, useState } from "react";
import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { AdBanner } from "@/components/AdBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const { t } = useLang();
  const [dialects, setDialects] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", topic: "", dialect: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get("/dialects").then((r) => setDialects(r.data)).catch(() => {});
  }, [api]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.topic || !form.message) {
      toast.error(t("c_message_ph"));
      return;
    }
    setLoading(true);
    try {
      await api.post("/contact", { ...form, dialect: form.dialect || null });
      setDone(true);
      toast.success(t("c_success"));
      setForm({ name: "", email: "", topic: "", dialect: "", message: "" });
    } catch (err) {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const topics = [
    { v: "general", label: t("c_topic_general") },
    { v: "dialect", label: t("c_topic_dialect") },
    { v: "partner", label: t("c_topic_partner") },
    { v: "bug", label: t("c_topic_bug") },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <span className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-pink mx-auto mb-5">
          <Mail className="w-7 h-7 text-[#0B0C10]" />
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">{t("contact_title")}</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t("contact_sub")}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
        <form
          data-testid="contact-form"
          onSubmit={submit}
          className="rounded-3xl border border-ink-border bg-ink-card p-6 sm:p-8 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("c_name")}</Label>
              <Input data-testid="contact-name" value={form.name} onChange={set("name")} className="bg-ink-surface border-ink-border" />
            </div>
            <div className="space-y-1.5">
              <Label>{t("c_email")}</Label>
              <Input data-testid="contact-email" type="email" value={form.email} onChange={set("email")} className="bg-ink-surface border-ink-border" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("c_topic")}</Label>
              <Select value={form.topic} onValueChange={set("topic")}>
                <SelectTrigger data-testid="contact-topic" className="bg-ink-surface border-ink-border">
                  <SelectValue placeholder={t("c_topic_ph")} />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((tp) => (
                    <SelectItem key={tp.v} value={tp.v}>{tp.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("c_dialect")}</Label>
              <Select value={form.dialect} onValueChange={set("dialect")}>
                <SelectTrigger data-testid="contact-dialect" className="bg-ink-surface border-ink-border">
                  <SelectValue placeholder={t("all_dialects")} />
                </SelectTrigger>
                <SelectContent>
                  {dialects.map((d) => (
                    <SelectItem key={d.code} value={d.code}>{d.name_native}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("c_message")}</Label>
            <Textarea
              data-testid="contact-message"
              value={form.message}
              onChange={set("message")}
              placeholder={t("c_message_ph")}
              rows={5}
              className="bg-ink-surface border-ink-border resize-none"
            />
          </div>

          {done && (
            <div data-testid="contact-success" className="flex items-center gap-2 text-neon-cyan text-sm">
              <CheckCircle2 className="w-5 h-5" /> {t("c_success")}
            </div>
          )}

          <Button
            data-testid="contact-submit"
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-pink text-[#0B0C10] font-bold hover:opacity-90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? t("c_sending") : t("c_send")}
          </Button>
        </form>

        <aside className="hidden lg:block sticky top-24">
          <AdBanner variant="rectangle" />
        </aside>
      </div>
    </div>
  );
}
