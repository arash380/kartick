import React, { useEffect, useState } from "react";
import classes from "./Results.module.css";
import { doc, onSnapshot } from "firebase/firestore";
import { lobbiesCollection } from "../../../firebase/firebase";
import rc from "../../routing/routeConfigs";
import { useNavigate, useParams } from "react-router-dom";

const Results = () => {
  const { lobbyId } = useParams();
  const [lobby, setLobby] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe = () => {};
    if (lobbyId) {
      unsubscribe = onSnapshot(doc(lobbiesCollection, lobbyId), (doc) => {
        setLobby(doc.data());
        console.log(doc.data());

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

  return <div className={classes.root}>results</div>;
};

export default Results;
