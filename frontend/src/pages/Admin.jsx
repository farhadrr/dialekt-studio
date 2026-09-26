import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('tiktok-scripts'); 
  const [status, setStatus] = useState('');

  const handleAddCard = async (e) => {
    e.preventDefault();
    setStatus('جاري الإضافة...');
    try {
      await addDoc(collection(db, 'cards'), {
        title: title,
        prompt: prompt,
        imageUrl: imageUrl,
        category: category, 
        createdAt: new Date()
      });
      setStatus('تمت إضافة الكرت بنجاح! ✅');
      setTitle('');
      setPrompt('');
      setImageUrl('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setStatus('حدث خطأ، حاول مرة أخرى ❌');
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
            <label className="block text-gray-300 mb-2 font-medium">رابط الصورة</label>
            <input 
              type="url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="https://..."
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg"
          >
            إضافة الكرت
          </button>
        </form>
        
        {status && (
          <div className={`mt-6 p-4 rounded-xl text-center font-bold ${status.includes('بنجاح') ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
