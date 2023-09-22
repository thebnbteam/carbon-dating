import React, { createContext, useContext, useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, dataCollection } from "../firebase/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
      console.log(`Logged in:${user.email}`);
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
      console.log("User logged in:", user);
    } catch (error) {
      console.error("Log-in error:", error.message);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCategoryLikes(null);
      setUserInfo(null);
      setUploadedPictures([]);
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

  const userLoginCheck = async (user) => {
    try {
      const userDocRef = doc(dataCollection, user.uid);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        if (!docSnapshot.data().userLogin) {
          await setDoc(userDocRef, {
            userLogin: {
              email: user.email,
              uid: user.uid,
            },
          });
        }
      } else {
        await setDoc(userDocRef, {
          userLogin: {
            email: user.email,
            uid: user.uid,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkUserInfo = async (user) => {
    if (user) {
      const userDocRef = doc(dataCollection, user.uid);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setUserInfo((prevUserInfo) => userData.userInfo || prevUserInfo);
        setCategoryLikes(
          (prevCategoryLikes) => userData.categoryLikes || prevCategoryLikes
        );
      }
    }
  };

  useEffect(() => {
    const handleAuthStateChanged = async (user) => {
      if (user && user.uid) {
        await checkUserInfo(user);
        userLoginCheck(user);
        setCurrentUser({ email: user.email, uid: user.uid });
      } else {
        setCurrentUser(null);
        authNotificationHandler("error", "Error", "Please Login!", true);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);

    return () => {
      unsubscribe();
    };
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
