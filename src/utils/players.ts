import type { IGameBoxscore } from "../types/team";
import type { IGoalieStats, IPlayerStats } from "../types/players";

// Multiple goalies can play in one game, so all are returned
export const getGoalieStats = async (
  team: "awayTeam" | "homeTeam",
  data: IGameBoxscore
): Promise<IGoalieStats[]> => {
  if (!data.boxscore) {
    console.log("Goalie has no boxscore", data);
    return [];
  }
  const goalies = data.boxscore.playerByGameStats[team].goalies;
  const goalieStats: IGoalieStats[] = [];
  for (const goalie of goalies) {
    const goalieStat: IGoalieStats = {
      decision: "", // TODO: Where is this info now?
      name: goalie.name.default,
      nationality: "", // This is available in https://api-web.nhle.com/v1/player/:playerId/landing, but extremely slow
      saves: Number(goalie.saveShotsAgainst.split("/")[0]),
      shots: Number(goalie.saveShotsAgainst.split("/")[1]),
      savePercentage: Number((Number(goalie.savePctg ?? 0) * 100).toFixed(2)),
      timeOnIce: goalie.toi,
    };
    goalieStats.push(goalieStat);
  }
  return goalieStats;
};

export const getPoints = async (
  team: "homeTeam" | "awayTeam",
  data: IGameBoxscore
): Promise<IPlayerStats[]> => {
  if (!data.boxscore) {
    console.log("Skater has no boxscore", data);
    return [];
  }
  const allPlayers = [
    ...data.boxscore.playerByGameStats[team].forwards,
    ...data.boxscore.playerByGameStats[team].defense,
  ];
  const playerStats: IPlayerStats[] = [];
  for (const player of allPlayers) {
    if (player.goals === 0 && player.assists === 0) continue;
    const playerStat: IPlayerStats = {
      assists: player.assists,
      goals: player.goals,
      name: player.name.default,
      nationality: "", // This is available in https://api-web.nhle.com/v1/player/:playerId/landing, but extremely slow
      points: player.points,
    };
    playerStats.push(playerStat);
  }
  return playerStats.sort(
    (a, b) => b!.points - a!.points || b!.goals - a!.goals
  ); // First by points, and if equal, by goals;
};

// The new API doesn't provide player nationalities, so this is a simple alternative
export const finnishNames = [
  "S. Aho",
  "A. Barkov",
  "M. Granlund",
  "J. Hakanpaa",
  "E. Haula",
  "M. Heiskanen",
  "R. Hintz",
  "V. Husso",
  "R. Jarventie",
  "H. Jokiharju",
  "K. Kahkonen",
  "K. Kakko",
  "K. Kapanen",
  "J. Kiviranta",
  "J. Korpisalo",
  "J. Kotkaniemi",
  "R. Kupari",
  "P. Laine",
  "K. Lankinen",
  "A. Lehkonen",
  "E. Lindell",
  "E. Luostarinen",
  "U. Luukkonen",
  "A. Lundell",
  "O. Maatta",
  "M. Maccelli",
  "W. Merela",
  "N. Mikkola",
  "J. Parssinen",
  "A. Raanta",
  "M. Rantanen",
  "R. Ristolainen",
  "J. Saros",
  "T. Teravainen",
  "E. Tolvanen",
  "U. Vaakanainen",
  "J. Valimaki",
];
