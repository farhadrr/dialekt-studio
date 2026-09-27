import React, { useState } from "react";
import { Copy, Check } from "lucide-react"; 

export const ContentCard = ({ item, dialects }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const title = item.title || "بدون عنوان";
  const text = item.prompt || item.desc || "";
  const imageUrl = item.imageUrl || item.image || "";
  
  const dialectName = dialects?.find(d => d.code === item.dialect)?.name_native || item.dialect || "";
  
  // نفترض وجود عنوان فرعي إنجليزي أو وصف قصير، إن لم يوجد نتركه فارغاً
  const subtitle = item.subtitle || ""; 

  // محاكاة نظام الهاشتاجات إذا لم تكن موجودة في البيانات
  const tags = item.tags || [dialectName || "كل اللهجات", "عام"];

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000); 
  };

  return (
    // الإطار الخارجي بنفس ألوان التصميم الأصلي
    <div className="bg-[#1F232B] border border-[#2D3340] rounded-2xl overflow-hidden hover:shadow-[0_0_15px_rgba(255,0,128,0.2)] transition-shadow duration-300 flex flex-col h-full">
      
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          {/* التدرج اللوني فوق الصورة كما في التصميم الأصلي */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F232B] to-transparent"></div>
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-grow relative z-10 -mt-8">
        
        {/* قسم العناوين والهاشتاجات */}
        <div className="text-right mb-4">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400 mb-2">{subtitle}</p>}
          
          <div className="flex flex-wrap justify-end gap-2 mt-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* النص بخط الـ Monospace كما في التصميم */}
        <p className="text-gray-300 text-sm flex-grow mb-6 leading-relaxed font-mono" dir="ltr">
          {text}
        </p>
        
        {/* زر النسخ */}
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
              <span>تم النسخ</span>
              <Check className="w-4 h-4 text-green-400" />
            </>
          ) : (
            <>
              <span>نسخ</span>
              <Copy className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
