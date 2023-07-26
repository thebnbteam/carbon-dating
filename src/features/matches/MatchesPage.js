import { MatchesDisplayBox } from "../../components";

export const MatchesPage = () => {
  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-center">matches</h2>
        <div className="flex flex-wrap justify-center">
          {/* Map function with all the matches from Firebase */}
          <MatchesDisplayBox size={150} />
          <MatchesDisplayBox size={150} />
          <MatchesDisplayBox size={150} />
          <MatchesDisplayBox size={150} />
          <MatchesDisplayBox size={150} />
          <MatchesDisplayBox size={150} />
          <MatchesDisplayBox size={150} />
        </div>
      </div>
    </>
  );
};
