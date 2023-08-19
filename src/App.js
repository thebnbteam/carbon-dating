import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner } from "./components";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase-config";

function App() {
  const { currentUser, getBioData, setCurrentUser } = useUserAuth();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setCurrentUser({ email: user.email, uid: user.uid });
        setIsLoading(false);
        // getBioData().then(() => {
        //   setIsLoading(false);
        // });
      } else {
        setCurrentUser(null);
        setIsLoading(false);
        navigate("/");
      }
    });
    console.log(currentUser);
    return () => unsubscribe();
  }, []);

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
