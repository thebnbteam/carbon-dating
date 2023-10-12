import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner } from "./components";

function App() {
  const {
    currentUser,
    userInfo,
    categoryLikes,
    isLoading,
    setIsLoading,
    allProfiles,
    setUserInfo,
    setCategoryLikes,
    setTopFive,
  } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const loggedInUser = allProfiles.find(
        (profile) => profile.userLogin.uid === currentUser.uid
      );
      if (loggedInUser) {
        const { userInfo, categoryLikes, topFive } = loggedInUser;
        if (topFive && userInfo && categoryLikes) {
          setUserInfo(userInfo);
          setCategoryLikes(categoryLikes);
          setTopFive(topFive);
          navigate("/profilepage");
        } else if (userInfo && categoryLikes) {
          setCategoryLikes(categoryLikes);
          setTopFive(topFive);
          navigate("/calibrationtopintro");
        } else if (!categoryLikes && userInfo) {
          setUserInfo(userInfo);
          navigate("/calibrationintro");
        } else {
          navigate("/calibratelandingpage");
        }
      }
    } else {
      navigate("/");
    }
    setIsLoading(false);
  }, [currentUser]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full h-screen max-w-md">
        {currentUser && (
          <div className="flex justify-end">
            <MobileMenu />
          </div>
        )}
        <div className="flex flex-col h-full justify-center">
          <Routes>
            {routes.map(({ element, path }, key) => (
              <Route path={path} element={element} key={key} />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
