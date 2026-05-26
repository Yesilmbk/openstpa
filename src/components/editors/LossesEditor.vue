<script setup lang="ts">
import { ref } from 'vue';
import type { Loss } from '../../types/stpa';

// La liste des Losses saisies (initialement vide)
const losses = ref<Loss[]>([]);

// Le texte en cours de saisie dans le champ
const newLossText = ref('');

// Action : ajouter une nouvelle Loss à la liste
function addLoss() {
  // On ignore si le champ est vide ou ne contient que des espaces
  const trimmed = newLossText.value.trim();
  if (trimmed === '') return;

  // On génère l'id automatiquement : L-1, L-2, L-3...
  const newId = `L-${losses.value.length + 1}`;

  // On ajoute la nouvelle Loss au tableau
  losses.value.push({
    id: newId,
    text: trimmed,
  });

  // On vide le champ de saisie pour la prochaine entrée
  newLossText.value = '';
}

// Action : supprimer une Loss par son id
function removeLoss(id: string) {
  losses.value = losses.value.filter((loss) => loss.id !== id);
}
</script>

<template>
  <section class="losses-editor">
    <h2>Losses</h2>
    <p class="description">
      Pertes inacceptables au niveau système.
    </p>

    <!-- Formulaire d'ajout -->
    <div class="add-form">
      <input
        v-model="newLossText"
        type="text"
        placeholder="Ex: Collision entre le véhicule et un piéton"
        class="input"
        @keyup.enter="addLoss"
      />
      <button @click="addLoss" class="btn-add">Ajouter</button>
    </div>

    <!-- Liste des Losses existantes -->
    <ul v-if="losses.length > 0" class="losses-list">
      <li v-for="loss in losses" :key="loss.id" class="loss-item">
        <span class="loss-id">{{ loss.id }}</span>
        <span class="loss-text">{{ loss.text }}</span>
        <button @click="removeLoss(loss.id)" class="btn-remove">
          Supprimer
        </button>
      </li>
    </ul>
    <p v-else class="empty">Aucune Loss saisie pour le moment.</p>
  </section>
</template>

<style scoped>
.losses-editor {
  background: white;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

h2 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.description {
  margin: 0 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.input:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.1);
}

.btn-add {
  padding: 0.5rem 1rem;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-add:hover {
  background: #1e3a8a;
}

.losses-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.loss-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

.loss-id {
  font-family: ui-monospace, monospace;
  font-weight: 600;
  color: #1e40af;
  font-size: 0.875rem;
}

.loss-text {
  flex: 1;
  color: #374151;
}

.btn-remove {
  padding: 0.25rem 0.75rem;
  background: white;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.btn-remove:hover {
  background: #fef2f2;
}

.empty {
  color: #9ca3af;
  font-size: 0.875rem;
  font-style: italic;
}
</style>