import React, { useState } from "react";
import classes from "./Create.module.css";
import logo from "../../../assets/images/logo.png";
import { addDoc } from "firebase/firestore";
import rc from "../../routing/routeConfigs";
import {
  lobbiesCollection,
  playersCollection,
} from "../../../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

const Create = () => {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const isCreateDisabled = playerName.trim() === "";

  const onCreate = async (event) => {
    event.preventDefault();

    const playerRef = await addDoc(playersCollection, {
      name: playerName,
    });

    const lobbyRef = await addDoc(lobbiesCollection, {
      startedAt: new Date(),
      currentRound: 0,
      players: [
        {
          id: playerRef.id,
          name: playerName,
          score: 0,
          isHost: true,
        },
      ],
      code: Math.random().toString(36).substring(2, 8),
      rounds: [],
      gameOver: false,
    });

    setPlayerName("");

    navigate(`/lobby/${lobbyRef.id}/player/${playerRef.id}`);
  };

  return (
    <div className={classes.root}>
      <Link className={classes.header} to={rc.default}>
        Kartick
      </Link>
      <div className={classes.centered}>
        <img src={logo} alt="Logo" className={classes.logo} />

        <form onSubmit={onCreate} className={classes.form}>
          <label htmlFor="playerName" className={classes.label}>
            Player Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            className={classes.input}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <button
            disabled={isCreateDisabled}
            type="submit"
            className={classes.button}
          >
            Join Lobby
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
