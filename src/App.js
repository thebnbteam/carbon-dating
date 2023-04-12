import React from "react";
import { StickyMenu } from "./components";
import {
  LandingPage,
  LoginPage,
  CalibrationLandingPage,
  CalibrationQuestionsPage,
  CalibrationIntroPage,
  CalibrationCategories,
} from "./features";
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <div className="my-0 mx-auto h-screen">
        <div className="flex justify-end sticky top-0">
          <StickyMenu />
        </div>
        <div className="mt-[10%]">
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
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
