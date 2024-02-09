import React, { useEffect } from "react";
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
  SwipeLandingPage,
  DMScreen,
  OverallMessages,
  SignUpPage,
  PageNotFound,
  TierListPage,
} from "./features";

export const routes = [
  {
    element: <LandingPage />,
    path: "/",
  },
  {
    element: <LoginPage />,
    path: "/loginpage",
  },
  {
    element: <SignUpPage />,
    path: "/signuppage",
  },
  {
    element: <CalibrationLandingPage />,
    path: "/calibratelandingpage",
  },
  {
    element: <CalibrationQuestionsPage />,
    path: "/calibrationquestions",
  },
  {
    element: <CalibrationIntroPage />,
    path: "/calibrationintro",
  },
  {
    element: <CalibrationCategories />,
    path: "/calibrationcategories",
  },
  {
    element: <CalibrationTopIntro />,
    path: "/calibrationtopintro",
  },
  {
    element: <CalibrationTopFive />,
    path: "/calibrationtopfive",
  },
  {
    element: <CalibrationDone />,
    path: "/calibrationdone",
  },
  {
    element: <RecalibrationPage />,
    path: "/recalibrationpage",
  },
  {
    element: <ProfilePage />,
    path: "/profilepage",
  },
  {
    element: <SwipeLandingPage />,
    path: "/swipelandingpage",
  },
  {
    element: <DMScreen />,
    path: "/dmscreen",
  },
  {
    element: <TierListPage />,
    path: "/tierlistpage",
  },
  {
    element: <OverallMessages />,
    path: "/overallmessages",
  },
  {
    element: <PageNotFound />,
    path: "*",
  },
];
