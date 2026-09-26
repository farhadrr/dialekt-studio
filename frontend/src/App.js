import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

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
          <Footer />
        </HashRouter>
        <Toaster position="top-center" richColors />
      </div>
    </LanguageProvider>
  );
}

export default App;
