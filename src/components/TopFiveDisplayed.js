import { topFiveArray } from "../constants/topfiveconstant";

export const TopFiveDisplayed = () => {
  return (
    <>
      <p className="p-3 border-solid border-2 rounded-full">
        Top 5: {topFiveArray.join(" ")}
      </p>
    </>
  );
};
