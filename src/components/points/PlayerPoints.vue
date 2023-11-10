<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: ["player", "index"],
  data() {
    return {
      isEven: this.index % 2 === 0,
      isFinnish: this.player.nationality.toLowerCase() === "fin",
    };
  },
});
</script>

<template>
  <div class="playerRow" :class="{ alternate: !isEven, finnish: isFinnish }">
    <div class="playerName">{{ player.name }}</div>
    <div>{{ player.goals }}+{{ player.assists }}={{ player.points }}</div>
  </div>
</template>

<style scoped>
.alternate {
  background-color: rgb(240, 240, 240);
}
.finnish {
  color: rgb(0, 162, 232);
  font-weight: bold;
}
.playerName {
  width: 70%;
}

.playerRow {
  display: flex;
  font-size: 0.9em;
}
</style>
