import { useEffect, useState } from "react";
import { Input, Button, Space, Layout, Form, Spin, List, Avatar } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useParams } from "react-router";

import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

import {
  dataCollection,
  messageCollection,
} from "../../firebase/firebase-config";

import { useUserAuth } from "../../context/UserAuthContext";

import { Spinner } from "../../components";
import InfiniteScroll from "react-infinite-scroll-component";

const { TextArea } = Input;
const { Header, Content, Footer } = Layout;

export const ChatRoom = () => {
  const { userUid } = useUserAuth();
  const { roomNumber, matchedUser } = useParams();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomMatch, setRoomMatch] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sortedMessages, setSortedMessages] = useState([]);
  const [matchUserInfo, setMatchUserInfo] = useState("");
  const [form] = Form.useForm();
  const messageDoc = doc(messageCollection, roomNumber);

  const roomCheck = async () => {
    const userDocRef = doc(dataCollection, userUid);
    const matchedUserDocRef = doc(dataCollection, matchedUser);
    try {
      const userSnapshot = await getDoc(userDocRef);
      const matchedSnapshot = await getDoc(matchedUserDocRef);
      setMatchUserInfo(matchedSnapshot.data());
      const userMatchedArray = userSnapshot.data().matched;
      const matchedUserArray = matchedSnapshot.data().matched;

      const [userMatchCheck] = userMatchedArray.filter(
        (field) => field.room === roomNumber
      );

      const [matchedUserCheck] = matchedUserArray.filter(
        (field) => field.room === roomNumber
      );

      if (
        roomNumber == userMatchCheck.room &&
        roomNumber == matchedUserCheck.room
      ) {
        setRoomMatch(true);
        setRoomId(roomNumber);
      }
    } catch (error) {
      console.error("Error Checking room number", error);
    }
  };

  const getExistingMessages = async () => {
    const messageDoc = doc(messageCollection, roomNumber);

    const allMessages = await getDoc(messageDoc);
    try {
      if (allMessages.exists()) {
        const messages = allMessages.data();
        let dateArray = Object.entries(messages);
        let sorted = dateArray.sort((a, b) => new Date(a[0]) - new Date(b[0]));
        setSortedMessages(sorted);
      }
    } catch (error) {
      console.log(error, "Error getting Messages");
    }
  };

  const sendNewMessage = async () => {
    const messageDoc = doc(messageCollection, roomNumber);
    if (newMessage === "") return;
    const messageRef = await getDoc(messageDoc);
    const timestamp = new Date();

    if (!messageRef.exists()) {
      await setDoc(messageDoc, {
        [timestamp]: {
          text: newMessage,
          user: userUid,
        },
      });
    } else {
      await updateDoc(messageDoc, {
        [timestamp]: {
          text: newMessage,
          user: userUid,
        },
      });
    }

    setNewMessage("");
  };

  // backend check is for safety front end check is for user experience
  useEffect(() => {
    roomCheck();
    getExistingMessages();
    const liveUpdates = onSnapshot(messageDoc, (doc) => {
      let messages = Object.entries(doc.data()).sort(
        (a, b) => new Date(a[0]) - new Date(b[0])
      );
      setSortedMessages(messages);
    });
  }, [roomNumber]);

  return (
    <>
      {roomMatch ? (
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Header
            style={{
              position: "sticky",
              top: 0,
              background: "white",
            }}
          >
            <div className="flex justify-center">
              <Avatar
                className="m-3"
                shape="square"
                size="large"
                src={matchUserInfo.profilePicture.url}
              />
              <h2 className="text-center">{matchUserInfo.userInfo.name}</h2>
            </div>
          </Header>
          <Content
            style={{
              background: "white",
            }}
          >
            <div className="mx-5">
              {sortedMessages.map((message) => {
                return (
                  <div
                    className={
                      message[1].user == userUid
                        ? "flex flex-row-reverse"
                        : "flex flex-row"
                    }
                  >
                    <h3
                      className={
                        message[1].user == userUid
                          ? "bg-blue-600 text-white p-2 rounded-md"
                          : "bg-gray-500 text-white p-2 rounded-md"
                      }
                    >
                      {message[1].text}
                    </h3>
                  </div>
                );
              })}
            </div>
          </Content>
          <Footer
            style={{
              position: "sticky",
              bottom: 0,
              background: "white",
            }}
          >
            <Form
              form={form}
              onFinish={() => {
                sendNewMessage();
              }}
            >
              <Space.Compact
                style={{
                  width: "100%",
                }}
              >
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(event) => {
                    setNewMessage(event.target.value);
                  }}
                  placeholder="Put your message here!"
                  allowClear
                />
                <Button
                  htmlType="submit"
                  size="large"
                  type="default"
                  icon={<SendOutlined />}
                />
              </Space.Compact>
            </Form>
          </Footer>
        </Layout>
      ) : (
        <Spinner />
      )}
    </>
  );
};
