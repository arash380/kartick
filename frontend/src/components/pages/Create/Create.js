import React, { useState } from "react";
import classes from "./Create.module.css";
import { addDoc } from "firebase/firestore";
import { lobbiesCollection } from "../../../firebase/firebase";

const Create = () => {
  const [playerName, setPlayerName] = useState("");

  const isCreateDisabled = playerName.trim() === "";

  const onCreate = async (event) => {
    event.preventDefault();

    await addDoc(lobbiesCollection, {
      startedAt: new Date(),
      active: true,
      round: 0, // game has not started yet?
    });
  };

  return (
    <div className={classes.centered}>
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
  );
};

export default Create;
