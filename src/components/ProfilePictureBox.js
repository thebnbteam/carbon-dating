import React, { useState, useEffect } from "react";
import { Card, message, Image } from "antd";
import { ImageCarousel } from "./ImageCarousel";
import { useUserAuth } from "../context/UserAuthContext";
import { doc, getDoc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";

const { Meta } = Card;

export const ProfilePictureBox = () => {
  const { userData } = useUserAuth();
  const [activeTabKey, setActiveTabKey] = useState("main");
  const [profilePicture, setProfilePicture] = useState();

  const pickProfilePicture = async (picture) => {
    try {
      const docRef = doc(userData, "profilePicture");
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        await updateDoc(docRef, picture);
        setProfilePicture(picture);
        message.success("Profile picture has been updated", 2);
      } else {
        await setDoc(docRef, picture);
        setProfilePicture(picture);
        message.success("Profile picture has been updated", 2);
      }
    } catch (error) {
      message.error("There has been an error", 2);
    }
  };

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    if (userData) {
      const documentRef = doc(userData, "profilePicture");
      const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setProfilePicture(data);
        } else {
          console.log("No profile picture");
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [userData]);

  const tabList = [
    {
      key: "main",
      tab: "Main",
    },
    {
      key: "pictures",
      tab: "Your Pictures",
    },
  ];

  const contentList = {
    main: profilePicture ? (
      <Image src={profilePicture.url} />
    ) : (
      "Please choose a profile picture!"
    ),
    pictures: <ImageCarousel pickProfilePicture={pickProfilePicture} />,
  };

  console.log(profilePicture);

  return (
    <Card
      hoverable
      style={{
        width: 300,
      }}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      <div className="my-3">{contentList[activeTabKey]}</div>
      <Meta title="Username" description="User Info" />
    </Card>
  );
};
