import React, { useEffect, useState } from "react";
import classes from "./Results.module.css";
import { doc, onSnapshot } from "firebase/firestore";
import { lobbiesCollection } from "../../../firebase/firebase";
import rc from "../../routing/routeConfigs";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Results = () => {
  const { lobbyId } = useParams();
  const [lobby, setLobby] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe = () => {};
    if (lobbyId) {
      unsubscribe = onSnapshot(doc(lobbiesCollection, lobbyId), (doc) => {
        if (doc.exists()) {
          setLobby(doc.data());
        } else {
          navigate(rc.default);
        }
      });
    }

    return () => {
      setLobby(null);
      unsubscribe();
    };
  }, [lobbyId, navigate]);

  if (!lobby) return null;

  const playerScores = lobby.players.map((player) => {
    let totalScore = 0;
    return {
      name: player.name,
      scores: lobby.rounds.map((round, roundIndex) => {
        const playerResult = round.results.find(
          (result) => result.id === player.id
        );
        if (playerResult && playerResult.correct) {
          totalScore += 1;
        }
        return totalScore;
      }),
    };
  });

  const data = lobby.rounds.map((round, roundIndex) => {
    const roundData = { round: round.number };
    playerScores.forEach((player) => {
      roundData[player.name] = player.scores[roundIndex] || 0;
    });
    return roundData;
  });

  const colors = [
    "#1b9e77",
    "#d95f02",
    "#7570b3",
    "#e7298a",
    "#66a61e",
    "#e6ab02",
    "#a6761d",
    "#666666",
    "#1f78b4",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#6a3d9a",
  ];

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Game Over!</h1>
      <h2 className={classes.subtitle}>Final Results</h2>

      <div className={classes.resultsContainer}>
        {playerScores.map((player, index) => (
          <div
            key={player.name}
            className={classes.playerResult}
            style={{ borderColor: colors[index % colors.length] }}
          >
            <span
              className={classes.playerName}
              style={{ color: colors[index % colors.length] }}
            >
              {player.name}:
            </span>
            <span className={classes.playerScore}>
              {player.scores[player.scores.length - 1]} points
            </span>
          </div>
        ))}
      </div>

      <LineChart width={600} height={300} data={data} className={classes.chart}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="round"
          label={{
            value: "Round #",
            position: "insideBottomRight",
            offset: -5,
          }}
        />
        <YAxis
          label={{ value: "Score", angle: -90, position: "insideLeft" }}
          domain={[0, "auto"]}
          allowDecimals={false}
        />
        <Tooltip />
        <Legend />
        {playerScores.map((player, index) => (
          <Line
            key={player.name}
            type="monotone"
            dataKey={player.name}
            stroke={colors[index % colors.length]}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default Results;
