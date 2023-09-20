import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYMQfkZpPyKYjH0j7H0C5K595rOJtwdi8",
  authDomain: "carbon-dating-8e598.firebaseapp.com",
  projectId: "carbon-dating-8e598",
  storageBucket: "carbon-dating-8e598.appspot.com",
  messagingSenderId: "1030621712154",
  appId: "1:1030621712154:web:c417374e7f6a1bf1caa6a3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const dataCollection = collection(db, "allUserData");
export const googleProvider = new GoogleAuthProvider();
