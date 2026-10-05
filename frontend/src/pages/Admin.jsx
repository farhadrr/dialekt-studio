import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, storage, auth } from '@/firebase';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleKu, setTitleKu] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('tiktok-scripts'); 
  const [imagePosition, setImagePosition] = useState('50'); 
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cards, setCards] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCards();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
      setAuthError('البريد الإلكتروني أو كلمة المرور غير صحيحة ❌');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCards([]);
  };

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
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

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
    setStatus(editingId ? 'جاري التعديل ورفع البيانات...' : 'جاري الرفع إلى Storage... ⚡');
    
    try {
      let finalImageUrl = ''; 

      if (imageFile) {
        const compressedBase64 = await compressAndConvertImage(imageFile);
        const fileName = `cards/${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
        const storageRef = ref(storage, fileName);
        
        await uploadString(storageRef, compressedBase64, 'data_url');
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const titleData = { ar: titleAr, en: titleEn, ku: titleKu };

      if (editingId) {
        const cardRef = doc(db, 'cards', editingId);
        const updateData = { title: titleData, prompt, category, imagePosition };
        if (finalImageUrl) updateData.imageUrl = finalImageUrl; 
        
        await updateDoc(cardRef, updateData);
        setStatus('تم تعديل الكرت بنجاح! ✅');
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'cards'), {
          title: titleData,
          prompt,
          imageUrl: finalImageUrl, 
          category, 
          imagePosition,
          createdAt: new Date()
        });
        setStatus('تمت إضافة الكرت بنجاح! ✅');
      }

      setTitleAr(''); setTitleEn(''); setTitleKu('');
      setPrompt('');
      setImageFile(null);
      setPreviewUrl(null);
      setImagePosition('50');
      if(document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
      fetchCards();
    } catch (error) {
      console.error(error);
      setStatus('حدث خطأ أثناء الرفع ❌');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleDelete = async (card) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكرت نهائياً؟')) {
      try {
        await deleteDoc(doc(db, 'cards', card.id));
        
        if (card.imageUrl && card.imageUrl.includes('firebasestorage')) {
          const imageRef = ref(storage, card.imageUrl);
          await deleteObject(imageRef).catch(e => console.log('الصورة غير موجودة أو محذوفة مسبقاً'));
        }

        fetchCards();
        setStatus('تم الحذف بنجاح! 🗑️');
        setTimeout(() => setStatus(''), 3000);
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
    
    if (card.imagePosition === 'object-top') setImagePosition('0');
    else if (card.imagePosition === 'object-bottom') setImagePosition('100');
    else if (card.imagePosition === 'object-center') setImagePosition('50');
    else setImagePosition(card.imagePosition || '50');
    
    setImageFile(null);
    setPreviewUrl(card.imageUrl || null);
    
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitleAr(''); setTitleEn(''); setTitleKu('');
    setPrompt('');
    setImageFile(null);
    setPreviewUrl(null);
    setImagePosition('50');
    setStatus('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col items-center justify-center py-12 px-4 font-sans">
        <div className="w-full max-w-md bg-[#1F2833] p-8 rounded-2xl shadow-2xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">تسجيل دخول المدير 🔒</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white" required dir="ltr" />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white" required dir="ltr" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              دخول
            </button>
            {authError && <div className="text-red-400 text-center font-bold">{authError}</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col items-center py-12 px-4 font-sans">
      <div className="w-full max-w-2xl bg-[#1F2833] p-8 rounded-2xl shadow-2xl border border-gray-800 mb-10">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {editingId ? 'تعديل الكرت ✏️' : 'لوحة تحكم الاستوديو'}
          </h2>
          <button onClick={handleLogout} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold py-2 px-4 rounded-lg transition-colors text-sm">
            تسجيل الخروج 🚪
          </button>
        </div>
        
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
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500" rows="6" required></textarea>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">{editingId ? 'تغيير الصورة' : 'إرفاق صورة جديدة (اختياري)'}</label>
            <input type="file" id="imageInput" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-3 bg-[#0B0C10] border border-gray-700 rounded-xl text-white" />
          </div>

          {previewUrl && (
            <div className="bg-[#0B0C10] p-4 rounded-xl border border-gray-700">
              <label className="block text-blue-400 mb-4 font-bold text-center">🎯 المعاينة المباشرة (Live Preview)</label>
              <div className="w-full max-w-sm mx-auto h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border-2 border-dashed border-gray-500 relative mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-all duration-75"
                  style={{ objectPosition: `center ${imagePosition}%` }}
                />
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={imagePosition} 
                onChange={(e) => setImagePosition(e.target.value)} 
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">اسحب المؤشر لترى الصورة تتحرك داخل الإطار بوضوح (0=رأس، 100=قدمين)</p>
            </div>
          )}

          <div className="flex gap-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              {isSubmitting ? 'جاري التنفيذ...' : (editingId ? 'حفظ التعديلات' : 'إضافة الكرت')}
            </button>
            {editingId && <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors">إلغاء</button>}
          </div>
          {status && <div className="text-center text-green-400 mt-4 font-bold">{status}</div>}
        </form>
      </div>
      
      <div className="w-full max-w-2xl bg-[#1F2833] p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-3">إدارة الكروت</h3>
        <div className="space-y-4">
          {cards.map(card => (
            <div key={card.id} className="bg-[#0B0C10] p-4 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-gray-500 transition-colors">
              <div className="flex items-center gap-4 w-full">
                {card.imageUrl && (
                   <img 
                     src={card.imageUrl} 
                     alt="Card" 
                     className="w-16 h-16 object-cover rounded-lg"
                     style={{ objectPosition: `center ${card.imagePosition === 'object-top' ? '0' : card.imagePosition === 'object-bottom' ? '100' : card.imagePosition === 'object-center' ? '50' : card.imagePosition || '50'}%` }}
                   />
                )}
                <div>
                  <h4 className="font-bold text-white text-lg">{typeof card.title === 'object' ? card.title.ar : card.title}</h4>
                  <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">{card.category}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEditClick(card)} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-4 py-2 rounded-lg transition-colors">تعديل</button>
                <button onClick={() => handleDelete(card)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg transition-colors">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
