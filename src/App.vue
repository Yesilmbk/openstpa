<script setup lang="ts">
// Composant racine de l'application OpenSTPA
// Pour l'instant, on affiche simplement un titre et la zone de navigation
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>OpenSTPA</h1>
      <p>STPA safety analysis tool</p>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.app-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e40af;
}

.app-header p {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.app-main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>