import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdr-0jB9tR-zrUF0RRSBgU9T05K1omf2k",
  authDomain: "notion-clone-4203d.firebaseapp.com",
  projectId: "notion-clone-4203d",
  storageBucket: "notion-clone-4203d.firebasestorage.app",
  messagingSenderId: "731889030417",
  appId: "1:731889030417:web:47aaa9c4c3ebde625a68b0",
  measurementId: "G-CVBQ8RMCK0"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export {db};
