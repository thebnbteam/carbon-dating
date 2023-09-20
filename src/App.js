import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner } from "./components";
import { doc, getDoc } from "firebase/firestore";
import { dataCollection } from "./firebase/firebase-config";

function App() {
  const {
    currentUser,
    isLoading,
    setIsLoading,
    setUserInfo,
    setCategoryLikes,
    userInfo,
    categoryLikes,
  } = useUserAuth();
  const navigate = useNavigate();

  const checkUserInfo = async () => {
    if (currentUser) {
      const userDataSnapshot = await getDoc(
        doc(dataCollection, currentUser.uid)
      );
      if (userDataSnapshot.exists()) {
        console.log(userDataSnapshot.exists());
        if (userDataSnapshot.data().categoryLikes) {
          console.log("hello");
          setCategoryLikes(userDataSnapshot.data().categoryLikes);
          navigate("/profilepage");
        } else if (userDataSnapshot.data().userInfo) {
          setUserInfo(userDataSnapshot.data().userInfo);
          navigate("/calibrationintro");
        } else {
          console.log("working");
          navigate("/calibratelandingpage");
        }
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      checkUserInfo();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      navigate("/");
    }
  }, [currentUser]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md m-2">
        {currentUser && (
          <div className="flex justify-end">
            <MobileMenu />
          </div>
        )}
        <Routes>
          {routes.map(({ element, path }, key) => (
            <Route path={path} element={element} key={key} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;
