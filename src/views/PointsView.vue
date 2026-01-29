<script lang="ts">
import { defineComponent } from "vue";
import PlayerPoints from "../components/points/PlayerPoints.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { finnishNames } from "../utils/players";
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
  isLoading: boolean;
  showFinnishOnly: boolean;
}

// Extract last names from the Finnish names list
const finnishLastNames = finnishNames.map(name => {
  const parts = name.split('. '); // Split on ". " to get last name
  return parts.length > 1 ? parts[1] : name;
});

// Check if a full name contains a Finnish last name
const isFinnishPlayer = (fullName: string, teamAbbrev: string): boolean => {
  // Exclude Sebastian Aho from NYI (different player)
  if (fullName.includes('Aho') && teamAbbrev === 'NYI') {
    return false;
  }
  
  // Check if any Finnish last name appears in the full name
  return finnishLastNames.some(lastName => fullName.includes(lastName));
};

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

export default defineComponent({
  components: {
    PlayerPoints,
    LoadingSpinner,
  },
  data(): StateData {
    return {
      players: [],
      finnishPlayers: [],
      isLoading: true,
      showFinnishOnly: false,
    };
  },
  computed: {
    displayedPlayers(): PlayerData[] {
      return this.showFinnishOnly ? this.finnishPlayers : this.players;
    },
  },
  methods: {
    async fetchFinnishPlayers() {
      try {
        const seasonId = getCurrentSeasonId();
        const apiUrl = `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=25&cayenneExp=gameTypeId=2%20and%20nationalityCode=%22FIN%22%20and%20seasonId%3C=${seasonId}%20and%20seasonId%3E=${seasonId}`;
        const response = await fetch(
          `${proxy}${encodeURIComponent(apiUrl)}`
        );
        const envelope = await response.json();
        const data: FinnishApiResponse = JSON.parse(envelope.body);
        console.log("Fetched Finnish players data:", data);
        
        this.finnishPlayers = data.data.map((player: FinnishPlayerData) => ({
          name: `${player.skaterFullName} (${player.teamAbbrevs})`,
          teamAbbrev: player.teamAbbrevs,
          goals: player.goals,
          assists: player.assists,
          points: player.points,
          isFinnish: false,
        }));
      } catch (error) {
        console.error("Error fetching Finnish player stats:", error);
      }
    },
    async toggleFinnishPlayers() {
      if (this.showFinnishOnly && this.finnishPlayers.length === 0) {
        this.isLoading = true;
        await this.fetchFinnishPlayers();
        this.isLoading = false;
      }
    },
  },
  async mounted() {
    try {
      const seasonId = getCurrentSeasonId();
      const apiUrl = `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=25&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${seasonId}%20and%20seasonId%3E=${seasonId}`;
      const response = await fetch(
        `${proxy}${encodeURIComponent(apiUrl)}`
      );
      const envelope = await response.json();
      const data: FinnishApiResponse = JSON.parse(envelope.body);
      console.log('Fetched all players data:', data);
      
      this.players = data.data.map((player: FinnishPlayerData) => ({
        name: `${player.skaterFullName} (${player.teamAbbrevs})`,
        teamAbbrev: player.teamAbbrevs,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
        isFinnish: isFinnishPlayer(player.skaterFullName, player.teamAbbrevs),
      }));
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
        Finnish players Top 25
      </label>
    </div>
    <div v-if="isLoading" class="spinnerContainer">
      <LoadingSpinner />
    </div>
    <div v-else-if="displayedPlayers.length > 0" class="playersList">
      <PlayerPoints
        v-for="(player, i) in displayedPlayers"
        :key="i"
        :player="player"
        :index="i"
      />
    </div>
    <div v-else class="noData">
      <p>No player data available</p>
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
