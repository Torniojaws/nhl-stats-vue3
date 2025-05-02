import type { IGameData } from "@/types/game";

export const getSeriesWins = (
  teamAbbrev: string,
  data: IGameData | undefined
): number | undefined => {
  if (!data?.seriesStatus) return undefined;
  if (data.seriesStatus.topSeedTeamAbbrev === teamAbbrev)
    return data.seriesStatus.topSeedWins;
  if (data.seriesStatus.bottomSeedTeamAbbrev === teamAbbrev)
    return data.seriesStatus.bottomSeedWins;
  return 0;
};
