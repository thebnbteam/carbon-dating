import { categories } from "../../categoriesconstant";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CalibrationTopIntro } from "./CalibrationTopIntro";
import {
  UpSquareOutlined,
  DownSquareOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { dataCollection } from "../../firebase/firebase-config";
import { RecalibrationCategory } from "./RecalibrationCategory";
import { motion, AnimatePresence } from "framer-motion";
import { foodFetcher } from "../../utilities/apiFetcher";

export const CalibrationCategories = () => {
  const { currentUser, setCategoryLikes, categoryLikes } = useUserAuth();
  const [mainCategoryIndex, setMainCategoryIndex] = useState(0);
  const [upClickState, setUpClickState] = useState(false);
  const [subCategoryIndex, setSubCategoryIndex] = useState(0);
  const [recalibrateCategory, setRecalibrateCategory] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const categoriesArray = Object.keys(categories);

  let location = useLocation();

  useEffect(() => {
    if (location.state.category) {
      let recalibrateIndex = categoriesArray.indexOf(location.state.category);
      setMainCategoryIndex(recalibrateIndex);
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
    const userDocRef = doc(dataCollection, currentUser.uid);

    try {
      const docSnapshot = await getDoc(userDocRef);

      if (!docSnapshot.exists()) {
        await setDoc(userDocRef, {
          categoryLikes: {
            [selectedCategory]: [selectedSubCategory],
          },
        });
      } else {
        await updateDoc(userDocRef, {
          [`categoryLikes.${selectedCategory}`]:
            arrayUnion(selectedSubCategory),
        });
      }
      setCategoryLikes((prev) => {
        let newObj = Object.assign({}, prev);
        if (newObj[selectedCategory] == null) {
          newObj[selectedCategory] = [];
        }
        newObj[selectedCategory].push(selectedSubCategory);
        return newObj;
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {mainCategoryIndex === categoriesArray.length - 1 ? (
        <CalibrationTopIntro />
      ) : (
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl text-center">
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
          <h2 className="text-center">{categoriesArray[mainCategoryIndex]}</h2>
          <h2 className="text-center">
            {upClickState &&
            categories[categoriesArray[mainCategoryIndex]][subCategoryIndex]
              ? categories[categoriesArray[mainCategoryIndex]][subCategoryIndex]
                  .name
              : null}
          </h2>
          <div>
            {upClickState &&
              categories[categoriesArray[mainCategoryIndex]][
                subCategoryIndex
              ] && (
                <RecalibrationCategory
                  category={categoriesArray[mainCategoryIndex]}
                  subcategory={
                    categories[categoriesArray[mainCategoryIndex]][
                      subCategoryIndex
                    ].name
                      ? categories[categoriesArray[mainCategoryIndex]][
                          subCategoryIndex
                        ].name
                      : categories[categoriesArray[mainCategoryIndex]][
                          subCategoryIndex
                        ]
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
                />
              )}
          </div>
          {upClickState && (
            <div
              className={`flex justify-around ${
                upClickState ? "mt-[400px]" : null
              }`}
            >
              <CloseCircleOutlined
                className="text-4xl mx-5"
                onClick={() => {}}
              />
              <CheckCircleOutlined
                className="text-4xl mx-5"
                onClick={() => {}}
              />
            </div>
          )}

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
