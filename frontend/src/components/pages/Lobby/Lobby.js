import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Lobby.module.css";
import { lobbiesCollection, playersCollection } from "../../../firebase/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import rc from "../../routing/routeConfigs";
import { getRandomCars } from "../../../services/api/cars";

const Lobby = () => {
  const { lobbyId, playerId } = useParams();
  const navigate = useNavigate();
  const [lobby, setLobby] = useState();

  const gameStarted = lobby?.currentRound > 0;

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
  }, [playerId, navigate]);

  const startGame = async () => {
    const cars = await getRandomCars(2, 2022, true);

    updateDoc(doc(lobbiesCollection, lobbyId), {
      currentRound: 1,
      rounds: lobby.rounds.push({
        number: 1,

        playerGuseses: lobby.players.map((player) => ({ id: player.id, guess: null })),

        correctAnswer: cars[Math.floor(Math.random() * cars.length)],
        options: cars,
      }),
    });
  };

  const guess = async () => {
    // updateDoc(doc(lobbiesCollection, lobbyId), {
    //   rounds: lobby.rounds.map((round) => {
    //     if (round.number === lobby.round.number) {
    //       return {
    //         ...round,
    //         playerGuseses: round.playerGuseses.map((guess) => {
    //           if (guess.id === playerId) {
    //             return { ...guess, guess: "car" };
    //           }
    //           return guess;
    //         }),
    //       };
    //     }
    //     return round;
    //   }),
    // });
    // // todo: check if all players have guessed
    // const everyoneGussed = lobby.rounds.find((round) => round.number === lobby.round.number).playerGuseses.every((guess) => guess.guess);
    // if (everyoneGussed) {
    //   //
    // }
  };

  const findCurrentRound = () => {
    return lobby.rounds.find((round) => round.number === lobby.currentRound);
  };

  const hasPlayerGuessed = () => {
    return findCurrentRound().playerGuseses.find((guess) => guess.id === playerId).guess;
  };

  return (
    lobby && (
      <div className={classes.root}>
        <h1>Lobby</h1>
        {gameStarted ? (
          <p>Round: {lobby?.round?.number}</p>
        ) : lobby.players.find(({ isHost }) => isHost).id === playerId ? (
          <button onClick={startGame}>Start Game</button>
        ) : (
          <p>Waiting for host to start the game</p>
        )}

        <p>Players:</p>
        <ul>
          {lobby.players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>

        <p>Current Player: {lobby.players.find(({ id }) => id === playerId)?.name}</p>
        <p>Host player: {lobby.players.find(({ isHost }) => isHost)?.name}</p>
        <p>Lobby Code: {lobby.code}</p>

        {gameStarted && !hasPlayerGuessed && <button onClick={guess}>Choose your car</button>}

        {lobby.currentRound > 1 && (
          <div>
            The correct answer was{" "}
            {lobby.rounds.find(({ number }) => number === lobby.currentRound - 1)?.correctAnswer?.name}
          </div>
        )}
      </div>
    )
  );
};

export default Lobby;
