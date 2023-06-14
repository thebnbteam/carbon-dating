import { LandingButtons } from "../../components";

export const MatchFound = () => {
  return (
    <>
      <div className="flex flex-col mx-9 mt-[30%] gap-8">
        <h2 className="text-center">you got a match!</h2>
        <div className="mt-6 flex flex-col gap-4">
          <LandingButtons text={"message first"} />
          <LandingButtons text={"back to swipe"} />
        </div>
      </div>
    </>
  );
};
