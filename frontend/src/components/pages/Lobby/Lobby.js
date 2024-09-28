import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Lobby.module.css";
import { lobbiesCollection, playersCollection } from "../../../firebase/firebase";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
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
    const cars = await getRandomCars(5);

    await updateDoc(doc(lobbiesCollection, lobbyId), {
      currentRound: 1,
      rounds: arrayUnion({
        number: 1,
        results: lobby.players.map((player) => ({ id: player.id, correct: null })),
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

      correctPlayers.forEach((player) => {
        updateDoc(doc(lobbiesCollection, lobbyId), {
          players: lobby.players.map((p) => {
            return p.id === player.id ? { ...p, score: p.score + 1 } : p;
          }),
        });
      });

      const cars = await getRandomCars(5);

      await updateDoc(doc(lobbiesCollection, lobbyId), {
        currentRound: lobby.currentRound + 1,
        rounds: arrayUnion({
          number: lobby.currentRound + 1,
          results: lobby.players.map((player) => ({ id: player.id, correct: null })),
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
            <li key={player.id}>
              {player.name}: {player.score}
            </li>
          ))}
        </ul>

        <p>Current Player: {lobby.players.find(({ id }) => id === playerId)?.name}</p>
        <p>Host player: {lobby.players.find(({ isHost }) => isHost)?.name}</p>
        <p>Lobby Code: {lobby.code}</p>

        {gameStarted && !hasPlayerGuessed() && (
          <>
            <h3>Which one is `{findCurrentRound().correctAnswer.name}`</h3>
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
