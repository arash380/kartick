import React, { useState } from "react";
import classes from "./Create.module.css";
import logo from "../../../assets/images/logo.png";
import { addDoc } from "firebase/firestore";
import { lobbiesCollection } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import rc from "../../routing/routeConfigs";

const Create = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");

  const isCreateDisabled = playerName.trim() === "";

  const onCreate = async (event) => {
    event.preventDefault();

    const ref = await addDoc(lobbiesCollection, {
      startedAt: new Date(),
      active: true,
      round: 0, // game has not started yet?
      players: [],
      code: "",
    });

    console.log(ref.id);
  };

  return (
    <div className={classes.roots}>
      <a className={classes.header} onClick={() => navigate(rc.default)}>Kartick.io</a>
      <div className={classes.centered}>
        <img src={logo} alt="Logo" className={classes.logo} />

        <form onSubmit={onCreate}>
          <label htmlFor="playerName">Player Name</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <button disabled={isCreateDisabled} type="submit">
            Join Lobby
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
