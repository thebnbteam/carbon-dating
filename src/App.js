import React, { useState } from "react";
import { StickyMenu, StickyShortcuts } from "./components";
import {
  LandingPage,
  LoginPage,
  CalibrationLandingPage,
  CalibrationQuestionsPage,
  CalibrationIntroPage,
  CalibrationCategories,
  CalibrationTopIntro,
  CalibrationTopFive,
  CalibrationDone,
  RecalibrationPage,
  ProfilePage,
  MatchesPage,
  SwipeLandingPage,
  MatchFound,
  DMScreen,
  OverallMessages,
} from "./features";
import { Routes, Route } from "react-router";
import { FingerPrintLogo } from "./components";

function App() {
  const [isAUser, setisAUser] = useState(true);

  return (
    <>
      <div className="flex justify-between sticky top-0">
        <StickyMenu />
        {isAUser && <FingerPrintLogo />}
      </div>
      <div className="mx-3">
        <div className=" my-0 mx-auto flex flex-col content-center max-w-md">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/loginpage" element={<LoginPage />} />
            <Route
              path="/calibratelandingpage"
              element={<CalibrationLandingPage />}
            />
            <Route
              path="/calibrationquestions"
              element={<CalibrationQuestionsPage />}
            />
            <Route
              path="/calibrationintro"
              element={<CalibrationIntroPage />}
            />
            <Route
              path="/calibrationcategories"
              element={<CalibrationCategories />}
            />
            <Route
              path="/calibrationtopintro"
              element={<CalibrationTopIntro />}
            />
            <Route
              path="/calibrationtopfive"
              element={<CalibrationTopFive />}
            />
            <Route path="/calibrationdone" element={<CalibrationDone />} />
            <Route path="/recalibrationpage" element={<RecalibrationPage />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/matchespage" element={<MatchesPage />} />
            <Route path="/swipelandingpage" element={<SwipeLandingPage />} />
            <Route path="/matchfound" element={<MatchFound />} />
            <Route path="/dmscreen" element={<DMScreen />} />
            <Route path="/overallmessages" element={<OverallMessages />} />
          </Routes>
          <div className="w-full relative flex justify-center">
            <StickyShortcuts />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
