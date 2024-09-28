import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import classes from "./Lobby.module.css";
import {
  lobbiesCollection,
  playersCollection,
} from "../../../firebase/firebase";
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
          guesses: lobby.players.map((player) => ({
            id: player.id,
            guess: null,
          })),
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
  };

  const findCurrentRound = () => {
    return lobby?.rounds?.find((round) => round.number === lobby?.currentRound);
  };

  const hasPlayerGuessed = () => {
    return findCurrentRound()?.guesses?.find((guess) => guess.id === playerId)
      ?.guess;
  };

  return (
    lobby && (
      <div className={classes.container}>
        <Link className={classes.header} to={rc.default}>
          Kartick
        </Link>
        <header className={classes.header}>
          <h1>Game Lobby</h1>
          <div className={classes.lobbyInfo}>
            <p>
              Lobby Code: <span>{lobby.code}</span>
            </p>
            <p>
              Current Player:{" "}
              <span>
                {lobby.players.find(({ id }) => id === playerId)?.name}
              </span>
            </p>
            <p>
              Host:{" "}
              <span>{lobby.players.find(({ isHost }) => isHost)?.name}</span>
            </p>
          </div>
        </header>

        <section className={classes.playersSection}>
          <h2>Players</h2>
          <ul className={classes.playerList}>
            {lobby.players.map((player) => (
              <li key={player.id} className={classes.playerItem}>
                {player.name}
              </li>
            ))}
          </ul>
        </section>

        <section className={classes.gameSection}>
          {gameStarted ? (
            <p className={classes.roundInfo}>Round: {lobby?.currentRound}</p>
          ) : lobby.players.find(({ isHost }) => isHost).id === playerId ? (
            <button className={classes.startButton} onClick={startGame}>
              Start Game
            </button>
          ) : (
            <p className={classes.waitMessage}>
              Waiting for host to start the game
            </p>
          )}

          {gameStarted && !hasPlayerGuessed() && (
            <div className={classes.guessSection}>
              <h3>Choose your guess</h3>
              <div className={classes.carsContainer}>
                {findCurrentRound()?.options.map((car, i) => (
                  <div
                    key={i}
                    className={classes.carOption}
                    onClick={() => guess(car.name)}
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      className={classes.carImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {lobby.currentRound > 1 && (
            <div className={classes.correctAnswer}>
              The correct answer was{" "}
              {
                lobby.rounds.find(
                  ({ number }) => number === lobby.currentRound - 1
                )?.correctAnswer?.name
              }
            </div>
          )}
        </section>
      </div>
    )
  );
};

export default Lobby;
