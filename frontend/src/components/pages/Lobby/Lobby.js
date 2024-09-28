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
    const cars = await getRandomCars(5, 2022, true);

    updateDoc(doc(lobbiesCollection, lobbyId), {
      currentRound: 1,
      rounds: [
        ...lobby.rounds,
        {
          number: 1,
          guesses: lobby.players.map((player) => ({ id: player.id, guess: null })),
          correctAnswer: cars[Math.floor(Math.random() * cars.length)],
          options: cars,
        },
      ],
    });
  };

  const guess = async (name) => {
    updateDoc(doc(lobbiesCollection, lobbyId), {
      rounds: lobby.rounds.map((round) => {
        if (round.number === lobby.currentRound) {
          return {
            ...round,
            guesses: round.guesses.map((guess) => {
              if (guess.id === playerId) {
                return { ...guess, guess: name };
              }
              return guess;
            }),
          };
        }
        return round;
      }),
    });

    // // todo: check if all players have guessed
    // const everyoneGussed = lobby.rounds.find((round) => round.number === lobby.round.number).guesses.every((guess) => guess.guess);
    // if (everyoneGussed) {
    //   //
    // }
  };

  const findCurrentRound = () => {
    return lobby?.rounds?.find((round) => round.number === lobby?.currentRound);
  };

  const hasPlayerGuessed = () => {
    return findCurrentRound()?.guesses?.find((guess) => guess.id === playerId)?.guess;
  };

  return (
    lobby && (
      <div className={classes.root}>
        <h1>Lobby</h1>
        {gameStarted ? (
          <p>Round: {lobby?.currentRound}</p>
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

        {gameStarted && !hasPlayerGuessed() && (
          <>
            <h3>Guess</h3>
            <div>
              {findCurrentRound()?.options.map((car, i) => (
                <div key={i} onClick={() => guess(car.name)}>
                  <img src={car.image} alt="car" />
                </div>
              ))}
            </div>
          </>
        )}

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
