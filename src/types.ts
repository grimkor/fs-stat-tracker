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
