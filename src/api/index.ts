import type { IGameData, IParsedGameData } from "../types/game";
import type { IPlayerByGameStats } from "../types/team";
import { getGoalieStats, getPoints } from "../utils/players";
import { getToday, getYesterday } from "../utils/dates";
import { fetchProxyJson } from "./request";

export { fetchProxyJson, proxy } from "./request";

const SCHEDULE_CACHE_TTL = 2 * 60 * 1000;
const FINAL_BOXSCORE_CACHE_TTL = 15 * 60 * 1000;
const LIVE_BOXSCORE_CACHE_TTL = 30 * 1000;

const getGamesOnDate = async (date: string, signal?: AbortSignal) => {
  const data = await fetchProxyJson<{
    gameWeek: [{ games: IGameData[] }];
  }>(
    `https://api-web.nhle.com/v1/schedule/${date}`,
    SCHEDULE_CACHE_TTL,
    signal
  );
  return data.gameWeek[0].games;
};

const getGameResult = async (
  game: IGameData,
  signal?: AbortSignal
): Promise<IPlayerByGameStats> =>
  fetchProxyJson<unknown>(
    `https://api-web.nhle.com/v1/gamecenter/${game.id}/boxscore`,
    game.gameState === "LIVE" ? LIVE_BOXSCORE_CACHE_TTL : FINAL_BOXSCORE_CACHE_TTL,
    signal
  ).then((result) => {
    const data = result as Partial<IPlayerByGameStats>;
    const awayStats = data.playerByGameStats?.awayTeam;
    const homeStats = data.playerByGameStats?.homeTeam;
    const hasCompleteStats =
      Array.isArray(awayStats?.forwards) &&
      Array.isArray(awayStats?.defense) &&
      Array.isArray(awayStats?.goalies) &&
      Array.isArray(homeStats?.forwards) &&
      Array.isArray(homeStats?.defense) &&
      Array.isArray(homeStats?.goalies);

    if (!data.awayTeam || !data.homeTeam || !hasCompleteStats) {
      throw new Error(`Incomplete NHL boxscore received for game ${game.id}`);
    }
    return data as IPlayerByGameStats;
  });

const getAllGames = async (
  games: IGameData[],
  signal?: AbortSignal
): Promise<IPlayerByGameStats[]> => {
  if (!games.length) return [];
  const results: IPlayerByGameStats[] = new Array(games.length);
  let nextIndex = 0;

  const worker = async (): Promise<void> => {
    while (nextIndex < games.length) {
      const index = nextIndex++;
      results[index] = await getGameResult(games[index], signal);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(4, games.length) }, () => worker())
  );
  return results;
};

const parsedResults = async (
  games: IGameData[],
  signal?: AbortSignal
): Promise<IParsedGameData[]> => {
  const gamesResults = await getAllGames(games, signal);
  const gamesById = new Map(games.map((game) => [game.id, game]));
  const parsedGames: IParsedGameData[] = [];
  for (const gameResult of gamesResults) {
    const awayTeamAbbrev = gameResult.awayTeam.abbrev;
    const homeTeamAbbrev = gameResult.homeTeam.abbrev;
    const parsedGame: IParsedGameData = {
      game: gamesById.get(gameResult.id),
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

export const getLastNightGamesResults = async (
  signal?: AbortSignal
): Promise<
  IParsedGameData[]
> => {
  const gamesLastNight = [...(await getGamesOnDate(getYesterday(), signal))];
  const gamesToday = await getGamesOnDate(getToday(), signal);
  // Merge today's games that have started
  for (const game of gamesToday) {
    if (!['FUT', 'PRE'].includes(game.gameState)) {
      gamesLastNight.push(game);
    }
  }
  // Show in progress games on top. When gameState is "LIVE", the game is in progress
  gamesLastNight.sort((a: { gameState: string; }, b: { gameState: string; }) => {
    if (a.gameState === 'LIVE' && b.gameState !== 'LIVE') return -1;
    if (a.gameState !== 'LIVE' && b.gameState === 'LIVE') return 1;
    return 0;
  });
  return parsedResults(gamesLastNight, signal);
};
