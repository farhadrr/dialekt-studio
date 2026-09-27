import React, { useState, useEffect } from 'react';
// استدعاء أدوات فايربيس الخاصة بالتعديل والحذف
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('tiktok-scripts'); 
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حالات جديدة لإدارة الكروت المحفوظة وعملية التعديل
  const [cards, setCards] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // دالة لجلب الكروت من القاعدة لعرضها في لوحة التحكم
  const fetchCards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      const cardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // ترتيبها من الأحدث للأقدم
      cardsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setCards(cardsData);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // دالة ضغط الصورة (نفسها التي استخدمناها للسرعة)
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

  // دالة الإضافة أو التعديل
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(editingId ? 'جاري التعديل...' : 'جاري الإرسال بسرعة البرق... ⚡');
    
    try {
      let fastImageUrl = '';
      if (imageFile) {
        fastImageUrl = await compressAndConvertImage(imageFile);
      }

      if (editingId) {
        // حالة التعديل على كرت موجود
        const cardRef = doc(db, 'cards', editingId);
        const updateData = { title, prompt, category };
        if (fastImageUrl) updateData.imageUrl = fastImageUrl; // تحديث الصورة فقط لو اخترت واحدة جديدة
        
        await updateDoc(cardRef, updateData);
        setStatus('تم تعديل الكرت بنجاح! ✅');
        setEditingId(null); // إنهاء وضع التعديل
      } else {
        // حالة إضافة كرت جديد
        await addDoc(collection(db, 'cards'), {
          title,
          prompt,
          imageUrl: fastImageUrl, 
          category, 
          createdAt: new Date()
        });
        setStatus('تمت إضافة الكرت بنجاح! ✅');
      }

      // تفريغ الحقول وتحديث القائمة
      setTitle('');
      setPrompt('');
      setImageFile(null);
      if(document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
      fetchCards();
    } catch (error) {
      console.error(error);
      setStatus('حدث خطأ ❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة الحذف
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكرت نهائياً من الموقع؟')) {
      try {
        await deleteDoc(doc(db, 'cards', id));
        fetchCards();
        setStatus('تم الحذف بنجاح! 🗑️');
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  // تفعيل وضع التعديل
  const handleEditClick = (card) => {
    setEditingId(card.id);
    setTitle(card.title || '');
    setPrompt(card.prompt || '');
    setCategory(card.category || 'tiktok-scripts');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // الصعود لأعلى الصفحة تلقائياً
  };

  // إلغاء التعديل
  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setPrompt('');
    setImageFile(null);
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
              className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
            >
              <option value="tiktok-scripts">سکریپتی تیک تۆک</option>
              <option value="ai-prompts">پرۆمپتی وێنەی AI</option>
              <option value="content-ideas">بیرۆکەی ناوەڕۆک</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">عنوان الكرت</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="اكتب العنوان هنا..."
              required 
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">النص (البرومبت أو السكريبت)</label>
            <textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500"
              rows="4"
              placeholder="اكتب المحتوى هنا..."
              required 
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              {editingId ? 'تغيير الصورة (اختياري - اتركها فارغة للاحتفاظ بالقديمة)' : 'اختر صورة من الهاتف'}
            </label>
            <input 
              type="file" 
              id="imageInput"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])} 
              className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              required={!editingId} // الزامي فقط في حالة الإضافة الجديدة
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-1 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-opacity duration-200 ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'}`}
            >
              {isSubmitting ? 'جاري التنفيذ...' : (editingId ? 'حفظ التعديلات' : 'إضافة الكرت')}
            </button>

            {editingId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
        
        {status && (
          <div className={`mt-6 p-4 rounded-xl text-center font-bold ${status.includes('بنجاح') || status.includes('الحذف') ? 'bg-green-900/50 text-green-400 border border-green-800' : status.includes('جاري') ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
            {status}
          </div>
        )}
      </div>

      {/* قسم إدارة الكروت (حذف وتعديل) */}
      <div className="w-full max-w-2xl bg-[#1F2833] p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-3">إدارة الكروت المضافة</h3>
        
        {cards.length === 0 ? (
          <p className="text-gray-400 text-center py-4">لا توجد كروت مضافة بعد.</p>
        ) : (
          <div className="space-y-4">
            {cards.map(card => (
              <div key={card.id} className="bg-[#0B0C10] p-4 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full">
                  {card.imageUrl && (
                    <img src={card.imageUrl} alt={card.title} className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div>
                    <h4 className="font-bold text-white text-lg">{card.title}</h4>
                    <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded-md">{card.category}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleEditClick(card)}
                    className="flex-1 sm:flex-none bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-800 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    تعديل ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(card.id)}
                    className="flex-1 sm:flex-none bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-800 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    حذف 🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
