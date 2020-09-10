const { MatchType } = require("./constants");
const { Tail } = require("tail");
const { Actions } = require("./constants");
const {
  authenticated,
  gameResult,
  casualMatchFound,
  rankedMatchFound,
  rematchFound,
} = require("./matchers");
const db = require("../database");

class LogParser {
  constructor(file, process) {
    this.process = process;
    this.file = file;
    this.setDefaultState();
    this.tail = new Tail(this.file, {
      useWatchFile: true,
    });
    this.tail.on("line", this.processLine.bind(this));
    this.tail.on("error", function (error) {});
    db.getConfig((err, result) => {
      if (!err && result.find((x) => x.setting === "playerName")) {
        this.player.name = result.find((x) => x.setting === "playerName").value;
        // this.process.send([Actions.set_config, this.player.name]);
      }
    });
  }

  run() {
    this.tail.watch(true);
  }

  setDefaultState() {
    this.player = {
      ...this.player,
      league: "",
      rank: "",
      stars: 0,
    };
    this.opponent = {
      id: -1,
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
        const name = authenticated(line);
        if (this.player.name !== name) {
          this.player.name = name;
          db.setConfig({ playerName: this.player.name });
        }
        this.process.send([Actions.authenticated, this.player.name]);
      }
      if (casualMatchFound(line)) {
        this.setDefaultState();
        const metaData = casualMatchFound(line);
        this.opponent.name = metaData.oppName;
        this.opponent.id = metaData.oppPlayerId;
        this.playerPosition = metaData.pnum;
        this.matchMetaData = metaData;
        this.matchType = MatchType.casual;
        db.insertMatch(
            {
                matchId: this.matchMetaData.gameplayRandomSeed,
                matchType: this.matchType,
                playerLeague: this.player.league,
                playerRank: this.player.rank,
                playerStars: this.player.stars,
                oppId: this.opponent.id,
                oppName: this.opponent.name,
                oppPlatform: this.matchMetaData.oppPlatform,
                oppPlatformId: this.matchMetaData.oppPlatformId,
                oppInputConfig: this.matchMetaData.oppInputConfig,
                oppLeague: this.opponent.league,
                oppRank: this.opponent.rank,
            },
            (err, res) => {
                if (!err) {
                    this.matchId = res.id;
                    this.process.send([
                        Actions.match_found,
                        {
                            player: this.player,
                            opponent: this.opponent,
                  matchType: MatchType.casual,
                },
              ]);
            } else {
              this.process.send(["ERROR", err]);
            }
          }
        );
      }
      if (rankedMatchFound(line)) {
        this.setDefaultState();
        const metaData = rankedMatchFound(line);
        this.opponent.id = metaData.oppPlayerId;
        this.opponent.name = metaData.oppName;
        this.opponent.rank = metaData.oppRank;
        this.opponent.league = metaData.oppLeague;
        this.player.rank = metaData.playerRank;
        this.player.league = metaData.playerLeague;
        this.player.stars = metaData.playerStars;
        this.playerPosition = metaData.pnum;
        this.matchMetaData = metaData;
        this.matchType = MatchType.ranked;
        db.insertMatch(
            {
                matchId: this.matchMetaData.gameplayRandomSeed,
                matchType: this.matchType,
                playerLeague: this.player.league,
                playerRank: this.player.rank,
                playerStars: this.player.stars,
                oppId: this.opponent.id,
                oppName: this.opponent.name,
                oppPlatform: this.matchMetaData.oppPlatform,
                oppPlatformId: this.matchMetaData.oppPlatformId,
                oppInputConfig: this.matchMetaData.oppInputConfig,
                oppLeague: this.opponent.league,
                oppRank: this.opponent.rank,
            },
            (err, res) => {
                if (err) {
                    this.process.send(["ERROR", err.message]);
                } else {
                    this.matchId = res.id;
                }
            }
        );
      }
        if (rematchFound(line) && this.matchType === MatchType.casual) {
            db.insertMatch(
                {
                    matchId: this.matchMetaData.gameplayRandomSeed,
                    matchType: this.matchType,
                    playerLeague: this.player.league,
                    playerRank: this.player.rank,
                    playerStars: this.player.stars,
                    oppId: this.opponent.id,
                    oppName: this.opponent.name,
                    oppPlatform: this.matchMetaData.oppPlatform,
                    oppPlatformId: this.matchMetaData.oppPlatformId,
                    oppInputConfig: this.matchMetaData.oppInputConfig,
                    oppLeague: this.opponent.league,
                    oppRank: this.opponent.rank,
                },
                (err, res) => {
                    if (err) {
                        this.process.send(["ERROR", err.message]);
                    } else {
                        this.matchId = res.id;
                    }
                }
            );
      }
      if (gameResult(line)) {
        const game = gameResult(line);
        const playerWins = game.winner.player === this.player.name;
        const player = playerWins ? game.winner : game.loser;
        const opponent = playerWins ? game.loser : game.winner;
        db.insertGameResult(
            {
                match: this.matchMetaData,
                match_id: this.matchId,
                player_character: player.character,
                opp_character: opponent.character,
                player_score: player.score,
                opp_score: opponent.score,
            },
            (err, res) => err && this.process.send(["ERR:", err.message])
        );
        this.process.send([
          Actions.update,
          {
            id: this.matchId,
            player_character: player.character,
            opp_character: opponent.character,
            player_score: player.score,
            opp_score: opponent.score,
          },
        ]);
      }
    } catch (e) {
      this.process.send(["error", e.message]);
    }
  }
}

module.exports = LogParser;
