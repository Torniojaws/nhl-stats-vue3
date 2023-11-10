import type { IGameBoxscore } from "../types/team";
import type { IGoalieStats } from "../types/players";

// Multiple goalies can play in one game, so all are returned
export const getGoalieStats = (
  team: "awayTeam" | "homeTeam",
  data: IGameBoxscore
): IGoalieStats[] => {
  if (!data.boxscore) {
    console.log("Goalie has no boxscore", data);
    return [];
  }
  const goalies = data.boxscore.playerByGameStats[team].goalies;
  return goalies.map((goalie) => {
    return {
      decision: "", // TODO: Where is this info now?
      name: goalie.name.default,
      nationality: "", // TODO: To detect Finnish players
      saves: Number(goalie.saveShotsAgainst.split("/")[0]),
      shots: Number(goalie.saveShotsAgainst.split("/")[1]),
      savePercentage: Number((Number(goalie.savePctg) * 100).toFixed(2)),
      timeOnIce: goalie.toi,
    };
  });
};

export const getPoints = (
  team: "homeTeam" | "awayTeam",
  data: IGameBoxscore
) => {
  if (!data.boxscore) {
    console.log("Skater has no boxscore", data);
    return [];
  }
  const allPlayers = [
    ...data.boxscore.playerByGameStats[team].forwards,
    ...data.boxscore.playerByGameStats[team].defense,
  ];
  return allPlayers
    .map((player) => {
      if (player.goals === 0 && player.assists === 0) return;
      return {
        assists: player.assists,
        goals: player.goals,
        name: player.name.default,
        nationality: "", // TODO: To detect Finns
        points: player.points,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.points - a!.points || b!.goals - a!.goals); // First by points, and if equal, by goals
};
