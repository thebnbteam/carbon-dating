import { categories } from "../../categoriesconstant";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CalibrationTopIntro } from "./CalibrationTopIntro";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";

import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { dataCollection } from "../../firebase/firebase-config";
import { CategoryPictures } from "./CategoryPictures";
import { motion } from "framer-motion";

export const CalibrationCategories = () => {
  const { userUid, setCategoryLikes, categoryLikes } = useUserAuth();
  const [mainCategoryIndex, setMainCategoryIndex] = useState(0);
  const [upClickState, setUpClickState] = useState(false);
  const [subCategoryIndex, setSubCategoryIndex] = useState(0);
  const [recalibrateCategory, setRecalibrateCategory] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const categoriesArray = Object.keys(categories);

  let location = useLocation();

  useEffect(() => {
    if (location?.state?.category) {
      let recalibrateIndex = categoriesArray.indexOf(location.state.category);
      setMainCategoryIndex(recalibrateIndex || 0);
    } else {
      setMainCategoryIndex(0);
    }
  }, []);

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
  function nextSubcategory() {
    const swipingIndex = subCategoryIndex + 1;
    setSubCategoryIndex(swipingIndex);
  }

  function nextArrayIndex() {
    if (
      subCategoryIndex < categories[categoriesArray[mainCategoryIndex]].length
    ) {
      nextSubcategory();
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

  async function addCategory(categoryData) {
    const selectedCategory = categoriesArray[mainCategoryIndex];
    const selectedSubCategory =
      categories[categoriesArray[mainCategoryIndex]][subCategoryIndex].name;
    const userDocRef = doc(dataCollection, userUid);

    try {
      const docSnapshot = await getDoc(userDocRef);

      if (!docSnapshot.exists()) {
        await setDoc(userDocRef, {
          categoryLikes: {
            [selectedCategory]: { [selectedSubCategory]: [categoryData] },
          },
        });
      } else {
        const updatedCategoryLikes = {};
        updatedCategoryLikes[
          `categoryLikes.${selectedCategory}.${selectedSubCategory}`
        ] = arrayUnion(categoryData);

        await updateDoc(userDocRef, updatedCategoryLikes);
      }
      setCategoryLikes((prev) => {
        const newObj = { ...prev };
        if (!newObj[selectedCategory]) {
          newObj[selectedCategory] = {};
        }
        if (!newObj[selectedCategory][selectedSubCategory]) {
          newObj[selectedCategory][selectedSubCategory] = [];
        }
        newObj[selectedCategory][selectedSubCategory].push(categoryData);
        return newObj;
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {mainCategoryIndex === categoriesArray.length ? (
        <CalibrationTopIntro />
      ) : (
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl text-center">
            {!upClickState ? "swipe up to expand!" : "swipe down to collapse"}
          </h3>
          <div className="flex justify-center">
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
          </div>
          <h2 className="text-center">{categoriesArray[mainCategoryIndex]}</h2>
          {upClickState && (
            <motion.div
              className="jello-horizontal"
              animate={{
                scale: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
              }}
              initial={{ scale: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h3 className="text-center">Swipe More For Better Match!</h3>
            </motion.div>
          )}
          {upClickState && (
            <>
              <h2 className="text-center">
                {
                  categories[categoriesArray[mainCategoryIndex]][
                    subCategoryIndex
                  ]?.name
                }
              </h2>
              <div className="flex flex-col items-center">
                <RightSquareOutlined
                  className="text-4xl"
                  onClick={() => {
                    nextArrayIndex();
                  }}
                />
                <h3 className="text-center">Press to go to next topic</h3>
              </div>
            </>
          )}
          <div>
            {upClickState &&
              categories[categoriesArray[mainCategoryIndex]][
                subCategoryIndex
              ] && (
                <CategoryPictures
                  category={categoriesArray[mainCategoryIndex]}
                  subcategory={
                    categories[categoriesArray[mainCategoryIndex]][
                      subCategoryIndex
                    ]?.name
                  }
                  subcategoryId={
                    categories[categoriesArray[mainCategoryIndex]][
                      subCategoryIndex
                    ].id
                      ? categories[categoriesArray[mainCategoryIndex]][
                          subCategoryIndex
                        ].id
                      : categories[categoriesArray[mainCategoryIndex]][
                          subCategoryIndex
                        ]
                  }
                  upClickState={upClickState}
                  nextSubcategory={nextSubcategory}
                  addCategory={addCategory}
                />
              )}
          </div>

          <div className="flex flex-col items-center gap-5">
            <h3 className="text-2xl">skip or next category</h3>
            <DownSquareOutlined
              onClick={() => {
                questionSkip();
              }}
              className="text-5xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
