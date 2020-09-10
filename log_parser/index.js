const Tail = require("tail").Tail;
const fs = require("fs");

let user = "";
const file =
  "c:\\Users\\David\\AppData\\LocalLow\\Sirlin Games\\Fantasy Strike\\output_log.txt";

// const file = "./output_log.txt";

tail = new Tail(file, {
  useWatchFile: true,
});

tail.on("line", (line) => {
  if (line.match(/\[\|authsucceeded:/i) && !user) {
    user = line.match(/:\w*:/i)[0];
    user = user.replace(/:/gi, "");
    console.log("User not set. Setting user as:", user);
  }

  if (line.match(/CheckSaveReplayToFile/i)) {
    const matchResult = /::\s\d*:\d*:\d*\d:\d*:\d/i.exec(line)[0];
    const split = matchResult.split(":");
    const whoWonIndex = split[split.length - 1];

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
    console.log(
      `${winner.player} (${winner.character}) beat ${loser.player} (${loser.character})`
    );
  }
});

tail.on("error", function (error) {
  console.log("ERROR: ", error);
});

tail.watch();
