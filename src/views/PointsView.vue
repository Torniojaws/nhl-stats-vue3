<script lang="ts">
import { defineComponent } from "vue";
import PlayerPoints from "../components/points/PlayerPoints.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { isFinnishPlayer } from "../utils/players";
import { proxy } from "@/api";


interface FinnishPlayerData {
  skaterFullName: string;
  teamAbbrevs: string;
  goals: number;
  assists: number;
  points: number;
}

interface FinnishApiResponse {
  data: FinnishPlayerData[];
}

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

interface PlayerData {
  name: string;
  teamAbbrev: string;
  goals: number;
  assists: number;
  points: number;
  isFinnish?: boolean;
}

interface StateData {
  players: PlayerData[];
  finnishPlayers: PlayerData[];
  playoffPlayers: PlayerData[];
  finnishPlayoffPlayers: PlayerData[];
  isLoading: boolean;
  showFinnishOnly: boolean;
  showPlayoffLeaders: boolean;
  currentSeasonId: number;
}

const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

// Calculate current NHL season ID
// NHL season runs from October (year) to June (year+1)
// Season ID format: YYYYZZZZ where YYYY is start year and ZZZZ is end year
const getCurrentSeasonId = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11 (0 = January, 9 = October)
  
  // If we're in January-September (months 0-8), the season started last year
  // If we're in October-December (months 9-11), the season started this year
  const seasonStartYear = month < 9 ? year - 1 : year;
  const seasonEndYear = seasonStartYear + 1;
  
  return parseInt(`${seasonStartYear}${seasonEndYear}`);
};

