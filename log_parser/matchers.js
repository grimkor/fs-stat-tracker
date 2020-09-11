const { Actions } = require("../constants");
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
        const players = playerMatches
          .map((x) => x[0])
          .map((result) => {
            let [trash, player, character] = result.split(" ");
            player = player.replace(/(\[|\]|\*)/gi, "");
            return { player, character };
          });

        const winner = players[whoWonIndex - 1];
        const loser = players.find((player) => player !== winner);
        process.send([
          Actions.match_result,
          {
            loser,
            winner,
          },
        ]);
      }
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  authenticated,
  gameResult,
};
