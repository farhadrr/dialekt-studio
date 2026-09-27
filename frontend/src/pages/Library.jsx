import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { api, CATEGORIES, accentMap } from "@/lib/api";
import { ContentCard } from "@/components/ContentCard";
import { AdBanner } from "@/components/AdBanner";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Library() {
  const { category } = useParams();
  const { t, tf } = useLang();
  const [dialects, setDialects] = useState([]);
  const [items, setItems] = useState([]);
  const [activeDialect, setActiveDialect] = useState("all");
  const [loading, setLoading] = useState(true);

  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const accent = accentMap[cat.accent];

  useEffect(() => {
    api.get("/dialects").then((r) => setDialects(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setActiveDialect("all");
      try {
        const querySnapshot = await getDocs(collection(db, 'cards'));
        
        const allCards = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'بدون عنوان',
            desc: data.prompt || '',  
            prompt: data.prompt || '',
            image: data.imageUrl || '', 
            category: data.category,
            dialect: data.dialect || 'sorani', 
            createdAt: data.createdAt
          };
        });

        const categoryCards = allCards.filter(c => c.category === cat.id);

        categoryCards.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        
        setItems(categoryCards);
      } catch (error) {
        console.error("Error fetching:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [cat.id]);

  const filtered = useMemo(
    () => (activeDialect === "all" ? items : items.filter((i) => i.dialect === activeDialect)),
    [items, activeDialect]
  );

  const withAds = [];
  filtered.forEach((item, idx) => {
    withAds.push(<ContentCard key={item.id} item={item} dialects={dialects} />);
    if ((idx + 1) % 6 === 0 && idx !== filtered.length - 1) {
      withAds.push(
        <div key={`ad-${idx}`} className="sm:col-span-2 lg:col-span-3">
          <AdBanner variant="infeed" />
        </div>
      );
    }
  });

  const availableDialects = dialects.filter((d) => items.some((i) => i.dialect === d.code));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <span className={`text-xs uppercase ${accent.text}`}>
          {tf(cat.badge)}
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">
              {tf(cat.title)}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">{tf(cat.desc)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          data-testid="dialect-filter-all"
          onClick={() => setActiveDialect("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
            activeDialect === "all"
              ? "bg-foreground text-[#0B0C10] border-foreground"
              : "border-ink-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("all_dialects")}
        </button>
        {availableDialects.map((d) => (
          <button
            key={d.code}
            data-testid={`dialect-filter-${d.code}`}
            onClick={() => setActiveDialect(d.code)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeDialect === d.code
                ? "bg-foreground text-[#0B0C10] border-foreground"
                : "border-ink-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.name_native}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          {loading ? (
            <p className="text-muted-foreground py-20 text-center">…</p>
          ) : filtered.length === 0 ? (
            <p data-testid="library-empty" className="text-muted-foreground py-20 text-center">
              {t("empty")}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{withAds}</div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <AdBanner variant="rectangle" />
          </div>
        </aside>
      </div>
    </div>
  );
}
