import { Button } from "antd";
import { Link } from "react-router-dom";

export const MatchFound = () => {
  return (
    <>
      <div className="flex flex-col mx-9 mt-[30%] gap-8">
        <h2 className="text-center">you got a match!</h2>
        <div className="mt-6 flex flex-col gap-4 items-center">
          <Link to={"/dmscreen"}>
            <Button size="large">message first!</Button>
          </Link>
          <Link to={"/swipelandingpage"}>
            <Button size="large">back to swipe!</Button>
          </Link>
        </div>
      </div>
    </>
  );
};
