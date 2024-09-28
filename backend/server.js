const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const CARQUERY_BASE_URL = "https://www.carqueryapi.com/api/0.3/";
const UNSPLASH_BASE_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const importantBrands = [
  "Infiniti",
  "Nissan",
  "Toyota",
  "BMW",
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Rolls Royce",
  "Jeep",
  "Mercedes-Benz",
  "Audi",
  "Bentley",
  "Aston Martin",
  "Maserati",
  "Jaguar",
  "McLaren",
  "Bugatti",
  "Chevrolet",
  "Ford",
  "Cadillac",
  "Dodge",
  "Tesla",
  "Land Rover",
  "Lexus",
  "Subaru",
  "Honda",
  "Mazda",
];

app.get("/random-cars", async (req, res) => {
  const { numCars = 10, minYear = 1980, includeImages = "false" } = req.query;
  const shouldIncludeImages = includeImages.toLowerCase() === "true";
  try {
    const year =
      Math.floor(Math.random() * (2022 - minYear + 1)) + parseInt(minYear);
    const makesResponse = await axios.get(
      `${CARQUERY_BASE_URL}?callback=?&cmd=getMakes&year=${year}`
    );
    const makesData = JSON.parse(
      makesResponse.data.replace("?(", "").replace(");", "")
    );
    const makes = makesData.Makes.filter((make) =>
      importantBrands.includes(make.make_display)
    );

    const selectedMakes = makes
      .sort(() => 0.5 - Math.random())
      .slice(0, numCars);
    const cars = [];

    for (const make of selectedMakes) {
      const trimsResponse = await axios.get(
        `${CARQUERY_BASE_URL}?callback=?&cmd=getTrims&make=${make.make_id}&year=${year}`
      );

      const trimsData = JSON.parse(
        trimsResponse.data.replace("?(", "").replace(");", "")
      );
      const trim = trimsData.Trims[0];

      if (trim) {
        const carName = `${make.make_display} ${trim.model_name}`;

        let imageUrl = "No image available";
        if (shouldIncludeImages) {
          const imageResponse = await axios.get(`${UNSPLASH_BASE_URL}`, {
            params: {
              query: `${carName}`,
              client_id: UNSPLASH_ACCESS_KEY,
              per_page: 1,
            },
          });
          imageUrl =
            imageResponse.data.results[0]?.urls?.small || "No image available";
        }

        cars.push({
          name: carName,
          image: imageUrl,
        });
      }
    }

    res.json(cars);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching car data");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
