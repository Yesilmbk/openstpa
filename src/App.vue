<script setup lang="ts">
import LossesEditor from './components/editors/LossesEditor.vue';
</script>

<template>
  <div class="home">
    <LossesEditor />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>