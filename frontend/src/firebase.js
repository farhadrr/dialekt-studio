// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbqqtEfCiaVQf7hNb4Bu8d5IA4xiIF4MU",
  authDomain: "studio-e4fa5.firebaseapp.com",
  projectId: "studio-e4fa5",
  storageBucket: "studio-e4fa5.firebasestorage.app",
  messagingSenderId: "66378803843",
  appId: "1:66378803843:web:b7cf98939a5d0d208b49b6",
  measurementId: "G-3Q8YG0J455"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
