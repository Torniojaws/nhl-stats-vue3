export interface IGoalieStats {
  decision: string;
  name: string;
  nationality: string;
  saves: number;
  shots: number;
  savePercentage: number;
  timeOnIce: string;
  teamAbbrev: string;
}

export interface IPlayerStats {
  assists: number;
  goals: number;
  name: string;
  nationality: string;
  points: number;
  teamAbbrev: string;
}

export interface IPlayerData {
  firstName: { default: string };
  lastName: { default: string };
  birthCountry: string;
  featuredStats: {
    regularSeason: {
      subSeason: {
        gamesPlayed: number;
        goals: number;
        assists: number;
        points: number;
      };
    };
  };
}
