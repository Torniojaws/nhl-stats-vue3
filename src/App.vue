<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>NHL Statistics v2.2</h1>
    <nav>
      <RouterLink to="/">Games</RouterLink>
      <RouterLink to="/points">Points Leaders</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  margin-bottom: 1rem;
}

nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

nav a {
  color: #0066cc;
  text-decoration: none;
  font-size: 1.1em;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

nav a:hover {
  background-color: rgba(0, 102, 204, 0.1);
}

nav a.router-link-active {
  font-weight: bold;
  color: #003366;
  background-color: rgba(0, 102, 204, 0.15);
}

main {
  flex: 1;
}
</style>
