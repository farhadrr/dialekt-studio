import React, { useState } from "react";
// أضفنا أيقونة "الصح" (Check) لتظهر عند النسخ بدلاً من الرسالة
import { Copy, Check } from "lucide-react"; 

export const ContentCard = ({ item, dialects }) => {
  // متغير للتحكم في حالة الزر (هل تم النسخ أم لا؟)
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const title = item.title || "بدون عنوان";
  const text = item.prompt || item.desc || "";
  const imageUrl = item.imageUrl || item.image || "";
  
  const dialectName = dialects?.find(d => d.code === item.dialect)?.name_native || item.dialect || "";

  // دالة النسخ الاحترافية بدون إشعارات مزعجة
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true); // تغيير الزر إلى حالة النجاح
    
    // إعادة الزر لشكله الأصلي بعد ثانيتين بالضبط
    setTimeout(() => {
      setCopied(false);
    }, 2000); 
  };

  return (
    <div className="bg-[#1F2833] border border-gray-700/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full group">
      
      {imageUrl && (
        <div className="w-full h-52 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2833] to-transparent opacity-60"></div>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow relative z-10">
        {dialectName && (
          <span className="text-xs font-semibold text-cyan-300 bg-cyan-900/40 px-3 py-1.5 rounded-full w-max mb-4 border border-cyan-700/50 shadow-sm">
            {dialectName}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
        
        <p className="text-gray-300 text-sm flex-grow mb-6 line-clamp-4 leading-relaxed" dir="auto">
          {text}
        </p>
        
        <button 
          onClick={handleCopy}
          disabled={copied}
          className={`mt-auto w-full font-semibold py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group/btn border ${
            copied 
              ? 'bg-green-900/40 border-green-500/50 text-green-400' // لون الزر عند النسخ
              : 'bg-[#0B0C10] hover:bg-gray-800 text-gray-200 hover:text-cyan-400 border-gray-700/50 hover:border-cyan-500/50' // لون الزر العادي
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-400" />
              <span>تم النسخ بنجاح</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gray-400 group-hover/btn:text-cyan-400 transition-colors" />
              <span>نسخ النص</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
