import type { IGameTeam } from "../types/team";

// Multiple goalies can play in one game, so all are returned
export const getGoalieStats = (team: "home" | "away", data: IGameTeam) => {
  const allPlayers = data[team].players;
  return Object.keys(allPlayers)
    .map((key) => {
      const player = allPlayers[key];
      if (!player.stats.goalieStats) return;
      return {
        decision: player.stats.goalieStats.decision, // If no value, goalie didn't finish the game
        name: player.person.fullName,
        nationality: player.person.nationality,
        saves: player.stats.goalieStats.saves,
        shots: player.stats.goalieStats.shots,
        savePercentage: player.stats.goalieStats.savePercentage.toFixed(2),
        timeOnIce: player.stats.goalieStats.timeOnIce,
      };
    })
    .filter(Boolean);
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
