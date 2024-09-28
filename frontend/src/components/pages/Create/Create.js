import React, { useState } from "react";
import classes from "./Create.module.css";

const Create = () => {
  const [playerName, setPlayerName] = useState("");

  const isCreateDisabled = playerName.trim() === "";

  return (
    <div className={classes.centered}>
      <label htmlFor="playerName">Player Name</label>
      <input
        type="text"
        id="playerName"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <button disabled={isCreateDisabled}>Join Lobby</button>
    </div>
  );
};

export default Create;
