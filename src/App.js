import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner } from "./components";

function App() {
  const { currentUser, userInfo, categoryLikes } = useUserAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      if (userInfo && categoryLikes) {
        navigate("/profilepage");
      } else if (!categoryLikes && userInfo) {
        navigate("/calibrationintro");
      } else {
        navigate("/calibratelandingpage");
      }
    } else {
      navigate("/");
    }
    setIsLoading(false);
  }, [currentUser, userInfo, categoryLikes]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md m-2">
        {currentUser && (
          <div className="flex justify-end">
            <MobileMenu />
          </div>
        )}
        <Routes>
          {routes.map(({ element, path }, key) => (
            <Route path={path} element={element} key={key} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;
