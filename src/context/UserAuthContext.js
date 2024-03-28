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
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { message } from "antd";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [currentUserProfile, setCurrentUserProfile] = useState({});
  const [userUid, setUserUid] = useState({});
  const [userInfo, setUserInfo] = useState();
  const [categoryLikes, setCategoryLikes] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedPictures, setUploadedPictures] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [topFive, setTopFive] = useState([]);
  const [leaveX, setLeaveX] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [nonSwipedUsers, setNonSwipedUsers] = useState([]);
  const [profilePicture, setProfilePicture] = useState();
  const [roomNumber, setRoomNumber] = useState("");
  const [matchedUpdates, setMatchedUpdates] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState();

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
      setUserUid(null);
      setCategoryLikes(null);
      setUserInfo(null);
      setUploadedPictures([]);
      setProfilePicture(null);
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

      const userData = {
        userLogin: {
          email: user.email,
          uid: user.uid,
        },
      };

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();
        if (!existingData.userLogin) {
          await setDoc(userDocRef, userData);
        } else {
          await updateDoc(userDocRef, {
            "userLogin.timeLogged": new Date(),
          });
        }
      } else {
        await setDoc(userDocRef, userData);
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
      setUserUid(user.uid);
    } else {
      setUserUid(null);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, handleAuthStateChanged);
  }, [auth]);

  return (
    <userAuthContext.Provider
      value={{
        currentUserProfile,
        setCurrentUserProfile,
        userUid,
        setUserUid,
        logIn,
        logOut,
        signUp,
        googleSignIn,
        userInfo,
        setUserInfo,
        categoryLikes,
        setCategoryLikes,
        isLoading,
        setIsLoading,
        uploadedPictures,
        setUploadedPictures,
        allProfiles,
        setAllProfiles,
        topFive,
        setTopFive,
        leaveX,
        setLeaveX,
        apiData,
        setApiData,
        profilePicture,
        setProfilePicture,
        nonSwipedUsers,
        setNonSwipedUsers,
        roomNumber,
        setRoomNumber,
        matchedUpdates,
        setMatchedUpdates,
        modalIsOpen,
        setModalIsOpen,
        matchedUsers,
        setMatchedUsers,
        messages,
        setMessages,
        unreadMessageCount,
        setUnreadMessageCount,
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
