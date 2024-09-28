import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Lobby.module.css";
import { lobbiesCollection, playersCollection } from "../../../firebase/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import rc from "../../routing/routeConfigs";

const Lobby = () => {
  const { lobbyId, playerId } = useParams();
  const navigate = useNavigate();
  const [lobby, setLobby] = useState();

  const roundStarted = lobby?.round?.number > 0;
  const roundActive = lobby?.round?.active;
  const isTheirTurn = lobby?.players.find(({ id }) => id === playerId)?.currentTurn;
  const currentTurn = lobby?.players.find(({ currentTurn }) => currentTurn);

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
    updateDoc(doc(lobbiesCollection, lobbyId), {
      round: { number: 1, active: false },
      rounds: lobby.rounds.push({
        number: 1,

        // player guesses is an array of objects with the player id and the car they guessed
        playerGuseses: lobby.players.map((player) => ({ id: player.id, guess: null })),

        // TODO: info about the options and the right answer
      }),
    });
  };

  const chooseRoundCar = async () => {
    updateDoc(doc(lobbiesCollection, lobbyId), {
      round: { number: lobby.round.number, active: true },

      // update rounds
    });

    // TODO: Implement the logic to choose the car (add fields? / make a rounds collection?)
  };

  const guessCar = async () => {
    updateDoc(doc(lobbiesCollection, lobbyId), {
      rounds: lobby.rounds.map((round) => {
        if (round.number === lobby.round.number) {
          return {
            ...round,
            playerGuseses: round.playerGuseses.map((guess) => {
              if (guess.id === playerId) {
                return { ...guess, guess: "car" };
              }
              return guess;
            }),
          };
        }
        return round;
      }),
    });
  };

  return (
    lobby && (
      <div className={classes.root}>
        <h1>Lobby</h1>
        {roundStarted ? (
          <p>Round: {lobby?.round?.number}</p>
        ) : lobby.players.find(({ isHost }) => isHost).id === playerId ? (
          <button onClick={startGame}>Start Game</button>
        ) : null}

        <p>Players:</p>
        <ul>
          {lobby.players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>

        <p>Current Player: {lobby.players.find(({ id }) => id === playerId)?.name}</p>
        <p>Host player: {lobby.players.find(({ isHost }) => isHost)?.name}</p>
        <p>Current Turn: {currentTurn?.name}</p>
        <p>Lobby Code: {lobby.code}</p>

        {/* The player that is choosing the car) */}
        {roundStarted && !roundActive && isTheirTurn && (
          <button onClick={chooseRoundCar}>Choose your car</button>
        )}
        {roundStarted && roundActive && isTheirTurn && <div>Waiting for other players to get the answer</div>}

        {/* Players playing (not the one who choose the car) */}
        {roundStarted && !roundActive && !isTheirTurn && <div>Waiting for {currentTurn?.name}</div>}
        {roundStarted && roundActive && !isTheirTurn && <button onClick={guessCar}>Find the car</button>}
      </div>
    )
  );
};

export default Lobby;
