<script lang="ts">
import { defineComponent } from 'vue'
import GameDetails from "./game/GameDetails.vue";
import { getLastNightGamesResults } from "../api";
import { yesterday } from '../utils/dates';

interface StateData {
  games: any[];
  yesterday: string;
}

export default defineComponent({
  components: {
    GameDetails,
  },
  data(): StateData {
    return {
      games: [],
      yesterday: ''
    };
  },
  async mounted() {
    this.games = await getLastNightGamesResults();
    this.yesterday = yesterday;
  },
});
</script>

<template>
  <div v-if="games" id='games'>
    <GameDetails
      v-for="(game, i) in games"
      :key="i"
      :game='game.game'
      :away="game.away"
      :home="game.home"
    />
  </div>
  <div v-if='games.length === 0' id='noGames'>
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
</style>
