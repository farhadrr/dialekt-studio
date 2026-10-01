import React, { useState } from "react";
import { Copy, Check } from "lucide-react"; 
import { useLang } from "@/context/LanguageContext";

export const ContentCard = ({ item, dialects }) => {
  const [copied, setCopied] = useState(false);
  
  const langContext = useLang() || {};
  const t = langContext.t || ((k) => k);
  const activeLang = langContext.lang || langContext.language || langContext.locale || "ar";

  if (!item) return null;

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
  
  // السر هنا: تحويل الرقم إلى تموضع دقيق، ودعم الكروت القديمة
  let objPos = "50% 50%"; 
  if (item.imagePosition) {
    if (item.imagePosition === "object-top") objPos = "50% 0%";
    else if (item.imagePosition === "object-bottom") objPos = "50% 100%";
    else if (item.imagePosition === "object-center") objPos = "50% 50%";
    else objPos = `50% ${item.imagePosition}%`; 
  }

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
    <div 
      className="bg-[#1F232B] border border-[#2D3340] rounded-2xl overflow-hidden hover:shadow-[0_0_15px_rgba(255,0,128,0.2)] transition-shadow duration-300 flex flex-col relative w-full h-[520px] sm:h-[580px]"
    >
      
      {imageUrl && (
        <div className="w-full h-[280px] sm:h-[320px] shrink-0 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={String(displayTitle)} 
            className="w-full h-full object-cover"
            style={{ objectPosition: objPos }} // تطبيق التحكم الدقيق
            onError={(e) => e.target.style.display='none'} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F232B] to-transparent"></div>
        </div>
      )}
      
      <div className="p-4 sm:p-5 flex flex-col flex-grow relative z-10 -mt-8 min-h-0">
        
        <div className={`mb-2 shrink-0 ${activeLang === 'en' ? 'text-left' : 'text-right'}`}>
          <h3 className="text-lg font-bold text-white mb-1 truncate">{String(displayTitle)}</h3>
          {subtitle && <p className="text-xs text-gray-400 mb-1 truncate">{subtitle}</p>}
          
          <div className={`flex flex-wrap gap-1 mt-1 overflow-hidden h-5 ${activeLang === 'en' ? 'justify-start' : 'justify-end'}`}>
            {safeTags.map((tag, i) => (
              <span key={i} className="text-[10px] text-gray-400">#{String(tag)}</span>
            ))}
          </div>
        </div>
        
        <div 
          className="text-gray-300 text-xs sm:text-sm flex-grow leading-relaxed font-mono overflow-hidden mb-4" 
          dir="ltr"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 7,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {text}
        </div>
        
        <button 
          onClick={handleCopy}
          disabled={copied}
          className={`mt-auto shrink-0 w-full py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border text-sm ${
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
