export interface Player {
  name: string;
  rank: string;
  winrate?: number;
}

export interface Opponent {
  name: string;
  rank?: string;
}

export interface Config {
  playerName: string;
}

export type Status = "Connected" | "Disconnected";
export type MatchType = "casual" | "ranked";

export interface Context {
  status: Status;
  player: Player;
  opponent: Opponent;
  matchType: MatchType;
}
