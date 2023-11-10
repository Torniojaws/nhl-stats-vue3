<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: ["goalie", "index"],
  data() {
    return {
      isEven: this.index % 2 === 0,
      isFinnish: this.goalie.nationality.toLowerCase() === "fin",
    };
  },
});
</script>

<template>
  <div class="goalieRow" :class="{ alternate: !isEven, finnish: isFinnish }">
    <div>{{ goalie.name }}</div>
    <div>
      {{ goalie.decision }} ({{ goalie.timeOnIce }}), {{ goalie.saves }}/{{
        goalie.shots
      }}, {{ goalie.savePercentage }}%
    </div>
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

.goalieRow {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  margin-bottom: 8px;
}
</style>
