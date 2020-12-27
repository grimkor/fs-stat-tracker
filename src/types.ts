import {Filter} from "../common/types";

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
  filter: Filter;
  setFilter: (filters: Filter) => void;
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
];
