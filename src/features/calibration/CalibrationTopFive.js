import { useState } from "react";
import { FingerPrintLogo } from "../../components";
import { categories } from "../../categoriesconstant";
import { useNavigate } from "react-router";
import { LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { dataCollection } from "../../firebase/firebase-config";

export const CalibrationTopFive = () => {
  const navigate = useNavigate();
  const { userUid, setTopFive, topFive } = useUserAuth();
  const [topFiveIndex, setTopFiveIndex] = useState(0);
  const categoriesArray = Object.keys(categories);
  let firstTopFive = categoriesArray[topFiveIndex];
  let secondTopFive = categoriesArray[topFiveIndex + 1];

  function nextTopFive() {
    if (topFiveIndex < categoriesArray.length) {
      let newIndex = topFiveIndex + 2;
      setTopFiveIndex(newIndex);
    }
    if (topFiveIndex == categoriesArray.length - 2) {
      navigate("/calibrationdone");
    }
  }

  async function getTopFive() {
    const userDocRef = doc(dataCollection, userUid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const topFive = docSnapshot.data().topFive;
        setTopFive(topFive);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function addTopFive(selection) {
    const userDocRef = doc(dataCollection, userUid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (!docSnapshot.exists()) {
        await setDoc(userDocRef, { topFive: selection });
      } else {
        await updateDoc(userDocRef, { topFive: arrayUnion(selection) });
      }
      getTopFive();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <FingerPrintLogo />
        <div
          className="flex flex-col p-5 items-center border-2 rounded-lg
 border-solid	border-white"
        >
          <h2>{firstTopFive}</h2>
          <div className="w-full flex justify-center">
            <RightSquareOutlined
              onClick={() => {
                nextTopFive();
                addTopFive(firstTopFive);
              }}
              className="text-5xl"
            />
          </div>
        </div>

        <h2>swipe!</h2>

        <div
          className="flex flex-col p-5 items-center border-2 rounded-lg
border-solid border-white	"
        >
          <h2>{secondTopFive}</h2>
          <div className="w-full flex justify-center">
            <LeftSquareOutlined
              onClick={() => {
                nextTopFive();
                addTopFive(secondTopFive);
              }}
              className="text-5xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CalibrationTopFive;
