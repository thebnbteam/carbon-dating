import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyCYMQfkZpPyKYjH0j7H0C5K595rOJtwdi8",
//   authDomain: "carbon-dating-8e598.firebaseapp.com",
//   projectId: "carbon-dating-8e598",
//   storageBucket: "carbon-dating-8e598.appspot.com",
//   messagingSenderId: "1030621712154",
//   appId: "1:1030621712154:web:c417374e7f6a1bf1caa6a3",
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDZe3z4ZM4flGaHTQuvDQ4UP0rR2C86z1E",
//   authDomain: "carbon-dating-backup.firebaseapp.com",
//   projectId: "carbon-dating-backup",
//   storageBucket: "carbon-dating-backup.appspot.com",
//   messagingSenderId: "466861534127",
//   appId: "1:466861534127:web:8c0a9d19313a8fd5a79d5a",
// };

const firebaseConfig = {
  apiKey: "AIzaSyC3Q7V-5f4y5-l0ohzcyjhXZnDRHPmTHjo",
  authDomain: "carbon-dating3.firebaseapp.com",
  projectId: "carbon-dating3",
  storageBucket: "carbon-dating3.appspot.com",
  messagingSenderId: "777832566907",
  appId: "1:777832566907:web:a5c2bf73ad57d6e14e52de",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const dataCollection = collection(db, "allUserData");
export const messageCollection = collection(db, "allMessages");
export const googleProvider = new GoogleAuthProvider();
