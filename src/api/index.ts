import type { IGameData, IParsedGameData } from "../types/game";
import type { IPlayerByGameStats } from "../types/team";
import { getGoalieStats, getPoints } from "../utils/players";
import { today, yesterday } from "../utils/dates";

const proxy = "https://corsproxy.io/?url=";

const getGamesOnDate = async (date: string) =>
  fetch(`${proxy}https://api-web.nhle.com/v1/schedule/${date}`)
    .then((response) => response.json())
    .then((data) => data.gameWeek[0].games)
    .catch((err) => err);

const getGameResult = async (gameId: number): Promise<IPlayerByGameStats> =>
  fetch(`${proxy}https://api-web.nhle.com/v1/gamecenter/${gameId}/boxscore`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => err);

const getAllGames = async (
  games: IGameData[]
): Promise<IPlayerByGameStats[]> => {
  if (!games.length) return [];
  const promises = games.map((game) => getGameResult(game.id));
  return Promise.all(promises);
};

const parsedResults = async (
  games: IGameData[]
): Promise<IParsedGameData[]> => {
  const gamesResults = await getAllGames(games);
  const parsedGames: IParsedGameData[] = [];
  for (const gameResult of gamesResults) {
    const awayTeamAbbrev = gameResult.awayTeam.abbrev;
    const homeTeamAbbrev = gameResult.homeTeam.abbrev;
    const parsedGame: IParsedGameData = {
      game: games.find((game) => game.id === gameResult.id),
      away: {
        goalies: await getGoalieStats("awayTeam", gameResult, awayTeamAbbrev),
        points: await getPoints("awayTeam", gameResult, awayTeamAbbrev),
      },
      home: {
        goalies: await getGoalieStats("homeTeam", gameResult, homeTeamAbbrev),
        points: await getPoints("homeTeam", gameResult, homeTeamAbbrev),
      },
    };
    parsedGames.push(parsedGame);
  }
  return parsedGames;
};

export const getLastNightGamesResults = async (): Promise<
  IParsedGameData[]
> => {
  const gamesLastNight = await getGamesOnDate(yesterday);
  const gamesToday = await getGamesOnDate(today);
  // Merge today's games that have started
  for (const game of gamesToday) {
   
    if (game.gameState == "LIVE" || game.gameState == "FINAL" || game.gameState == "OFF") {
      gamesLastNight.push(game);
    }
  }
  console.log('all games from last night and today:', gamesLastNight);
  return parsedResults(gamesLastNight);
};
