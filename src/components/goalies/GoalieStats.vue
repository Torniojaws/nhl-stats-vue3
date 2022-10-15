<script>
export default {
  props: ['goalie', 'index'],
  data() {
    return {
      isEven: this.index % 2 === 0,
      isFinnish: this.goalie.nationality.toLowerCase() === 'fin'
    }
  }
}
</script>

<template>
  <div class='goalieRow' :class='{ alternate: !isEven, finnish: isFinnish }'>
    <div class='goalieName'>{{ goalie.name }}</div>
    <div class='goalieGame'>{{ goalie.decision }} ({{ goalie.timeOnIce }}), {{ goalie.saves }}/{{ goalie.shots }}, {{ goalie.savePercentage }}%</div>
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
.goalieName {
  
}
.goalieStats {
}
.goalieRow {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  margin-bottom: 8px;
}
</style>

<!-- 
export interface IGoalieStats {
  decision: string;
  name: string;
  nationality: string;
  saves: number;
  shots: number;
  savePercentage: number;
  timeOnIce: string;
} -->
