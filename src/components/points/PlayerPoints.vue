<script lang="ts">
import { defineComponent } from "vue";
import { isFinnishName } from "../../utils/players";

export default defineComponent({
  props: ["player", "index"],
  computed: {
    isEven(): boolean {
      return this.index % 2 === 0;
    },
    isFinnish(): boolean {
      // If player has isFinnish property (from Points view), use it
      if (this.player.isFinnish !== undefined) {
        return this.player.isFinnish;
      }
      // Ignore Sebastian Aho from NYI
      if (this.player.name === "S. Aho" && this.player.teamAbbrev === "NYI") {
        return false;
      }
      return isFinnishName(this.player.name);
    },
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
