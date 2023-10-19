import React, { useState, useEffect } from "react";
import {
  UpSquareOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Card, Image } from "antd";
import { useUserAuth } from "../../context/UserAuthContext";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  AnimatePresence,
} from "framer-motion";

const { Meta } = Card;

export const SwipeLandingPage = () => {
  const { allProfiles, setAllProfiles } = useUserAuth();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [leaveX, setLeaveX] = useState(0);
  const [directionX, setDirectionX] = useState(0);

  const controls = useAnimation();

  const activeIndex = filteredProfiles.length - 1;

  function profileExpander() {
    setProfileExpanded(!profileExpanded);
  }

  const removeCard = (id) => {
    setFilteredProfiles((current) =>
      current.filter((card) => card.userLogin.uid !== id)
    );
  };

  const onDragEnd = (info, profile) => {
    console.log(info.offset.x);

    if (info.offset.y < -200) {
      profileExpander();
    }

    if (info.offset.x > 200) {
      setLeaveX(-1000);
      removeCard(profile);
    }

    if (info.offset.x < -200) {
      setLeaveX(1000);
      removeCard(profile);
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
      <div className="flex flex-col">
        <div className="flex justify-center">
          <motion.div
            className="jello-horizontal"
            animate={{
              scale: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
            }}
            initial={{ scale: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <UpSquareOutlined
              onClick={() => {
                profileExpander();
              }}
              className="text-5xl"
            />
          </motion.div>
        </div>
        <div className="flex flex-col items-center">
          <AnimatePresence>
            {filteredProfiles.map((profile, index) =>
              activeIndex === index ? (
                <motion.div
                  key={index}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  drag={true}
                  initial={{ scale: 1 }}
                  onDragEnd={(event, info) => {
                    if (info.delta.x === 0) {
                      setTimeout(() => {
                        setDirectionX(0);
                      }, 0);
                    }
                    onDragEnd(info, filteredProfiles[index].userLogin.uid);
                  }}
                  onDrag={(event, info) => {
                    setDirectionX(info.offset.x);
                  }}
                  animate={{
                    scale: 1.05,
                  }}
                  exit={{
                    x: leaveX,
                    opacity: 0,
                    scale: 0.5,
                    transition: { duration: 0.2 },
                    rotate: 300,
                  }}
                  onAnimationComplete={() => {
                    console.log("completed");
                  }}
                  className={`absolute`}
                >
                  <Card
                    hoverable
                    style={{
                      width: 200,
                      margin: 10,
                    }}
                    cover={
                      <Image
                        height={200}
                        width={200}
                        src={profile.profilePicture.url}
                        alt="cute cat picture"
                      />
                    }
                  >
                    <Meta title={profile.userInfo.name} />
                    {directionX > 0 ? (
                      <div className="flex justify-center">
                        <CheckOutlined className="text-5xl" />
                      </div>
                    ) : directionX < 0 ? (
                      <div className="flex justify-center">
                        <CloseOutlined className="text-5xl" />
                      </div>
                    ) : null}
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
              ) : (
                <div className="absolute rotate-12">
                  <Card
                    hoverable
                    style={{
                      width: 200,
                      margin: 10,
                    }}
                    cover={
                      <Image
                        height={200}
                        width={200}
                        src={profile.profilePicture.url}
                        alt="cute cat picture"
                      />
                    }
                  >
                    <Meta title={profile.userInfo.name} />
                  </Card>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
        <div className="w-full flex justify-center mt-[400px]">
          <div>
            <CloseCircleOutlined
              className="text-4xl mx-5"
              onClick={() => {
                onDragEnd(
                  { offset: { x: -500 } },
                  filteredProfiles[activeIndex].userLogin.uid
                );
              }}
            />
            <CheckCircleOutlined
              className="text-4xl mx-5"
              onClick={() => {
                onDragEnd(
                  { offset: { x: 500 } },
                  filteredProfiles[activeIndex].userLogin.uid
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
