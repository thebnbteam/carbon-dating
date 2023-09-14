import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner } from "./components";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const {
    userData,
    currentUser,
    isLoading,
    setIsLoading,
    setUserInfo,
    setCategoryLikes,
  } = useUserAuth();
  const navigate = useNavigate();

  const checkUserInfo = async () => {
    const userInfoSnapShot = await getDoc(doc(userData, "userInfo"));
    const categorySnapShot = await getDoc(doc(userData, "categoryLikes"));
    if (categorySnapShot.exists()) {
      setCategoryLikes(categorySnapShot.data());
      navigate("/profilepage");
    } else if (userInfoSnapShot.exists()) {
      setUserInfo(userInfoSnapShot.data());
      navigate("/calibrationintro");
    } else {
      navigate("/calibratelandingpage");
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
