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
  const { userUid, matchedUpdates, matchedUsers, messages } = useUserAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [lastMessage, setlastMessage] = useState([]);
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
        {messages
          ? messages.map((room) => {
              return (
                <Card hoverable className="m-2">
                  <Meta title={room.user.userInfo.name} />
                  <div className="flex">
                    <Image width={150} src={room.user.profilePicture.url} />
                    <div className="flex flex-col m-2">
                      <h3 className="font-bold">Most Recent Message</h3>
                      <p>
                        {room?.messages[room?.messages?.length - 1][1]?.text}
                      </p>
                      <Button
                        className="m-1"
                        onClick={() => {
                          navigate(
                            `/chatroom/${room.room}/${room.user.userLogin.uid}`
                          );
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
