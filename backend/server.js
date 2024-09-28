const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const cars = [
  {
    name: "Infiniti G35",
    image:
      "https://preview.redd.it/the-hardest-temptation-of-a-g35-is-keeping-the-stock-clean-v0-3sgg7r6opl4b1.jpg?width=1080&crop=smart&auto=webp&s=b263c465784742356c239acc3eee7e0aa44c6233",
  },
  {
    name: "Mercedes-Benz C350",
    image:
      "https://www.motortrend.com/uploads/sites/11/2012/01/2012-mercedes-benz-front-left-view1.jpg",
  },
  {
    name: "BMW M2",
    image:
      "https://cdn.jdpower.com/JDP_2023%20BMW%20M2%20Blue%20Front%20Quarter%20View.jpg",
  },
  {
    name: "BMW M3",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/2025-bmw-m3-110-66562ddceaf59.jpg?crop=0.752xw:0.501xh;0.105xw,0.331xh&resize=1200:*",
  },
  {
    name: "Toyota Supra",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxrqLPeOlGY5Ezx_xkUTLkTmPSsEVSShRMJg&s",
  },
  {
    name: "Nissan GTR",
    image:
      "https://www.goodcarbadcar.net/wp-content/uploads/2011/01/Nissan-GT-R-scaled.jpeg",
  },
  {
    name: "Toyota RAV4",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5KFkIOHWO-_u8DFUZsutBRUCzJmHdg1xkA&s",
  },
  {
    name: "Ford Mustang",
    image:
      "https://www.autotrader.ca/editorial/media/zizh5pca/mustang-gtd-on-track-4.jpg?width=972&height=546&v=1d9d1dbefdfb9c0",
  },
  {
    name: "Chevrolet Camaro",
    image:
      "https://www.thespeedjournal.com/wp-content/uploads/Chevrolet/Camero-ZL1/chevrolet-camero-zl1-1.jpg",
  },
  {
    name: "Chevrolet Corvette",
    image:
      "https://www.motortrend.com/uploads/2022/10/2023-Chevrolet-Corvette-70th-Anniversary-Edition-ldr.jpg",
  },
  {
    name: "Tesla Model 3",
    image:
      "https://v2charge.com/wp-content/uploads/2024/04/tesla-model-3-performance-valencia.jpg",
  },
  {
    name: "Lamborghini Aventador",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv8F362_aZjP7UevA0DMXIuta0Z1BzXxVH6g&s",
  },
  {
    name: "Lamborghini Huracan",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV_hUNJ5FuVoGDnRf2oMlWbv7exBlaysduTA&s",
  },
  {
    name: "Ferrari 488",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0KELV_9iam9YjNje8AeZ9ycmRLPk5hu6piw&s",
  },
  {
    name: "Ferrari F8",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz0O4kDNQR48XQXwNTQKJbByVpprzAS_maew&s",
  },
  {
    name: "Rolls Royce Phantom",
    image:
      "https://www.rolls-roycemotorcars.com/content/dam/rrmc/marketUK/rollsroycemotorcars_com/phantom-series-ii-in-detail/page-properties/01_RR_PHANTOM-single-twin-card-min.jpg",
  },
  {
    name: "Rolls Royce Ghost",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrGIKk6BO_KMnMqy7RE79e_qqpr0MYSUgnkg&s",
  },
  {
    name: "Audi R8",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQwbygXmxVC3oii1HqQ5nh-1sk8FjsbTLlHQ&s",
  },
  {
    name: "Audi Q7",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEZ7isqBEhAs-VMxW-NIDzdiw5F_Ey2f79yw&s",
  },
  {
    name: "Bentley Continental GT",
    image:
      "https://www.bentleymotors.com/content/dam/bm/websites/bmcom/bentleymotors-com/models/25my/25my-gt-testing/Dynamic%20Stage%20Main%20v2.jpg/_jcr_content/renditions/original.image_file.1120.480.file/Dynamic%20Stage%20Main%20v2.jpg",
  },
  {
    name: "Aston Martin DB11",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ZVHuNgJ7TuL0m9fiL7Ta61ethsDWXQ_OWg&s",
  },
  {
    name: "Maserati Ghibli",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/2018_Maserati_Ghibli_GranLusso_Diesel_3.0_facelift_Front.jpg",
  },
  {
    name: "Jaguar F-Type",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcm3zu4_fRedP0rGOCYTUe8d_B1ajQqa9yig&s",
  },
  {
    name: "McLaren 720S",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxcmwcqyr62M5WUq6UlXj3AkbPiz-ogAPx6g&s",
  },
  {
    name: "Bugatti Chiron",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtH4NgyTj_M7N2WuF__JYMUo9nRWMSbM4Y2Q&s",
  },
  {
    name: "Land Rover Range Rover",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtp5dChtNGBBJHUsVXJikDGPyZqDuCRW6HlA&s",
  },
  {
    name: "Honda Civic",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgflGAsZRHGSUb26U7g2Oha1QFqFVTobSVSQ&s",
  },
  {
    name: "Honda Accord",
    image:
      "https://cdn.prod.website-files.com/62f50791f9b93f9c60c6b70a/6560c3487dee9697974d14de_Honda_Accord_(CV3)_EX_eHEV%2C_2021%2C_front.jpg",
  },
  {
    name: "Subaru WRX",
    image:
      "https://www.motortrend.com/uploads/sites/5/2017/12/2018-Subaru-WRX-STI-front-side-view-from-above.jpg?w=768&width=768&q=75&format=webp",
  },
  {
    name: "Subaru BRZ",
    image:
      "https://cdn.jdpower.com/JDP_2024%20Subaru%20BRZ%20tS%20White%20Front%20Quarter%20View.jpg",
  },
  {
    name: "Mazda MX-5",
    image:
      "https://www.topgear.com/sites/default/files/2024/04/1-Mazda-MX-5-review-2024.jpg",
  },
  {
    name: "Nissan 370Z",
    image:
      "https://redriven.com/wp-content/uploads/2022/11/Nissan-370Z-1-scaled.jpg",
  },
  {
    name: "Jeep Wrangler",
    image:
      "https://images.cars.com/cldstatic/wp-content/uploads/jeep-wrangler-willys-4xe-2023-exterior-oem-02.jpg",
  },
  {
    name: "Ford F-150",
    image:
      "https://www.ford.ca/cmslibs/content/dam/vdm_ford/live/en_ca/ford/nameplate/f-150f-150/2024/collections/3-2/FMCA0456000_2024_F150_Reveal_Canada_DesktopHomepage_fade_167.jpg/jcr:content/renditions/cq5dam.web.1440.1440.jpeg",
  },
  {
    name: "Dodge Challenger",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeBuT2XmoDc9VReW-3CPopgt_kY1fYcgi-9A&s",
  },
  {
    name: "Dodge Charger",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5C0bwCatHo60j8QrOzs-zFt0L1UUGP41ong&s",
  },
  {
    name: "Cadillac Escalade",
    image:
      "https://www.cadillac.com/content/dam/cadillac/na/us/english/index/vehicles/future-and-concept/future-vehicles/escalade-mcm/my25-escalade-mov-gallery-grid-exterior-front-grille-v2.jpg?imwidth=960",
  },
  {
    name: "Lexus IS",
    image:
      "https://toyotacanada.scene7.com/is/image/toyotacanada/2021_Lexus_IS_F-SPORT_027-1?ts=1689118310868&$Media-Large$&dpr=off",
  },
  {
    name: "Toyota Land Cruiser",
    image:
      "https://img.sm360.ca/images/article/dilawri-group-of-companies/118500//the-toyota-landcruiser-will-be-back-in-canada-after-nearly-30-years-of-absence1693167444138.jpg",
  },
  {
    name: "Mercedes-Benz G Wagon",
    image:
      "https://www.mercedes-benz.ca/content/dam/mb-nafta/ca/myco/my24/g-class/class-page/series/MBCAN-2024-G-SUV-HERO-DR.jpg",
  },
  {
    name: "BMW X5",
    image:
      "https://media.ed.edmunds-media.com/bmw/x5/2025/oem/2025_bmw_x5_4dr-suv_xdrive40i_fq_oem_1_1600.jpg",
  },
  {
    name: "Chevrolet Tahoe",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQMB8iuaAuT484ucK0vf9AXeEzPjMvVP_vpw&s",
  },
  {
    name: "Audi A4",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyArTb3OtwrK_jqz-AdjurO14PYelGzDPOiA&s",
  },
];

app.get("/random-cars", (req, res) => {
  const { numCars = 10 } = req.query;

  const shuffledCars = cars.sort(() => 0.5 - Math.random()).slice(0, numCars);

  res.json(shuffledCars);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
