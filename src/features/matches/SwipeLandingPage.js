import React, { useState } from "react";

import {
  ProfilePictureBox,
  ProfileTextBox,
  TopFiveDisplayed,
} from "../../components";

import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export const SwipeLandingPage = () => {
  const [profileExpanded, setProfileExpanded] = useState(true);

  function profileExpander() {
    setProfileExpanded(!profileExpanded);
  }

  return (
    <>
      <div className="flex flex-col mx-4 mt-10 gap-6 items-center">
        {!profileExpanded ? (
          <FaAngleDoubleUp
            onClick={() => {
              profileExpander();
            }}
            className="text-5xl"
          />
        ) : (
          <FaAngleDoubleDown
            onClick={() => {
              profileExpander();
            }}
            className="text-5xl"
          />
        )}
        <ProfilePictureBox />
        {profileExpanded && <TopFiveDisplayed />}
        <ProfileTextBox />
        <div className="w-full flex justify-between px-3">
          <FaTimesCircle className="text-4xl" />
          <FaCheckCircle className="text-4xl" />
        </div>
      </div>
    </>
  );
};
