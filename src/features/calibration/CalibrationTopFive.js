import { useState } from "react";
import { FingerPrintLogo } from "../../components";
import { categories } from "../../categoriesconstant";
import { useNavigate } from "react-router";
import { LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
import { allUserData } from "../../firebase/firebase-config";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";

export const CalibrationTopFive = () => {
  const navigate = useNavigate();
  const { userData } = useUserAuth();
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

  async function addTopFive(selection) {
    const docRef = doc(userData, "topFive");
    try {
      const docSnapshot = await getDoc(docRef);
      if (!docSnapshot.exists()) {
        await setDoc(docRef, { topFive: selection });
      } else {
        await updateDoc(docRef, { topFive: arrayUnion(selection) });
      }
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
