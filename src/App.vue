<script setup lang="ts">
import GamesLastNight from "./components/GamesLastNight.vue";
</script>

<template>
  <h1>NHL Statistics v2.2</h1>
  <Suspense>
    <GamesLastNight />
  </Suspense>
</template>

<style scoped></style>
