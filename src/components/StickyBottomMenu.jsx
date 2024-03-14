import React from "react";
import { Popover } from "antd";
import {
  UserOutlined,
  MessageOutlined,
  SwapOutlined,
  HeartOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router";

export const StickyBottomMenu = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between">
        <UserOutlined
          className="text-2xl"
          onClick={() => {
            navigate("/profilepage");
          }}
        />
        <SwapOutlined
          className="text-2xl"
          onClick={() => {
            navigate("/swipelandingpage");
          }}
        />
        <MessageOutlined
          className="text-2xl"
          onClick={() => {
            navigate("/overallmessages");
          }}
        />
        <HeartOutlined
          className="text-2xl"
          onClick={() => {
            navigate("/matches");
          }}
        />
      </div>
    </>
  );
};
