import { Input, Button, Card, Image } from "antd";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  query,
  getDocs,
  where,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  messageCollection,
  dataCollection,
} from "../../firebase/firebase-config";

import { useUserAuth } from "../../context/UserAuthContext";

import { useNavigate } from "react-router";

const { Search } = Input;
const { Meta } = Card;

export const OverallMessages = () => {
  const navigate = useNavigate();
  const { userUid } = useUserAuth();
  const [lastMessages, setlastMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userDocRef = doc(dataCollection, userUid);

  const getLatestMessages = async () => {
    try {
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.data().matched) {
        const userMatches = userSnapshot.data().matched;
        const roomNumberArray = userMatches
          .filter((field) => field.hasOwnProperty("room"))
          .map((field) => field.room);
        const tempPushArray = await Promise.all(
          roomNumberArray.map(async (room) => {
            const roomDocRef = doc(messageCollection, room);
            const roomMessages = await getDoc(roomDocRef);
            let tempPushObj = {};
            if (roomMessages.exists()) {
              tempPushObj.room = room;
              tempPushObj.messages = Object.entries(roomMessages.data()).sort(
                (a, b) => new Date(a[0]) - new Date(b[0])
              );
            }
            for (const match of userMatches) {
              if (match.room === room) {
                const userRef = doc(dataCollection, match.uid);
                const userProf = await getDoc(userRef);
                if (userProf.exists()) {
                  tempPushObj.name = userProf.data().userInfo.name;
                  tempPushObj.uid = userProf.data().userLogin.uid;
                  tempPushObj.picture = userProf.data().profilePicture.url;
                }
              }
            }
            return tempPushObj;
          })
        );
        setlastMessages(tempPushArray);
      }
    } catch (error) {
      console.error("Error getting latest messages:", error);
    }
  };

  const filteredMessages = lastMessages.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getLatestMessages();
  }, [userUid]);

  return (
    <>
      <div className="mt-3 mb-auto mx-7">
        <h2 className="text-center">Messages</h2>
        <Search
          className="m-2"
          size="large"
          placeholder="Search name"
          allowClear
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredMessages.length > 0
          ? filteredMessages.map((room) => {
              return (
                <Card hoverable className="m-2">
                  <Meta title={room.name} />
                  <div className="flex">
                    <Image width={150} src={room.picture} />
                    <div className="flex flex-col m-2">
                      <h3 className="font-bold">Most Recent Message</h3>
                      <p>
                        {room?.messages[room?.messages?.length - 1][1]?.text}
                      </p>
                      <Button
                        className="m-1"
                        onClick={() => {
                          navigate(`/chatroom/${room.room}/${room.uid}`);
                        }}
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          : "No Recent Messages"}
      </div>
    </>
  );
};
