import {
  ProfilePictureBox,
  ProfileTextBox,
  LandingButtons,
  StickyShortcuts,
} from "../../components";

export const ProfilePage = () => {
  return (
    <>
      <div className="flex flex-col mx-4 gap-6">
        <h2 className="text-center">profile</h2>
        <ProfilePictureBox />
        <ProfileTextBox />
        <div className="mt-10 flex flex-col gap-3">
          <LandingButtons text={"calibrate again"} />
          <LandingButtons text={"t o p 5"} />
        </div>
      </div>
      <StickyShortcuts />
    </>
  );
};

export default ProfilePage;
