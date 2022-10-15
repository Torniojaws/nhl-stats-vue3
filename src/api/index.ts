import type { IGameData } from "../types/game";
import type { IGameTeam } from "../types/team";
import { getGoalieStats, getPoints } from "../utils/players";

// YYYY-MM-DD
const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];

const getGamesOnDate = async (date: string) =>
  fetch(`https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`)
    .then((response) => response.json())
    .then((data) => data.dates[0].games)
    .catch((err) => err);

const getGameResult = (gamePk: number) =>
  fetch(`https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`)
    .then((response) => response.json())
    .then((data) => {
      return { gamePk, ...data.teams };
    })
    .catch((err) => err);

const getAllGames = async (games: IGameData[]): Promise<IGameTeam[]> => {
  const promises = games.map((game) => getGameResult(game.gamePk));
  return Promise.all(promises);
};

const parsedResults = async (games: IGameData[]) => {
  const gamesResults = await getAllGames(games);
  return gamesResults.map((gameResult) => {
    return {
      game: games.find((game) => game.gamePk === gameResult.gamePk),
      away: {
        goalies: getGoalieStats("away", gameResult),
        points: getPoints("away", gameResult),
      },
      home: {
        goalies: getGoalieStats("home", gameResult),
        points: getPoints("home", gameResult),
      },
    };
  });
};

export const getLastNightGamesResults = async () => {
  const gamesLastNight = await getGamesOnDate(yesterday);
  return await parsedResults(gamesLastNight);
};
