<script lang="ts">
import { defineComponent } from 'vue'
import GameDetails from "./game/GameDetails.vue";
import { getLastNightGamesResults } from "../api";

interface StateData {
  games: any[];
}

export default defineComponent({
  components: {
    GameDetails,
  },
  data(): StateData {
    return {
      games: [],
    };
  },
  async mounted() {
    this.games = await getLastNightGamesResults();
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
</template>

<style scoped>
div#games {
  flex: 1;
}
</style>
