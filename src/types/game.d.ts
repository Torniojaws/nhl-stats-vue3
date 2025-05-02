import type { IGoalieStats, IPlayerPoints } from "./players";

interface Team {
  id: number;
  placeName: {
    default: string;
  };
  abbrev: string;
  score: number;
}

export interface IGameData {
  id: number;
  gameState: "OFF" | "LIVE" | string;
  awayTeam: Team;
  homeTeam: Team;
  seriesStatus: IPlayoffSeries | undefined;
}

export interface IPlayoffSeries {
  topSeedTeamAbbrev: string;
  topSeedWins: number;
  bottomSeedTeamAbbrev: string;
  bottomSeedWins: number;
}

interface Stats {
  goalies: IGoalieStats[];
  points: IPlayerPoints[];
}

export interface IParsedGameData {
  game: IGameData | undefined;
  away: Stats;
  home: Stats;
}
