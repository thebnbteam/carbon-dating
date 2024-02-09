import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner } from "./components";
import { getDocs, where, query } from "firebase/firestore";
import { dataCollection } from "./firebase/firebase-config";

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
    setNonSwipedUsers,
  } = useUserAuth();
  const navigate = useNavigate();

  const fetchNotSwipedUsers = async (swipedYesUsers) => {
    try {
      if (swipedYesUsers.length > 0) {
        const qFiltered = query(
          dataCollection,
          where("userLogin.uid", "not-in", swipedYesUsers)
        );
        const filteredSnapshot = await getDocs(qFiltered);
        const documents = filteredSnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setNonSwipedUsers(documents);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    if (userUid) {
      const loggedInUser = allProfiles.find(
        (profile) => profile.userLogin.uid === userUid
      );
      setCurrentUserProfile(loggedInUser);
      if (loggedInUser) {
        const {
          swiped,
          userInfo,
          categoryLikes,
          topFive,
          pictures,
          profilePicture,
        } = loggedInUser;
        if (topFive && userInfo && categoryLikes) {
          if (swiped?.yes.length > 0) {
            fetchNotSwipedUsers(swiped.yes);
          }
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
