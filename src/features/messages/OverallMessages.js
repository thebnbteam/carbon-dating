import { MatchesDisplayBox } from "../../components";
import { Input } from "antd";
import { FaRegHeart } from "react-icons/fa";
export const OverallMessages = () => {
  const lastMessage = "Hey thats hilarious!";

  return (
    <>
      <div>
        <div>
          <h2 className="text-center">Messages</h2>
          <Input size="large" placeholder="Search user" />
        </div>
        <div className="my-4">
          <h3 className="text-xl my-3 ">Activities</h3>
          <div className="flex border border-solid border-white p-2 rounded-md">
            <MatchesDisplayBox />
            <MatchesDisplayBox />
            <MatchesDisplayBox />
            <MatchesDisplayBox />
          </div>
        </div>
        <div>
          <h3 className="text-xl my-3">Messages</h3>
          <div className="flex flex-col border border-solid border-white p-1 rounded-md">
            <div className="flex">
              <div className="w-[30%]">
                <MatchesDisplayBox />
              </div>
              <div className="bg-white w-full my-1 border-white p-2 rounded-md flex justify-between">
                {lastMessage ? lastMessage : "Has not responded"}
                <FaRegHeart className="my-1 text-red" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
