<script lang="ts">
import GoalieStats from "../goalies/GoalieStats.vue";
export default {
  components: {
    GoalieStats,
  },
  props: ["away", "game", "home"],
};
</script>

<template>
  <div class="goalieResults">
    <div class="goalies">
      <GoalieStats
        v-for="(goalie, i) in home.goalies"
        :goalie="goalie"
        :index="i"
        :key="i"
      />
    </div>
    <div class="divider"></div>
    <div class="goalies">
      <GoalieStats
        v-for="(goalie, i) in away.goalies"
        :goalie="goalie"
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
.goalies {
  min-height: 32px;
  min-width: 20vw;
  width: 40%;
}
.goalieResults {
  display: flex;
  padding-top: 24px;
}
</style>
