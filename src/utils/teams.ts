interface TeamColors {
  [key: string]: {
    bottom: string;
    top: string;
  };
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
  console.log("teamname", teamName);
  const normalized = teamName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const { topColor, bottomColor } = getColorsForTeam(normalized);
  return `linear-gradient(${topColor}, ${bottomColor})`;
};
