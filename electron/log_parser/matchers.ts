import {CasualMatchResult, GameResultMatch, RankedDataResult, RankedMatchResult,} from "../types";
import Logger from "../logger";

const logger = new Logger();

export const authenticated = (line: string) => {
  try {
    if (line.match(/\[\|authsucceeded:/i)) {
      logger.writeLine("match", "authenticated", line);
      const match = line.match(/:\w*:/i);
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
    const match = line.match(/\[\|join:ip/i);
    if (match) {
      logger.writeLine("match", "casualMatchFound", line);
      const properties = line.matchAll(/\w*:\w*/gi);
      return [...properties].reduce((acc, prop) => {
        const [key, value] = prop[0].split(":");
        return key ? {...acc, [key]: value} : acc;
      }, {} as CasualMatchResult);
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
      const properties = split[1].matchAll(/\w*:\w*/gi);
      return [...properties].reduce((acc, prop) => {
        const [key, value] = prop[0].split(":");
        return key ? {...acc, [key]: value} : acc;
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
      const properties = line.matchAll(/\w*:\w*/gi);
      return [...properties].reduce((acc, prop) => {
        const [key, value] = prop[0].split(":");
        return key ? {...acc, [key]: value} : acc;
      }, {} as RankedMatchResult);
    }
  } catch (e) {
    logger.writeError("rankedMatchFound matcher", e);
  }
};

// const rankedMatchResult = (line: string) => {
//   if (line.match(/end prepareteambattlescreen/i)) {
//     logger.writeLine("match", "", line);
//     const scores = line.match(/winnerChars P1 \[(.*?)\] P2 \[(.*?)\]/i);
//     if (scores?.some((x) => x.split(",").length === 3)) {
//       return [...scores].reduce(
//         (acc, player, index) =>
//           index
//             ? {
//                 winner: player.split(",").length === 3 ? index : acc.winner,
//                 loserScore:
//                   player.split(",").length === 3
//                     ? acc.score
//                     : player.split(",").length,
//               }
//             : acc,
//         { score: 0, winner: 0 }
//       );
//     }
//   }
// };

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
