interface PlayerData {
  playerId: number;
  name: {
    default: string;
  };
  goals: number;
  assists: number;
  points: number;
}

export interface GoalieData {
  playerId: number;
  name: {
    default: string;
  };
  savePctg: string;
  goalsAgainst: number;
  saveShotsAgainst: string;
  toi: string;
}

export interface GameStats {
  forwards: PlayerData[];
  defense: PlayerData[];
  goalies: GoalieData[];
}

interface TeamInfo {
  name: {
    default: string;
  };
  abbrev: string;
  score: number;
  sog: number;
}

interface Boxscore {
  playerByGameStats: {
    awayTeam: GameStats;
    homeTeam: GameStats;
  };
}

export interface IGameBoxscore {
  id: number;
  awayTeam: TeamInfo;
  homeTeam: TeamInfo;
  boxscore: Boxscore;
}
