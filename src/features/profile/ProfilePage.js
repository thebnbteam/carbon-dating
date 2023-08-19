import { ProfilePictureBox } from "../../components";
import { Button, Alert } from "antd";
import { useUserAuth } from "../../context/UserAuthContext";

export const ProfilePage = () => {
  const { authNotifications, closeNotification } = useUserAuth();

  return (
    <>
      <div className="flex flex-col mx-4 gap-6">
        {authNotifications.type && (
          <Alert
            afterClose={() => {
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
        <h2 className="text-center">profile</h2>
        <div className="flex justify-center">
          <ProfilePictureBox />
        </div>
        <div className="mt-10 flex flex-col gap-3">
          <Button size="large">Calibrate Again</Button>
          <Button size="large">Top 5</Button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
