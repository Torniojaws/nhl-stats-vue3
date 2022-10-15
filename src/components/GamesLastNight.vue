<script>
import GameDetails from "./game/GameDetails.vue";
import { getLastNightGamesResults } from "../api";

export default {
  components: {
    GameDetails,
  },
  data() {
    return {
      games: [],
    };
  },
  async mounted() {
    this.games = await getLastNightGamesResults();
  },
};
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
