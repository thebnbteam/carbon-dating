import { ProfilePictureBox } from "../../components";
import { Button } from "antd";

export const ProfilePage = () => {
  return (
    <>
      <div className="flex flex-col mx-4 gap-6">
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
