import axios from "axios";

const URL_PREFIX = process.env.REACT_APP_API_URL;

export const getRandomCars = async (numCars, minYear, includeImages) => {
  const response = await axios.get(
    `${URL_PREFIX}/random-cars?numCars=${numCars}&minYear=${minYear}&includeImages=${includeImages}`
  );
  return response.data;
};
