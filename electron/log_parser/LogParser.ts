import {ChildProcess} from "child_process";
import {Tail} from "tail";
import {
  authenticated,
  casualMatchFound,
  challengeMatchFound,
  gameResult,
  rankedData,
  rankedMatchFound,
  rematchFound,
} from "./matchers";
import db from "../database";
import {CasualMatchResult, GameResultMatch, RankedDataResult, RankedMatchResult,} from "../types";

const {MatchType} = require("./constants");
const {Actions} = require("./constants");

class LogParser {
  process: ChildProcess;
  file: string;
  tail: Tail;
  // @ts-ignore
  player: {
    name: string;
    league: string;
    rank: string;
    stars: string;
  };
  // @ts-ignore
  opponent: {
    id: string;
    name: string;
    league: string;
    rank: string;
  };
  // @ts-ignore
  matchId: string;
  matchType: typeof MatchType;
  matchMetaData: CasualMatchResult | RankedMatchResult | undefined;

  constructor(file: string, process: ChildProcess) {
    this.process = process;
    this.file = file;
    this.setDefaultState();

    this.tail = new Tail(this.file, {
      useWatchFile: true,
    });
    this.tail.on("line", this.processLine.bind(this));
    this.tail.on("error", function () {
    });

    db.getConfig((err, result) => {
      if (!err && result?.find((x) => x.setting === "playerName")) {
        this.player.name =
          result.find((x) => x.setting === "playerName")?.value ?? "";
        // this.process.send([Actions.set_config, this.player.name]);
      }
    });
  }

  run() {
    this.tail.watch();
  }

  setDefaultState() {
    this.player = {
      ...this.player,
      league: "",
      rank: "",
      stars: "0",
    };
    this.opponent = {
      id: "-1",
      name: "",
      league: "",
      rank: "",
    };
    this.matchId = "-1";
    this.matchType = MatchType.casual;
  }

  processLine(line: string) {
    try {
      if (authenticated(line)) {
        const name = authenticated(line);
        if (name && this.player.name !== name) {
          this.player.name = name;
          db.setPlayer({name: this.player.name});
        }
        this.process.send([Actions.update, this.player.name]);
      }
      const casualMatch = casualMatchFound(line);
      const challengeMatch = challengeMatchFound(line);
      if (casualMatch || challengeMatch) {
        this.setDefaultState();
        const metaData = (casualMatch ?? challengeMatch) as CasualMatchResult;
        this.matchType = casualMatch ? MatchType.casual : MatchType.challenge;
        this.opponent.name = metaData.oppName;
        this.opponent.id = metaData.oppPlayerId;
        this.matchMetaData = metaData;
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
          (err, data) => {
            if (!err && data) {
              this.matchId = data.id;
              this.process.send([
                Actions.match_found,
                {
                  player: this.player,
                  opponent: this.opponent,
                  matchType: this.matchType,
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
        const metaData = rankedMatchFound(line) as RankedMatchResult;
        this.opponent.id = metaData.oppPlayerId;
        this.opponent.name = metaData.oppName;
        this.opponent.rank = metaData.oppRank;
        this.opponent.league = metaData.oppLeague;
        this.player.rank = metaData.playerRank;
        this.player.league = metaData.playerLeague;
        this.player.stars = metaData.playerStars;
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
          (err, data) => {
            if (err) {
              this.process.send(["ERROR", err.message]);
            } else if (data) {
              this.matchId = data.id;
            }
          }
        );
      }
      if (
        rematchFound(line) &&
        [MatchType.casual, MatchType.challenge].includes(this.matchType)
      ) {
        db.insertMatch(
          {
            matchId: this.matchMetaData?.gameplayRandomSeed ?? "",
            matchType: this.matchType,
            playerLeague: this.player.league,
            playerRank: this.player.rank,
            playerStars: this.player.stars,
            oppId: this.opponent.id,
            oppName: this.opponent.name,
            oppPlatform: this.matchMetaData?.oppPlatform ?? "",
            oppPlatformId: this.matchMetaData?.oppPlatformId ?? "",
            oppInputConfig: this.matchMetaData?.oppInputConfig ?? "",
            oppLeague: this.opponent.league,
            oppRank: this.opponent.rank,
          },
          (err, data) => {
            if (err) {
              this.process.send(["ERROR", err.message]);
            } else if (data) {
              this.matchId = data.id;
              this.process.send(["rematch found", this.matchId]);
            }
          }
        );
      }
      if (gameResult(line)) {
        const game = gameResult(line) as GameResultMatch;
        const playerWins = game.winner.player === this.player.name;
        const player = playerWins ? game.winner : game.loser;
        const opponent = playerWins ? game.loser : game.winner;
        db.insertGameResult(
          {
            match: this.matchMetaData,
            match_id: this.matchId,
            player_character: player.character,
            opp_character: opponent.character,
            player_score: String(player.score),
            opp_score: String(opponent.score),
          },
          (err) => err && this.process.send(["ERR:", err.message])
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

      if (rankedData(line)) {
        const rank = rankedData(line) as RankedDataResult;
        db.setPlayer(rank);
        this.process.send([Actions.update, rank]);
      }
    } catch (e) {
      this.process.send(["error", e.message]);
    }
  }
}

export default LogParser;
