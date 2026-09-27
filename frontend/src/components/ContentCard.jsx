import React, { useState } from "react";
import { Copy, Check } from "lucide-react"; 
import { useLang } from "@/context/LanguageContext";

export const ContentCard = ({ item, dialects }) => {
  const [copied, setCopied] = useState(false);
  
  // استدعاء آمن للغات
  const langContext = useLang() || {};
  const t = langContext.t || ((k) => k);
  const activeLang = langContext.lang || langContext.language || langContext.locale || "ar";

  if (!item) return null;

  // 1. نظام ذكي وآمن جداً لاستخراج العنوان بـ 3 لغات بدون انهيار الموقع
  let displayTitle = "بدون عنوان";
  if (item.title) {
    if (typeof item.title === 'object') {
      displayTitle = item.title[activeLang] || item.title['ar'] || item.title['en'] || "بدون عنوان";
    } else {
      displayTitle = t(item.title) || item.title;
    }
  }

  const text = String(item.prompt || item.desc || "");
  const imageUrl = String(item.imageUrl || item.image || "");
  const subtitle = item.subtitle ? String(t(item.subtitle)) : ""; 

  // 2. حماية إضافية للهاشتاجات لتجنب أي شاشة سوداء أخرى
  let safeTags = ["عام"];
  if (Array.isArray(item.tags)) {
    safeTags = item.tags;
  } else if (typeof item.tags === 'string') {
    safeTags = item.tags.split(',').map(s => s.trim());
  } else {
    const dName = dialects?.find(d => d.code === item.dialect)?.name_native || item.dialect || "";
    safeTags = [dName || "كل اللهجات", "عام"];
  }

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (
    <div className="bg-[#1F232B] border border-[#2D3340] rounded-2xl overflow-hidden hover:shadow-[0_0_15px_rgba(255,0,128,0.2)] transition-shadow duration-300 flex flex-col h-full">
      
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={String(displayTitle)} 
            className="w-full h-full object-cover"
            onError={(e) => e.target.style.display='none'} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F232B] to-transparent"></div>
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-grow relative z-10 -mt-8">
        <div className={`mb-4 ${activeLang === 'en' ? 'text-left' : 'text-right'}`}>
          <h3 className="text-xl font-bold text-white mb-1">{String(displayTitle)}</h3>
          {subtitle && <p className="text-sm text-gray-400 mb-2">{subtitle}</p>}
          
          <div className={`flex flex-wrap gap-2 mt-2 ${activeLang === 'en' ? 'justify-start' : 'justify-end'}`}>
            {safeTags.map((tag, i) => (
              <span key={i} className="text-xs text-gray-400">#{String(tag)}</span>
            ))}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm flex-grow mb-6 leading-relaxed font-mono" dir="ltr">
          {text}
        </p>
        
        <button 
          onClick={handleCopy}
          disabled={copied}
          className={`mt-auto w-full py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border ${
            copied 
              ? 'bg-[#1a202c] border-green-500/50 text-green-400' 
              : 'bg-[#15181e] hover:bg-[#1a202c] text-gray-300 border-[#2D3340]' 
          }`}
        >
          {copied ? (
            <>
              <span>{t("copied") || "تم النسخ"}</span>
              <Check className="w-4 h-4 text-green-400" />
            </>
          ) : (
            <>
              <span>{t("copy") || "نسخ"}</span>
              <Copy className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
