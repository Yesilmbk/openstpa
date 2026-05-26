// Types du modèle de données STPA
// On ajoutera ici les autres entités au fur et à mesure
// (Hazards, UCAs, etc.)

/**
 * Loss : une perte inacceptable au niveau système.
 * Exemple : "L-1 : collision entre le véhicule et un piéton"
 */
export type Loss = {
  id: string;      // ex: "L-1", "L-2", ...
  text: string;    // description en langage naturel
};