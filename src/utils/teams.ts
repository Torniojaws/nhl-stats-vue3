interface TeamColors {
  [key: string]: {
    bottom: string;
    top: string;
  };
}

enum TeamNames {
  ANA = "Anaheim Ducks",
  ARI = "Arizona Coyotes",
  BOS = "Boston Bruins",
  BUF = "Buffalo Sabres",
  CGY = "Calgary Flames",
  CAR = "Carolina Hurricanes",
  CHI = "Chicago Blackhawks",
  COL = "Colorado Avalanche",
  CBJ = "Columbus Blue Jackets",
  DAL = "Dallas Stars",
  DET = "Detroit Red Wings",
  EDM = "Edmonton Oilers",
  FLA = "Florida Panthers",
  LAK = "Los Angeles Kings",
  MIN = "Minnesota Wild",
  MTL = "Montreal Canadiens",
  NSH = "Nashville Predators",
  NJD = "New Jersey Devils",
  NYI = "New York Islanders",
  NYR = "New York Rangers",
  OTT = "Ottawa Senators",
  PHI = "Philadelphia Flyers",
  PIT = "Pittsburgh Penguins",
  SJS = "San Jose Sharks",
  SEA = "Seattle Kraken",
  STL = "St Louis Blues",
  TBL = "Tampa Bay Lightning",
  TOR = "Toronto Maple Leafs",
  VAN = "Vancouver Canucks",
  VGK = "Vegas Golden Knights",
  WSH = "Washington Capitals",
  WPG = "Winnipeg Jets",
}

const colors: TeamColors = {
  ANA: { bottom: "#e43603", top: "black" },
  ARI: { bottom: "black", top: "maroon" },
  BOS: { bottom: "gold", top: "black" },
  BUF: { bottom: "gold", top: "blue" },
  CGY: { bottom: "gold", top: "red" },
  CAR: { bottom: "black", top: "red" },
  CHI: { bottom: "black", top: "red" },
  COL: { bottom: "blue", top: "maroon" },
  CBJ: { bottom: "#8a101d", top: "#204980" },
  DAL: { bottom: "silver", top: "green" },
  DET: { bottom: "white", top: "red" },
  EDM: { bottom: "orange", top: "blue" },
  FLA: { bottom: "gold", top: "red" },
  LAK: { bottom: "silver", top: "black" },
  MIN: { bottom: "#a81e2e", top: "#124735" },
  MTL: { bottom: "blue", top: "red" },
  NSH: { bottom: "navy", top: "gold" },
  NJD: { bottom: "black", top: "red" },
  NYI: { bottom: "orange", top: "blue" },
  NYR: { bottom: "red", top: "blue" },
  OTT: { bottom: "red", top: "black" },
  PHI: { bottom: "black", top: "orange" },
  PIT: { bottom: "gold", top: "black" },
  SJS: { bottom: "silver", top: "teal" },
  SEA: { bottom: "#97d2d3", top: "#041b2d" },
  STL: { bottom: "gold", top: "blue" },
  TBL: { bottom: "silver", top: "blue" },
  TOR: { bottom: "white", top: "blue" },
  VAN: { bottom: "#006d48", top: "#002959" },
  VGK: { bottom: "#d9b845", top: "#404a56" },
  WSH: { bottom: "blue", top: "red" },
  WPG: { bottom: "grey", top: "blue" },
};

const getColorsForTeam = (teamName: string) => {
  return {
    bottomColor: colors[teamName].bottom,
    topColor: colors[teamName].top,
  };
};

export const getTeamColorCss = (teamName: string) => {
  const { topColor, bottomColor } = getColorsForTeam(teamName);
  return `linear-gradient(${topColor}, ${bottomColor})`;
};

export const getTeamByAbbrev = (teamAbbrev: string): string =>
  TeamNames[teamAbbrev as keyof typeof TeamNames];
