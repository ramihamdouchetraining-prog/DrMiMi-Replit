# 🩺 Dr.MiMi - Plateforme d'Apprentissage Médical Interactive

![Dr.MiMi Banner](https://via.placeholder.com/1200x300/FF69B4/FFFFFF?text=Dr.MiMi+-+Votre+Compagne+d%27Apprentissage+M%C3%A9dical)

## 📋 Description

Dr.MiMi est une plateforme d'apprentissage médical interactive conçue pour les étudiants en médecine. Elle offre une expérience d'apprentissage ludique et efficace avec des cours structurés, des résumés visuels, des QCM interactifs et des cas cliniques.

### ✨ Fonctionnalités Principales

- 📚 **Cours Structurés** : Contenus organisés par modules et années d'études
- 📝 **Résumés Visuels** : Fiches imprimables avec schémas et diagrammes clairs
- ✅ **QCM Interactifs** : Questions variées avec corrections détaillées et explications
- 🏥 **Cas Cliniques** : Situations pratiques pour développer le raisonnement clinique
- 🤖 **Chatbot IA** : Assistant virtuel Dr.MiMi pour répondre à vos questions
- 🌍 **Multilingue** : Support français/anglais/arabe
- 🎨 **Thèmes Personnalisables** : Mode clair/sombre et styles féminins/neutres
- 📱 **PWA** : Fonctionne hors ligne et installable sur mobile

## 🚀 Installation

### Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0

### Étapes d'installation

```bash
# Cloner le dépôt
git clone https://github.com/ramihamdouchetraining-prog/DrMiMi-Replit.git

# Accéder au répertoire
cd DrMiMi-Replit

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le serveur de développement sera accessible sur `http://localhost:5173`

## 🛠️ Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile le projet pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run type-check` - Vérifie les types TypeScript

## 📁 Structure du Projet

```
DrMiMi-Replit/
├── public/              # Fichiers statiques
│   ├── icons/          # Icônes PWA
│   ├── images/         # Images et médias
│   └── sw.js           # Service Worker
├── src/
│   ├── components/     # Composants React réutilisables
│   ├── contexts/       # Contextes React (Thème, Langue)
│   ├── data/          # Données statiques
│   ├── extentions/    # Extensions TipTap
│   ├── hooks/         # Hooks personnalisés
│   ├── pages/         # Pages de l'application
│   ├── App.tsx        # Composant principal
│   ├── main.tsx       # Point d'entrée
│   └── index.css      # Styles globaux
├── index.html         # Template HTML
├── package.json       # Dépendances
├── tsconfig.json      # Configuration TypeScript
├── vite.config.ts     # Configuration Vite
└── tailwind.config.js # Configuration Tailwind CSS
```

## 🎨 Technologies Utilisées

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Framer Motion
- **Build Tool**: Vite
- **State Management**: React Query + Context API
- **Editor**: TipTap (WYSIWYG)
- **Icons**: Lucide React
- **i18n**: i18next

## 👥 Rôles et Permissions

L'application supporte trois types d'utilisateurs :

1. **Étudiants** : Accès aux cours, quiz, et bibliothèque
2. **Administrateurs** : Gestion du contenu et des utilisateurs
3. **Propriétaire** : Accès complet avec gestion financière

## 🌐 Déploiement

### Déploiement sur Vercel

```bash
npm run build
vercel --prod
```

### Déploiement sur Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Rami Hamdouche**

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

## 🙏 Remerciements

Merci à tous les étudiants en médecine qui utilisent Dr.MiMi pour leur apprentissage ! 💕

---

Fait avec 💖 par [Rami Hamdouche](https://github.com/ramihamdouchetraining-prog)
