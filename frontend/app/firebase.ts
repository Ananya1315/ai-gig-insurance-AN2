import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCbhk8BM-BMpxITb0ZckTFLDs60AEF-R14",
  authDomain: "delicare-134151.firebaseapp.com",
  projectId: "delicare-134151",
  storageBucket: "delicare-134151.firebasestorage.app",
  messagingSenderId: "1074739421955",
  appId: "1:1074739421955:web:81430015156f128603ff36",
  measurementId: "G-B54CWX6B66"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);