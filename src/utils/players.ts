import type { IPlayerByGameStats } from "../types/team";
import type { IGoalieStats, IPlayerStats } from "../types/players";

// Multiple goalies can play in one game, so all are returned
export const getGoalieStats = async (
  team: "awayTeam" | "homeTeam",
  data: IPlayerByGameStats,
  teamAbbrev: string
): Promise<IGoalieStats[]> => {
  if (!data.playerByGameStats) {
    console.log("Goalie has no playerByGameStats", data);
    return [];
  }
  const goalies = data.playerByGameStats[team].goalies;
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
      teamAbbrev,
    };
    goalieStats.push(goalieStat);
  }
  return goalieStats;
};

export const getPoints = async (
  team: "homeTeam" | "awayTeam",
  data: IPlayerByGameStats,
  teamAbbrev: string
): Promise<IPlayerStats[]> => {
  if (!data.playerByGameStats) {
    console.log("Skater has no playerByGameStats", data);
    return [];
  }
  const allPlayers = [
    ...data.playerByGameStats[team].forwards,
    ...data.playerByGameStats[team].defense,
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
      teamAbbrev,
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
  "J. Annunen",
  "J. Armia",
  "A. Barkov",
  "J. Blomqvist",
  "M. Granlund",
  "J. Hakanpaa",
  "E. Haula",
  "M. Heiskanen",
  "R. Hintz",
  "V. Husso",
  "A. Hyry",
  "R. Jarventie",
  "H. Jokiharju",
  "K. Kahkonen",
  "K. Kakko",
  "K. Kapanen",
  "O. Kapanen",
  "S. Kinnunen",
  "J. Kiviranta",
  "J. Koppanen",
  "J. Korpisalo",
  "J. Kotkaniemi",
  "R. Kupari",
  "P. Laine",
  "B. Lambert",
  "K. Lankinen",
  "A. Lehkonen",
  "E. Lindell",
  "E. Luostarinen",
  "U. Luukkonen",
  "A. Lundell",
  "O. Maatta",
  "M. Maccelli",
  "E. Makiniemi",
  "N. Matinpalo",
  "W. Merela",
  "N. Mikkola",
  "T. Niemela",
  "M. Niemelainen",
  "J. Parssinen",
  "M. Pyyhtia",
  "J. Puljujarvi",
  "V. Puustinen",
  "A. Raanta",
  "M. Rantanen",
  "A. Raty",
  "R. Ristolainen",
  "J. Saros",
  "T. Teravainen",
  "S. Tuomaala",
  "E. Tolvanen",
  "U. Vaakanainen",
  "J. Valimaki",
  "J. Ylönen",
];
