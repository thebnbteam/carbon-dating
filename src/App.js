import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useUserAuth } from "./context/UserAuthContext";
import { routes } from "./routes";
import { MobileMenu, Spinner } from "./components";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firebase-config";
import { collection } from "firebase/firestore";

function App() {
  const { currentUser, setCurrentUser, authNotificationHandler, setUserData } =
    useUserAuth();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        console.log("user logged in");
        setCurrentUser({ email: user.email, uid: user.uid });
        const userCollectionRef = collection(db, user.uid);
        setUserData(userCollectionRef);
        setIsLoading(false);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
        navigate("/");
        authNotificationHandler("error", "Error", "Please Login!", true);
      }
    });
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
