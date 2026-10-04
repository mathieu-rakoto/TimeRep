# Time' Rep

Minuteur d'intervalles pour les séances de sport : on règle le nombre de séries (12 au maximum), la durée de l'effort (facultative) et celle du repos, puis le programme enchaîne seul effort → repos → effort → repos… jusqu'à la dernière série.

Site : https://timerep.dreamhub.fr/

## Fonctionnalités

- **Programme de séries** : nombre de séries, durée d'effort et durée de repos en minutes/secondes (entiers uniquement).
- **Effort libre** : si la durée d'effort est laissée vide, rien ne défile pendant l'effort et on termine la série avec le bouton « Set done ».
- **Frise de progression** : une barre par effort, un trait par repos, qui se vide au fil de la séance.
- **Bips** sur les 5 dernières secondes de chaque phase.
- **Pause, Skip, Stop** pendant le programme.
- **Écran maintenu allumé** pendant la séance (Screen Wake Lock, si le navigateur le permet), et chrono calé sur l'horloge réelle : il rattrape son retard si le navigateur ralentit l'onglet.
- Pas de repos après la dernière série : la séance est terminée dès qu'elle l'est.

## Développement

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production dans dist/
npm run lint     # ESLint
```

Vite 8 demande Node 20.19+ ou 22.12+.

Le site est statique : le contenu de `dist/` est à déposer sur l'hébergement.

## Stack

React 19, Vite 8, JavaScript (JSX), CSS simple. Aucun backend, aucune donnée stockée.
