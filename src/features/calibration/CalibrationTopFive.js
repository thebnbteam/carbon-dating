import { useState } from "react";
import { FingerPrintLogo } from "../../components";
import { categories } from "../../categoriesconstant";
import { useNavigate } from "react-router";
import { LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";

export const CalibrationTopFive = () => {
  const navigate = useNavigate();
  const [topFiveIndex, setTopFiveIndex] = useState(0);
  const [topFiveState, setTopFiveState] = useState(false);
  const categoriesArray = Object.keys(categories);

  function nextTopFive() {
    if (topFiveIndex < categoriesArray.length) {
      let newIndex = topFiveIndex + 2;
      setTopFiveIndex(newIndex);
    }
    if (topFiveIndex == categoriesArray.length - 2) {
      navigate("/calibrationdone");
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
          <h2>{categoriesArray[topFiveIndex]}</h2>
          <div className="w-full flex justify-center">
            <RightSquareOutlined
              onClick={() => nextTopFive()}
              className="text-5xl"
            />
          </div>
        </div>

        <h2>swipe!</h2>

        <div
          className="flex flex-col p-5 items-center border-2 rounded-lg
border-solid border-white	"
        >
          <h2>{categoriesArray[topFiveIndex + 1]}</h2>
          <div className="w-full flex justify-center">
            <LeftSquareOutlined
              onClick={() => nextTopFive()}
              className="text-5xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CalibrationTopFive;
