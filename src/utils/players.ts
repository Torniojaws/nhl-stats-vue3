import type { IGameTeam, TeamData, PlayerData } from "../types/team";
import type { IGoalieStats } from "../types/players";

const getGoalieIds = (teamData: TeamData) =>
  Object.keys(teamData.players)
    .filter((playerId) => teamData.players[playerId].position.code === "G")
    .filter(Boolean);

const getGoalies = (teamData: TeamData): PlayerData[] => {
  const goaliePlayerIds: string[] = getGoalieIds(teamData);
  return goaliePlayerIds.map((goalieId) => teamData.players[goalieId]);
};

// Multiple goalies can play in one game, so all are returnedrf
export const getGoalieStats = (
  team: "home" | "away",
  data: IGameTeam
): IGoalieStats[] => {
  const goalies = getGoalies(data[team]);
  return goalies.map((goalie) => {
    return {
      decision: goalie.stats.goalieStats!.decision,
      name: goalie.person.fullName,
      nationality: goalie.person.nationality,
      saves: goalie.stats.goalieStats!.saves,
      shots: goalie.stats.goalieStats!.shots,
      savePercentage: Number(
        goalie.stats.goalieStats!.savePercentage.toFixed(2)
      ),
      timeOnIce: goalie.stats.goalieStats!.timeOnIce,
    };
  });
};

export const getPoints = (team: "home" | "away", data: IGameTeam) => {
  const allPlayers = data[team].players;
  return Object.keys(allPlayers)
    .map((key) => {
      const player = allPlayers[key];
      const stats = player.stats.skaterStats
        ? player.stats.skaterStats
        : player.stats.goalieStats;
      // Some skaters don't have any stats - skip them
      if (!stats) return;
      if (stats.goals === 0 && stats.assists === 0) return;
      return {
        assists: stats.assists,
        goals: stats.goals,
        name: player.person.fullName,
        nationality: player.person.nationality,
        points: stats.goals + stats.assists,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.points - a!.points || b!.goals - a!.goals); // First by points, and if equal, by goals
};
