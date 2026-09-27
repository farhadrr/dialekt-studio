import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Admin() {
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleKu, setTitleKu] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('tiktok-scripts'); 
  
  // المتغير الجديد الذي طلبته لتعديل إطار الصورة
  const [imagePosition, setImagePosition] = useState('object-center'); 
  
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cards, setCards] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchCards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      const cardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      cardsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setCards(cardsData);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const compressAndConvertImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); 
        };
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(editingId ? 'جاري التعديل...' : 'جاري الإرسال بسرعة البرق... ⚡');
    
    try {
      let fastImageUrl = '';
      if (imageFile) {
        fastImageUrl = await compressAndConvertImage(imageFile);
      }

      const titleData = { ar: titleAr, en: titleEn, ku: titleKu };

      if (editingId) {
        const cardRef = doc(db, 'cards', editingId);
        const updateData = { title: titleData, prompt, category, imagePosition };
        if (fastImageUrl) updateData.imageUrl = fastImageUrl; 
        
        await updateDoc(cardRef, updateData);
        setStatus('تم تعديل الكرت بنجاح! ✅');
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'cards'), {
          title: titleData,
          prompt,
          imageUrl: fastImageUrl, 
          category, 
          imagePosition, // حفظ إطار الصورة في الداتا بيز
          createdAt: new Date()
        });
        setStatus('تمت إضافة الكرت بنجاح! ✅');
      }

      setTitleAr(''); setTitleEn(''); setTitleKu('');
      setPrompt('');
      setImageFile(null);
      setImagePosition('object-center'); // إعادة تعيين
      if(document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
      fetchCards();
    } catch (error) {
      console.error(error);
      setStatus('حدث خطأ ❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكرت؟')) {
      try {
        await deleteDoc(doc(db, 'cards', id));
        fetchCards();
        setStatus('تم الحذف بنجاح! 🗑️');
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const handleEditClick = (card) => {
    setEditingId(card.id);
    if (typeof card.title === 'object' && card.title !== null) {
      setTitleAr(card.title.ar || '');
      setTitleEn(card.title.en || '');
      setTitleKu(card.title.ku || '');
    } else {
      setTitleAr(card.title || '');
      setTitleEn(''); setTitleKu('');
    }
    setPrompt(card.prompt || '');
    setCategory(card.category || 'tiktok-scripts');
    // سحب الإطار المحفوظ أو وضع الوسط كافتراضي
    setImagePosition(card.imagePosition || 'object-center'); 
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitleAr(''); setTitleEn(''); setTitleKu('');
    setPrompt('');
    setImageFile(null);
    setImagePosition('object-center');
    setStatus('');
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col items-center py-12 px-4 font-sans">
      <div className="w-full max-w-2xl bg-[#1F2833] p-8 rounded-2xl shadow-2xl border border-gray-800 mb-10">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {editingId ? 'تعديل الكرت ✏️' : 'لوحة تحكم الاستوديو'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">اختر الخانة (القسم)</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="tiktok-scripts">سکریپتی تیک تۆک</option>
              <option value="ai-prompts">پرۆمپتی وێنەی AI</option>
              <option value="content-ideas">بیرۆکەی ناوەڕۆک</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 bg-[#0B0C10] p-4 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 font-bold mb-2">عناوين الكرت باللغات الثلاث:</h3>
            <input type="text" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="w-full p-3 bg-[#1F2833] border border-gray-600 rounded-lg text-white" placeholder="العنوان بالعربي 🇦🇪" required />
            <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full p-3 bg-[#1F2833] border border-gray-600 rounded-lg text-white text-left" placeholder="العنوان بالإنجليزي 🇬🇧" dir="ltr" required />
            <input type="text" value={titleKu} onChange={(e) => setTitleKu(e.target.value)} className="w-full p-3 bg-[#1F2833] border border-gray-600 rounded-lg text-white" placeholder="العنوان بالكردي ☀️" required />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">النص (البرومبت)</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl text-white" rows="4" required></textarea>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">{editingId ? 'تغيير الصورة' : 'الصورة'}</label>
            <input type="file" id="imageInput" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl text-white" required={!editingId} />
          </div>

          {/* الخيار العبقري الذي اقترحته */}
          <div className="bg-[#0B0C10] p-4 rounded-xl border border-gray-700">
            <label className="block text-blue-400 mb-2 font-bold">🎯 تعديل إطار الصورة (التركيز)</label>
            <select 
              value={imagePosition} 
              onChange={(e) => setImagePosition(e.target.value)} 
              className="w-full p-3 bg-[#1F2833] border border-gray-600 rounded-xl text-white"
            >
              <option value="object-center">وسط الصورة (للمناظر الطبيعية والعامة)</option>
              <option value="object-top">أعلى الصورة (ممتاز لإظهار وجوه الأشخاص)</option>
              <option value="object-bottom">أسفل الصورة</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl">
              {isSubmitting ? 'جاري التنفيذ...' : (editingId ? 'حفظ التعديلات' : 'إضافة الكرت')}
            </button>
            {editingId && <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-700 text-white font-bold py-3 px-4 rounded-xl">إلغاء</button>}
          </div>
        </form>
      </div>
      
      {/* جزء عرض الكروت */}
      <div className="w-full max-w-2xl bg-[#1F2833] p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-3">إدارة الكروت</h3>
        <div className="space-y-4">
          {cards.map(card => (
            <div key={card.id} className="bg-[#0B0C10] p-4 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full">
                {card.imageUrl && <img src={card.imageUrl} alt="Card" className={`w-16 h-16 object-cover rounded-lg ${card.imagePosition || 'object-center'}`} />}
                <div>
                  <h4 className="font-bold text-white text-lg">{typeof card.title === 'object' ? card.title.ar : card.title}</h4>
                  <span className="text-xs text-cyan-400">{card.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(card)} className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg">تعديل</button>
                <button onClick={() => handleDelete(card.id)} className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
