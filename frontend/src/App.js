import "@/App.css";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

// مكون النص التعريفي (سيظهر فقط في الصفحة الرئيسية)
const SeoText = () => {
  const location = useLocation();
  // إذا لم نكن في الصفحة الرئيسية، لا تعرض النص
  if (location.pathname !== "/") return null;

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 sm:p-10 bg-[#1F232B] rounded-2xl border border-[#2D3340] shadow-lg text-right" dir="rtl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
        مرحباً بكم في ديالكت ستوديو (Dialekt Studio): بوابتك لصناعة المحتوى الذكي
      </h2>
      
      <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
        في عالم يتسارع فيه التطور الرقمي، أصبحت صناعة المحتوى الإبداعي تتطلب أدوات ذكية ومبتكرة توفر الوقت وترفع من جودة الإنتاج. من هنا انطلق <strong className="text-white">ديالكت ستوديو</strong>، المنصة الرائدة والمصممة خصيصاً لدعم صناع المحتوى في العالم العربي وكردستان، ليكون مساعدك الشخصي في تحويل الأفكار البسيطة إلى محتوى احترافي جاهز للنشر والانتشار.
      </p>

      <h3 className="text-lg font-bold text-white mb-2 mt-6">ماذا يقدم ديالكت ستوديو؟</h3>
      <p className="text-gray-300 leading-relaxed mb-2 text-sm sm:text-base">
        نحن نجمع بين أحدث تقنيات الذكاء الاصطناعي والفهم العميق للثقافات واللغات المحلية، لنقدم لك أدوات تفاعلية متخصصة، تشمل:
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 text-sm sm:text-base pr-4">
        <li><strong className="text-cyan-400">استوديو القصص وسيناريوهات تيك توك:</strong> نكتب لك نصوصاً (Scripts) احترافية للفيديوهات القصيرة، مصممة لجذب الانتباه منذ الثواني الأولى، مع توزيع دقيق للمشاهد، اللقطات، والمؤثرات الصوتية.</li>
        <li><strong className="text-cyan-400">برومبتات الصور (AI Prompts):</strong> نوفر لك أوامر جاهزة تمت هندستها بدقة عالية باللغة الإنجليزية لتوليد صور سينمائية وفنية بضغطة زر وبأعلى جودة على Midjourney وغيرها.</li>
      </ul>

      <h3 className="text-lg font-bold text-white mb-2 mt-6">تعدد اللغات: تواصل بلسان جمهورك</h3>
      <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
        ما يميز ديالكت ستوديو هو دعمه الكامل لتعدد اللغات. سواء كنت تستهدف الجمهور العربي، أو ترغب في صناعة محتوى باللغة الكردية (باللهجتين السورانية والبادينية)، أو حتى باللغة الإنجليزية، فإن منصتنا تفهم لغتك وتستجيب بها فوراً.
      </p>

      <h3 className="text-lg font-bold text-white mb-2 mt-6">رؤيتنا في ديالكت ستوديو</h3>
      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
        نهدف إلى تمكين المبدعين، المصممين، ومسوقي السوشيال ميديا من التركيز على جوهر الإبداع والتنفيذ، بينما يتولى الذكاء الاصطناعي مهمة الصياغة والهندسة اللفظية. تصفح كروت المحتوى الخاصة بنا، اختر القسم الذي يناسب فكرتك، واصنع محتواك القادم باحترافية وسرعة.
      </p>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <div className="App min-h-screen flex flex-col bg-[#0B0C10]">
        <HashRouter>
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library/:category" element={<Library />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          
          {/* النص التعريفي تم وضعه هنا */}
          <SeoText />
          
          <Footer />
        </HashRouter>
        <Toaster position="top-center" richColors />
      </div>
    </LanguageProvider>
  );
}

export default App;
