import React from "react";
import { useLang } from "@/context/LanguageContext";

export default function Privacy() {
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
              Privacy Policy
            </h1>
            <p>Welcome to Dialekt Studio. Your privacy is critically important to us.</p>
            
            <h2 className="text-xl font-bold text-white mt-8">Google AdSense and Cookies</h2>
            <p>
              We use Google AdSense to display ads on our website. Google, as a third-party vendor, uses cookies to serve ads on Dialekt Studio. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
            </p>
            <p>
              Users may opt-out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-neon-cyan hover:underline">Google Ads Settings</a>.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">Information Collection and Use</h2>
            <p>
              We do not collect any personal data unless explicitly provided by you (e.g., through our contact form). Any information collected is used solely to improve the user experience and provide better content.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We advise you to review this page periodically for any changes.
            </p>
          </div>
        )}

        {/* اللغة الكردية */}
        {lang === 'ku' && (
          <div className="text-right space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
              سیاسەتی تایبەتمەندی
            </h1>
            <p>بەخێربێن بۆ دایالێکت ستۆدیۆ. پاراستنی زانیارییە تایبەتەکانت لای ئێمە زۆر گرنگە.</p>
            
            <h2 className="text-xl font-bold text-white mt-8">ڕیکلامەکانی گۆگڵ و کوکیز (Cookies)</h2>
            <p>
              ئێمە خزمەتگوزاری Google AdSense بەکاردەهێنین بۆ نیشاندانی ڕیکلام لە ماڵپەڕەکەمان. گۆگڵ وەک لایەنی سێیەم، کوکیز بەکاردەهێنێت بۆ نیشاندانی ڕیکلام. بەکارهێنانی کوکیز لەلایەن گۆگڵەوە یارمەتی دەدات ڕیکلامی گونجاو پیشانی بەکارهێنەران بدات بەپێی سەردانەکانیان بۆ ماڵپەڕەکەمان یان ماڵپەڕەکانی تری ئینتەرنێت.
            </p>
            <p>
              بەکارهێنەران دەتوانن ڕیکلامە تایبەتمەندکراوەکان ڕابگرن لە ڕێگەی سەردانیکردنی <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-neon-cyan hover:underline">ڕێکخستنەکانی ڕیکلامی گۆگڵ</a>.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">کۆکردنەوەی زانیاری و بەکارهێنانی</h2>
            <p>
              ئێمە هیچ زانیارییەکی کەسی کۆناکەینەوە مەگەر خۆت پێمان بدەیت (بۆ نموونە لە ڕێگەی فۆڕمی پەیوەندی). هەر زانیارییەک کۆبکرێتەوە تەنها بۆ باشترکردنی ئەزموونی بەکارهێنەر و پێشکەشکردنی ناوەڕۆکی باشتر بەکاردەهێنرێت.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">گۆڕانکاری لەم سیاسەتە</h2>
            <p>
              لەوانەیە ناوە ناوە گۆڕانکاری لە سیاسەتی تایبەتمەندیمان بکەین. ئامۆژگاریت دەکەین ناوە ناوە سەردانی ئەم پەڕەیە بکەیت بۆ ئاگاداربوون لە هەر گۆڕانکارییەک.
            </p>
          </div>
        )}

        {/* اللغة العربية */}
        {lang === 'ar' && (
          <div className="text-right space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
              سياسة الخصوصية
            </h1>
            <p>مرحباً بكم في ديالكت ستوديو. خصوصيتك لها أهمية بالغة بالنسبة لنا.</p>
            
            <h2 className="text-xl font-bold text-white mt-8">إعلانات جوجل وملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نحن نستخدم خدمة Google AdSense لعرض الإعلانات على موقعنا. تستخدم جوجل، بصفتها مورداً خارجياً، ملفات تعريف الارتباط لعرض الإعلانات على ديالكت ستوديو. يتيح استخدام جوجل لملفات تعريف الارتباط الإعلانية لها ولشركائها عرض الإعلانات للمستخدمين بناءً على زيارتهم لموقعنا أو مواقع أخرى على الإنترنت.
            </p>
            <p>
              يمكن للمستخدمين إلغاء الاشتراك في الإعلانات المخصصة عن طريق زيارة <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-neon-cyan hover:underline">إعدادات إعلانات جوجل</a>.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">جمع المعلومات واستخدامها</h2>
            <p>
              نحن لا نجمع أي بيانات شخصية إلا إذا تم تقديمها صراحة من قبلك (على سبيل المثال، من خلال نموذج الاتصال بنا). يتم استخدام أي معلومات يتم جمعها فقط لتحسين تجربة المستخدم وتقديم محتوى أفضل.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">التغييرات على هذه السياسة</h2>
            <p>
              قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. ننصحك بمراجعة هذه الصفحة بشكل دوري للتعرف على أي تغييرات.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
