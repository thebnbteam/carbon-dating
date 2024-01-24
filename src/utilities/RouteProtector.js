import React from "react";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
const RouteProtector = ({ children }) => {
  const navigate = useNavigate();
  const { userUid } = useUserAuth();

  if (!userUid) {
    navigate("/");
  }

  return children;
};

export default RouteProtector;
