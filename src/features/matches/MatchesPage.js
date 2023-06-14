import { StickyShortcuts, MatchesDisplayBox } from "../../components";
export const MatchesPage = () => {
  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-center">matches</h2>
        <div className="flex flex-wrap justify-center">
          <MatchesDisplayBox />
          <MatchesDisplayBox />
          <MatchesDisplayBox />
        </div>
      </div>
      <StickyShortcuts />
    </>
  );
};
