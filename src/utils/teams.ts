interface TeamColors {
  [key: string]: {
    bottom: string;
    top: string;
  };
}

const colors: TeamColors = {
  "Anaheim Ducks": { bottom: "gold", top: "orange" },
  "Arizona Coyotes": { bottom: "black", top: "maroon" },
  "Boston Bruins": { bottom: "gold", top: "black" },
  "Buffalo Sabres": { bottom: "gold", top: "blue" },
  "Calgary Flames": { bottom: "gold", top: "red" },
  "Carolina Hurricanes": { bottom: "black", top: "red" },
  "Chicago Blackhawks": { bottom: "black", top: "red" },
  "Colorado Avalanche": { bottom: "blue", top: "maroon" },
  "Columbus Blue Jackets": { bottom: "#8a101d", top: "#204980" },
  "Dallas Stars": { bottom: "silver", top: "green" },
  "Detroit Red Wings": { bottom: "white", top: "red" },
  "Edmonton Oilers": { bottom: "orange", top: "blue" },
  "Florida Panthers": { bottom: "gold", top: "red" },
  "Los Angeles Kings": { bottom: "silver", top: "black" },
  "Minnesota Wild": { bottom: "#a81e2e", top: "#124735" },
  "Montreal Canadiens": { bottom: "blue", top: "red" },
  "Nashville Predators": { bottom: "navy", top: "gold" },
  "New Jersey Devils": { bottom: "black", top: "red" },
  "New York Islanders": { bottom: "orange", top: "blue" },
  "New York Rangers": { bottom: "red", top: "blue" },
  "Ottawa Senators": { bottom: "red", top: "black" },
  "Philadelphia Flyers": { bottom: "black", top: "orange" },
  "Pittsburgh Penguins": { bottom: "gold", top: "black" },
  "San Jose Sharks": { bottom: "silver", top: "teal" },
  "Seattle Kraken": { bottom: "#97d2d3", top: "#041b2d" },
  "St Louis Blues": { bottom: "gold", top: "blue" },
  "Tampa Bay Lightning": { bottom: "silver", top: "blue" },
  "Toronto Maple Leafs": { bottom: "white", top: "blue" },
  "Vancouver Canucks": { bottom: "#006d48", top: "#002959" },
  "Vegas Golden Knights": { bottom: "#d9b845", top: "#404a56" },
  "Washington Capitals": { bottom: "blue", top: "red" },
  "Winnipeg Jets": { bottom: "grey", top: "blue" },
};

const getColorsForTeam = (teamName: string) => {
  return {
    bottomColor: colors[teamName].bottom,
    topColor: colors[teamName].top,
  };
};

export const getTeamColorCss = (teamName: string) => {
  const normalized = teamName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const { topColor, bottomColor } = getColorsForTeam(normalized);
  return `linear-gradient(${topColor}, ${bottomColor})`;
};
