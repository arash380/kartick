import React, { useState } from "react";
import classes from "./Join.module.css";

const Join = () => {
  const [roomLobby, setRoomLobby] = useState("");
  const [playerName, setPlayerName] = useState("");

  const isJoinDisabled = roomLobby.trim() === "" || playerName.trim() === "";

  return (
    <div className={classes.centered}>
      <label htmlFor="roomLobby">Room Lobby</label>
      <input
        type="text"
        id="roomLobby"
        value={roomLobby}
        onChange={(e) => setRoomLobby(e.target.value)}
      />

      <label htmlFor="playerName">Player Name</label>
      <input
        type="text"
        id="playerName"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <button disabled={isJoinDisabled}>Join Lobby</button>
    </div>
  );
};

export default Join;
