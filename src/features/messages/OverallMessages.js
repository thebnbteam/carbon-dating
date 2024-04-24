import { Input, Button, Card, Image, Badge } from "antd";
import { useState } from "react";

import { useUserAuth } from "../../context/UserAuthContext";

import { useNavigate } from "react-router";

import { Layout } from "antd";

const { Search } = Input;
const { Meta } = Card;
const { Content } = Layout;

export const OverallMessages = () => {
  const navigate = useNavigate();
  const { messages, unreadMessageCount } = useUserAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <h2 className="text-center">Messages</h2>
      <Layout
        style={{
          overflowY: "auto",
          height: "100%",
          background: "white",
        }}
      >
        <Search
          className="m-2"
          size="large"
          placeholder="Search name"
          allowClear
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Content
          style={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {messages
            ? messages.map((room) => {
                return (
                  <Card hoverable className="m-2">
                    <Meta title={room.user.userInfo.name} />
                    <div className="flex">
                      <Image width={150} src={room.user.profilePicture.url} />
                      <div className="flex flex-col m-2">
                        <Badge offset={[12, 3]} count={unreadMessageCount}>
                          <h3 className="font-bold">Most Recent Message</h3>
                        </Badge>
                        <p>
                          {room?.messages[0]
                            ? room?.messages[0][1]?.text
                            : "No Messages Yet"}
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
        </Content>
      </Layout>
    </>
  );
};
