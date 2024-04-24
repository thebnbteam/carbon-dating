import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Space,
  Layout,
  Form,
  Spin,
  List,
  Avatar,
  message,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useParams } from "react-router";

import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

import {
  dataCollection,
  messageCollection,
} from "../../firebase/firebase-config";

import { useUserAuth } from "../../context/UserAuthContext";

import { Spinner } from "../../components";

const { TextArea } = Input;
const { Header, Content, Footer } = Layout;

export const ChatRoom = () => {
  const { userUid, messages, setUnreadMessageCount, unreadMessageCount } =
    useUserAuth();
  const { roomNumber, matchedUser } = useParams();
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sortedMessages, setSortedMessages] = useState([]);
  const [matchUserInfo, setMatchUserInfo] = useState({});
  const [readHover, setReadHover] = useState(false);
  const [form] = Form.useForm();
  const messageDoc = doc(messageCollection, roomNumber);

  const sendNewMessage = async () => {
    const messageRef = await getDoc(messageDoc);

    if (newMessage === "") return;
    const timestamp = new Date();

    if (!messageRef.exists()) {
      await setDoc(messageDoc, {
        [timestamp]: {
          text: newMessage,
          user: userUid,
          readStatus: false,
          time: new Date(),
        },
      });
    } else {
      await updateDoc(messageDoc, {
        [timestamp]: {
          text: newMessage,
          user: userUid,
          readStatus: false,
          time: new Date(),
        },
      });
    }
    setNewMessage("");
  };

  const updateMessages = async (messages) => {
    const options = {
      hour12: true, // Use 12-hour clock
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get user's timezone
    };

    const readTime = new Date().toLocaleString("en-US", options);

    await new Promise((resolve) => {
      const updatedMessages = messages?.map((message) => {
        if (message[1].user !== userUid) {
          return [
            message[0],
            { ...message[1], readStatus: true, readAt: readTime },
          ];
        } else {
          return [message[0], message[1]];
        }
      });
      resolve(updatedMessages);
    }).then((val) => {
      try {
        updateDoc(messageDoc, Object.fromEntries(val));
      } catch (error) {
        console.log(error, "error updating messages");
      }
    });
  };

  const readMessages = async (messages) => {
    const unreadCounter = messageCounter(messages);
    const newCount = unreadMessageCount - unreadCounter;
    setUnreadMessageCount(newCount);
  };

  const getMatchedUser = async (matchedUser) => {
    const matchedUserDoc = doc(dataCollection, matchedUser);
    const matchedUserDocRef = await getDoc(matchedUserDoc);
    setMatchUserInfo(matchedUserDocRef.data());
  };

  const messageCounter = (sortedChat) => {
    let unreadCounter = 0;
    sortedChat.forEach((message) => {
      if (message[1].readStatus == false && message[1].user !== userUid) {
        unreadCounter++;
      }
    });
    return unreadCounter;
  };

  useEffect(() => {
    getMatchedUser(matchedUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    const messageWatch = onSnapshot(
      doc(messageCollection, roomNumber),
      (doc) => {
        const sorted = Object.entries(doc.data()).sort(
          (a, b) => new Date(b[0]) - new Date(a[0])
        );
        setSortedMessages(sorted);
      }
    );

    if (unreadMessageCount > 0) {
      readMessages(sortedMessages);
      updateMessages(sortedMessages);
    }
  }, [roomNumber, unreadMessageCount, sortedMessages]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {!loading ? (
        <Layout
          style={{
            padding: 10,
            overflow: "auto",
            height: "100%",
            background: "white",
            position: "relative",
            width: "100%",
          }}
        >
          <Header
            style={{
              position: "sticky",
              top: 0,
              background: "transparent",
            }}
          >
            <div className="flex justify-center">
              <Avatar
                className="m-3"
                shape="square"
                size="large"
                src={matchUserInfo?.profilePicture?.url}
              />
              <h2 className="text-center">{matchUserInfo?.userInfo?.name}</h2>
            </div>
          </Header>
          <Content
            style={{
              background: "white",
              overflow: "auto",
              marginLeft: 10,
              marginBottom: 30,
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            {sortedMessages && !loading
              ? sortedMessages.map((message, id) => {
                  return (
                    <>
                      <div className="flex flex-col">
                        {readHover === id ? (
                          <p className="text-center">{message[1].readAt}</p>
                        ) : null}
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
                                ? "bg-blue-600 text-white p-2 my-1 rounded-md "
                                : "bg-gray-500 text-white p-2 my-1 rounded-md"
                            }
                            onClick={() => {
                              setReadHover(id);
                            }}
                          >
                            {message[1].text}
                          </h3>
                        </div>
                        {message[1].user == userUid ? (
                          <div className="flex flex-row-reverse">
                            {readHover === id ? (
                              <p>{message[1].readStatus ? "Read" : "Sent"}</p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </>
                  );
                })
              : null}
          </Content>
          <Footer
            style={{
              background: "white",
              overflow: "auto",
              padding: 0,
              width: "100%",
              flex: "0 0 auto",
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
                  display: "flex",
                  justifyContent: "center",
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
