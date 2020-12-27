import {
  CasualMatchResult,
  GameResultMatch,
  RankedDataResult,
  RankedMatchResult,
} from "../types";
import Logger from "../logger";

const logger = new Logger();

export const authenticated = (line: string) => {
  try {
    if (line.match(/\[\|authsucceeded:/i)) {
      logger.writeLine("match", "authenticated", line);
      const match = line.match(/(?<=authsucceeded:).*:/i);
      if (match) {
        return match[0].replace(/:/gi, "");
      }
    }
  } catch (e) {
    logger.writeError("authenticated matcher", e);
  }
};

export const gameResult = (line: string): GameResultMatch | undefined => {
  try {
    if (line.match(/CheckSaveReplayToFile/i)) {
      logger.writeLine("match", "gameResult", line);
      const matchResult = /::\s\d*:\d*:\d*\d:\d*:\d/i.exec(line);
      if (matchResult) {
        const split = matchResult[0].split(":");
        const whoWonIndex = Number(split[split.length - 1]);

        const playerMatches = [...line.matchAll(/{P\s\[(.*?)\]\s\w*/gi)];
        const score = line.match(/\[\{.*(\d\-\d).*}]/i)?.[1].split("-");
        const players = playerMatches
          .map((x) => x[0])
          .map((result, index) => {
            let [, player, character] = result.split(/\s\[|\]\s/i);
            player = player.replace(/(\[|\]|\*)/gi, "");
            return { player, character, score: Number(score?.[index]) };
          });

        const winner = players[whoWonIndex - 1];
        const loser =
          players[0].player !== winner.player ? players[0] : players[1];
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
    logger.writeError("gameResult matcher", e);
  }
};

export const casualMatchFound = (
  line: string
): CasualMatchResult | undefined => {
  try {
    const match = line.match(/\[\|join:/i);
    if (match) {
      const properties = line.matchAll(/\w*:.*?(?=[,\]])/gi);
      const casualMatchResult = [...properties].reduce((acc, prop) => {
        const [key, value] = prop[0].split(":");
        return key ? { ...acc, [key]: value } : acc;
      }, {} as CasualMatchResult);
      if (casualMatchResult.gameplayRandomSeed) {
        logger.writeLine("match", "casualMatchFound", line);
        return casualMatchResult;
      }
    }
  } catch (e) {
    logger.writeError("casualMatchFound matcher", e);
  }
};

export const challengeMatchFound = (
  line: string
): CasualMatchResult | undefined => {
  try {
    const match = line.match(/\[\|joinchallenge:/i);
    if (match) {
      logger.writeLine("match", "challengeMatchFound", line);
      const split = line.split(/\[\|joinchallenge:/i);
      const properties = split[1].matchAll(/\w*:.*?(?=[,\]])/gi);
      return [...properties].reduce((acc, prop) => {
        const [key, value] = prop[0].split(":");
        return key ? { ...acc, [key]: value } : acc;
      }, {} as CasualMatchResult);
    }
  } catch (e) {
    logger.writeError("challengeMatchFound matcher", e);
  }
};

export const rematchFound = (line: string) => {
  try {
    const match = line.match(/RestartGGPOSessionNextFrame/i);
    if (match) {
      logger.writeLine("match", "rematchFound", line);
      return true;
    }
  } catch (e) {
    logger.writeError("rematchFound matcher", e);
  }
};

export const rankedMatchFound = (
  line: string
): RankedMatchResult | undefined => {
  try {
    const match = line.match(/\[\|joinranked:/i);
    if (match) {
      logger.writeLine("match", "rankedMatchFound", line);
      const properties = line.matchAll(/\w*:.*?(?=[,\]])/gi);
      let rankedMatchResult = [...properties].reduce((acc, prop) => {
        const [key, value] = prop[0].split(":");
        return key ? { ...acc, [key]: value } : acc;
      }, {} as RankedMatchResult);
      logger.writeLine(
        "match",
        "rankedMatchFound",
        JSON.stringify(rankedMatchResult)
      );
      return rankedMatchResult;
    }
  } catch (e) {
    logger.writeError("rankedMatchFound matcher", e);
  }
};

export const rankedBotMatchFound = (line: string): boolean | undefined => {
  try {
    const match = line.match(/\[\|joinrankedbot:/i);
    if (match) {
      logger.writeLine("match", "rankedBotMatchFound", line);
      return true;
    }
    return false;
  } catch (e) {
    logger.writeError("rankedMatchFound matcher", e);
  }
};

export const rankedData = (line: string): RankedDataResult | undefined => {
  try {
    if (line.match(/\[\|rankeddata/i)) {
      logger.writeLine("match", "rankedData", line);
      const match = line.match(/\[\|rankeddata.*\]/i)?.[0];
      if (match) {
        logger.writeLine("match", "rankedData match", match);
        const [, league, rank] = match.split(":");
        return {
          league,
          rank,
        };
      }
    }
  } catch (e) {
    logger.writeError("rankedData matcher", e);
  }
};

export const friendTeamBattle = (line: string): boolean | undefined => {
  try {
    const match = line.match(/\[\|setmode:friend-teambattle\]/i);
    if (match) {
      logger.writeLine("match", "friendTeamBattle", line);
      return true;
    }
  } catch (e) {
    logger.writeError("friendTeamBattle matcher", e);
  }
};

export const friendVersus = (line: string): boolean | undefined => {
  try {
    const match = line.match(/\[\|setmode:friend-versus\]/i);
    if (match) {
      logger.writeLine("match", "friendVersus", line);
      return true;
    }
  } catch (e) {
    logger.writeError("friendVersus matcher", e);
  }
};
