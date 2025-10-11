# Guide de Contribution

Merci de votre intérêt pour contribuer à Dr.MiMi ! 💕

## Comment Contribuer

### 1. Fork et Clone

```bash
# Fork le projet sur GitHub
# Puis clonez votre fork
git clone https://github.com/votre-username/DrMiMi-Replit.git
cd DrMiMi-Replit
```

### 2. Installation

```bash
# Installez les dépendances
npm install
```

### 3. Créez une Branche

```bash
# Créez une branche pour votre fonctionnalité
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 4. Développez

- Écrivez du code propre et bien commenté
- Suivez les conventions de code existantes
- Testez vos changements localement avec `npm run dev`
- Vérifiez le linting avec `npm run lint`
- Vérifiez les types avec `npm run type-check`

### 5. Commit

```bash
# Ajoutez vos changements
git add .

# Committez avec un message clair
git commit -m "feat: ajoute nouvelle fonctionnalité X"
```

#### Convention de Messages de Commit

Utilisez le format suivant :

- `feat:` pour une nouvelle fonctionnalité
- `fix:` pour une correction de bug
- `docs:` pour la documentation
- `style:` pour le formatage
- `refactor:` pour la refactorisation
- `test:` pour les tests
- `chore:` pour les tâches de maintenance

### 6. Push et Pull Request

```bash
# Poussez vers votre fork
git push origin feature/ma-nouvelle-fonctionnalite
```

Ensuite, créez une Pull Request sur GitHub avec :
- Un titre clair
- Une description détaillée des changements
- Des captures d'écran si applicable

## Standards de Code

### TypeScript

- Utilisez TypeScript strict
- Définissez les types pour toutes les props et fonctions
- Évitez `any` autant que possible

### React

- Utilisez des composants fonctionnels avec hooks
- Préférez les arrow functions
- Décomposez les composants complexes

### Styling

- Utilisez Tailwind CSS pour les styles
- Suivez le système de design existant
- Maintenez la cohérence visuelle

### Performance

- Optimisez les re-renders avec `useMemo` et `useCallback`
- Lazy load les composants quand approprié
- Optimisez les images et ressources

## Structure des Fichiers

```
src/
├── components/     # Composants réutilisables
├── contexts/       # Contextes React
├── data/          # Données statiques
├── hooks/         # Hooks personnalisés
├── pages/         # Pages de l'application
└── utils/         # Fonctions utilitaires
```

## Tests

Bien que les tests ne soient pas encore implémentés, les contributions incluant des tests sont fortement encouragées.

## Questions ?

N'hésitez pas à ouvrir une issue pour poser des questions ou discuter de nouvelles fonctionnalités.

## Code de Conduite

Veuillez lire et suivre notre [Code de Conduite](CODE_OF_CONDUCT.md).

---

Merci de contribuer à rendre Dr.MiMi meilleur ! 🩺✨
