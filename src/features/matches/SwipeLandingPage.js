import React, { useState } from "react";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Card, Image } from "antd";
import { useUserAuth } from "../../context/UserAuthContext";
import {
  motion,
  Frame,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";

const { Meta } = Card;

export const SwipeLandingPage = () => {
  const { allProfiles, setAllProfiles } = useUserAuth();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [motionValue, setMotionValue] = useState(0);

  function profileExpander() {
    setProfileExpanded(!profileExpanded);
  }

  const handleSwipe = (direction) => {
    if (direction === "right") {
      setMotionValue(1000);
    } else {
      setMotionValue(-1000);
    }

    const updatedProfiles = [...allProfiles];
    updatedProfiles.splice(currentCardIndex, 1);
    setAllProfiles(updatedProfiles);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-center">
          {!profileExpanded ? (
            <UpSquareOutlined
              onClick={() => {
                profileExpander();
              }}
              className="text-5xl"
            />
          ) : (
            <DownSquareOutlined
              onClick={() => {
                profileExpander();
              }}
              className="text-5xl"
            />
          )}
        </div>
        <div className="flex flex-col items-center">
          {allProfiles.map((profile, index) => {
            if (profile.profilePicture) {
              return (
                index === currentCardIndex && (
                  <motion.div
                    key={index}
                    className={`absolute`}
                    dragConstraints={{ left: 0, right: 0 }}
                    animate={{
                      x: motionValue,
                    }}
                    transition={{
                      ease: "linear",
                      duration: 1.5,
                    }}
                    drag
                    onAnimationComplete={() => {
                      setMotionValue(0);
                    }}
                  >
                    <Card
                      hoverable
                      style={{
                        width: 250,
                        margin: 10,
                      }}
                      cover={
                        <Image
                          height={250}
                          width={250}
                          src={profile.profilePicture.url}
                          alt="cute cat picture"
                        />
                      }
                    >
                      <Meta title={profile.userInfo.name} />
                      {profileExpanded && (
                        <Card
                          style={{
                            marginTop: 15,
                          }}
                          type="inner"
                          title="Loves (Top 5)"
                        >
                          <div className="flex flex-wrap justify-center">
                            {profile.topFive.map((topic) => {
                              return <p className="mx-1">{topic}</p>;
                            })}
                          </div>
                        </Card>
                      )}
                    </Card>
                  </motion.div>
                )
              );
            }
          })}
        </div>
        <div className="w-full flex justify-center mt-[400px]">
          <div>
            <CloseCircleOutlined
              className="text-4xl mx-5"
              onClick={() => {
                handleSwipe("left");
              }}
            />
            <CheckCircleOutlined
              className="text-4xl mx-5"
              onClick={() => {
                handleSwipe("right");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
