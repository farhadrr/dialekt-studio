import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('tiktok-scripts'); 
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // دالة سحرية لضغط الصورة وتحويلها لنص ليتم إرسالها في ثانية واحدة
  const compressAndConvertImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // تصغير العرض لتخفيف الحجم
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // تحويل الصورة لكود نصي مضغوط جداً
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); 
          resolve(dataUrl);
        };
      };
    });
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setStatus('الرجاء اختيار صورة من الهاتف ❌');
      return;
    }

    setIsSubmitting(true);
    setStatus('جاري إرسال الكرت بسرعة البرق... ⚡');
    
    try {
      // 1. معالجة الصورة فوراً
      const fastImageUrl = await compressAndConvertImage(imageFile);

      // 2. إرسال الكرت بالكامل لقاعدة البيانات (العنوان + النص + الصورة)
      await addDoc(collection(db, 'cards'), {
        title: title,
        prompt: prompt,
        imageUrl: fastImageUrl, // الصورة الآن محفوظة بشكل سريع جداً
        category: category, 
        createdAt: new Date()
      });
      
      setStatus('تمت إضافة الكرت مع الصورة بنجاح وفي ثانية واحدة! ✅');
      setTitle('');
      setPrompt('');
      setImageFile(null);
      document.getElementById('imageInput').value = '';
    } catch (error) {
      console.error('Error adding document: ', error);
      setStatus('حدث خطأ، تأكد من اتصالك بالإنترنت ❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col items-center py-12 px-4 font-sans">
      <div className="w-full max-w-2xl bg-[#1F2833] p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          لوحة تحكم الاستوديو
        </h2>
        
        <form onSubmit={handleAddCard} className="space-y-6">
          
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
            <label className="block text-gray-300 mb-2 font-medium">اختر صورة من الهاتف</label>
            <input 
              type="file" 
              id="imageInput"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])} 
              className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-opacity duration-200 ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'}`}
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إضافة الكرت'}
          </button>
        </form>
        
        {status && (
          <div className={`mt-6 p-4 rounded-xl text-center font-bold ${status.includes('بنجاح') ? 'bg-green-900/50 text-green-400 border border-green-800' : status.includes('جاري') ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
