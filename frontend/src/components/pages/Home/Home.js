import React from "react";
import car from "../../../assets/images/logo.png";
import classes from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import rc from "../../routing/routeConfigs";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <Link className={classes.header} to={rc.default}>
        Kartick
      </Link>
      <div className={classes.centered}>
        <img src={car} alt="car" className={classes.logo} />
        <button className={classes.button} onClick={() => navigate(rc.create)}>
          Create
        </button>
        <button className={classes.button} onClick={() => navigate(rc.join)}>
          Join
        </button>
      </div>
    </div>
  );
};

export default Home;
