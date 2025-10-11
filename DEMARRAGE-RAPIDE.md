# 🚀 Démarrage Rapide - Dr.MiMi

Guide rapide pour commencer à développer sur Dr.MiMi en quelques minutes.

## ⚡ Installation Express

```bash
# 1. Cloner le repository
git clone https://github.com/ramihamdouchetraining-prog/DrMiMi-Replit.git
cd DrMiMi-Replit

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Voilà ! L'application est accessible sur http://localhost:5173

## 📋 Commandes Essentielles

```bash
# Développement
npm run dev              # Lancer le serveur de développement

# Build
npm run build           # Compiler pour la production
npm run preview         # Prévisualiser le build

# Qualité du code
npm run lint            # Vérifier le code avec ESLint
npm run type-check      # Vérifier les types TypeScript
```

## 🎯 Premiers Pas

### 1. Explorer la Structure

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── contexts/      # État global (Thème, Langue)
├── hooks/         # Hooks personnalisés
└── App.tsx        # Point d'entrée principal
```

### 2. Créer un Nouveau Composant

```typescript
// src/components/MonComposant.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MonComposantProps {
  title: string;
}

const MonComposant: React.FC<MonComposantProps> = ({ title }) => {
  return (
    <motion.div
      className="p-4 bg-blue-500 text-white rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>{title}</h2>
    </motion.div>
  );
};

export default MonComposant;
```

### 3. Ajouter une Nouvelle Page

```typescript
// src/pages/MaNouvellePage.tsx
import React from 'react';

const MaNouvellePage: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Ma Nouvelle Page</h1>
    </div>
  );
};

export default MaNouvellePage;
```

Puis l'ajouter dans App.tsx :

```typescript
import MaNouvellePage from './pages/MaNouvellePage';

// Dans les routes
<Route path="/ma-page" element={<MaNouvellePage />} />
```

### 4. Utiliser les Contextes

#### Thème

```typescript
import { useTheme } from './contexts/ThemeContext';

const MonComposant = () => {
  const { isDark, toggleTheme, isFeminine } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌞 Clair' : '🌙 Sombre'}
    </button>
  );
};
```

#### Langue

```typescript
import { useLanguage } from './contexts/LanguageContext';

const MonComposant = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <p>{t('home.title')}</p>
      <button onClick={() => setLanguage('fr')}>Français</button>
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('ar')}>العربية</button>
    </div>
  );
};
```

## 🎨 Styling avec Tailwind

```typescript
// Classes utilitaires
<div className="flex items-center justify-center p-4">
  <button className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
    Cliquer ici
  </button>
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenu */}
</div>
```

## 🎭 Animations avec Framer Motion

```typescript
import { motion } from 'framer-motion';

// Animation simple
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Contenu animé
</motion.div>

// Animation au survol
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Bouton interactif
</motion.button>
```

## 🔍 Debugging

### Outils de Développement

```typescript
// Console logs avec style
console.log('%c Debug Info', 'color: blue; font-weight: bold', data);

// React DevTools (extension Chrome/Firefox)
// Inspecter les composants et leur état

// TypeScript errors
// Vérifier la console du terminal pour les erreurs de type
```

### Erreurs Communes

**Erreur : Module not found**
```bash
# Solution : Installer la dépendance manquante
npm install nom-du-package
```

**Erreur : Port already in use**
```bash
# Solution : Utiliser un autre port
npm run dev -- --port 5174
```

**Erreur : Build failed**
```bash
# Solution : Nettoyer et réinstaller
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

## 📚 Ressources Utiles

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)
- [Documentation Framer Motion](https://www.framer.com/motion/)
- [Documentation Vite](https://vitejs.dev/)

## 🆘 Besoin d'Aide ?

1. Consulter la [documentation complète](README.md)
2. Voir les [exemples d'architecture](ARCHITECTURE.md)
3. Lire le [guide de contribution](CONTRIBUTING.md)
4. Ouvrir une [issue sur GitHub](https://github.com/ramihamdouchetraining-prog/DrMiMi-Replit/issues)

## ⚡ Astuces Productivité

### VSCode Extensions

Installer les extensions recommandées :
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

### Raccourcis Utiles

```bash
# Terminal
Ctrl + C          # Arrêter le serveur
Ctrl + `          # Ouvrir/fermer le terminal

# VSCode
Ctrl + P          # Rechercher un fichier
Ctrl + Shift + P  # Palette de commandes
F2                # Renommer un symbole
Alt + ↑/↓         # Déplacer une ligne
```

### Hot Reload

Le serveur de développement se recharge automatiquement quand vous modifiez :
- ✅ Fichiers .tsx/.ts
- ✅ Fichiers .css
- ✅ Fichiers de configuration

## 🎯 Prochaines Étapes

1. ✅ Installation terminée
2. 📖 Lire la [documentation d'architecture](ARCHITECTURE.md)
3. 🎨 Personnaliser les thèmes
4. 📝 Ajouter du contenu médical
5. 🚀 Déployer (voir [DEPLOYMENT.md](DEPLOYMENT.md))

---

Bon développement avec Dr.MiMi ! 💕🩺
