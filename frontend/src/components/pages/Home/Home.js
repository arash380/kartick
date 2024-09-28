import React from "react";
import f1car from "../../../assets/images/f1-car.png";
import classes from "./Home.module.css";

const Home = () => {

  return (
    <div className={classes.root}>
      <img src={f1car} alt="car"/>
      <h1>Kartick.io</h1>
      <button>Create</button>
      <button>Join</button>
    </div>
  )
};

export default Home;
