import { categories } from "../../categoriesconstant";
import { Button } from "antd";

export const RecalibrationPage = () => {
  const categoriesArray = Object.keys(categories);
  return (
    <>
      <div className="flex flex-col h-screen">
        <h2 className="text-center">categories</h2>
        <div className="my-[20%] flex flex-wrap w-full justify-center">
          {categoriesArray.map((categories) => {
            return (
              <Button className="w-1/3 border border-solid m-1 rounded-md">
                {categories}
              </Button>
            );
          })}
        </div>
        <div className="flex justify-center">
          <Button size="large">Back To Profile</Button>
        </div>
      </div>
    </>
  );
};

export default RecalibrationPage;
