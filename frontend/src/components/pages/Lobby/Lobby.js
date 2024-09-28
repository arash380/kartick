import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Lobby.module.css";
import { lobbiesCollection, playersCollection } from "../../../firebase/firebase";
import rc from "../../routing/routeConfigs";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const Lobby = () => {
  const { lobbyId, playerId } = useParams();
  const navigate = useNavigate();
  const [lobby, setLobby] = useState();

  useEffect(() => {
    let unsubscribe = () => {};
    if (lobbyId) {
      unsubscribe = onSnapshot(doc(lobbiesCollection, lobbyId), (doc) => {
        setLobby(doc.data());

        if (!doc.exists()) {
          navigate(rc.default);
        }
      });
    }

    return () => {
      setLobby(null);
      unsubscribe();
    };
  }, [lobbyId, navigate]);

  useEffect(() => {
    if (playerId) {
      getDoc(doc(playersCollection, playerId)).then((doc) => {
        if (!doc.exists()) {
          navigate(rc.default);
        }
      });
    }

    // if (lobby && !Object.values(lobby.players).includes(playerId)) navigate(rc.default);
  }, [playerId, navigate]);

  return (
    lobby && (
      <div className={classes.root}>
        <p>{lobbyId}</p>
        <p>{playerId}</p>
      </div>
    )
  );
};

export default Lobby;
