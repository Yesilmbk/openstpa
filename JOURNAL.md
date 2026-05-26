# Journal de bord — OpenSTPA

Auteur : Ilyes Mobarek  
Stage : Hirose Lab, Sendai Kosen — 2026  
Outil : OpenSTPA — outil web d'analyse de sécurité STPA

---

## 25 mai 2026 — Session 1 : cadrage et exploration

### Réalisé
- Analyse du paysage des outils STPA existants (XSTAMPP, STAMP Workbench, 
  STPA Documentation Tool de Codethink, STPAmaster)
- Constat : l'outil STPA Documentation Tool (Codethink, 2019) est 
  abandonné par son créateur depuis 2021 au profit d'une approche 
  YAML + Python + Markdown. STAMP Workbench (IPA Japan) est Windows-only.
- Décision : créer un outil web open source cross-platform (Linux/Mac/
  Windows par essence) qui comble ce gap
- Nom retenu : **OpenSTPA**
- Licence retenue : **Apache 2.0** (permissive + protection brevets, 
  adaptée au domaine safety)
- Stack technique choisie : Vue 3 + TypeScript + Vite + Tailwind v3 + Pinia
- Hébergement : GitHub perso (github.com/Yesilmbk/openstpa)
- Première tentative de génération via Claude Code (scaffolding et 
  premier code généré)

### Décision de fin de session
Le code généré par IA dépassait ma capacité de compréhension. Décision 
de reprendre à zéro le développement métier en codage manuel, en 
gardant uniquement le scaffolding initial des outils (Vite, Vue, 
Tailwind, Pinia configurés). Claude Code reste réservé au déblocage 
de bugs techniques précis.

---

## 26 mai 2026 — Session 2 : démarrage du code manuel

### Réalisé
- Reset du repo Git au commit du scaffolding (`git reset --hard`)
- Configuration de l'éditeur App.vue avec un header sobre et professionnel
- Création du premier type STPA en TypeScript : `Loss` dans `src/types/stpa.ts`
- Création du premier composant Vue : `LossesEditor.vue` avec :
  - Champ de saisie + bouton Ajouter
  - Liste des Losses existantes avec suppression
  - Validation contre les entrées vides
- Découverte des 4 concepts Vue de base utilisés en pratique : 
  `ref()`, `v-model`, `v-for`, `@click`

### Premier bug rencontré et résolu — Identifiants dupliqués

L'implémentation initiale calculait l'ID des Losses à partir de la 
taille du tableau (`L-${losses.length + 1}`). Après suppression d'une 
Loss intermédiaire puis ajout d'une nouvelle, l'identifiant se 
retrouvait dupliqué. Exemple : `[L-1, L-2, L-3]` → suppression de L-2 
→ ajout d'une nouvelle → recalcul `length + 1 = 3` → l'ID `L-3` 
existait déjà.

**Correction** : implémentation d'une fonction `getNextLossNumber()` 
qui parcourt le tableau, extrait les numéros existants, et retourne 
`max + 1`. Garantit l'unicité monotone des identifiants, propriété 
essentielle en analyse de sécurité où la traçabilité des références 
doit être stable dans le temps. Bug à ne pas reproduire pour les 
autres entités (Hazards, UCAs, etc.).

### Deuxième bug — Interpolation d'une fonction sans appel

J'ai écrit `` `L-${getNextLossNumber}` `` (sans parenthèses) au lieu 
de `` `L-${getNextLossNumber()}` `` (avec parenthèses). Conséquence : 
le code source de la fonction était inséré comme chaîne dans l'ID. 
Bug classique en JavaScript : sans parenthèses, on manipule la 
référence à la fonction ; avec parenthèses, on appelle la fonction 
et on récupère sa valeur de retour.

### Mise en place de la persistance avec Pinia + localStorage

- Création du store Pinia `useProjectStore` dans `src/stores/project.ts`
- Persistance automatique via `watch(project, ..., { deep: true })` 
  qui déclenche `localStorage.setItem` à chaque mutation
- Choix architectural : centraliser la persistance dans un watch 
  unique au lieu de l'appeler dans chaque action. Avantage : 
  responsabilité unique, pas de duplication, pas de risque d'oubli 
  dans une nouvelle action
- Lecture initiale depuis localStorage au démarrage du store

### Création du second éditeur : HazardsEditor

- Ajout du type `Hazard` (champs : `id`, `text`, `losses: string[]`)
- Mise à jour du type `Project` pour inclure `hazards: Hazard[]`
- Ajout des actions `addHazard` et `removeHazard` dans le store
- Création du composant `HazardsEditor.vue` avec :
  - Avertissement si aucune Loss n'existe encore
  - Système de cases à cocher pour référencer plusieurs Losses 
    (utilisation avancée de `v-model` sur tableau)
  - Affichage des Losses référencées en tags bleus sous chaque Hazard

### Troisième bug — Composant non rendu à cause d'un raccourci de routing

Après création de `HazardsEditor.vue` et import dans `HomeView.vue`, 
le composant ne s'affichait pas dans le navigateur. Cause racine : 
le fichier `App.vue` rendait directement `<LossesEditor />` au lieu 
de déléguer au routeur via `<RouterView />`. Conséquence : la vue 
`HomeView` n'était jamais montée par Vue Router, donc `HazardsEditor` 
(qui est dans `HomeView`) restait invisible.

**Correction** : remplacement de l'import direct par `<RouterView />` 
dans `App.vue`. Vue Router monte alors `HomeView` qui agrège les 
deux éditeurs.

**Leçon architecturale** : un composant racine doit déléguer le rendu 
des pages au routeur et ne contenir directement que les éléments 
persistants à travers la navigation (header, footer, sidebar globale). 
Mélanger rendu direct et routing court-circuite le système.

### Choix de méthodologie : assistance IA ciblée

Pour ce bug spécifique, j'ai utilisé Claude Code (Anthropic) pour 
gagner du temps de diagnostic. Conformément à ma méthodologie de 
stage, l'IA est utilisée comme assistant de débogage ponctuel et 
non comme générateur de code. Chaque correction proposée est 
revue, comprise et documentée avant d'être appliquée.

### À faire la prochaine fois (Session 3)
- Ajouter le type et l'éditeur des Safety Constraints (SC)
- Ajouter le type et l'éditeur des UCAs (avec la notion de type : 
  Not Provided, Provided, Wrong Timing, Stopped Too Soon)
- Ajouter le type et l'éditeur des Causal Scenarios (CS)
- Commencer à concevoir la vue de traçabilité

### Concepts à creuser
- Vue Router en profondeur (routes, paramètres, navigation programmée)
- Les `computed` Vue (alternatives aux `ref` pour les valeurs dérivées)
- Les tests unitaires Vitest

---