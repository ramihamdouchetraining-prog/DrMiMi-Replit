# Dr. Mimi - Plateforme d'Apprentissage Médical Interactive

Une plateforme moderne et interactive pour l'apprentissage médical, développée avec React, TypeScript, et Vite.

## 🌟 Caractéristiques

- 🎓 Interface d'apprentissage interactive
- 🤖 Chatbot médical avancé
- 📊 Visualisation de données médicales
- 🎨 Thèmes clair/sombre
- 🌐 Support multilingue (Français, Arabe, Anglais)
- 📝 Éditeur de texte riche (TipTap)
- 🎯 Quiz et tests interactifs
- 📈 Tableaux de bord analytiques
- 👤 Système d'authentification et RBAC

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/ramihamdouchetraining-prog/DrMiMi-Replit.git
cd DrMiMi-Replit

# Installer les dépendances
npm install

# Valider et créer la structure des ressources publiques
npm run setup:assets

# Lancer le serveur de développement
npm run dev
```

> **⚠️ Important**: Après l'installation, remplacez les fichiers placeholder dans `public/images/` par de vraies images. Voir [PUBLIC_ASSETS.md](PUBLIC_ASSETS.md) pour plus de détails.

## 📦 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile le projet pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run validate:assets` - Valide les ressources du dossier public
- `npm run setup:assets` - Crée la structure et les placeholders des ressources

## 🛠️ Technologies utilisées

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne et rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations
- **TipTap** - Éditeur de texte riche
- **Chart.js** - Graphiques et visualisations
- **i18next** - Internationalisation
- **React Router** - Gestion des routes

## 📁 Structure du projet

```
DrMiMi-Replit/
├── src/
│   ├── components/     # Composants React
│   ├── contexts/       # Contextes React
│   ├── data/          # Données statiques
│   ├── extensions/    # Extensions TipTap
│   ├── hooks/         # Hooks personnalisés
│   ├── locales/       # Fichiers de traduction
│   ├── pages/         # Pages de l'application
│   ├── utils/         # Fonctions utilitaires
│   ├── App.tsx        # Composant principal
│   ├── main.tsx       # Point d'entrée
│   └── index.css      # Styles globaux
├── public/            # Fichiers statiques
├── index.html         # Template HTML
├── package.json       # Dépendances
├── tsconfig.json      # Configuration TypeScript
├── vite.config.ts     # Configuration Vite
└── tailwind.config.js # Configuration Tailwind

```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Développé par Rami Hamdouche

---

**Note**: Ce projet est en développement actif. Les fonctionnalités peuvent évoluer.
