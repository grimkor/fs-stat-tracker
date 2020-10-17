import {CasualMatchResult, GameResultMatch, RankedDataResult, RankedMatchResult,} from "../types";

export const authenticated = (line: string) => {
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

export const gameResult = (line: string): GameResultMatch | undefined => {
  try {
    if (line.match(/CheckSaveReplayToFile/i)) {
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
        // const loser = players.find((player) => player !== winner);
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
    throw e;
  }
};

export const casualMatchFound = (
  line: string
): CasualMatchResult | undefined => {
  const match = line.match(/\[\|join:ip/i);
  if (match) {
    const properties = line.matchAll(/\w*:\w*/gi);
    return [...properties].reduce((acc, prop) => {
      const [key, value] = prop[0].split(":");
      return key ? {...acc, [key]: value} : acc;
    }, {} as CasualMatchResult);
  }
};

export const challengeMatchFound = (
  line: string
): CasualMatchResult | undefined => {
  const match = line.match(/\[\|joinchallenge:/i);
  if (match) {
    const split = line.split(/\[\|joinchallenge:/i);
    const properties = split[1].matchAll(/\w*:\w*/gi);
    return [...properties].reduce((acc, prop) => {
      const [key, value] = prop[0].split(":");
      return key ? {...acc, [key]: value} : acc;
    }, {} as CasualMatchResult);
  }
};

export const rematchFound = (line: string) => {
  const match = line.match(/RestartGGPOSessionNextFrame/i);
  if (match) {
    return true;
  }
};

export const rankedMatchFound = (
  line: string
): RankedMatchResult | undefined => {
  const match = line.match(/\[\|joinranked:/i);
  if (match) {
    const properties = line.matchAll(/\w*:\w*/gi);
    return [...properties].reduce((acc, prop) => {
      const [key, value] = prop[0].split(":");
      return key ? { ...acc, [key]: value } : acc;
    }, {} as RankedMatchResult);
  }
};

// const rankedMatchResult = (line: string) => {
//   if (line.match(/end prepareteambattlescreen/i)) {
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
  if (line.match(/\[\|rankeddata/i)) {
    const match = line.match(/\[\|rankeddata.*\]/i)?.[0];
    if (match) {
      const [, league, rank] = match.split(":");
      return {
        league,
        rank,
      };
    }
  }
};
