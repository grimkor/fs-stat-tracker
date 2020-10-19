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
