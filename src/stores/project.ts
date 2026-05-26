// Store Pinia : centralise toutes les données du projet STPA en cours.
// Un seul projet à la fois (MVP).
// Auto-sauvegarde dans localStorage à chaque modification.

import { defineStore } from 'pinia';//la fonction pinia pour cree un store
import { ref, watch } from 'vue';//watch est un observateur pour executer du code a chaque fois qu'une variable reactive change 
import type { Loss, Hazard } from '../types/stpa';
// Clé sous laquelle on stocke le projet dans le localStorage
const STORAGE_KEY = 'openstpa.currentProject';

/**
 * Type représentant le projet complet.
 * Pour l'instant on n'a que les Losses, on ajoutera les autres entités plus tard.
 */
type Project = {
  losses: Loss[];
  hazards: Hazard[];
};

/**
 * Charge le projet depuis localStorage.
 * Retourne un projet vide si rien n'est sauvegardé ou si la lecture échoue.
 */
function loadFromStorage(): Project {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return { losses: [], hazards: [] };
    }
    return JSON.parse(raw) as Project;
  } catch (error) {
    console.error('Impossible de charger le projet :', error);
    return { losses: [], hazards: [] };
  }
}

/**
 * Sauvegarde le projet dans localStorage (sérialisé en JSON).
 */
function saveToStorage(project: Project): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch (error) {
    console.error('Impossible de sauvegarder le projet :', error);
  }
}

/**
 * Définition du store. À utiliser dans les composants via useProjectStore().
 */
export const useProjectStore = defineStore('project', () => {
  // État réactif : on charge depuis localStorage au démarrage
  const project = ref<Project>(loadFromStorage());

  // Auto-save : à chaque modification du projet, on sauvegarde
  // `deep: true` permet de détecter les changements à l'intérieur du tableau
  //a chzque changement recuperer, on sauvegrade 
  watch(
    project,
    (newValue) => {
      saveToStorage(newValue);
    },
    { deep: true }
  );

function addLoss(text: string): void {
  const trimmed = text.trim();
  if (trimmed === '') return;

  // On calcule le prochain ID en cherchant le plus grand numéro déjà utilisé.
  // Exemple : si on a [L-1, L-3, L-7], le prochain sera L-8.
  const newId = `L-${getNextLossNumber()}`;

  project.value.losses.push({
    id: newId,
    text: trimmed,
  });
}

/**
 * Retourne le prochain numéro disponible pour une Loss.
 * On prend le plus grand numéro existant + 1.
 * Si aucune Loss n'existe, on commence à 1.
 */
function getNextLossNumber(): number {
  if (project.value.losses.length === 0) {
    return 1;
  }

  // On extrait le numéro de chaque ID (ex: "L-3" → 3)
  const numbers = project.value.losses.map((loss) => {
    const numStr = loss.id.replace('L-', ''); // "L-3" → "3"
    return parseInt(numStr, 10);              // "3" → 3
  });

  // On trouve le plus grand et on ajoute 1
  return Math.max(...numbers) + 1;
}

  // Action : supprimer une Loss par son id
  function removeLoss(id: string): void {
    project.value.losses = project.value.losses.filter(
      (loss) => loss.id !== id
    );
  }

  // ---------- Actions Hazards ----------

/**
 * Retourne le prochain numéro disponible pour un Hazard.
 * Même logique que pour les Losses : on prend le plus grand numéro + 1.
 */
function getNextHazardNumber(): number {
  if (project.value.hazards.length === 0) {
    return 1;
  }
  const numbers = project.value.hazards.map((hazard) => {
    const numStr = hazard.id.replace('H-', '');
    return parseInt(numStr, 10);
  });
  return Math.max(...numbers) + 1;
}

/**
 * Ajoute un nouveau Hazard avec ses Losses référencées.
 * @param text description du Hazard
 * @param lossIds IDs des Losses référencées (ex: ["L-1", "L-2"])
 */
function addHazard(text: string, lossIds: string[]): void {
  const trimmed = text.trim();
  if (trimmed === '') return;

  const newId = `H-${getNextHazardNumber()}`;

  project.value.hazards.push({
    id: newId,
    text: trimmed,
    losses: lossIds,
  });
}

/**
 * Supprime un Hazard par son id.
 */
function removeHazard(id: string): void {
  project.value.hazards = project.value.hazards.filter(
    (hazard) => hazard.id !== id
  );
}

  // On expose ce qui doit être accessible depuis les composants
return {
  project,
  addLoss,
  removeLoss,
  addHazard,
  removeHazard,
};
});