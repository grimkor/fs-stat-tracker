const { MatchType } = require("./constants");
const { Tail } = require("tail");
const { Actions } = require("./constants");
const {
  authenticated,
  gameResult,
  casualMatchFound,
  rankedMatchFound,
  rankedMatchResult,
} = require("./matchers");

class LogParser {
  constructor(file, process) {
    console.log(process);
    this.process = process;
    this.file = file;
    this.setDefaultState();
    this.tail = new Tail(this.file, {
      useWatchFile: true,
    });
    this.tail.on("line", this.processLine.bind(this));
    this.tail.on("error", function (error) {});
  }

  run() {
    this.tail.watch(true);
  }

  setDefaultState() {
    this.player = {
      name: "",
      league: "",
      rank: "",
    };
    this.opponent = {
      name: "",
      league: "",
      rank: "",
    };
    this.playerPosition = undefined;
    this.matchId = undefined;
    this.matchType = undefined;
  }

  processLine(line) {
    try {
      if (authenticated(line)) {
        this.player.name = authenticated(line);
        this.process.send([Actions.authenticated, this.player.name]);
      }
      if (casualMatchFound(line)) {
        this.setDefaultState();
        const metaData = casualMatchFound(line);
        this.opponent.name = metaData.oppName;
        this.matchId = metaData.gameplayRandomSeed;
        this.playerPosition = metaData.pnum;
        this.matchMetaData = metaData;
        this.matchType = MatchType.casual;
        this.process.send([
          Actions.match_found,
          {
            opponent: this.opponent,
            matchType: MatchType.casual,
          },
        ]);
      }
      if (rankedMatchFound(line)) {
        this.setDefaultState();
        const metaData = rankedMatchFound(line);
        this.opponent.name = metaData.oppName;
        this.opponent.rank = metaData.oppRank;
        this.opponent.league = metaData.oppLeague;
        this.player.rank = metaData.playerRank;
        this.player.league = metaData.playerLeague;
        this.playerPosition = metaData.pnum;
        this.matchMetaData = metaData;
        this.matchType = MatchType.ranked;
        this.process.send([
          Actions.match_found,
          {
            opponent: this.opponent,
            matchType: MatchType.ranked,
          },
        ]);
      }
      if (gameResult(line)) {
        this.process.send([Actions.game_result, gameResult(line)]);
      }
      if (rankedMatchResult(line)) {
        const result = rankedMatchResult(line);
        this.process.send([
          Actions.match_result,
          {
            winner: result.winner === this.playerPosition,
            opponent: this.opponent,
            loserScore: result.score,
          },
        ]);
        this.setDefaultState();
      }
    } catch (e) {
      this.process.send(["error", e.message]);
    }
  }
}

module.exports = LogParser;
