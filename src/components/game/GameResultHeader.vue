<script lang="ts">
import { defineComponent } from "vue";
import { getTeamByAbbrev, getTeamColorCss } from "../../utils/teams";
import { getSeriesWins } from "../../utils/playoffs";
import type { IGameData } from "@/types/game";

export default defineComponent({
  props: ["away", "game", "home"],
  methods: {
    getTeamBackground: (teamName: any) => getTeamColorCss(teamName),
    getTeamName: (teamAbbrev: string) => getTeamByAbbrev(teamAbbrev),
    getSeriesResult: (teamAbbrev: string, game: IGameData) =>
      getSeriesWins(teamAbbrev, game),
  },
  data() {
    return {
      isGameInProgress: this.game.gameState === "LIVE",
      isGameCancelled: this.game.gameScheduleState === "CNCL",
      isPlayoffsGame: this.game.gameType === 3, // 1-preseason, 2-regseason, 3-playoffs
    };
  },
});
</script>

<template>
  <header class="gameResult">
    <div
      class="teamName"
      :style="{ background: getTeamBackground(game.homeTeam.abbrev) }"
    >
      {{ getTeamName(game.homeTeam.abbrev) }}
    </div>
    <div class="gameScore" :class="{ gameUnfinished: isGameInProgress }">
      {{ game.homeTeam.score }} - {{ game.awayTeam.score }}
    </div>
    <div
      class="teamName"
      :style="{ background: getTeamBackground(game.awayTeam.abbrev) }"
    >
      {{ getTeamName(game.awayTeam.abbrev) }}
    </div>
  </header>
  <div
    class="gamePlayoffs centerText"
    :class="[
      { hidden: !isPlayoffsGame },
      getSeriesResult(game.homeTeam.abbrev, game) === 4 && 'seriesFinished',
      ,
      getSeriesResult(game.awayTeam.abbrev, game) === 4 && 'seriesFinished',
    ]"
  >
    <div>Playoffs series:</div>
    <div class="playoffsSeries">
      <div
        v-bind:class="[
          getSeriesResult(game.homeTeam.abbrev, game) === 4 && 'wonSeries',
        ]"
      >
        {{ game.homeTeam.abbrev }}
        {{ isPlayoffsGame ? getSeriesResult(game.homeTeam.abbrev, game) : "" }}
      </div>
      -
      <div
        v-bind:class="[
          getSeriesResult(game.awayTeam.abbrev, game) === 4 && 'wonSeries',
        ]"
      >
        {{ isPlayoffsGame ? getSeriesResult(game.awayTeam.abbrev, game) : "" }}
        {{ game.awayTeam.abbrev }}
      </div>
    </div>
  </div>
  <div class="gameUnfinished centerText" :class="{ hidden: !isGameInProgress }">
    Game in progress
  </div>
  <div class="gameUnfinished centerText" :class="{ hidden: !isGameCancelled }">
    Game has been cancelled
  </div>
</template>

<style scoped>
.centerText {
  text-align: center;
}
.dash {
  font-size: 1.5em;
  padding-top: 6px;
  text-align: center;
}
.gameResult {
  display: flex;
}
.gameScore {
  align-items: center;
  display: flex;
  font-size: 1.5em;
  justify-content: center;
  width: 20%;
}
@media all and (min-width: 1000px) {
  .gameScore {
    padding-left: 8px;
    padding-right: 8px;
  }
}
.gameUnfinished {
  background-color: rgb(243, 228, 124);
  align-items: center;
  justify-content: center;
  display: flex;
  min-height: 32px;
}
.gamePlayoffs {
  background-color: rgb(196, 196, 196);
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  min-height: 32px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 80%;
  align-self: center;
}
.seriesFinished {
  background-color: gold;
}
.playoffsSeries {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.wonSeries {
  font-weight: bold;
}
.teamName {
  background: linear-gradient(0deg, blue, black 40%, red);
  color: white;
  display: flex;
  min-height: 32px;
  min-width: 20vw;
  align-items: center;
  justify-content: center;
  width: 40%;
}
.hidden {
  display: none;
}
</style>
