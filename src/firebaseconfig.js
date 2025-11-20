import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBmGzRv_QEKS4vKGLURPK9jkgE69HwiaZI",
  authDomain: "wander-f9835.firebaseapp.com",
  projectId: "wander-f9835",
  storageBucket: "wander-f9835.appspot.com",
  messagingSenderId: "737013545609",
  appId: "1:737013545609:web:fd7021ec270b30ccaee458",
  measurementId: "G-8TJSYQCD09",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
