const getNextTurnIndex = (turn) => {
  if (turn >= 10) {
    turn = turn - 10;
  }

  return [0, 0, 1, 1, 2, 2, 3, 3, 4, 4][turn];
};

const getTurnTeam = (turn) => {
  if (turn >= 10) {
    turn = turn - 10;
  }

  return [
    "blue",
    "red",
    "red",
    "blue",
    "blue",
    "red",
    "red",
    "blue",
    "blue",
    "red",
  ][turn];
};

module.exports = { getNextTurnIndex, getTurnTeam };
