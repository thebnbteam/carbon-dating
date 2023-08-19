import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useUserAuth } from "../context/UserAuthContext";

export const PageNotFound = () => {
  const { currentUser } = useUserAuth();

  return (
    <>
      <div className="mt-6 flex flex-col justify-center items-center gap-3">
        <h2>Hey!</h2>
        <p>
          {currentUser ? "The page does not exist!" : "You are not logged in!"}
        </p>
        <Link to={currentUser ? "/profilepage" : "/"}>
          <Button type="default" size="large">
            {currentUser ? "Back To Profile" : "Back to Login"}
          </Button>
        </Link>
      </div>
    </>
  );
};
