import { StickyShortcuts, LandingButtons } from "../../components";
import { categories } from "../../categoriesconstant";

export const RecalibrationPage = () => {
  const categoriesArray = Object.keys(categories);
  return (
    <>
      <div className="flex flex-col h-screen">
        <h2 className="text-center">categories</h2>
        <div className="my-[20%] flex flex-wrap w-full justify-center">
          {categoriesArray.map((categories) => {
            return (
              <button className="w-1/3 border border-solid border-white p-2 m-1 rounded-md">
                {categories}
              </button>
            );
          })}
        </div>
        <div className="flex justify-center">
          <LandingButtons text={"back to profile"} />
        </div>
        <StickyShortcuts />
      </div>
    </>
  );
};

export default RecalibrationPage;
