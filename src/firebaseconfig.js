import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCCZz1jPYNEKpXmwt0rYNPuwC5bX35n3cw",
  authDomain: "dive--hrzn.firebaseapp.com",
  projectId: "dive--hrzn",
  storageBucket: "dive--hrzn.firebasestorage.app",
  messagingSenderId: "420297137844",
  appId: "1:420297137844:web:036fb43e0e4b253b77c1e1",
  measurementId: "G-4MKFTQHS3S"
};
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);