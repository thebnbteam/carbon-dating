import React, { useState, useEffect } from "react";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { message, Modal, Button, Avatar, Space } from "antd";
import { useUserAuth } from "../../context/UserAuthContext";
import { motion, AnimatePresence } from "framer-motion";

import { MatchesCard } from "./MatchesCards";

import { doc, getDoc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { dataCollection } from "../../firebase/firebase-config";

import { categories } from "../../categoriesconstant";

export const SwipeLandingPage = () => {
  const { allProfiles, setLeaveX, userUid, currentUserProfile } = useUserAuth();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [removedCards, setRemovedCards] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sameInterest, setSameInterest] = useState([]);
  const [tier, setTier] = useState("");
  const [matchedUser, setMatchedUser] = useState();

  const categoriesArray = Object.keys(categories);

  const activeIndex = filteredProfiles.length - 1;

  useEffect(() => {
    const filtered = allProfiles.filter((profile) => {
      if (
        profile.profilePicture &&
        profile.userLogin.uid !== currentUserProfile.userLogin.uid
      ) {
        return profile;
      }
    });
    setFilteredProfiles(filtered);
  }, [allProfiles]);

  function profileExpander() {
    setProfileExpanded(!profileExpanded);
  }

  const removeCard = (id, direction) => {
    const removedCard = filteredProfiles.filter(
      (profiles) => profiles.userLogin.uid === id
    );

    setRemovedCards((prev) => [...prev, ...removedCard]);

    setFilteredProfiles((current) =>
      current.filter((card) => card.userLogin.uid !== id)
    );
    const { userLogin } = removedCard[0];
    addSwiped(direction, userLogin.uid);
    if (direction == "yes") {
      matchCheck(userLogin);
    }
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
      removeProfileFromSwiped(singleRemovedCard.userLogin.uid);
    } else {
      message.error(`You didn't swipe yet!`, 2);
    }
  };

  const modalClose = () => {
    setModalIsOpen(false);
  };

  async function addSwiped(direction, uid) {
    const userDocRef = doc(dataCollection, userUid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (!docSnapshot.exists()) {
        await setDoc(userDocRef, {
          swiped: {
            [direction]: [uid],
          },
        });
      } else {
        await updateDoc(userDocRef, {
          [`swiped.${direction}`]: arrayUnion(uid),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function removeProfileFromSwiped(uid) {
    const userDocRef = doc(dataCollection, userUid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const swipedData = userData.swiped;
        for (const direction in swipedData) {
          const directionArray = swipedData[direction];
          const updatedArray = directionArray.filter(
            (profile) => profile !== uid
          );
          await updateDoc(userDocRef, {
            [`swiped.${direction}`]: updatedArray,
          });
        }
      } else {
        console.log("Document does not exist.");
      }
    } catch (error) {
      console.error("Error removing profile:", error);
    }
  }

  const matchCheck = (swipedProfile) => {
    const swipedUserProfile = allProfiles.find(
      (profile) => profile.userLogin.uid == swipedProfile.uid
    );

    if (swipedUserProfile?.swiped?.yes?.length > 0) {
      swipedUserProfile.swiped.yes.forEach((uid) => {
        if (uid == currentUserProfile.userLogin.uid) {
          setMatchedUser(swipedUserProfile);
          tierSetter(swipedUserProfile);
          setModalIsOpen(true);
        }
      });
    }
  };

  const tierSetter = (swipedProfile) => {
    const profileSwipedSorted = categorySorter(swipedProfile.categoryLikes);
    const currentUserLikesSorted = categorySorter(
      currentUserProfile.categoryLikes
    );
    let matched = 0;
    let sameInterest = [];
    for (let i = 0; i <= 5; i++) {
      if (
        currentUserLikesSorted[i][0] == profileSwipedSorted[i][0] ||
        currentUserLikesSorted[i][0] == profileSwipedSorted[i - 1][0] ||
        currentUserLikesSorted[i][0] == profileSwipedSorted[i + 1][0]
      ) {
        matched += 1;
        sameInterest.push(currentUserLikesSorted[i][0]);
      }
    }
    if (matched >= 3) {
      setTier("Silver");
    } else {
      setTier("Bronze");
    }
    setSameInterest(sameInterest);
  };

  function categorySorter(categoryObj) {
    let sortedLowTierObj = {};
    const likesArray = Object.keys(categoryObj);
    likesArray.forEach((category) => {
      sortedLowTierObj[category] = Object.keys(categoryObj[category]).length;
    });
    const sortedCalibration = Object.entries(sortedLowTierObj).sort(
      (a, b) => b[1] - a[1]
    );
    return sortedCalibration;
  }

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
          <Modal
            centered
            open={modalIsOpen}
            width={300}
            closable={true}
            footer={null}
            onCancel={modalClose}
          >
            <div className="flex flex-col justify-center gap-3 m-2">
              <h2 className="text-center">It's A {tier} Match!</h2>
              <div className="flex flex-wrap gap-2">
                <h3>You share interests in:</h3>
                {sameInterest.map((interest) => (
                  <h3 className="capitalize font-bold">{interest}</h3>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <Avatar
                  size={100}
                  src={
                    <img
                      src={currentUserProfile.profilePicture.url}
                      alt="User's profile picture"
                    />
                  }
                />
                <Avatar
                  size={100}
                  src={
                    <img
                      src={matchedUser?.profilePicture.url}
                      alt="User's profile picture"
                    />
                  }
                />
              </div>
              <Button>Message Your Match!</Button>
              <Button
                onClick={() => {
                  modalClose();
                }}
              >
                Back To Swiping
              </Button>
            </div>
          </Modal>
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
                removeCard(filteredProfiles[activeIndex].userLogin.uid, "no");
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
                removeCard(filteredProfiles[activeIndex].userLogin.uid, "yes");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
