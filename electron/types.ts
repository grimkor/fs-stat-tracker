export type DatabaseCallback<T> = (data?: T) => void;

export interface Config {
  setting: string;
  value: string;
}

export interface Player {
  property: string;
  value: string;
}


export interface WinratePivot {
  player: string;
  opponent: string;
  wins: number;
  losses: number;
}

export interface CharacterOverview {
  name: string;
  wins: number;
  losses: number;
}

export interface DatabaseInput {
  [key: string]: string;
}

export interface SetPlayerInput {
  name?: string;
  league?: string;
  rank?: string;
}

export interface Match {
  matchId: string;
  matchType: string;
  playerLeague: string;
  playerRank: string;
  playerStars: string;
  oppId: string;
  oppName: string;
  oppPlatform: string;
  oppPlatformId: string;
  oppInputConfig: string;
  oppLeague: string;
  oppRank: string;
}

export interface Game {
  match: CasualMatchResult | RankedMatchResult | undefined;
  match_id: string;
  player_character: string;
  opp_character: string;
  player_score: string;
  opp_score: string;
}

export interface CasualMatchResult {
  oppName: string;
  oppPlayerId: string;
  gameplayRandomSeed: string;
  oppPlatform: string;
  oppPlatformId: string;
  oppInputConfig: string;
}

export interface RankedMatchResult extends CasualMatchResult {
  oppRank: string;
  oppLeague: string;
  playerRank: string;
  playerLeague: string;
  playerStars: string;
}

export interface GameResultMatch {
  winner: { score: number; character: string; player: string };
  loser: { score: number; character: string; player: string };
}

export interface RankedDataResult {
  league: string;
  rank: string;
}

