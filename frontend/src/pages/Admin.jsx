import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleAddCard = async (e) => {
    e.preventDefault();
    setStatus('جاري الإضافة...');
    try {
      await addDoc(collection(db, 'cards'), {
        title: title,
        prompt: prompt,
        imageUrl: imageUrl,
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">لوحة تحكم الاستوديو</h2>
        <form onSubmit={handleAddCard} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">عنوان الكرت</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">النص (البرومبت)</label>
            <textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required 
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">رابط الصورة</label>
            <input 
              type="url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
          >
            إضافة الكرت
          </button>
        </form>
        {status && <p className="mt-4 text-center font-semibold text-gray-800">{status}</p>}
      </div>
    </div>
  );
}
