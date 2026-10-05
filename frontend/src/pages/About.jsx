import React from "react";
import { useLang } from "@/context/LanguageContext";

export default function About() {
  const { lang } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-[80vh]">
      <div 
        className="bg-[#1F232B] p-8 sm:p-12 rounded-3xl border border-[#2D3340] shadow-2xl"
        dir={lang === 'en' ? 'ltr' : 'rtl'}
      >
        {lang === 'en' && (
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
              About Dialekt Studio
            </h1>
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              In a fast-paced digital world, creative content creation requires smart and innovative tools that save time and elevate quality. <strong className="text-white">Dialekt Studio</strong> is designed specifically to support creators in the Arab world and Kurdistan, acting as your personal assistant to turn simple ideas into professional, viral-ready content.
            </p>
            <h2 className="text-xl font-bold text-white mb-3 mt-8">What We Offer</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We combine cutting-edge AI technology with deep local cultural understanding to provide specialized interactive tools, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-8 space-y-3 pl-4">
              <li><strong className="text-neon-cyan">Story Studio & TikTok Scripts:</strong> Professional short video scripts designed to grab attention instantly with detailed scene breakdowns and audio cues.</li>
              <li><strong className="text-neon-cyan">AI Image Prompts:</strong> Carefully engineered English prompts to generate cinematic and realistic visuals on Midjourney and other AI tools.</li>
            </ul>
            <h2 className="text-xl font-bold text-white mb-3 mt-8">Multilingual Support</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              Dialekt Studio fully supports multiple languages. Whether you target Arabic speakers, Kurdish audiences (Sorani and Badini), or English speakers, our platform adapts to your language instantly.
            </p>
          </div>
        )}

        {lang === 'ku' && (
          <div className="text-right">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
              دەربارەی دایالێکت ستۆدیۆ
            </h1>
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              لە جیهانێکی پڕ لە گۆڕانکاری دیجیتالدا، دروستکردنی ناوەڕۆکی داهێنەرانە پێویستی بە ئامرازی هزرمەند و خێرا هەیە. <strong className="text-white">دایالێکت ستۆدیۆ</strong> دروستکراوە بۆ پشتگیریکردنی ناوەڕۆک سازان لە جیهانی عەرەبی و کوردستاندا، تاوەکو یارمەتیت بدات بیرۆکە سادەکانت بگۆڕیت بۆ ناوەڕۆکێکی پرۆفیشناڵ.
            </p>
            <h2 className="text-xl font-bold text-white mb-3 mt-8">ئێمە چی پێشکەش دەکەین؟</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              پێشکەوتووترین تەکنۆلۆژیای زیرەکی دەستکرد تێکەڵ دەکەین لەگەڵ تێگەیشتنی قووڵ بۆ فەرهەنگی خۆجێی بۆ پێشکەشکردنی ئەم ئامرازانە:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-8 space-y-3 pr-4">
              <li><strong className="text-neon-cyan">ستۆدیۆ چیرۆک و سکریپتی تیک تۆک:</strong> نوسینی سکریپتی پرۆفیشناڵ بۆ ڤیدیۆ کورتەکان بە دابەشکردنی وردی دیمەنەکان.</li>
              <li><strong className="text-neon-cyan">پرۆمپتی وێنەی AI:</strong> دابینکردنی پرۆمپتی ورد بە زمانی ئینگلیزی بۆ دروستکردنی وێنەی سەرنجڕاکێش لەسەر میدجەرنی.</li>
            </ul>
            <h2 className="text-xl font-bold text-white mb-3 mt-8">فرە زمانی</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              دایالێکت ستۆدیۆ پشتگیری تەواوی چەند زمانێک دەکات، ئەگەر بە زمانی کوردی (سۆرانی و بادینی)، عەرەبی یان ئینگلیزی کار بکەیت، پلاتفۆرمەکەمان دەگونجێت لەگەڵتدا.
            </p>
          </div>
        )}

        {lang === 'ar' && (
          <div className="text-right">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink">
              من نحن - ديالكت ستوديو
            </h1>
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              في عالم يتسارع فيه التطور الرقمي، أصبحت صناعة المحتوى الإبداعي تتطلب أدوات ذكية ومبتكرة توفر الوقت وترفع من جودة الإنتاج. من هنا انطلق <strong className="text-white">ديالكت ستوديو</strong>، المنصة الرائدة والمصممة خصيصاً لدعم صناع المحتوى في العالم العربي وكردستان، ليكون مساعدك الشخصي في تحويل الأفكار البسيطة إلى محتوى احترافي جاهز للنشر والانتشار.
            </p>
            <h2 className="text-xl font-bold text-white mb-3 mt-8">ماذا يقدم ديالكت ستوديو؟</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              نحن نجمع بين أحدث تقنيات الذكاء الاصطناعي والفهم العميق للثقافات واللغات المحلية، لنقدم لك أدوات تفاعلية متخصصة، تشمل:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-8 space-y-3 pr-4">
              <li><strong className="text-neon-cyan">استوديو القصص وسيناريوهات تيك توك:</strong> نكتب لك نصوصاً (Scripts) احترافية للفيديوهات القصيرة، مصممة لجذب الانتباه منذ الثواني الأولى، مع توزيع دقيق للمشاهد، اللقطات، والمؤثرات الصوتية.</li>
              <li><strong className="text-neon-cyan">برومبتات الصور (AI Prompts):</strong> نوفر لك أوامر جاهزة تمت هندستها بدقة عالية باللغة الإنجليزية لتوليد صور سينمائية وفنية بضغطة زر وبأعلى جودة.</li>
            </ul>
            <h2 className="text-xl font-bold text-white mb-3 mt-8">تعدد اللغات: تواصل بلسان جمهورك</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              ما يميز ديالكت ستوديو هو دعمه الكامل لتعدد اللغات. سواء كنت تستهدف الجمهور العربي، أو ترغب في صناعة محتوى باللغة الكردية (باللهجتين السورانية والبادينية)، أو حتى باللغة الإنجليزية، فإن منصتنا تفهم لغتك وتستجيب بها فوراً.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
