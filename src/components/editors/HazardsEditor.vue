<script setup lang="ts">
import { ref } from 'vue';
import { useProjectStore } from '../../stores/project';

const store = useProjectStore();

// Texte du nouveau Hazard en cours de saisie
const newHazardText = ref('');

// IDs des Losses sélectionnées pour le nouveau Hazard
const selectedLossIds = ref<string[]>([]);

function addHazard() {
  // Le store vérifie déjà si le texte est vide
  store.addHazard(newHazardText.value, selectedLossIds.value);

  // On vide le formulaire pour la prochaine saisie
  newHazardText.value = '';
  selectedLossIds.value = [];
}

function removeHazard(id: string) {
  store.removeHazard(id);
}
</script>

<template>
  <section class="hazards-editor">
    <h2>Hazards</h2>
    <p class="description">
      États du système pouvant conduire à une Loss.
    </p>

    <!-- Avertissement si aucune Loss n'existe encore -->
    <div v-if="store.project.losses.length === 0" class="warning">
      Définissez d'abord au moins une Loss avant d'ajouter des Hazards.
    </div>

    <!-- Formulaire d'ajout (uniquement si des Losses existent) -->
    <div v-else class="add-form">
      <input
        v-model="newHazardText"
        type="text"
        placeholder="Ex: Le véhicule se déplace vers un piéton"
        class="input"
        @keyup.enter="addHazard"
      />

      <!-- Liste des Losses à cocher pour référencer -->
      <div class="losses-picker">
        <p class="picker-label">Losses référencées :</p>
        <label
          v-for="loss in store.project.losses"
          :key="loss.id"
          class="picker-item"
        >
          <input
            type="checkbox"
            :value="loss.id"
            v-model="selectedLossIds"
          />
          <span class="picker-id">{{ loss.id }}</span>
          <span class="picker-text">{{ loss.text }}</span>
        </label>
      </div>

      <button @click="addHazard" class="btn-add">Ajouter</button>
    </div>

    <!-- Liste des Hazards existants -->
    <ul v-if="store.project.hazards.length > 0" class="hazards-list">
      <li
        v-for="hazard in store.project.hazards"
        :key="hazard.id"
        class="hazard-item"
      >
        <div class="hazard-main">
          <span class="hazard-id">{{ hazard.id }}</span>
          <span class="hazard-text">{{ hazard.text }}</span>
          <button @click="removeHazard(hazard.id)" class="btn-remove">
            Supprimer
          </button>
        </div>
        <!-- Affichage des Losses référencées (avec contrôle des "morts") -->
        <div v-if="hazard.losses.length > 0" class="hazard-refs">
          <span class="refs-label">Réfère :</span>
          <span
            v-for="lossId in hazard.losses"
            :key="lossId"
            class="ref-tag"
          >
            {{ lossId }}
          </span>
        </div>
      </li>
    </ul>
    <p
      v-else-if="store.project.losses.length > 0"
      class="empty"
    >
      Aucun Hazard saisi pour le moment.
    </p>
  </section>
</template>

<style scoped>
.hazards-editor {
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

.warning {
  padding: 0.75rem 1rem;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.input {
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

.losses-picker {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.picker-label {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
}

.picker-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.picker-item:hover {
  background: #f3f4f6;
  border-radius: 0.25rem;
}

.picker-id {
  font-family: ui-monospace, monospace;
  font-weight: 600;
  color: #1e40af;
}

.picker-text {
  color: #6b7280;
}

.btn-add {
  align-self: flex-start;
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

.hazards-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.hazard-item {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

.hazard-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hazard-id {
  font-family: ui-monospace, monospace;
  font-weight: 600;
  color: #1e40af;
  font-size: 0.875rem;
}

.hazard-text {
  flex: 1;
  color: #374151;
}

.hazard-refs {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.refs-label {
  color: #6b7280;
}

.ref-tag {
  font-family: ui-monospace, monospace;
  padding: 0.125rem 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.25rem;
  font-weight: 600;
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