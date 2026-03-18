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

export const normalizePlayerName = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// The new API doesn't provide player nationalities, so this is a simple alternative
export const finnishNames = [
  "S. Aho",
  "J. Annunen",
  "J. Armia",
  "A. Barkov",
  "J. Blomqvist",
  "H. Borgstrom",
  "M. Granlund",
  "K. Halttunen",
  "J. Hakanpaa",
  "E. Haula",
  "S. Hatakka",
  "L. Hameenaho",
  "A. Heimosalmi",
  "V. Heinola",
  "M. Heiskanen",
  "K. Helenius",
  "S. Helenius",
  "R. Hintz",
  "R. Hirvonen",
  "A. Honka",
  "V. Husso",
  "N. Huuhtanen",
  "A. Hyry",
  "W. Ignatjew",
  "J. Innala",
  "J. Jaaska",
  "A. Jamsen",
  "R. Jarventie",
  "H. Jokiharju",
  "J. Jurmo",
  "K. Kahkonen",
  "K. Kakko",
  "K. Kapanen",
  "O. Kapanen",
  "A. Kaskimaki",
  "K. Kaskisuo",
  "J. Kemell",
  "S. Kinnunen",
  "J. Kiviranta",
  "V. Koivunen",
  "N. Kokko",
  "J. Koppanen",
  "J. Korpisalo",
  "J. Kotkaniemi",
  "R. Kupari",
  "P. Laine",
  "B. Lambert",
  "J. Lammikko",
  "K. Lankinen",
  "A. Lehkonen",
  "E. Lindell",
  "E. Liukas",
  "E. Luostarinen",
  "U. Luukkonen",
  "A. Lundell",
  "J. Luoto",
  "O. Maatta",
  "M. Maccelli",
  "E. Makiniemi",
  "V. Marjala",
  "M. Matikka",
  "N. Matinpalo",
  "W. Merela",
  "L. Merilainen",
  "L. Meriläinen",
  "N. Mikkola",
  "T. Niemela",
  "M. Niemelainen",
  "J. Nurmi",
  "J. Nyman",
  "V. Ottavainen",
  "J. Parssinen",
  "M. Pyyhtia",
  "J. Puljujarvi",
  "J. Pulkkinen",
  "V. Pulli",
  "V. Puustinen",
  "A. Raanta",
  "M. Rantanen",
  "A. Räty",
  "R. Ristolainen",
  "O. Salin",
  "J. Saros",
  "C. Sedoff",
  "P. Seppala",
  "T. Teravainen",
  "H. Tikkanen",
  "S. Tuomaala",
  "A. Tuomisto",
  "E. Tolvanen",
  "U. Vaakanainen",
  "J. Valimaki",
  "T. Vilen",
  "E. Viro",
  "J. Ylönen",
];

const normalizedFinnishNames = new Set(finnishNames.map(normalizePlayerName));
const normalizedFinnishLastNames = finnishNames
  .map((name) => {
    const parts = name.split(". ");
    return parts.length > 1 ? parts[1] : name;
  })
  .map(normalizePlayerName);

export const isFinnishName = (name: string): boolean =>
  normalizedFinnishNames.has(normalizePlayerName(name));

export const isFinnishPlayer = (fullName: string, teamAbbrev: string): boolean => {
  const normalizedFullName = normalizePlayerName(fullName);

  // Exclude Sebastian Aho from NYI (different player)
  if (normalizedFullName.includes("aho") && teamAbbrev === "NYI") {
    return false;
  }

  return normalizedFinnishLastNames.some((lastName) =>
    normalizedFullName.includes(lastName)
  );
};
