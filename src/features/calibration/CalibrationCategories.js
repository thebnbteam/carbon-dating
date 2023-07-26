import { FingerPrintLogo } from "../../components";
import { categories } from "../../categoriesconstant";
import { useState } from "react";
import { CalibrationTopIntro } from "./CalibrationTopIntro";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  LeftSquareOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";

export const CalibrationCategories = () => {
  const [calibrationIndex, setCalibrationIndex] = useState(0);
  const [upClickState, setUpClickState] = useState(false);
  const [swipeArray, setSwipeArray] = useState(0);
  const categoriesArray = Object.keys(categories);

  function categoryExpander() {
    setUpClickState(!upClickState);
  }

  function questionSkip() {
    setUpClickState(false);
    if (calibrationIndex < categoriesArray.length) {
      const newIndex = calibrationIndex + 1;
      setCalibrationIndex(newIndex);
    }
  }

  function nextArrayIndex() {
    if (swipeArray < categories[categoriesArray[calibrationIndex]].length) {
      const swipingIndex = swipeArray + 1;
      setSwipeArray(swipingIndex);
    }

    if (
      swipeArray ==
      categories[categoriesArray[calibrationIndex]].length - 1
    ) {
      categoryExpander();
      setCalibrationIndex(calibrationIndex + 1);
      setSwipeArray(0);
    }
  }

  return (
    <>
      {calibrationIndex === categoriesArray.length - 1 ? (
        <CalibrationTopIntro />
      ) : (
        <div className="flex flex-col items-center gap-10">
          <FingerPrintLogo />
          <div className="flex flex-col items-center gap-5">
            <h3 className="text-2xl">
              {!upClickState ? "swipe up to expand!" : "swipe down to collapse"}
            </h3>
            {!upClickState ? (
              <UpSquareOutlined
                onClick={() => {
                  categoryExpander();
                }}
                className="text-5xl"
              />
            ) : (
              <DownSquareOutlined
                onClick={() => {
                  categoryExpander();
                }}
                className="text-5xl"
              />
            )}
            <h2>{categoriesArray[calibrationIndex]}</h2>
            {upClickState && (
              <>
                <div className="flex justify-between w-full">
                  <h3>boot it!</h3>
                  <h3>keep it!</h3>
                </div>
                <div className="flex justify-between w-full">
                  <LeftSquareOutlined
                    onClick={() => {
                      nextArrayIndex();
                    }}
                    className="text-3xl"
                  />
                  <RightSquareOutlined
                    onClick={() => {
                      nextArrayIndex();
                    }}
                    className="text-3xl"
                  />
                </div>
                <h2>
                  {categories[categoriesArray[calibrationIndex]][swipeArray]}
                </h2>
              </>
            )}
            <div className="sticky bottom-0 flex flex-col items-center gap-5">
              <h3 className="text-2xl">skip or next category</h3>
              <DownSquareOutlined
                onClick={() => {
                  questionSkip();
                }}
                className="text-5xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
