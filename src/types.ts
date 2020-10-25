export interface Player {
  name: string;
  rank: string;
}

export interface Config {
  logFile: string;
}

export interface Context {
  player: Player;
  config: Config;
  filter: number[];
  setFilter: (filters: number[]) => void;
}

export interface OverviewStats {
  ranked: {
    wins: number;
    losses: number;
    wins30: number;
    losses30: number;
    max_rank: number;
    rank: number;
  };
  casual: {
    wins: number;
    losses: number;
    wins30: number;
    losses30: number;
  };
  challenge: {
    wins: number;
    losses: number;
    wins30: number;
    losses30: number;
  };
}

export const MatchTypesObj: { [key: string]: number } = {
  Casual: 1,
  Ranked: 2,
  Friendly: 3,
};

export type MatchTypes = typeof MatchTypesObj;

export const CharactersList = [
  "Argagarg",
  "DeGrey",
  "Geiger",
  "Grave",
  "Jaina",
  "Lum",
  "Midori",
  "Onimaru",
  "Quince",
  "Rook",
  "Setsuki",
  "Valerie",
]
