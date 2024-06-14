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
  orderBy,
  limit,
} from "firebase/firestore";
import { dataCollection, messageCollection } from "./firebase/firebase-config";
import { Button, Layout, message, notification } from "antd";
import { ConsoleSqlOutlined } from "@ant-design/icons";

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
    setRecentMessages,
    setRoomInfo,
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

  const newMessageWatcher = async () => {
    const userDocRef = doc(dataCollection, userUid);
    const chatRoomsCollectionRef = collection(userDocRef, "chatRooms");
    const chatRoomWatch = onSnapshot(chatRoomsCollectionRef, (docs) => {
      const rooms = [];
      const matchedUser = [];
      docs.forEach((doc) => {
        rooms.push(doc.data().room);
        matchedUser.push(doc.data().matchedUserUid);
      });
      const matchedUserProfilesQuery = query(
        dataCollection,
        where("userLogin.uid", "in", matchedUser)
      );
      const messageRoomQuery = query(
        messageCollection,
        where("roomNumber", "in", rooms)
      );

      const matchedUserProfileGrab = onSnapshot(
        matchedUserProfilesQuery,
        (docs) => {
          const matchedUser = [];
          docs.forEach((doc) => {
            matchedUser.push(doc.data());
          });
          setMatchedUsers(matchedUser);
        }
      );

      const messagesUnread = onSnapshot(messageRoomQuery, (docs) => {
        const roomData = [];
        docs.forEach((doc) => {
          const { users, ...rest } = doc.data();
          const [otherUsers] = users.filter((user) => user !== userUid);
          const newData = { ...rest, users: otherUsers };
          roomData.push(newData);

          const messagesCollectionRef = collection(doc.ref, "messages");

          const unreadQuery = query(
            messagesCollectionRef,
            where("readStatus", "==", false)
          );

          const messagesUnreadSub = onSnapshot(unreadQuery, (messagesDocs) => {
            const unReadArray = [];
            messagesDocs.forEach((messageDoc) => {
              if (messageDoc.data().user !== userUid) {
                console.log(messageDoc.data());
                unReadArray.push(messageDoc.data());
              }
            });
            if (unReadArray.length > 0) {
              messageNotification(unReadArray.length);
              setUnreadMessageCount(unReadArray.length);
            } else {
              setUnreadMessageCount(0);
            }
          });
        });
        console.log(roomData);
        setRoomInfo(roomData);
      });
    });
  };

  useEffect(() => {
    if (userUid) {
      if (topFive && userInfo && categoryLikes) {
        if (currentUserProfile?.swiped?.yes?.length > 0) {
          fetchNotSwipedUsers(currentUserProfile.swiped.yes);
        }
        newMatchWatcher();
        newMessageWatcher();
        setCalibrationDone(true);
        navigate("/profilepage");
      } else if (userInfo && categoryLikes) {
        navigate("/calibrationtopintro");
      } else if (!categoryLikes && userInfo) {
        navigate("/calibrationintro");
      } else {
        navigate("/calibratelandingpage");
      }
    } else {
      navigate("/");
      setIsLoading(false);
    }
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
