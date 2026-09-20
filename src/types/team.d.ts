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
  savePctg: number;
  goalsAgainst: number;
  saveShotsAgainst?: string;
  toi: string;
  decision?: "W" | "L" | "O";
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

export interface IPlayerByGameStats {
  id: number; // Game ID
  awayTeam: TeamInfo;
  homeTeam: TeamInfo;
  playerByGameStats: {
    awayTeam: GameStats;
    homeTeam: GameStats;
  };
}
