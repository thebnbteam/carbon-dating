import React, { createContext, useContext, useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, db, storage } from "../firebase/firebase-config";
import { collection } from "firebase/firestore";
import { ref } from "firebase/storage";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [authNotifications, setAuthNotifications] = useState({
    type: "",
    message: "",
    description: "",
  });
  const [userData, setUserData] = useState();
  const [userInfo, setUserInfo] = useState();
  const [categoryLikes, setCategoryLikes] = useState();
  const [calibrationStatus, setCalibrationStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedPictures, setUploadedPictures] = useState([]);

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setCurrentUser({ email: user.email, uid: user.uid });
    } catch (error) {
      console.error("Sign-up error:", error.message);
      throw error;
    }
  };

  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setCurrentUser({ email: user.email, uid: user.uid });
      console.log("User logged in:", user.email, user.uid);
    } catch (error) {
      console.error("Log-in error:", error.message);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Log-out error:", error.message);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const googleAuthProvider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;
      console.log("User signed in with Google:", user.email);
      return user;
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      throw error;
    }
  };

  const authNotificationHandler = (type, message, description, state) => {
    setAuthNotifications((prev) => ({
      ...prev,
      type: type,
      message: message,
      description: description,
      state: state,
    }));
  };

  const closeNotification = (type) => {
    setAuthNotifications((prev) => ({
      ...prev,
      type: "",
      state: false,
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setCurrentUser({ email: user.email, uid: user.uid });
        const userCollectionRef = collection(db, user.uid);
        setUserData(userCollectionRef);
      } else {
        setCurrentUser(null);
        authNotificationHandler("error", "Error", "Please Login!", true);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <userAuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logIn,
        logOut,
        signUp,
        googleSignIn,
        authNotificationHandler,
        authNotifications,
        setAuthNotifications,
        closeNotification,
        userData,
        setUserData,
        userInfo,
        setUserInfo,
        categoryLikes,
        setCategoryLikes,
        calibrationStatus,
        setCalibrationStatus,
        isLoading,
        setIsLoading,
        imageUpload,
        setImageUpload,
        imageUrls,
        setImageUrls,
        uploadedPictures,
        setUploadedPictures,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export const useUserAuth = () => {
  return useContext(userAuthContext);
};

export { userAuthContext };
