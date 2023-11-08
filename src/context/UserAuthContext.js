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
import { doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { message } from "antd";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});

  const [userData, setUserData] = useState();
  const [userInfo, setUserInfo] = useState();
  const [categoryLikes, setCategoryLikes] = useState();
  const [calibrationStatus, setCalibrationStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedPictures, setUploadedPictures] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [topFive, setTopFive] = useState([]);
  const [leaveX, setLeaveX] = useState(0);

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
      message.success("Logged in successfully.", 2);
    } catch (error) {
      message.error("Log-in error:", 2);
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
      message.success("Logged out successfully.", 2);
    } catch (error) {
      message.error(`Log out error: ${error.message}`, 2);
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

  const getAllProfiles = async () => {
    const querySnapshot = await getDocs(dataCollection);
    let profileArray = [];
    querySnapshot.forEach((doc) => {
      profileArray.push(doc.data());
    });
    setAllProfiles(profileArray);
  };

  const handleAuthStateChanged = async (user) => {
    if (user && user.uid) {
      await userLoginCheck(user);
      await getAllProfiles();
      setCurrentUser({ email: user.email, uid: user.uid });
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, handleAuthStateChanged);
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
        allProfiles,
        setAllProfiles,
        topFive,
        setTopFive,
        leaveX,
        setLeaveX,
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
