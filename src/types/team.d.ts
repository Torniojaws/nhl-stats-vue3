interface SkaterStats {
  timeOnIce: string;
  assists: number;
  goals: number;
}

interface GoalieStats {
  timeOnIce: string;
  assists: number;
  goals: number;
  shots: number;
  saves: number;
  savePercentage: number;
  decision: string;
}

interface PlayerStats {
  skaterStats?: SkaterStats;
  goalieStats?: GoalieStats;
}

interface PositionData {
  code: string;
  name: string;
}

interface PersonData {
  fullName: string;
  nationality: string;
}

export interface PlayerData {
  person: PersonData;
  jerseyNumber: string;
  position: PositionData;
  stats: PlayerStats;
}

export interface TeamData {
  teamStats: {
    teamSkaterStats: {
      goals: number;
      shots: number;
    };
  };
  players: {
    [key: string]: PlayerData;
  };
}

export interface IGameTeam {
  away: TeamData;
  home: TeamData;
  gamePk: number;
}
