import React, { useEffect, useState } from "react";
import classes from "./Join.module.css";
import { useNavigate, Link } from "react-router-dom";
import rc from "../../routing/routeConfigs";
import logo from "../../../assets/images/logo.png";
import { addDoc, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { lobbiesCollection, playersCollection } from "../../../firebase/firebase";
import { toast } from "react-toastify";

const Join = () => {
  const [lobbyCode, setLobbyCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [lobbies, setLobbies] = useState([]);
  const navigate = useNavigate();

  const isJoinDisabled = lobbyCode.trim() === "" || playerName.trim() === "";

  useEffect(() => {
    const unsubscribe = onSnapshot(lobbiesCollection, (snapshot) => {
      let data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setLobbies(data);
    });

    return () => {
      setLobbies({});
      unsubscribe();
    };
  }, []);

  const onJoin = async (event) => {
    event.preventDefault();

    const lobby = lobbies.find((lobby) => lobby.code === lobbyCode);

    if (!lobby) {
      toast.error("Lobby not found!");
      return;
    }

    const playerRef = await addDoc(playersCollection, {
      name: playerName,
    });

    updateDoc(doc(lobbiesCollection, lobby.id), {
      players: arrayUnion({
        id: playerRef.id,
        name: playerName,
        score: 0,
        isHost: false,
        currentTurn: false,
      }),
    });

    setPlayerName("");
    setLobbyCode("");

    navigate(`/lobby/${lobby.id}/player/${playerRef.id}`);
  };

  return (
    lobbies && (
      <div className={classes.root}>
        <Link className={classes.header} to={rc.default}>Kartick</Link>
        <div className={classes.centered}>
          <img src={logo} alt="Logo" className={classes.logo} />

          <form onSubmit={onJoin}>
            <label htmlFor="lobbyCode">Lobby Code</label>
            <input
              type="text"
              id="lobbyCode"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value)}
            />

            <label htmlFor="playerName">Player Name</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />

            <button disabled={isJoinDisabled} type="submit">
              Join Lobby
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default Join;
