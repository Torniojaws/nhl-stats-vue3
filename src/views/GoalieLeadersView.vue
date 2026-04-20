<script lang="ts">
import { defineComponent } from "vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import GoalieLeaderRow from "../components/goalies/GoalieLeaderRow.vue";
import { proxy } from "@/api";

interface SeasonData {
  id: number;
  regularSeasonEndDate: string;
  startDate: string;
}

interface SeasonApiResponse {
  data: SeasonData[];
}

interface ProxyEnvelope {
  body: string;
}

interface GoalieApiData {
  goalieFullName?: string;
  playerName?: string;
  teamAbbrevs?: string;
  teamAbbrev?: string;
  wins?: number;
  goalsAgainstAverage?: number;
  savePct?: number;
  gamesPlayed?: number;
}

interface GoalieApiResponse {
  data: GoalieApiData[];
}

interface GoalieLeader {
  name: string;
  teamAbbrev: string;
  wins: number;
  gaa: number;
  savePct: number;
  gamesPlayed: number;
}

interface StateData {
  isLoading: boolean;
  showPlayoffLeaders: boolean;
  currentSeasonId: number;
  regularWins: GoalieLeader[];
  regularGaa: GoalieLeader[];
  regularSavePct: GoalieLeader[];
  playoffWins: GoalieLeader[];
  playoffGaa: GoalieLeader[];
  playoffSavePct: GoalieLeader[];
}

type SortMetric = "wins" | "goalsAgainstAverage" | "savePct";

const TOP_LIMIT = 15;
const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

const getCurrentSeasonId = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const seasonStartYear = month < 9 ? year - 1 : year;
  const seasonEndYear = seasonStartYear + 1;

  return parseInt(`${seasonStartYear}${seasonEndYear}`);
};

const shouldShowPlayoffLeaders = (season: SeasonData): boolean => {
  const now = new Date();
  const regularSeasonEndDate = new Date(season.regularSeasonEndDate);
  const seasonStartDate = new Date(season.startDate);
  const isOneMonthBeforeSeasonStart =
    seasonStartDate > now &&
    seasonStartDate.getTime() - now.getTime() <= ONE_MONTH_IN_MS;

  return now >= regularSeasonEndDate && !isOneMonthBeforeSeasonStart;
};

const mapGoalie = (goalie: GoalieApiData): GoalieLeader => {
  const name = String(goalie.goalieFullName ?? goalie.playerName ?? "Unknown");
  const teamAbbrev = String(goalie.teamAbbrevs ?? goalie.teamAbbrev ?? "");

  return {
    name: `${name}${teamAbbrev ? ` (${teamAbbrev})` : ""}`,
    teamAbbrev,
    wins: Number(goalie.wins ?? 0),
    gaa: Number(goalie.goalsAgainstAverage ?? 0),
    savePct: Number(goalie.savePct ?? 0),
    gamesPlayed: Number(goalie.gamesPlayed ?? 0),
  };
};

export default defineComponent({
  components: {
    LoadingSpinner,
    GoalieLeaderRow,
  },
  data(): StateData {
    return {
      isLoading: true,
      showPlayoffLeaders: false,
      currentSeasonId: getCurrentSeasonId(),
      regularWins: [],
      regularGaa: [],
      regularSavePct: [],
      playoffWins: [],
      playoffGaa: [],
      playoffSavePct: [],
    };
  },
  methods: {
    async fetchCurrentSeasonData() {
      const seasonApiUrl =
        "https://api.nhle.com/stats/rest/en/season?sort=%5B%7B%22property%22:%22id%22,%22direction%22:%22DESC%22%7D%5D";
      const response = await fetch(`${proxy}${encodeURIComponent(seasonApiUrl)}`);
      const envelope: ProxyEnvelope = await response.json();
      const data: SeasonApiResponse = JSON.parse(envelope.body);
      const currentSeason = data.data[0];

      if (currentSeason) {
        this.currentSeasonId = currentSeason.id;
        this.showPlayoffLeaders = shouldShowPlayoffLeaders(currentSeason);
      }
    },
    buildGoalieUrl(
      sortMetric: SortMetric,
      gameTypeId: number,
      withGamesPlayedLimit: boolean
    ): string {
      const sortDirection = sortMetric === "goalsAgainstAverage" ? "ASC" : "DESC";
      const sort = encodeURIComponent(
        JSON.stringify([
          { property: sortMetric, direction: sortDirection },
          { property: "playerId", direction: "ASC" },
        ])
      );
      const cayenneExp = encodeURIComponent(
        `gameTypeId=${gameTypeId} and seasonId<=${this.currentSeasonId} and seasonId>=${this.currentSeasonId}`
      );
      const factCayenneExp = withGamesPlayedLimit
        ? `&factCayenneExp=${encodeURIComponent("gamesPlayed>=10")}`
        : "";

      return `https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=false&isGame=false&sort=${sort}&start=0&limit=50${factCayenneExp}&cayenneExp=${cayenneExp}`;
    },
    async fetchGoalieLeaders(
      sortMetric: SortMetric,
      gameTypeId: number,
      withGamesPlayedLimit: boolean
    ): Promise<GoalieLeader[]> {
      const apiUrl = this.buildGoalieUrl(sortMetric, gameTypeId, withGamesPlayedLimit);
      const response = await fetch(`${proxy}${encodeURIComponent(apiUrl)}`);
      const envelope: ProxyEnvelope = await response.json();
      const data: GoalieApiResponse = JSON.parse(envelope.body);

      return data.data.map(mapGoalie);
    },
    async fetchRegularGoalieLeaders(sortMetric: SortMetric): Promise<GoalieLeader[]> {
      const withLimit = await this.fetchGoalieLeaders(sortMetric, 2, true);
      if (withLimit.length > 0) {
        return withLimit.slice(0, TOP_LIMIT);
      }

      const withoutLimit = await this.fetchGoalieLeaders(sortMetric, 2, false);
      return withoutLimit.slice(0, TOP_LIMIT);
    },
    async fetchPlayoffGoalieLeaders(sortMetric: SortMetric): Promise<GoalieLeader[]> {
      const playoffLeaders = await this.fetchGoalieLeaders(sortMetric, 3, false);
      return playoffLeaders.slice(0, TOP_LIMIT);
    },
    async fetchAllRegularGoalieLeaders() {
      const [wins, gaa, savePct] = await Promise.all([
        this.fetchRegularGoalieLeaders("wins"),
        this.fetchRegularGoalieLeaders("goalsAgainstAverage"),
        this.fetchRegularGoalieLeaders("savePct"),
      ]);

      this.regularWins = wins;
      this.regularGaa = gaa;
      this.regularSavePct = savePct;
    },
    async fetchAllPlayoffGoalieLeaders() {
      const [wins, gaa, savePct] = await Promise.all([
        this.fetchPlayoffGoalieLeaders("wins"),
        this.fetchPlayoffGoalieLeaders("goalsAgainstAverage"),
        this.fetchPlayoffGoalieLeaders("savePct"),
      ]);

      this.playoffWins = wins;
      this.playoffGaa = gaa;
      this.playoffSavePct = savePct;
    },
  },
  async mounted() {
    try {
      await this.fetchCurrentSeasonData();
      await this.fetchAllRegularGoalieLeaders();

      if (this.showPlayoffLeaders) {
        await this.fetchAllPlayoffGoalieLeaders();
      }
    } catch (error) {
      console.error("Error fetching goalie leaders:", error);
    } finally {
      this.isLoading = false;
    }
  },
});
</script>

