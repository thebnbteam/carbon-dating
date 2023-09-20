import React, { useState, useEffect } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [calibrationStatus, setCalibrationStatus] = useState("");
  const navigate = useNavigate();
  const { logOut, authNotificationHandler, userInfo, categoryLikes } =
    useUserAuth();

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

  useEffect(() => {
    if (userInfo == undefined && categoryLikes == undefined) {
      setCalibrationStatus("notDone");
    } else if (userInfo && categoryLikes == undefined) {
      setCalibrationStatus("partial");
    } else {
      setCalibrationStatus("done");
    }
  }, [userInfo, categoryLikes]);

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
          {calibrationStatus === "notDone" ||
          calibrationStatus === "partial" ? (
            <Button
              block
              onClick={() => {
                navigate(
                  calibrationStatus === "notDone"
                    ? "/calibratelandingpage"
                    : "/calibrationintro"
                );
                onClose();
              }}
            >
              Please Finish Your Calibration!
            </Button>
          ) : null}
          {calibrationStatus == "done" ? (
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
            </>
          ) : null}
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
