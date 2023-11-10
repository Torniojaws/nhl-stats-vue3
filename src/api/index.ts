import type { IGameData, IParsedGameData } from "../types/game";
import type { IGameBoxscore } from "../types/team";
import { getGoalieStats, getPoints } from "../utils/players";
import { yesterday } from "../utils/dates";

const getGamesOnDate = async (date: string) =>
  fetch(`https://corsproxy.io/?https://api-web.nhle.com/v1/schedule/${date}`)
    .then((response) => response.json())
    .then((data) => data.gameWeek[0].games)
    .catch((err) => err);

const getGameResult = async (gameId: number): Promise<IGameBoxscore> =>
  fetch(
    `https://corsproxy.io/?https://api-web.nhle.com/v1/gamecenter/${gameId}/boxscore`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => err);

const getAllGames = async (games: IGameData[]): Promise<IGameBoxscore[]> => {
  if (!games.length) return [];
  const promises = games.map((game) => getGameResult(game.id));
  return Promise.all(promises);
};

const parsedResults = async (
  games: IGameData[]
): Promise<IParsedGameData[]> => {
  const gamesResults = await getAllGames(games);
  return gamesResults.map((gameResult) => {
    return {
      game: games.find((game) => game.id === gameResult.id),
      away: {
        goalies: getGoalieStats("awayTeam", gameResult),
        points: getPoints("awayTeam", gameResult),
      },
      home: {
        goalies: getGoalieStats("homeTeam", gameResult),
        points: getPoints("homeTeam", gameResult),
      },
    };
  });
};

export const getLastNightGamesResults = async (): Promise<
  IParsedGameData[]
> => {
  const gamesLastNight = await getGamesOnDate(yesterday);
  return parsedResults(gamesLastNight);
};
