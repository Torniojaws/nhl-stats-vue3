<script lang="ts">
import GameResultHeader from "./GameResultHeader.vue";
import GameScoring from "./GameScoring.vue";
import GameGoalieStats from "./GameGoalieStats.vue";

export default {
  components: {
    GameResultHeader,
    GameScoring,
    GameGoalieStats,
  },
  props: ["away", "game", "home"],
};
</script>

<template>
  <article class="gameDetails">
    <GameResultHeader :away="away" :game="game" :home="home" />
    <GameScoring :away="away" :game="game" :home="home" />
    <GameGoalieStats :away="away" :game="game" :home="home" />
  </article>
</template>

<style scoped>
.gameDetails {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
</style>
