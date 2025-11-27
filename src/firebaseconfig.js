import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBXnnHa76PfoUrV1OwqHPvR4oIp_X8uYzA",
  authDomain: "feedback-b9813.firebaseapp.com",
  projectId: "feedback-b9813",
  storageBucket: "feedback-b9813.firebasestorage.app",
  messagingSenderId: "140148221702",
  appId: "1:140148221702:web:eee4ff01789fc406586087",
  measurementId: "G-5WE8MBZTHQ"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);