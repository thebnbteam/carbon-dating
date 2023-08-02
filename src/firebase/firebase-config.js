import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxwwz63eUnvQx8chgl4OLhuRl8qSW0u4Y",
  authDomain: "tinder-clone-30b0c.firebaseapp.com",
  projectId: "tinder-clone-30b0c",
  storageBucket: "tinder-clone-30b0c.appspot.com",
  messagingSenderId: "659900339846",
  appId: "1:659900339846:web:4915089779ca5454df2307",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
