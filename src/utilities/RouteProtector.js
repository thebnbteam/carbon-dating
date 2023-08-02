import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const RouteProtector = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    navigate("/");
  }

  return children;
};

export default RouteProtector;
