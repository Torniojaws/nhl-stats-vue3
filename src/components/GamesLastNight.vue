<script lang="ts">
import { defineComponent } from "vue";
import GameDetails from "./game/GameDetails.vue";
import { getLastNightGamesResults } from "../api";
import { yesterday } from "../utils/dates";
import type { IParsedGameData } from "@/types/game";

interface StateData {
  games: IParsedGameData[];
  yesterday: string;
  isLoading: boolean;
}

export default defineComponent({
  components: {
    GameDetails,
  },
  data(): StateData {
    return {
      games: [],
      yesterday: "",
      isLoading: true,
    };
  },
  async mounted() {
    this.games = await getLastNightGamesResults();
    this.isLoading = false;
    this.yesterday = yesterday;
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
    <img :src="`spinner.gif`" id="spinner" />
  </div>
  <div v-if="!isLoading && games.length === 0" id="noGames">
    <p>No games last night ({{ yesterday }})</p>
  </div>
</template>

<style scoped>
div#games {
  flex: 1;
}
div#noGames {
  flex: 1;
  text-align: center;
}
div#spinnerContainer {
  display: flex;
  justify-content: center;
}
img#spinner {
  height: 128px;
  width: 128px;
}
</style>
