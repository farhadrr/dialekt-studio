import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const CATEGORIES = [
  {
    id: "tiktok-scripts",
    icon: "Clapperboard",
    accent: "cyan",
    badge: { en: "Viral Ready", ar: "جاهز للانتشار", ku: "ئامادەی ڤایراڵ" },
    title: { en: "TikTok Scripts", ar: "سيناريوهات تيك توك", ku: "سکریپتی تیک تۆک" },
    desc: {
      en: "Viral hooks, retention bodies, and CTA frameworks formatted for the short-form algorithm.",
      ar: "هوكات فيرال، محتوى يحافظ على المشاهدة، وأطر دعوة للتفاعل مصممة لخوارزمية الفيديوهات القصيرة.",
      ku: "هوکی ڤایراڵ، ناوەڕۆکی ڕاگرتنی بینەر، و چوارچێوەی بانگەواز بۆ ئەلگۆریتمی ڤیدیۆی کورت.",
    },
  },
  {
    id: "ai-prompts",
    icon: "Sparkles",
    accent: "pink",
    badge: { en: "Midjourney & Flux", ar: "ميدجورني و فلكس", ku: "میدجەرنی و فلەکس" },
    title: { en: "AI Image Prompts", ar: "برومبتات الصور بالذكاء الاصطناعي", ku: "پرۆمپتی وێنەی AI" },
    desc: {
      en: "High-detail prompts for Midjourney, Flux & DALL-E, tuned for Middle Eastern & Kurdish aesthetics.",
      ar: "برومبتات عالية التفصيل لميدجورني وفلكس ودال-إي، مضبوطة على الجماليات الشرق أوسطية والكردية.",
      ku: "پرۆمپتی وردی بەرز بۆ میدجەرنی و فلەکس و DALL-E، بۆ جوانیناسی ڕۆژهەڵاتی ناوەڕاست و کوردی.",
    },
  },
  {
    id: "content-ideas",
    icon: "Lightbulb",
    accent: "gold",
    badge: { en: "Trending Concepts", ar: "أفكار رائجة", ku: "بیرۆکەی ترێند" },
    title: { en: "Content Ideas", ar: "أفكار محتوى", ku: "بیرۆکەی ناوەڕۆک" },
    desc: {
      en: "Trending concepts, dialect-specific skits and storyboards tailored for regional virality.",
      ar: "أفكار رائجة، مشاهد كوميدية حسب اللهجة، وستوري بورد مصممة للانتشار الإقليمي.",
      ku: "بیرۆکەی ترێند، سکێچی تایبەت بە زاراوە و ستۆری بۆرد بۆ ڤایراڵبوونی ناوچەیی.",
    },
  },
];

export const accentMap = {
  cyan: { text: "text-neon-cyan", border: "border-neon-cyan", ring: "#00F2FE", bg: "bg-neon-cyan" },
  pink: { text: "text-neon-pink", border: "border-neon-pink", ring: "#FF0050", bg: "bg-neon-pink" },
  gold: { text: "text-neon-gold", border: "border-neon-gold", ring: "#FFB800", bg: "bg-neon-gold" },
};
