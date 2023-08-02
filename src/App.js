import React, { useState } from "react";
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
  SignUpPage,
} from "./features";
import { Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { notification } from "antd";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import RouteProtector from "./utilities/RouteProtector";

function App() {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, err) => {
    api[type]({
      message:
        type == "success" ? "Success!" : `There has been an error: ${err}`,
    });
  };

  return (
    <div className=" my-0 mx-auto flex flex-col content-center max-w-md">
      {contextHolder}
      <Provider store={store}>
        <UserAuthContextProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/loginpage"
              element={
                <LoginPage openNotification={openNotificationWithIcon} />
              }
            />
            <Route
              path="/signuppage"
              element={
                <SignUpPage openNotification={openNotificationWithIcon} />
              }
            />
            <Route
              path="/calibratelandingpage"
              element={
                <RouteProtector>
                  <CalibrationLandingPage />
                </RouteProtector>
              }
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
        </UserAuthContextProvider>
      </Provider>
      {/* <div className="w-full relative flex justify-center">
            <StickyShortcuts />
          </div> */}
    </div>
  );
}

export default App;