const mapPlayer = (player: FinnishPlayerData | Record<string, unknown>): PlayerData => {
  const payload = player as Partial<FinnishPlayerData> & {
    playerName?: string;
    teamAbbrev?: string;
  };
  const name = String(payload.skaterFullName ?? payload.playerName ?? "Unknown");
  const teamAbbrev = String(payload.teamAbbrevs ?? payload.teamAbbrev ?? "");

  return {
    name: `${name}${teamAbbrev ? ` (${teamAbbrev})` : ""}`,
    teamAbbrev,
    goals: Number(player.goals ?? 0),
    assists: Number(player.assists ?? 0),
    points: Number(player.points ?? 0),
    isFinnish: isFinnishPlayer(name, teamAbbrev),
  };
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

export default defineComponent({
  components: {
    PlayerPoints,
    LoadingSpinner,
  },
  data(): StateData {
    return {
      players: [],
      finnishPlayers: [],
      playoffPlayers: [],
      finnishPlayoffPlayers: [],
      isLoading: true,
      showFinnishOnly: false,
      showPlayoffLeaders: false,
      currentSeasonId: getCurrentSeasonId(),
    };
  },
  computed: {
    displayedPlayers(): PlayerData[] {
      const list = this.showFinnishOnly ? this.finnishPlayers : this.players;
      return this.showFinnishOnly
        ? list.map((p) => ({ ...p, isFinnish: false }))
        : list;
    },
    displayedPlayoffPlayers(): PlayerData[] {
      const list = this.showFinnishOnly
        ? this.finnishPlayoffPlayers
        : this.playoffPlayers;
      return this.showFinnishOnly
        ? list.map((p) => ({ ...p, isFinnish: false }))
        : list;
    },
    playoffLeadersTitle(): string {
      const count = this.displayedPlayoffPlayers.length;
      if (count === 0) return "Playoffs Points Leaders";
      if (count < 25) return `Playoffs Points Leaders (${count} players)`;
      return "Playoffs Top 25 Points Leaders";
    },
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
    async fetchPlayers() {
      const apiUrl = `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=25&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${this.currentSeasonId}%20and%20seasonId%3E=${this.currentSeasonId}`;
      const response = await fetch(`${proxy}${encodeURIComponent(apiUrl)}`);
      const envelope: ProxyEnvelope = await response.json();
      const data: FinnishApiResponse = JSON.parse(envelope.body);

      this.players = data.data.map((player: FinnishPlayerData) => ({
        name: `${player.skaterFullName} (${player.teamAbbrevs})`,
        teamAbbrev: player.teamAbbrevs,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
        isFinnish: isFinnishPlayer(player.skaterFullName, player.teamAbbrevs),
      }));
    },
    async fetchPlayoffPlayers() {
      const apiUrl = `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22gamesPlayed%22,%22direction%22:%22ASC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=25&cayenneExp=gameTypeId=3%20and%20seasonId%3C=${this.currentSeasonId}%20and%20seasonId%3E=${this.currentSeasonId}`;
      const response = await fetch(`${proxy}${encodeURIComponent(apiUrl)}`);
      const envelope: ProxyEnvelope = await response.json();
      const data: FinnishApiResponse = JSON.parse(envelope.body);

      this.playoffPlayers = data.data.map((player: FinnishPlayerData) =>
        mapPlayer(player)
      );
    },
    async fetchFinnishPlayers() {
      try {
        const apiUrl = `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=25&cayenneExp=gameTypeId=2%20and%20nationalityCode=%22FIN%22%20and%20seasonId%3C=${this.currentSeasonId}%20and%20seasonId%3E=${this.currentSeasonId}`;
        const response = await fetch(
          `${proxy}${encodeURIComponent(apiUrl)}`
        );
        const envelope: ProxyEnvelope = await response.json();
        const data: FinnishApiResponse = JSON.parse(envelope.body);
        
        this.finnishPlayers = data.data.map((player: FinnishPlayerData) =>
          mapPlayer(player)
        );
      } catch (error) {
        console.error("Error fetching Finnish player stats:", error);
      }
    },
    async fetchFinnishPlayoffPlayers() {
      try {
        const apiUrl = `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22gamesPlayed%22,%22direction%22:%22ASC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=25&cayenneExp=gameTypeId=3%20and%20nationalityCode=%22FIN%22%20and%20seasonId%3C=${this.currentSeasonId}%20and%20seasonId%3E=${this.currentSeasonId}`;
        const response = await fetch(
          `${proxy}${encodeURIComponent(apiUrl)}`
        );
        const envelope: ProxyEnvelope = await response.json();
        const data: FinnishApiResponse = JSON.parse(envelope.body);

        this.finnishPlayoffPlayers = data.data.map(
          (player: FinnishPlayerData) => mapPlayer(player)
        );
      } catch (error) {
        console.error("Error fetching Finnish playoff player stats:", error);
      }
    },
    async toggleFinnishPlayers() {
      if (!this.showFinnishOnly) {
        return;
      }

      const shouldFetchFinnishRegular = this.finnishPlayers.length === 0;
      const shouldFetchFinnishPlayoffs =
        this.showPlayoffLeaders && this.finnishPlayoffPlayers.length === 0;

      if (shouldFetchFinnishRegular || shouldFetchFinnishPlayoffs) {
        this.isLoading = true;
        try {
          const requests: Promise<void>[] = [];

          if (shouldFetchFinnishRegular) {
            requests.push(this.fetchFinnishPlayers());
          }
          if (shouldFetchFinnishPlayoffs) {
            requests.push(this.fetchFinnishPlayoffPlayers());
          }

          await Promise.all(requests);
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
  async mounted() {
    try {
      await this.fetchCurrentSeasonData();
      await this.fetchPlayers();

      if (this.showPlayoffLeaders) {
        await this.fetchPlayoffPlayers();
      }
    } catch (error) {
      console.error("Error fetching player stats:", error);
    } finally {
      this.isLoading = false;
    }
  },
});
</script>

<template>
  <div class="pointsView">
    <h2>Top 25 Points Leaders</h2>
    <div class="filterContainer">
      <label class="checkbox">
        <input 
          type="checkbox" 
          v-model="showFinnishOnly"
          @change="toggleFinnishPlayers"
        >
        Show only Finnish players
      </label>
    </div>
    <div v-if="isLoading" class="spinnerContainer">
      <LoadingSpinner />
    </div>

    <div v-else class="listsContainer">
      <div v-if="displayedPlayers.length > 0" class="playersList">
        <PlayerPoints
          v-for="(player, i) in displayedPlayers"
          :key="`regular-${i}`"
          :player="player"
          :index="i"
        />
      </div>
      <div v-else class="noData">
        <p>No player data available</p>
      </div>

      <section v-if="showPlayoffLeaders" class="playoffsSection">
        <h3>{{ playoffLeadersTitle }}</h3>
        <div v-if="displayedPlayoffPlayers.length > 0" class="playersList">
          <PlayerPoints
            v-for="(player, i) in displayedPlayoffPlayers"
            :key="`playoff-${i}`"
            :player="player"
            :index="i"
          />
        </div>
        <div v-else class="noData">
          <p>No playoff player data available</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pointsView {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.filterContainer {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1em;
  cursor: pointer;
}

.checkbox input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.playersList {
  width: 100%;
  max-width: 800px;
}

.listsContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.playoffsSection {
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
}

.playoffsSection h3 {
  text-align: center;
  margin-bottom: 1rem;
}

.spinnerContainer {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.noData {
  text-align: center;
  margin-top: 2rem;
}
</style>