<template>
  <div class="goalieLeadersView">
    <h2>Goalie Leaders (Top 15)</h2>

    <div v-if="isLoading" class="spinnerContainer">
      <LoadingSpinner />
    </div>

    <div v-else class="listsContainer">
      <section class="seasonSection">
        <h3>Regular Season</h3>
        <p class="seasonNote">
          Min 10 games played (show all if no results)
        </p>

        <div class="metricSection">
          <h4>Wins</h4>
          <div v-if="regularWins.length > 0" class="leadersList">
            <GoalieLeaderRow
              v-for="(goalie, i) in regularWins"
              :key="`regular-wins-${i}`"
              :goalie="goalie"
              :index="i"
              metric="wins"
            />
          </div>
          <p v-else class="noData">No goalie data available</p>
        </div>

        <div class="metricSection">
          <h4>GAA</h4>
          <div v-if="regularGaa.length > 0" class="leadersList">
            <GoalieLeaderRow
              v-for="(goalie, i) in regularGaa"
              :key="`regular-gaa-${i}`"
              :goalie="goalie"
              :index="i"
              metric="gaa"
            />
          </div>
          <p v-else class="noData">No goalie data available</p>
        </div>

        <div class="metricSection">
          <h4>Save %</h4>
          <div v-if="regularSavePct.length > 0" class="leadersList">
            <GoalieLeaderRow
              v-for="(goalie, i) in regularSavePct"
              :key="`regular-savepct-${i}`"
              :goalie="goalie"
              :index="i"
              metric="savePct"
            />
          </div>
          <p v-else class="noData">No goalie data available</p>
        </div>
      </section>

      <section v-if="showPlayoffLeaders" class="seasonSection playoffsSection">
        <h3>Playoffs</h3>

        <div class="metricSection">
          <h4>Wins</h4>
          <div v-if="playoffWins.length > 0" class="leadersList">
            <GoalieLeaderRow
              v-for="(goalie, i) in playoffWins"
              :key="`playoff-wins-${i}`"
              :goalie="goalie"
              :index="i"
              metric="wins"
            />
          </div>
          <p v-else class="noData">No goalie data available</p>
        </div>

        <div class="metricSection">
          <h4>GAA</h4>
          <div v-if="playoffGaa.length > 0" class="leadersList">
            <GoalieLeaderRow
              v-for="(goalie, i) in playoffGaa"
              :key="`playoff-gaa-${i}`"
              :goalie="goalie"
              :index="i"
              metric="gaa"
            />
          </div>
          <p v-else class="noData">No goalie data available</p>
        </div>

        <div class="metricSection">
          <h4>Save %</h4>
          <div v-if="playoffSavePct.length > 0" class="leadersList">
            <GoalieLeaderRow
              v-for="(goalie, i) in playoffSavePct"
              :key="`playoff-savepct-${i}`"
              :goalie="goalie"
              :index="i"
              metric="savePct"
            />
          </div>
          <p v-else class="noData">No goalie data available</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.goalieLeadersView {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.listsContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.seasonSection {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.seasonSection h3 {
  text-align: center;
  margin-bottom: 1rem;
}

.seasonNote {
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9em;
}

.metricSection {
  margin-bottom: 1.5rem;
}

.metricSection h4 {
  margin-bottom: 0.5rem;
}

.leadersList {
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 0.35rem;
}

.playoffsSection {
  margin-top: 1rem;
}

.spinnerContainer {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.noData {
  margin: 0.5rem 0;
  color: #666;
}

@media all and (min-width: 900px) {
  .seasonSection {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    align-items: start;
  }

  .seasonSection h3 {
    grid-column: 1 / -1;
    margin-bottom: 0;
  }

  .seasonNote {
    grid-column: 1 / -1;
    margin-top: -0.25rem;
  }

  .metricSection {
    margin-bottom: 0;
  }
}
</style>
