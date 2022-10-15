<script>
import PlayerPoints from '../points/PlayerPoints.vue';
export default {
  components: {
    PlayerPoints,
  },
  props: ['away', 'game', 'home'],
}
</script>

<template>
  <div class='scoringResults'>
    <div class='scorers'>
      <PlayerPoints v-for='(player, i) in home.points' :player='player' :index='i' />
    </div>
    <div class='divider' />
    <div class='scorers'>
      <PlayerPoints v-for='(player, i) in away.points' :player='player' :index='i' />
    </div>
  </div>
</template>

<style scoped>
.divider {
  width: 20%;
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
