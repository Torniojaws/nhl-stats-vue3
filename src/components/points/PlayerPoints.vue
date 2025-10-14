<script lang="ts">
import { defineComponent } from "vue";
import { finnishNames } from "../../utils/players";
export default defineComponent({
  props: ["player", "index"],
  data() {
    return {
      isEven: this.index % 2 === 0,
      isFinnish:
        finnishNames.includes(this.player.name) &&
        this.player.teamAbbrev !== "NYI", // To not mark the other Sebastian Aho as Finnish
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
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playerRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.9em;
}
</style>
