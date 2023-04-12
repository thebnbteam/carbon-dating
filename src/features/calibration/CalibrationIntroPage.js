import React, { useState } from "react";
import { FingerPrintLogo } from "../../components";
import { FaAngleDoubleDown } from "react-icons/fa";
import { Link } from "react-router-dom";

export const CalibrationIntroPage = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const introQuote = [
    "almost there!",
    "we just need to know",
    "a bit more about you!",
    "and explore our app!",
  ];

  const slideClick = () => {
    if (slideIndex < 3) {
      const newIndex = slideIndex + 1;
      setSlideIndex(newIndex);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-10 h-screen">
        <FingerPrintLogo />
        <h3 className="text-center text-4xl mx-10 mb-20">
          {introQuote[slideIndex]}
        </h3>
        {slideIndex < 3 ? (
          <FaAngleDoubleDown
            onClick={() => {
              slideClick();
            }}
            className="text-5xl"
          />
        ) : (
          <Link to="/calibrationcategories">
            <FaAngleDoubleDown className="text-5xl" />
          </Link>
        )}
      </div>
    </>
  );
};
