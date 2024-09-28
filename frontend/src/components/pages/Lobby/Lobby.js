import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import classes from "./Lobby.module.css";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { lobbiesCollection, playersCollection } from "../../../firebase/firebase";
import rc from "../../routing/routeConfigs";
import { getRandomCars } from "../../../services/api/cars";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const cars = await getRandomCars(5);

    await updateDoc(doc(lobbiesCollection, lobbyId), {
      currentRound: 1,
      rounds: arrayUnion({
        number: 1,
        results: lobby.players.map((player) => ({
          id: player.id,
          correct: null,
        })),
        correctAnswer: cars[Math.floor(Math.random() * cars.length)],
        options: cars,
      }),
    });
  };

  const guess = async (name) => {
    const newLobby = {
      ...lobby,
      rounds: lobby.rounds.map((round) => {
        if (round.number === lobby.currentRound) {
          return {
            ...round,
            results: round.results.map((result) => {
              return result.id === playerId
                ? { ...result, correct: name === round.correctAnswer.name }
                : result;
            }),
          };
        }
        return round;
      }),
    };

    await updateDoc(doc(lobbiesCollection, lobbyId), newLobby);

    const allGuessed = findCurrentRound()
      .results.filter((result) => result.id !== playerId)
      .every((result) => result.correct !== null);

    if (allGuessed) {
      const correctPlayers = newLobby.rounds
        .find((r) => r.number === newLobby.currentRound)
        .results.filter((result) => result.correct);

      const updatedPlayers = lobby.players.map((player) => {
        const correctPlayer = correctPlayers.find((p) => p.id === player.id);
        return correctPlayer ? { ...player, score: player.score + 1 } : player;
      });

      await updateDoc(doc(lobbiesCollection, lobbyId), {
        players: updatedPlayers,
      });

      const cars = await getRandomCars(5);

      await updateDoc(doc(lobbiesCollection, lobbyId), {
        currentRound: lobby.currentRound + 1,
        rounds: arrayUnion({
          number: lobby.currentRound + 1,
          results: lobby.players.map((player) => ({
            id: player.id,
            correct: null,
          })),
          correctAnswer: cars[Math.floor(Math.random() * cars.length)],
          options: cars,
        }),
      });
    }
  };

  const findCurrentRound = () => {
    return lobby?.rounds?.find((round) => round.number === lobby?.currentRound);
  };

  const hasPlayerGuessed = () => {
    return findCurrentRound()?.results?.find((result) => result.id === playerId)?.correct !== null;
  };

  const copyLobbyCode = () => {
    navigator.clipboard.writeText(lobby.code);
    toast.success("Lobby code copied to clipboard!");
  };

  return (
    lobby && (
      <div className={classes.root}>
        <Link className={classes.header} to={rc.default}>
          Kartick
        </Link>

        <div className={classes.container}>
          <header className={classes.main}>
            <h1>Game Lobby</h1>
            <div className={classes.lobbyInfo}>
              <p>
                Lobby Code:{" "}
                <span className={classes.lobbyCode} onClick={copyLobbyCode}>
                  {lobby.code}
                </span>
              </p>
              <p>
                Current Player: <span>{lobby.players.find(({ id }) => id === playerId)?.name}</span>
              </p>
              <p>
                Host: <span>{lobby.players.find(({ isHost }) => isHost)?.name}</span>
              </p>
            </div>
          </header>

          <section className={classes.playersSection}>
            <h2>Players</h2>
            <ul className={classes.playerList}>
              {lobby.players.map((player) => (
                <li key={player.id} className={classes.playerItem}>
                  {player.name}: {player.score}
                </li>
              ))}
            </ul>
          </section>

          <section className={classes.gameSection}>
            {gameStarted ? (
              <p className={classes.roundInfo}>Round: {lobby?.currentRound}</p>
            ) : lobby.players.find(({ isHost }) => isHost).id === playerId ? (
              lobby.players.length > 1 ? (
                <button className={classes.startButton} onClick={startGame}>
                  Start Game
                </button>
              ) : (
                <p className={classes.waitMessage}>Waiting for more players</p>
              )
            ) : (
              <p className={classes.waitMessage}>Waiting for host to start the game</p>
            )}

            {gameStarted && !hasPlayerGuessed() && (
              <div className={classes.guessSection}>
                <h3>Which one is `{findCurrentRound().correctAnswer.name}`</h3>
                <div className={classes.carsContainer}>
                  {findCurrentRound()?.options.map((car, i) => (
                    <div key={i} className={classes.carOption} onClick={() => guess(car.name)}>
                      <img src={car.image} alt={car.name} className={classes.carImage} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lobby.currentRound > 1 && (
              <div className={classes.correctAnswer}>
                The correct answer for previous round was:
                <br />
                <img
                  src={
                    lobby.rounds.find(({ number }) => number === lobby.currentRound - 1)?.correctAnswer?.image
                  }
                  className={classes.carImage}
                  alt="car"
                />
              </div>
            )}
          </section>
        </div>
      </div>
    )
  );
};

export default Lobby;
