import { FingerPrintLogo } from "../../components";
import { categories } from "../../categoriesconstant";
import { useState } from "react";
import { CalibrationTopIntro } from "./CalibrationTopIntro";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  LeftSquareOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";

import { categoryLikes } from "../../firebase/firebase-config";
import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";

export const CalibrationCategories = () => {
  const { userData } = useUserAuth();
  const [mainCategoryIndex, setMainCategoryIndex] = useState(0);
  const [upClickState, setUpClickState] = useState(false);
  const [subCategoryIndex, setSubCategoryIndex] = useState(0);
  const categoriesArray = Object.keys(categories);

  function categoryExpander() {
    setUpClickState(!upClickState);
  }

  function questionSkip() {
    setUpClickState(false);
    if (mainCategoryIndex < categoriesArray.length) {
      const newIndex = mainCategoryIndex + 1;
      setMainCategoryIndex(newIndex);
      setSubCategoryIndex(0);
    }
  }

  function nextArrayIndex() {
    if (
      subCategoryIndex < categories[categoriesArray[mainCategoryIndex]].length
    ) {
      const swipingIndex = subCategoryIndex + 1;
      setSubCategoryIndex(swipingIndex);
    }

    if (
      subCategoryIndex ==
      categories[categoriesArray[mainCategoryIndex]].length - 1
    ) {
      categoryExpander();
      setMainCategoryIndex(mainCategoryIndex + 1);
      setSubCategoryIndex(0);
    }
  }

  async function addCategory() {
    const selectedCategory = categoriesArray[mainCategoryIndex];
    const selectedSubCategory =
      categories[categoriesArray[mainCategoryIndex]][subCategoryIndex];
    const docRef = doc(userData, "categoryLikes");
    try {
      const docSnapshot = await getDoc(docRef);
      if (!docSnapshot.exists()) {
        await setDoc(docRef, { [selectedCategory]: [selectedSubCategory] });
      } else {
        await updateDoc(docRef, {
          [selectedCategory]: arrayUnion(selectedSubCategory),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {mainCategoryIndex === categoriesArray.length - 1 ? (
        <CalibrationTopIntro />
      ) : (
        <div className="flex flex-col items-center gap-10">
          <FingerPrintLogo />
          <div className="flex flex-col items-center gap-5">
            <h3 className="text-2xl">
              {!upClickState ? "swipe up to expand!" : "swipe down to collapse"}
            </h3>
            {!upClickState ? (
              <UpSquareOutlined
                onClick={() => {
                  categoryExpander();
                }}
                className="text-5xl"
              />
            ) : (
              <DownSquareOutlined
                onClick={() => {
                  categoryExpander();
                }}
                className="text-5xl"
              />
            )}
            <h2>{categoriesArray[mainCategoryIndex]}</h2>
            {upClickState && (
              <>
                <div className="flex justify-between w-full">
                  <h3>boot it!</h3>
                  <h3>keep it!</h3>
                </div>
                <div className="flex justify-between w-full">
                  <LeftSquareOutlined
                    onClick={() => {
                      nextArrayIndex();
                    }}
                    className="text-3xl"
                  />
                  <RightSquareOutlined
                    onClick={() => {
                      nextArrayIndex();
                      addCategory();
                    }}
                    className="text-3xl"
                  />
                </div>
                <h2>
                  {
                    categories[categoriesArray[mainCategoryIndex]][
                      subCategoryIndex
                    ]
                  }
                </h2>
              </>
            )}
            <div className="sticky bottom-0 flex flex-col items-center gap-5">
              <h3 className="text-2xl">skip or next category</h3>
              <DownSquareOutlined
                onClick={() => {
                  questionSkip();
                }}
                className="text-5xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
