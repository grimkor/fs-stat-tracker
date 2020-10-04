const { Actions } = require("./constants");
const authenticated = (line) => {
  try {
    if (line.match(/\[\|authsucceeded:/i)) {
      const match = line.match(/:\w*:/i);
      if (match) {
        return match[0].replace(/:/gi, "");
      }
    }
  } catch (e) {
    throw e;
  }
};

const gameResult = (line) => {
  try {
    if (line.match(/CheckSaveReplayToFile/i)) {
      const matchResult = /::\s\d*:\d*:\d*\d:\d*:\d/i.exec(line);
      if (matchResult) {
        const split = matchResult[0].split(":");
        const whoWonIndex = Number(split[split.length - 1]);

        const playerMatches = [...line.matchAll(/{P\s\[\w*\*{0,1}\]\s\w*/gi)];
        const score = line.match(/\[\{.*(\d\-\d).*}]/i)[1].split("-");
        const players = playerMatches
            .map((x) => x[0])
            .map((result, index) => {
              let [trash, player, character] = result.split(" ");
              player = player.replace(/(\[|\]|\*)/gi, "");
              return { player, character, score: Number(score[index]) };
            });

        const winner = players[whoWonIndex - 1];
        const loser = players.find((player) => player !== winner);
        return {
          loser,
          winner: {
            ...winner,
            score: winner.score + 1,
          },
        };
      }
    }
  } catch (e) {
    throw e;
  }
};

const casualMatchFound = (line) => {
  const match = line.match(/\[\|join:ip/i);
  if (match) {
    const properties = line.matchAll(/\w*:\w*/gi);
    return [...properties].reduce((acc, prop) => {
      const [key, value] = prop[0].split(":");
      return key ? { ...acc, [key]: value } : acc;
    }, {});
  }
};

const rankedMatchFound = (line) => {
  const match = line.match(/\[\|joinranked:/i);
  if (match) {
    const properties = line.matchAll(/\w*:\w*/gi);
    return [...properties].reduce((acc, prop) => {
      const [key, value] = prop[0].split(":");
      return key ? { ...acc, [key]: value } : acc;
    }, {});
  }
};

const rankedMatchResult = (line) => {
  if (line.match(/end prepareteambattlescreen/i)) {
    const scores = line.match(/winnerChars P1 \[(.*?)\] P2 \[(.*?)\]/i);
    if (scores.some((x) => x.split(",").length === 3)) {
      return [...scores].reduce(
        (acc, player, index) =>
          index
            ? {
                winner: player.split(",").length === 3 ? index : acc.winner,
                loserScore:
                  player.split(",").length === 3
                    ? acc.score
                    : player.split(",").length,
              }
            : acc,
        { score: 0, winner: 0 }
      );
    }
  }
};

module.exports = {
  authenticated,
  gameResult,
  casualMatchFound,
  rankedMatchFound,
  rankedMatchResult,
};
