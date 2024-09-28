import React from "react";
import car from "../../../assets/images/logo.png";
import classes from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import rc from "../../routing/routeConfigs";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <a className={classes.header} onClick={() => navigate(rc.default)}>Kartick.io</a>
      <div className={classes.centered}>
        <img src={car} alt="car" className={classes.logo}/>
        <button onClick={() => navigate(rc.create)}>Create</button>
        <button onClick={() => navigate(rc.join)}>Join</button>
      </div>
    </div>
  ) 
};

export default Home;
