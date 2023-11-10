// interface SkaterStats {
//   timeOnIce: string;
//   assists: number;
//   goals: number;
// }

// interface GoalieStats {
//   timeOnIce: string;
//   assists: number;
//   goals: number;
//   shots: number;
//   saves: number;
//   savePercentage: number;
//   decision: string;
// }

// interface PlayerStats {
//   skaterStats?: SkaterStats;
//   goalieStats?: GoalieStats;
// }

// interface PositionData {
//   code: string;
//   name: string;
// }

// interface PersonData {
//   fullName: string;
//   nationality: string;
// }

// export interface PlayerData {
//   person: PersonData;
//   jerseyNumber: string;
//   position: PositionData;
//   stats: PlayerStats;
// }

// export interface TeamData {
//   teamStats: {
//     teamSkaterStats: {
//       goals: number;
//       shots: number;
//     };
//   };
//   players: {
//     [key: string]: PlayerData;
//   };
// }

// New format

interface PlayerData {
  name: {
    default: string;
  };
  goals: number;
  assists: number;
  points: number;
}

export interface GoalieData {
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
