import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner, StickyBottomMenu } from "./components";
import {
  getDocs,
  where,
  query,
  onSnapshot,
  doc,
  getDoc,
  FieldPath,
  documentId,
} from "firebase/firestore";
import { dataCollection, messageCollection } from "./firebase/firebase-config";
import { Button, Layout, message, notification } from "antd";
import { ConsoleSqlOutlined } from "@ant-design/icons";

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
    modalIsOpen,
    setMatchedUpdates,
    matchedUpdates,
    matchedUsers,
    setMatchedUsers,
    setMessages,
    messages,
  } = useUserAuth();
  const [calibrationDone, setCalibrationDone] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const matchNotification = () => {
    api.info({
      message: "You have a new match!",
      description: (
        <Button
          onClick={() => {
            navigate("/matches");
          }}
        >
          See Your New Match!
        </Button>
      ),
      duration: 2,
    });
  };

  const messageNotification = () => {
    api.info({
      message: "You have a new message!",
      description: <Button>See Your New Message!</Button>,
      duration: 2,
    });
  };

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

  const onlineWatcher = async () => {
    try {
      const userDoc = doc(dataCollection, userUid);
      const userRef = await getDoc(userDoc);
      if (userRef.exists()) {
        const userLiveUpdates = onSnapshot(userDoc, (doc) => {
          if (doc.data().matched) {
            setMatchedUpdates(doc.data().matched);
            doc.data().matched.forEach((match) => {
              if (!match.checked) {
                matchNotification();
              }
            });
          }
          const matchedUid = doc
            .data()
            .matched.filter((field) => field.hasOwnProperty("uid"))
            .map((field) => field.uid);

          const liveGetMatchedUsers = onSnapshot(
            query(dataCollection, where("userLogin.uid", "in", matchedUid)),
            (snapshot) => {
              const profiles = [];
              snapshot.forEach((doc) => {
                profiles.push(doc.data());
              });
              setMatchedUsers(profiles);
            }
          );
          if (doc.data().chatRooms) {
            const roomArray = doc.data().chatRooms;
            if (roomArray) {
              const chatSorted = [];
              const promises = roomArray.map((room) => {
                return new Promise((resolve, reject) => {
                  const tempObj = {};
                  const liveChatPromise = new Promise((liveResolve) => {
                    onSnapshot(
                      query(
                        dataCollection,
                        where("userLogin.uid", "==", room.uid)
                      ),
                      (snapshot) => {
                        snapshot.forEach((doc) => {
                          tempObj.user = doc.data();
                        });
                        liveResolve();
                      }
                    );
                  });
                  const messageCollectionPromise = new Promise(
                    (messageResolve) => {
                      onSnapshot(messageCollection, (snapshot) => {
                        snapshot.forEach((doc) => {
                          if (doc.id == room.roomId) {
                            tempObj.room = doc.id;
                            tempObj.messages = Object.entries(doc.data()).sort(
                              (a, b) => new Date(a[0]) - new Date(b[0])
                            );
                          }
                        });
                        messageResolve();
                      });
                    }
                  );

                  Promise.all([liveChatPromise, messageCollectionPromise])
                    .then(() => {
                      chatSorted.push(tempObj);
                      resolve();
                    })
                    .catch(reject);
                });
              });
              Promise.all(promises)
                .then(() => {
                  setMessages(chatSorted);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          }
        });
      }
    } catch (error) {
      console.error("Error loading live matches", error);
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
          if (swiped?.yes?.length > 0) {
            fetchNotSwipedUsers(swiped.yes);
          }
          onlineWatcher();
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
      {contextHolder}
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
        {userUid && calibrationDone && (
          <Footer
            style={{
              position: "sticky",
              bottom: 0,
              background: "white",
              width: "100%",
              borderTopStyle: "double",
              borderTopColor: "black",
              borderTopWidth: 4,
            }}
          >
            <StickyBottomMenu />
          </Footer>
        )}
      </Layout>
    </div>
  );
}

export default App;
