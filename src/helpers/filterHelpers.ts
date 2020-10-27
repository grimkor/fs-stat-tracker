import {MatchTypesObj} from "../types";

export const filterIdtoName = (id: number) =>
  Object.keys(MatchTypesObj).find((name) => MatchTypesObj[name] === id);

export const filterNameToId = (name: string) => MatchTypesObj[name];
