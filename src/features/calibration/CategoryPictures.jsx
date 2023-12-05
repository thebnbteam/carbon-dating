import { useEffect, useState } from "react";
import { Card, Image } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import { Spinner } from "../../components";
import { click } from "@testing-library/user-event/dist/click";

const { Meta } = Card;

export function CategoryPictures({
  category,
  subcategory,
  subcategoryId,
  upClickState,
  nextSubcategory,
  addCategory,
}) {
  const { setApiData, apiData, setLeaveX } = useUserAuth();
  const [dataArray, setDataArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [titleAndImage, setTitleAndImage] = useState({ title: "", image: "" });
  const [removedCards, setRemovedCards] = useState([]);

  const otherArray = ["places", "animals", "sports", "hobbies"];

  const activeIndex = apiData.length - 1;

  useEffect(() => {
    if (subcategory) {
      if (otherArray.includes(category)) {
        try {
          apiFetchObj.other();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          apiFetchObj[category]();
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, [subcategory]);

  const removeCard = (index) => {
    const removedCard = apiData[index];
    setRemovedCards((prev) => [...prev, removedCard]);
    setApiData((curr) => curr.filter((_, i) => i !== index));
  };

  const apiFetchObj = {
    music: async () => {
      const result = await axios
        .get(
          `https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${subcategory}&limit=20&api_key=46a018726a8b842337a5421352d20f41&format=json`
        )
        .then((res) => {
          setApiData(res.data.topartists.artist);
        });
      return result;
    },
    movie: async () => {
      const result = await axios
        .get(
          `https://api.themoviedb.org/3/discover/movie?api_key=55d23946c5ee83b77117e381870bede8&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${subcategoryId}`
        )
        .then((res) => {
          setApiData(res.data.results);
        });
    },
    shows: async () => {
      const result = await axios
        .get(
          `https://api.themoviedb.org/3/discover/tv?api_key=55d23946c5ee83b77117e381870bede8&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${subcategoryId}`
        )
        .then((res) => {
          setApiData(res.data.results);
        });
    },
    games: async () => {
      const result = await axios
        .get(
          `https://api.rawg.io/api/games?genres=${subcategoryId}&key=31cf81a745d74c7ba00c7133434ebb27&page_size=10`
        )
        .then((res) => {
          setApiData(res.data.results);
        });
    },
    food: async () => {
      const result = await axios
        .get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${subcategory}`
        )
        .then((res) => {
          setApiData(res.data.meals);
        });
      return result;
    },
    drinks: async () => {
      const result = await axios
        .get(
          `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${subcategory}`
        )
        .then((res) => {
          setApiData(res.data.drinks);
        });

      return result;
    },
    other: async () => {
      const response = await axios
        .get(
          `https://api.unsplash.com/search/photos/?client_id=tRm44LzaejmxcP9IcwBZsYzBWXFLTSlR9yqzPSOzs3c&query=${subcategory}`
        )
        .then((res) => {
          console.log(res);
          setApiData(res.data.results);
        });
      return response;
    },
  };

  const categoryComponents = {
    music: (data, index) => (
      <ApiSwipeBox
        key={`main-${index}`}
        title={data?.name}
        image={data?.image[1]["#text"]}
        index={index}
        activeIndex={activeIndex}
        setTitleAndImage={setTitleAndImage}
        removeCard={removeCard}
        addCategory={addCategory}
      />
    ),
    movie: (data, index) => (
      <ApiSwipeBox
        key={`main-${index}`}
        title={data.title}
        index={index}
        activeIndex={activeIndex}
        setTitleAndImage={setTitleAndImage}
        removeCard={removeCard}
        addCategory={addCategory}
        image={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
      />
    ),
    shows: (data, index) => (
      <ApiSwipeBox
        key={`main-${index}`}
        title={data.name}
        index={index}
        activeIndex={activeIndex}
        setTitleAndImage={setTitleAndImage}
        removeCard={removeCard}
        addCategory={addCategory}
        image={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
      />
    ),
    games: (data, index) => (
      <ApiSwipeBox
        key={`main-${index}`}
        title={data.name}
        image={data.background_image}
        index={index}
        activeIndex={activeIndex}
        removeCard={removeCard}
        addCategory={addCategory}
        setTitleAndImage={setTitleAndImage}
      />
    ),
    food: (data, index) => (
      <ApiSwipeBox
        key={`main-${index}`}
        title={data.strMeal}
        image={data.strMealThumb}
        index={index}
        activeIndex={activeIndex}
        removeCard={removeCard}
        addCategory={addCategory}
        setTitleAndImage={setTitleAndImage}
      />
    ),
    drinks: (data, index) => (
      <ApiSwipeBox
        key={`main-${index}`}
        title={data.strDrink}
        image={data.strDrinkThumb}
        index={index}
        activeIndex={activeIndex}
        removeCard={removeCard}
        addCategory={addCategory}
        setTitleAndImage={setTitleAndImage}
      />
    ),
    other: (data, index) => (
      <ApiSwipeBox
        key={`main-${index}`}
        title={subcategory}
        image={data?.urls?.small}
        index={index}
        activeIndex={activeIndex}
        removeCard={removeCard}
        addCategory={addCategory}
        setTitleAndImage={setTitleAndImage}
      />
    ),
  };

  return (
    <>
      <div className="flex flex-col items-center relative">
        <AnimatePresence onExitComplete={() => setLeaveX(0)}>
          {apiData.length > 0 && !otherArray.includes(category)
            ? apiData.map(categoryComponents[category])
            : null}
          {otherArray.includes(category) && apiData.length > 0
            ? apiData.map(categoryComponents["other"])
            : null}
        </AnimatePresence>
      </div>
      {upClickState && (
        <div
          className={`flex justify-around ${
            upClickState ? "mt-[350px]" : null
          }`}
        >
          <CloseCircleOutlined
            className="text-4xl mx-5"
            onClick={() => {
              setLeaveX(-1000);
              removeCard(activeIndex);
              if (activeIndex === 0) {
                nextSubcategory();
              }
            }}
          />
          <CheckCircleOutlined
            className="text-4xl mx-5"
            onClick={() => {
              setLeaveX(1000);
              removeCard(activeIndex);
              addCategory(titleAndImage);
              if (activeIndex === 0) {
                nextSubcategory();
              }
            }}
          />
        </div>
      )}
    </>
  );
}

export function ApiSwipeBox({
  title,
  image,
  index,
  activeIndex,
  setTitleAndImage,
  removeCard,
  addCategory,
}) {
  const { leaveX, setLeaveX } = useUserAuth();

  useEffect(() => {
    if (activeIndex === index) {
      setTitleAndImage({ title, image });
    }
  }, [activeIndex, index, title, image]);

  if (activeIndex === index) {
    return (
      <motion.div
        key={`main-card-${index}`}
        drag={true}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        initial={{ x: 0 }}
        style={{
          position: "absolute",
        }}
        onDragEnd={(event, info) => {
          if (info.delta.x === 0) {
            setLeaveX(0);
          }

          if (info.offset.x > 200) {
            setLeaveX(1000);
            addCategory({ title: title, image: image });
          }

          if (info.offset.x < -200) {
            setLeaveX(-1000);
          }
          removeCard(activeIndex);
        }}
        onDrag={(event, info) => {
          setLeaveX(info.offset.x);
        }}
        exit={{
          x: leaveX > 200 ? 1000 : -1000,
          opacity: 0,
          scale: 0.5,
          transition: { duration: 0.5 },
          rotate: 300,
        }}
        animate={{
          scale: 1.05,
        }}
      >
        <Card
          hoverable
          style={{
            width: 200,
            margin: 10,
          }}
          cover={
            <Image
              height={200}
              width={200}
              src={image}
              alt={`${title} picture`}
            />
          }
        >
          <Meta title={title} />
        </Card>
      </motion.div>
    );
  } else {
    return (
      <div className="absolute rotate-[20deg]">
        <Card
          hoverable
          style={{
            width: 200,
            margin: 10,
          }}
          cover={
            <Image
              height={200}
              width={200}
              src={image}
              alt={`${title} picture`}
            />
          }
        >
          <Meta title={title} />
        </Card>
      </div>
    );
  }
}
