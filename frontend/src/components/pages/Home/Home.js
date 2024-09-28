import React, { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import noImage from "../../../assets/images/noImage.png";
import { playersCollection } from "../../../firebase/firebase";
import classes from "./Home.module.css";
// import { Button } from "@mui/material";

const Home = () => {
  const [players, setPlayers] = useState();

  useEffect(() => {
    const unsubscribe = onSnapshot(playersCollection, (snapshot) => {
      let data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      data.sort((a, b) => a.name.localeCompare(b.name));
      data = data.map((player) => (player.img === "" ? { ...player, img: noImage } : player));
      setPlayers(data);
    });

    return () => {
      setPlayers([]);
      unsubscribe();
    };
  }, []);

  // const onPlayerClick = (index) => {
  //   const newPlayers = [...players];
  //   newPlayers[index].isSelected = !newPlayers[index].isSelected;

  //   setPlayers(newPlayers);
  // };

  return players ? (
    <div className={classes.root}>
      <h2>Who's playing?</h2>
      <div className={classes.players}>
        {players.map((player, i) => (
          <div
            key={i}
            // onClick={() => onPlayerClick(i)}
            className={`${classes.player} ${player.isSelected && classes.isPlayerSelected}`}
          >
            <img src={player.img} alt={player.name} />
            <p>{player.name}</p>
          </div>
        ))}
      </div>
      {/* <Button className={classes.btn} onClick={startGame}>
        Start Game
      </Button> */}
    </div>
  ) : (
    // <AppLoader />
    <div>Loading...</div>
  );
};

export default Home;
