import { useEffect, useState } from "react";
import { Card } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";

const { Meta } = Card;

export function RecalibrationCategory({
  category,
  subcategory,
  subcategoryId,
}) {
  const { setApiData, apiData } = useUserAuth();
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    if (subcategory) {
      if (apiFetchObj[category]) {
        try {
          apiFetchObj[category]();
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, []);

  async function imageApiCall(subcategory) {
    try {
      const response = await axios
        .get(
          `https://api.unsplash.com/search/photos/?client_id=tRm44LzaejmxcP9IcwBZsYzBWXFLTSlR9yqzPSOzs3c&query=${subcategory}`
        )
        .then((res) => setApiData(res.data.results));
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

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
    places: imageApiCall,
  };

  const categoryComponents = {
    music: (data) => (
      <ApiSwipeBox title={data.name} image={data.image[1]["#text"]} />
    ),
    movie: (data) => (
      <ApiSwipeBox
        title={data.title}
        image={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
      />
    ),
    shows: (data) => (
      <ApiSwipeBox
        title={data.name}
        image={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
      />
    ),
    games: (data) => (
      <ApiSwipeBox title={data.name} image={data.background_image} />
    ),
    food: (data) => (
      <ApiSwipeBox title={data.strMeal} image={data.strMealThumb} />
    ),
    drinks: (data) => (
      <ApiSwipeBox title={data.strDrink} image={data.strDrinkThumb} />
    ),
    places: (data) => (
      <ApiSwipeBox title={subcategory} image={data.urls.regular} />
    ),
  };

  console.log(apiData);

  return (
    <>
      <div className="flex flex-col items-center relative">
        {apiData.length > 0 && apiData
          ? apiData?.map(categoryComponents[category])
          : null}
      </div>
    </>
  );
  function ApiSwipeBox({ title, image }) {
    return (
      <motion.div
        drag={true}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        initial={{ x: 0 }}
        style={{
          position: "absolute",
        }}
      >
        <Card
          hoverable
          style={{ width: 250, height: 300 }}
          cover={<img alt="" src={image} />}
        >
          <Meta title={title} />
        </Card>
      </motion.div>
    );
  }
}
