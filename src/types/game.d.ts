interface Team {
  leagueRecord: {
    wins: number;
    losses: number;
    ot: number;
    type: string;
  };
  score: number;
  team: {
    id: number;
    name: string;
    link: string;
  };
}

interface GameStatus {
  abstractGameStatus: string;
  detailedState: string;
}

export interface IGameData {
  gamePk: number;
  status: GameStatus;
  teams: {
    away: Team;
    home: Team;
  };
}
