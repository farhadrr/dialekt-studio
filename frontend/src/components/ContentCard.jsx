import React from "react";

export const ContentCard = ({ item, dialects }) => {
  // حماية إضافية: إذا لم تكن هناك بيانات لا تفعل شيئاً
  if (!item) return null;

  // توحيد أسماء المتغيرات لتعمل مع بيانات فايربيس والبيانات القديمة
  const title = item.title || "بدون عنوان";
  const text = item.prompt || item.desc || "";
  const imageUrl = item.imageUrl || item.image || "";
  
  // محاولة جلب اسم اللهجة إذا كانت موجودة
  const dialectName = dialects?.find(d => d.code === item.dialect)?.name_native || item.dialect || "";

  return (
    <div className="bg-[#1F2833] border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col h-full group">
      
      {/* قسم الصورة (يظهر فقط إذا كان هناك رابط صورة) */}
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      {/* قسم النصوص والتفاصيل */}
      <div className="p-5 flex flex-col flex-grow">
        {dialectName && (
          <span className="text-xs font-bold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded-md w-max mb-3 border border-cyan-800/50">
            {dialectName}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        <p className="text-gray-400 text-sm flex-grow mb-4 line-clamp-3" dir="auto">
          {text}
        </p>
        
        {/* زر نسخ النص */}
        <button 
          onClick={() => {
            navigator.clipboard.writeText(text);
            alert("تم نسخ النص! ✅");
          }}
          className="mt-auto w-full bg-[#0B0C10] hover:bg-gray-800 text-white font-medium py-2.5 rounded-xl transition-colors border border-gray-700 hover:border-cyan-500"
        >
          نسخ النص 📋
        </button>
      </div>
    </div>
  );
};
