import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner, StickyBottomMenu } from "./components";
import { getDocs, where, query } from "firebase/firestore";
import { dataCollection } from "./firebase/firebase-config";
import { Layout, Space } from "antd";

const { Header, Content, Footer } = Layout;

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
  const [calibrationDone, setCalibrationDone] = useState(false);
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
          setCalibrationDone(true);
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
    <div className="flex justify-center items-center">
      <Layout
        style={{
          margin: 5,
          maxWidth: 480,
          borderStyle: "double",
          borderColor: "black",
          borderWidth: 4,
          height: "100vh",
        }}
      >
        <Header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            background: "white",
            padding: 20,
          }}
        >
          {userUid && <MobileMenu />}
        </Header>
        <Content
          style={{
            background: "white",
          }}
        >
          <Routes>
            {routes.map(({ element, path }, key) => (
              <Route path={path} element={element} key={key} />
            ))}
          </Routes>
        </Content>
        <Footer
          style={{
            position: "sticky",
            bottom: 0,
            background: "white",
            width: "100%",
            borderStyle: "double",
            borderColor: "black",
            borderWidth: 4,
          }}
        >
          {userUid && calibrationDone && <StickyBottomMenu />}
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
