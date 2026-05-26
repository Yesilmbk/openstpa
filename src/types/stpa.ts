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

/**
 * Hazard : état du système qui peut conduire à une Loss.
 * Exemple : "H-1 : Le véhicule se déplace vers un piéton dans sa trajectoire"
 * Chaque Hazard référence une ou plusieurs Losses qu'il pourrait causer.
 */
export type Hazard = {
  id: string;            // ex: "H-1", "H-2"
  text: string;          // description en langage naturel
  losses: string[];      // IDs des Losses référencées, ex: ["L-1", "L-3"]
};