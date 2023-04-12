import { FingerPrintLogo } from "../../components";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { categories } from "../../categoriesconstant";
import { useState } from "react";

export const CalibrationCategories = () => {
  const [calibrationIndex, setCalibrationIndex] = useState(0);
  const [upClickState, setUpClickState] = useState(false);

  function categoryChanger() {
    setUpClickState(true);
  }

  function questionSkip() {
    setUpClickState(false);
    if (calibrationIndex < categories.length) {
      const newIndex = calibrationIndex + 1;
      setCalibrationIndex(newIndex);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <FingerPrintLogo />
        <div className="flex flex-col items-center gap-5">
          <h3 className="text-2xl">swipe up to expand!</h3>
          <FaAngleDoubleUp
            onClick={() => {
              categoryChanger();
            }}
            className="text-5xl"
          />
          <h2>{Object.keys(categories[calibrationIndex])}</h2>
          {upClickState ? (
            <>
              <div className="flex justify-between w-full">
                <h3>boot it!</h3>
                <h3>keep it!</h3>
              </div>
              <div className="flex justify-between w-full">
                <FaAngleDoubleLeft className="text-3xl" />
                <FaAngleDoubleRight className="text-3xl" />
              </div>
            </>
          ) : (
            <div></div>
          )}
          <div className="sticky bottom-0 flex flex-col items-center gap-5">
            <h3 className="text-2xl">skip or next category</h3>
            <FaAngleDoubleDown
              onClick={() => {
                questionSkip();
              }}
              className="text-5xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};
