const rc = Object.freeze({
  wildCard: "*",
  default: "/",
  join: "/join",
  create: "/create",
  lobby: "/lobby/:lobbyId/player/:playerId",
  results: "/lobby/:lobbyId/results",
});

export default rc;
