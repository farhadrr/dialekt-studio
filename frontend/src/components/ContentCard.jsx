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
      className="bg-[#1F232B] border border-[#2D3340] rounded-2xl overflow-hidden hover:shadow-[0_0_15px_rgba(255,0,128,0.2)] transition-shadow duration-300 flex flex-col relative w-full"
      style={{ aspectRatio: '1 / 1' }} 
    >
      
      {imageUrl && (
        <div className="w-full h-[40%] shrink-0 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={String(displayTitle)} 
            // الحل هنا: cover تملأ المكان، و top تحمي الوجه من القص
            className="w-full h-full object-cover object-top"
            onError={(e) => e.target.style.display='none'} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F232B] to-transparent"></div>
        </div>
      )}
      
      <div className="p-3 sm:p-4 flex flex-col flex-grow relative z-10 -mt-6 min-h-0">
        
        <div className={`mb-1.5 shrink-0 ${activeLang === 'en' ? 'text-left' : 'text-right'}`}>
          <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 truncate">{String(displayTitle)}</h3>
          {subtitle && <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5 truncate">{subtitle}</p>}
          
          <div className={`flex flex-wrap gap-1 overflow-hidden h-4 ${activeLang === 'en' ? 'justify-start' : 'justify-end'}`}>
            {safeTags.map((tag, i) => (
              <span key={i} className="text-[9px] text-gray-400">#{String(tag)}</span>
            ))}
          </div>
        </div>
        
        <div 
          className="text-gray-300 text-[10px] sm:text-[11px] flex-grow leading-snug font-mono overflow-hidden mb-2" 
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
          className={`mt-auto shrink-0 w-full py-1.5 sm:py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border text-xs sm:text-sm ${
            copied 
              ? 'bg-[#1a202c] border-green-500/50 text-green-400' 
              : 'bg-[#15181e] hover:bg-[#1a202c] text-gray-300 border-[#2D3340]' 
          }`}
        >
          {copied ? (
            <>
              <span>{t("copied") || "تم النسخ"}</span>
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            </>
          ) : (
            <>
              <span>{t("copy") || "نسخ"}</span>
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
