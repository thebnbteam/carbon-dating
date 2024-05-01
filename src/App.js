import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
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
  collection,
} from "firebase/firestore";
import { dataCollection, messageCollection } from "./firebase/firebase-config";
import { Button, Layout, message, notification } from "antd";

const { Header, Content, Footer } = Layout;

function App() {
  const {
    userUid,
    isLoading,
    userInfo,
    categoryLikes,
    topFive,
    setNonSwipedUsers,
    setMatchedUpdates,
    setMatchedUsers,
    setMessages,
    setUnreadMessageCount,
    currentUserProfile,
    setIsLoading,
  } = useUserAuth();
  const [calibrationDone, setCalibrationDone] = useState(false);
  const [api, contextHolder] = notification.useNotification();
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

  const messageNotification = (number) => {
    api.info({
      message: `You have ${number} message!`,
      description: (
        <Button
          onClick={() => {
            navigate("/overallmessages");
          }}
        >
          See Your New Message!
        </Button>
      ),
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

  const newMatchWatcher = async () => {
    const userDocRef = doc(dataCollection, userUid);
    const chatRoomsCollectionRef = collection(userDocRef, "chatRooms");
    const q = query(chatRoomsCollectionRef, where("checked", "==", false));
    const matchWatcher = onSnapshot(q, (matches) => {
      const notChecked = [];
      matches.forEach((match) => {
        notChecked.push(match.data());
      });
      if (notChecked.length > 0) {
        matchNotification();
      }
    });
  };

  // const onlineWatcher = async () => {
  //   try {
  //     if (userUid) {
  //       const userLiveUpdates = onSnapshot(
  //         doc(dataCollection, userUid),
  //         (doc) => {
  //           if (doc.data().matched) {
  //             setMatchedUpdates(doc.data().matched);
  //             doc.data().matched.forEach((match) => {
  //               if (match.checked == false) {
  //                 matchNotification();
  //               }
  //             });
  //           }
  //           const roomArray = doc.data().chatRooms;
  //           if (roomArray) {
  //             const chatSorted = [];
  //             const promises = roomArray.map((room) => {
  //               return new Promise((resolve, reject) => {
  //                 const tempObj = {};
  //                 const liveChatPromise = new Promise((liveResolve) => {
  //                   onSnapshot(
  //                     query(
  //                       dataCollection,
  //                       where("userLogin.uid", "==", room.uid)
  //                     ),
  //                     (snapshot) => {
  //                       snapshot.forEach((doc) => {
  //                         tempObj.user = doc.data();
  //                       });
  //                       liveResolve();
  //                     }
  //                   );
  //                 });
  //                 const messageCollectionPromise = new Promise(
  //                   (messageResolve) => {
  //                     onSnapshot(messageCollection, (snapshot) => {
  //                       snapshot.forEach((doc) => {
  //                         if (doc.id == room.roomId) {
  //                           tempObj.room = doc.id;
  //                           tempObj.messages = Object.entries(doc.data()).sort(
  //                             (a, b) => new Date(b[0]) - new Date(a[0])
  //                           );
  //                         }
  //                       });
  //                       const messageCount = messageCounter(tempObj.messages);

  //                       if (messageCount > 0) {
  //                         setUnreadMessageCount(messageCount);
  //                         messageNotification(messageCount);
  //                       }
  //                       messageResolve();
  //                     });
  //                   }
  //                 );

  //                 Promise.all([liveChatPromise, messageCollectionPromise])
  //                   .then(() => {
  //                     setMessages([tempObj]);
  //                     resolve();
  //                   })
  //                   .catch(reject);
  //               });
  //             });
  //           }
  //         }
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error loading live matches", error);
  //   }
  // };

  // const messageCounter = (sortedChat) => {
  //   let unreadCounter = 0;
  //   sortedChat.forEach((message) => {
  //     if (message[1].readStatus == false && message[1].user !== userUid) {
  //       unreadCounter++;
  //     }
  //   });
  //   return unreadCounter;
  // };

  useEffect(() => {
    if (userUid) {
      if (topFive && userInfo && categoryLikes) {
        if (currentUserProfile?.swiped?.yes?.length > 0) {
          fetchNotSwipedUsers(currentUserProfile.swiped.yes);
        }

        newMatchWatcher();
        setCalibrationDone(true);
        navigate("/profilepage");
      } else if (userInfo && categoryLikes) {
        navigate("/calibrationtopintro");
      } else if (!categoryLikes && userInfo) {
        navigate("/calibrationintro");
      } else {
        navigate("/calibratelandingpage");
      }
    }
    setIsLoading(false);
  }, [currentUserProfile]);

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
            overflow: "auto",
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
