import { randomGuy } from "../../constants/randomprofile";
import { FaPaperPlane } from "react-icons/fa";
import { StickyShortcuts } from "../../components";

export const DMScreen = () => {
  return (
    <>
      <div className="flex flex-col items-center relative h-screen">
        <h2 className="text-center">{randomGuy.name}</h2>
        <div className="bg-white m-3 p-3 border-solid border-white rounded-md border-2 overflow-y-auto h-[50%]">
          <div></div>
        </div>
        <div className="flex justify-center my-5 fixed bottom-10 w-full">
          <input
            className="p-3 m-3 border-solid border-2 border-white rounded-lg w-[70%]"
            type="text"
            placeholder="What do you want to say?"
          />
          <FaPaperPlane className="m-3 self-center text-3xl" />
        </div>
      </div>
      <StickyShortcuts />
    </>
  );
};
