import React, { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logOut, authNotificationHandler } = useUserAuth();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const signOut = async () => {
    try {
      await logOut();
      authNotificationHandler(
        "success",
        "Success",
        "You have successfully logged out!"
      );
      navigate("/");
    } catch (err) {
      authNotificationHandler("error", "Error", err.message);
    }
  };

  return (
    <>
      <MenuOutlined
        style={{
          fontSize: 20,
        }}
        onClick={showDrawer}
      />
      <Drawer width={300} onClose={onClose} open={open}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            block
            onClick={() => {
              navigate("/profilepage");
              onClose();
            }}
          >
            Profile
          </Button>
          <Button
            block
            onClick={() => {
              navigate("/swipelandingpage");
              onClose();
            }}
          >
            Swiping
          </Button>
          <Button
            block
            onClick={() => {
              navigate("/matchespage");
              onClose();
            }}
          >
            Matches
          </Button>
          <Button
            block
            onClick={() => {
              navigate("/overallmessages");
              onClose();
            }}
          >
            Messages
          </Button>
          <Button
            block
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </Button>
        </Space>
      </Drawer>
    </>
  );
}
