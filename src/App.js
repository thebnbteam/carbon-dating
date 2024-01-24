import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner } from "./components";

function App() {
  const {
    userUid,
    isLoading,
    setIsLoading,
    allProfiles,
    setUserInfo,
    setCategoryLikes,
    setTopFive,
    setUploadedPictures,
    setProfilePicture,
    setCurrentUserProfile,
  } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userUid) {
      const loggedInUser = allProfiles.find(
        (profile) => profile.userLogin.uid === userUid
      );
      setCurrentUserProfile(loggedInUser);
      if (loggedInUser) {
        const { userInfo, categoryLikes, topFive, pictures, profilePicture } =
          loggedInUser;
        if (topFive && userInfo && categoryLikes) {
          setUserInfo(userInfo);
          setCategoryLikes(categoryLikes);
          setTopFive(topFive);
          setUploadedPictures(pictures || []);
          setProfilePicture(profilePicture);
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
  }, [userUid]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full h-screen max-w-md">
        {userUid && (
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
