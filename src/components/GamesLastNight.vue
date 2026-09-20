<script lang="ts">
import { defineComponent } from "vue";
import GameDetails from "./game/GameDetails.vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import { getLastNightGamesResults } from "../api";
import { yesterday } from "../utils/dates";
import type { IParsedGameData } from "@/types/game";

interface StateData {
  games: IParsedGameData[];
  yesterday: string;
  isLoading: boolean;
  errorMessage: string;
  abortController: AbortController;
}

export default defineComponent({
  components: {
    GameDetails,
    LoadingSpinner,
  },
  data(): StateData {
    return {
      games: [],
      yesterday: "",
      isLoading: true,
      errorMessage: "",
      abortController: new AbortController(),
    };
  },
  async mounted() {
    try {
      this.games = await getLastNightGamesResults(this.abortController.signal);
      this.yesterday = yesterday;
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        console.error("Error fetching games:", error);
        this.games = [];
        this.errorMessage = "Unable to load game data.";
      }
    } finally {
      this.isLoading = false;
    }
  },
  beforeUnmount() {
    this.abortController.abort();
  },
});
</script>

<template>
  <div v-if="games" id="games">
    <GameDetails
      v-for="(game, i) in games"
      :key="i"
      :game="game.game"
      :away="game.away"
      :home="game.home"
    />
  </div>
  <div v-if="isLoading" id="spinnerContainer">
    <LoadingSpinner />
  </div>
  <div v-if="!isLoading && errorMessage" id="noGames">
    <p>{{ errorMessage }}</p>
  </div>
  <div v-else-if="!isLoading && games.length === 0" id="noGames">
    <p>No games last night ({{ yesterday }})</p>
  </div>
</template>

<style scoped>
div#games {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
div#noGames {
  flex: 1;
  text-align: center;
}
div#spinnerContainer {
  display: flex;
  justify-content: center;
  padding: 2rem;
}
</style>
