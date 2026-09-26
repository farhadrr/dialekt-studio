import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbqqtEfCiaVQf7hNb4Bu8d5IA4xiIF4MU",
  authDomain: "studio-e4fa5.firebaseapp.com",
  projectId: "studio-e4fa5",
  storageBucket: "studio-e4fa5.firebasestorage.app",
  messagingSenderId: "66378803843",
  appId: "1:66378803843:web:b7cf98939a5d0d208b49b6",
  measurementId: "G-3Q8YG0J455"
};

// تهيئة الاتصال بقاعدة البيانات
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
