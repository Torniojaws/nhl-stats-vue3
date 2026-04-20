<script lang="ts">
import { defineComponent, type PropType } from "vue";

type GoalieMetric = "wins" | "gaa" | "savePct";

interface GoalieLeader {
  name: string;
  teamAbbrev: string;
  wins: number;
  gaa: number;
  savePct: number;
  gamesPlayed: number;
}

export default defineComponent({
  props: {
    goalie: {
      type: Object as PropType<GoalieLeader>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    metric: {
      type: String as PropType<GoalieMetric>,
      required: true,
    },
  },
  computed: {
    isEven(): boolean {
      return this.index % 2 === 0;
    },
    formattedValue(): string {
      if (this.metric === "wins") {
        return `${this.goalie.wins}`;
      }
      if (this.metric === "gaa") {
        return this.goalie.gaa.toFixed(2);
      }

      const raw = Number(this.goalie.savePct);
      const normalized = raw <= 1 ? raw * 100 : raw;
      return `${normalized.toFixed(1)}%`;
    },
  },
});
</script>

<template>
  <div class="goalieRow" :class="{ alternate: !isEven }">
    <div class="goalieName">{{ goalie.name }}</div>
    <div class="goalieValue">{{ formattedValue }}</div>
  </div>
</template>

<style scoped>
.alternate {
  background-color: rgb(240, 240, 240);
}

.goalieRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  padding: 0.15rem 0.25rem;
}

.goalieName {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goalieValue {
  min-width: 4rem;
  text-align: right;
  font-weight: 600;
}
</style>
