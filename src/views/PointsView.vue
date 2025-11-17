<script lang="ts">
import { defineComponent } from "vue";
import PlayerPoints from "../components/points/PlayerPoints.vue";

interface SkaterLeader {
  id: number;
  headshot: string;
  firstName: {
    default: string;
  };
  lastName: {
    default: string;
  };
  sweaterNumber: number;
  positionCode: string;
  teamAbbrev: string;
  value: number;
}

interface PlayerLandingData {
  featuredStats: {
    regularSeason: {
      subSeason: {
        goals: number;
        assists: number;
      };
    };
  };
}

interface ApiResponse {
  points: SkaterLeader[];
}

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
}

interface StateData {
  players: PlayerData[];
  finnishPlayers: PlayerData[];
  isLoading: boolean;
  showFinnishOnly: boolean;
}

const proxy = "https://corsproxy.io/?url=";

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
        const response = await fetch(
          `${proxy}https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=[{"property":"points","direction":"DESC"},{"property":"goals","direction":"DESC"},{"property":"assists","direction":"DESC"},{"property":"playerId","direction":"ASC"}]&start=0&limit=25&cayenneExp=gameTypeId=2 and nationalityCode="FIN" and seasonId<=${seasonId} and seasonId>=${seasonId}`
        );
        const data: FinnishApiResponse = await response.json();
        
        this.finnishPlayers = data.data.map((player: FinnishPlayerData) => ({
          name: `${player.skaterFullName} (${player.teamAbbrevs})`,
          teamAbbrev: player.teamAbbrevs,
          goals: player.goals,
          assists: player.assists,
          points: player.points,
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
      const response = await fetch(
        `${proxy}https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=points&limit=25`
      );
      const data: ApiResponse = await response.json();
      
      // Fetch individual player data for each points leader
      const playerPromises = data.points.map(async (player: SkaterLeader) => {
        try {
          const playerResponse = await fetch(
            `${proxy}https://api-web.nhle.com/v1/player/${player.id}/landing`
          );
          const playerData: PlayerLandingData = await playerResponse.json();
          
          const goals = playerData.featuredStats.regularSeason.subSeason.goals;
          const assists = playerData.featuredStats.regularSeason.subSeason.assists;
          const points = goals + assists;
          
          return {
            name: `${player.firstName.default} ${player.lastName.default} (${player.teamAbbrev})`,
            teamAbbrev: player.teamAbbrev,
            goals: goals,
            assists: assists,
            points: points,
          };
        } catch (error) {
          console.error(`Error fetching data for player ${player.id}:`, error);
          // Fallback to using the value from the points API
          return {
            name: `${player.firstName.default} ${player.lastName.default} (${player.teamAbbrev})`,
            teamAbbrev: player.teamAbbrev,
            goals: 0,
            assists: 0,
            points: player.value,
          };
        }
      });
      
      this.players = await Promise.all(playerPromises);
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
        />
        Finnish players Top 25
      </label>
    </div>
    <div v-if="isLoading" class="spinnerContainer">
      <img :src="`spinner.gif`" class="spinner" />
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
  margin-top: 2rem;
}

.spinner {
  height: 128px;
  width: 128px;
}

.noData {
  text-align: center;
  margin-top: 2rem;
}
</style>
