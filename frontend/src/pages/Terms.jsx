import React from "react";
import { useLang } from "@/context/LanguageContext";

export default function Terms() {
  const { lang } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-[80vh]">
      <div 
        className="bg-[#1F232B] p-8 sm:p-12 rounded-3xl border border-[#2D3340] shadow-2xl text-gray-300"
        dir={lang === 'en' ? 'ltr' : 'rtl'}
      >
        {/* اللغة الإنجليزية */}
        {lang === 'en' && (
          <div className="text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
              Terms of Service
            </h1>
            <p>Welcome to Dialekt Studio. By accessing or using our website, you agree to be bound by these Terms of Service.</p>
            
            <h2 className="text-xl font-bold text-white mt-8">Intellectual Property & Usage</h2>
            <p>
              The content, AI prompts, and TikTok scripts provided on Dialekt Studio are designed to help you create your own content. You are free to use them for your personal and commercial projects. However, you may not resell, redistribute, or publish the raw prompts and scripts themselves as a standalone product.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">Disclaimer of Warranties</h2>
            <p>
              Our tools and content are provided on an "as is" and "as available" basis. Dialekt Studio makes no guarantees regarding the performance of the generated content on third-party platforms (like TikTok or Midjourney) or its ability to generate revenue.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. Your continued use of the site after any changes constitutes acceptance of the new Terms.
            </p>
          </div>
        )}

        {/* اللغة الكردية */}
        {lang === 'ku' && (
          <div className="text-right space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
              مەرجەکانی بەکارهێنان
            </h1>
            <p>بەخێربێن بۆ دایالێکت ستۆدیۆ. بە چوونە ژوورەوە یان بەکارهێنانی ماڵپەڕەکەمان، تۆ ڕازیت بەم مەرجانەی خوارەوە.</p>
            
            <h2 className="text-xl font-bold text-white mt-8">مافی خاوەندارێتی و بەکارهێنان</h2>
            <p>
              ئەو ناوەڕۆک، پرۆمپتەکانی AI، و سکریپتەکانی تیک تۆک کە لە دایالێکت ستۆدیۆ پێشکەش دەکرێن، بۆ ئەوەن یارمەتیت بدەن ناوەڕۆکی خۆت دروست بکەیت. تۆ ئازادیت لە بەکارهێنانیان بۆ پڕۆژە کەسی و بازرگانییەکانت. بەڵام، بۆت نییە خودی پرۆمپت و سکریپتە خاوەکان بفرۆشیتەوە یان بڵاوبکەیتەوە وەک بەرهەمێکی سەربەخۆ.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">لێخۆشبوون لە گەرەنتی</h2>
            <p>
              ئامراز و ناوەڕۆکەکانمان وەک "خۆی" پێشکەش دەکرێن. دایالێکت ستۆدیۆ هیچ گەرەنتییەک نادات سەبارەت بە سەرکەوتنی ناوەڕۆکە دروستکراوەکان لە پلاتفۆرمەکانی تر (وەک تیک تۆک یان میدجەرنی) یان توانایان بۆ پەیداکردنی داهات.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">گۆڕانکاری لە مەرجەکان</h2>
            <p>
              ئێمە مافی ئەوەمان هەیە لە هەر کاتێکدا گۆڕانکاری لەم مەرجانەدا بکەین. بەردەوامبوونت لە بەکارهێنانی ماڵپەڕەکە دوای هەر گۆڕانکارییەک، بە واتای قبوڵکردنی مەرجە نوێیەکان دێت.
            </p>
          </div>
        )}

        {/* اللغة العربية */}
        {lang === 'ar' && (
          <div className="text-right space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
              شروط الاستخدام
            </h1>
            <p>مرحباً بكم في ديالكت ستوديو. بمجرد وصولك إلى موقعنا أو استخدامه، فإنك توافق على الالتزام بشروط الاستخدام هذه.</p>
            
            <h2 className="text-xl font-bold text-white mt-8">الملكية الفكرية والاستخدام</h2>
            <p>
              تم تصميم المحتوى وبرومبتات الذكاء الاصطناعي وسيناريوهات تيك توك المقدمة في ديالكت ستوديو لمساعدتك في إنشاء محتواك الخاص. لك الحرية في استخدامها في مشاريعك الشخصية والتجارية. ومع ذلك، لا يُسمح لك بإعادة بيع أو إعادة توزيع البرومبتات والسيناريوهات الخام نفسها كمنتج مستقل.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">إخلاء المسؤولية عن الضمانات</h2>
            <p>
              تُقدم أدواتنا ومحتوانا "كما هي" دون أي ضمانات. لا تقدم ديالكت ستوديو أي وعود بشأن أداء المحتوى المولد على منصات خارجية (مثل تيك توك أو Midjourney) أو قدرته على تحقيق أرباح أو مشاهدات.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">التغييرات على الشروط</h2>
            <p>
              نحتفظ بالحق في تعديل أو استبدال هذه الشروط في أي وقت. استمرارك في استخدام الموقع بعد أي تغييرات يُعد قبولاً منك بالشروط الجديدة.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
