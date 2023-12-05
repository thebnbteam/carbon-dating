import React, { useState, useEffect } from "react";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { message, Card } from "antd";
import { useUserAuth } from "../../context/UserAuthContext";
import { motion, AnimatePresence } from "framer-motion";

import { MatchesCard } from "./MatchesCards";

const { Meta } = Card;

export const SwipeLandingPage = () => {
  const { allProfiles, setLeaveX } = useUserAuth();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [removedCards, setRemovedCards] = useState([]);

  const activeIndex = filteredProfiles.length - 1;

  function profileExpander() {
    setProfileExpanded(!profileExpanded);
  }

  const removeCard = (id) => {
    const removedCard = filteredProfiles.filter(
      (profiles) => profiles.userLogin.uid === id
    );

    setRemovedCards((prev) => [...prev, ...removedCard]);

    setFilteredProfiles((current) =>
      current.filter((card) => card.userLogin.uid !== id)
    );
  };

  const onDragEnd = (info, profileId) => {
    if (info.offset.y < -200) {
      profileExpander();
    }

    if (
      (info.offset.x > 200 && info.offset.y > -200) ||
      (info.offset.x < -200 && info.offset.y > -200)
    ) {
      removeCard(profileId);
    }
  };

  const undoSwipe = () => {
    if (removedCards.length > 0) {
      const singleRemovedCard = removedCards.pop();
      setFilteredProfiles((current) => [...current, singleRemovedCard]);
    } else {
      message.error(`You didn't swipe yet!`, 2);
    }
  };

  useEffect(() => {
    const filtered = allProfiles.filter((profile) => {
      if (profile.profilePicture) {
        return profile;
      }
    });
    setFilteredProfiles(filtered);
  }, []);

  return (
    <>
      <div className="flex flex-col pb-[300px]">
        <div className="flex justify-center m-4">
          <motion.div
            className="jello-horizontal"
            animate={{
              scale: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
            }}
            initial={{ scale: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {profileExpanded ? (
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
          </motion.div>
        </div>
        <div className="flex flex-col items-center relative">
          <AnimatePresence onExitComplete={() => setLeaveX(0)}>
            {filteredProfiles.map((profile, index) => {
              return (
                <MatchesCard
                  key={profile.userLogin.uid}
                  index={index}
                  profile={profile}
                  activeIndex={activeIndex}
                  profileExpanded={profileExpanded}
                  onDragEnd={onDragEnd}
                  currentProfile={filteredProfiles[index]}
                />
              );
            })}
          </AnimatePresence>
          {filteredProfiles.length === 0 ? (
            <div className="flex flex-col justify-center items-center mt-6">
              <h3 className="text-center">No more!</h3>
              <h3 className="text-center">Please come back later!</h3>
            </div>
          ) : null}
        </div>
        <div className="w-full flex flex-col justify-center mt-[300px]">
          <h3 className="text-center mb-4">
            {profileExpanded
              ? "Click To See Details"
              : "Swipe Up To See Details"}
          </h3>
          <div className="flex justify-around">
            <CloseCircleOutlined
              className="text-4xl mx-5"
              onClick={() => {
                setLeaveX(-1000);
                removeCard(filteredProfiles[activeIndex].userLogin.uid);
              }}
            />

            <UndoOutlined
              className="text-4xl mx-5"
              onClick={() => {
                undoSwipe();
              }}
            />

            <CheckCircleOutlined
              className="text-4xl mx-5"
              onClick={() => {
                setLeaveX(1000);
                removeCard(filteredProfiles[activeIndex].userLogin.uid);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
