import { FingerPrintLogo } from "../components";
import { Link } from "react-router-dom";
import { Button, Alert } from "antd";
import { useUserAuth } from "../context/UserAuthContext";

export const LandingPage = () => {
  const { authNotifications, closeNotification } = useUserAuth();

  return (
    <div className="flex flex-col items-center gap-4 my-[20%]">
      {authNotifications.type && (
        <Alert
          onClose={() => {
            closeNotification();
          }}
          type={authNotifications.type}
          message={authNotifications.message}
          description={authNotifications.description}
          showIcon
          closable
          style={{
            margin: 10,
          }}
        />
      )}
      <h2 className="text-center">carbon</h2>
      <h2 className="text-center">dating</h2>
      <FingerPrintLogo />

      <div className="flex flex-col items-center gap-4">
        <Link to="/loginpage">
          <Button type="default" size="large">
            l o g i n
          </Button>
        </Link>
        <Link to="/signuppage">
          <Button type="default" size="large">
            make account
          </Button>
        </Link>
      </div>
    </div>
  );
};
