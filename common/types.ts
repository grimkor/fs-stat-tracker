interface results {
  wins: number;
  losses: number;
}

export interface WinLoss {
  total: string;
  wins: string;
  losses: string;
  match_type: string;
}

export interface OverviewStats {
  ranked: results;
  casual: results;
  challenge: results;
}

export interface CharacterWinrate {
  Argagarg: results;
  DeGrey: results;
  Geiger: results;
  Grave: results;
  Jaina: results;
  Lum: results;
  Midori: results;
  Onimaru: results;
  Quince: results;
  Rook: results;
  Setsuki: results;
  Valerie: results;
}

export interface Rank {
  player_rank: number;
  player_league: number;
}
