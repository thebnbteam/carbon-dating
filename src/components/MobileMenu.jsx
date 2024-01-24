import React, { useState, useEffect } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    logOut,
    authNotificationHandler,
    userInfo,
    categoryLikes,
    profilePicture,
  } = useUserAuth();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const signOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      authNotificationHandler("error", "Error", err.message);
    }
  };

  return (
    <>
      <MenuOutlined
        style={{
          fontSize: 25,
        }}
        onClick={showDrawer}
        className="m-2"
      />
      <Drawer width={300} onClose={onClose} open={open}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {(!userInfo && !categoryLikes) || (userInfo && !categoryLikes) ? (
            <Button
              block
              onClick={() => {
                navigate(
                  !userInfo && !categoryLikes
                    ? "/calibratelandingpage"
                    : "/calibrationintro"
                );
                onClose();
              }}
            >
              Please Finish Your Calibration!
            </Button>
          ) : null}

          {profilePicture ? (
            <>
              <Button
                block
                onClick={() => {
                  navigate("/profilepage");
                  onClose();
                }}
              >
                Profile Page
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
                  navigate("/tierlistpage");
                  onClose();
                }}
              >
                Tier List Info
              </Button>
            </>
          ) : (
            <Button
              block
              onClick={() => {
                navigate("/profilepage");
                onClose();
              }}
            >
              Please Set Your Profile Picture!
            </Button>
          )}
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
