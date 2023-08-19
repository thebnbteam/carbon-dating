import React, { createContext, useContext, useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth, userCollectionRef } from "../firebase/firebase-config";
import { getDocs } from "firebase/firestore";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [authNotifications, setAuthNotifications] = useState({
    type: "",
    message: "",
    description: "",
  });
  const [userAuthObj, setUserAuthObj] = useState({});
  const [bioData, setBioData] = useState();
  const [isError, setIsError] = useState(false);

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed up:", user.email);
      return user;
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
      console.log("User logged in:", user.email);
      return user;
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
      state: true,
    }));
  };

  const getBioData = async () => {
    try {
      const data = await getDocs(userCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setBioData(filteredData);
    } catch (err) {
      console.log(err.message);
    }
  };

  const closeNotification = (type) => {
    setAuthNotifications((prev) => ({
      ...prev,
      type: null,
      state: false,
    }));
  };

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
        setUserAuthObj,
        setAuthNotifications,
        closeNotification,
        getBioData,
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
