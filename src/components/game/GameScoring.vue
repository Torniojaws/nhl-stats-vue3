<script lang="ts">
import PlayerPoints from "../points/PlayerPoints.vue";
export default {
  components: {
    PlayerPoints,
  },
  props: ["away", "game", "home"],
};
</script>

<template>
  <div class="scoringResults">
    <div class="scorers">
      <PlayerPoints
        v-for="(player, i) in home.points"
        :player="player"
        :index="i"
        :key="i"
      />
    </div>
    <div class="divider"></div>
    <div class="scorers">
      <PlayerPoints
        v-for="(player, i) in away.points"
        :player="player"
        :index="i"
        :key="i"
      />
    </div>
  </div>
</template>

<style scoped>
.divider {
  width: 75px;
  padding: 0 4px;
}
@media all and (max-width: 430px) {
  .divider {
    width: 50px;
    padding: 0 2px;
  }
}
.scorers {
  min-height: 32px;
  min-width: 20vw;
  width: 40%;
}
.scoringResults {
  display: flex;
}
</style>
