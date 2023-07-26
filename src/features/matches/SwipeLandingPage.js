import React, { useState } from "react";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { MatchesDisplayBox } from "../../components";

export const SwipeLandingPage = () => {
  const [profileExpanded, setProfileExpanded] = useState(true);

  function profileExpander() {
    setProfileExpanded(!profileExpanded);
  }

  return (
    <>
      <div className="flex flex-col mx-4 mt-10 gap-6 items-center">
        {!profileExpanded ? (
          <DownSquareOutlined
            onClick={() => {
              profileExpander();
            }}
            className="text-5xl"
          />
        ) : (
          <UpSquareOutlined
            onClick={() => {
              profileExpander();
            }}
            className="text-5xl"
          />
        )}
        <MatchesDisplayBox size={300} expanded={profileExpanded} />
        <div className="w-full flex justify-between px-3">
          <CloseCircleOutlined className="text-4xl" />
          <CheckCircleOutlined className="text-4xl" />
        </div>
      </div>
    </>
  );
};
