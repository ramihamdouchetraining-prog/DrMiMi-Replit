# 📁 Documentation des Ressources du Dossier Public

## 📋 Vue d'ensemble

Ce document décrit la structure et les ressources requises dans le dossier `public/` pour le projet Dr. Mimi.

## 🗂️ Structure du Dossier Public

```
public/
├── vite.svg                                    # Logo Vite (par défaut)
├── images/
│   ├── avatars/                                # Avatars Dr. Mimi (15 poses)
│   │   ├── reading.png                         # Dr. Mimi en train de lire
│   │   ├── stethoscope.png                     # Dr. Mimi avec stéthoscope
│   │   ├── medicine.png                        # Dr. Mimi avec médicaments
│   │   ├── idea.png                            # Dr. Mimi avec une idée
│   │   ├── pointing.png                        # Dr. Mimi pointant
│   │   ├── greeting.png                        # Dr. Mimi saluant
│   │   ├── writing.png                         # Dr. Mimi écrivant
│   │   ├── thinking.png                        # Dr. Mimi réfléchissant
│   │   ├── smiling.png                         # Dr. Mimi souriant
│   │   ├── laptop.png                          # Dr. Mimi avec ordinateur
│   │   ├── pondering.png                       # Dr. Mimi méditant
│   │   ├── celebration.png                     # Dr. Mimi célébrant
│   │   ├── teaching.png                        # Dr. Mimi enseignant
│   │   ├── encouragement.png                   # Dr. Mimi encourageant
│   │   └── questioning.png                     # Dr. Mimi questionnant
│   └── logos/
│       └── logo-hijab.png                      # Logo Dr. Mimi avec hijab
└── attached_assets/
    └── generated_images/
        └── Dr._Mimi_medical_logo_6b7ade86.png  # Logo médical Dr. Mimi
```

## 🎯 Ressources Requises

### 1. Avatars Dr. Mimi (15 poses)

Les avatars sont utilisés dans plusieurs composants de l'application :
- `AvatarDrMimi.tsx` - Composant principal des avatars
- `StudyLevelSelector.tsx` - Sélection de niveau d'études
- Autres composants interactifs

**Spécifications:**
- Format: PNG avec transparence
- Taille recommandée: 256x256px minimum
- Style: Mascotte médicale féminine avec hijab
- Poses: 15 expressions/actions différentes (voir liste ci-dessus)

### 2. Logos

**logo-hijab.png**
- Utilisé dans: `DrMimiAvatar.tsx`, `EnhancedDrMimiAvatar.tsx`, `AdvancedChatbot.tsx`
- Format: PNG avec transparence
- Taille recommandée: 128x128px

**Dr._Mimi_medical_logo_6b7ade86.png**
- Utilisé dans: `App.original.tsx`
- Format: PNG avec transparence
- Taille recommandée: 256x256px
- Style: Logo professionnel médical

## 🔧 Scripts de Validation

### Valider les ressources

```bash
npm run validate:assets
```

Ce script vérifie que tous les fichiers requis sont présents dans le dossier `public/`.

### Créer la structure et les placeholders

```bash
npm run setup:assets
```

Ce script:
1. Crée tous les dossiers nécessaires
2. Génère des fichiers placeholder vides pour les ressources manquantes

### Utilisation directe

```bash
# Validation simple
node validate-public-assets.js

# Créer les dossiers manquants
node validate-public-assets.js --create-dirs

# Créer les dossiers et les placeholders
node validate-public-assets.js --create-dirs --create-placeholders
```

## 📊 Rapport de Validation

Le script de validation génère un rapport coloré indiquant:
- ✓ Fichiers présents (vert)
- ✗ Fichiers manquants (rouge)
- Statistiques par catégorie
- Total général

Exemple de sortie:
```
📁 Validation: Avatars Dr. Mimi
   Chemin: public/images/avatars
  ✓ reading.png
  ✓ stethoscope.png
  ...

📊 RAPPORT DE VALIDATION
avatars: 15/15 présents
logos: 1/1 présents
generated: 1/1 présents
Total: 17/17 fichiers présents
✅ Tous les fichiers requis sont présents!
```

## 🚀 Workflow de Développement

### 1. Premier lancement

```bash
# Installer les dépendances
npm install

# Créer la structure et les placeholders
npm run setup:assets

# Valider
npm run validate:assets
```

### 2. Avant le build

```bash
# Vérifier que toutes les ressources sont présentes
npm run validate:assets

# Si tout est OK, builder
npm run build
```

### 3. Intégration Continue (CI/CD)

Le workflow GitHub Actions (`.github/workflows/deploy.yml`) peut inclure:

```yaml
- name: Validate Public Assets
  run: npm run validate:assets
```

## 📝 Notes Importantes

### Placeholders vs Vraies Images

- Les placeholders sont des fichiers **vides** créés automatiquement
- Ils permettent à l'application de ne pas crasher en attendant les vraies images
- **Important**: Remplacez les placeholders par de vraies images pour la production

### Ajout de Nouvelles Ressources

Si vous ajoutez de nouvelles ressources requises:

1. Modifiez `validate-public-assets.js`:
```javascript
const REQUIRED_ASSETS = {
  avatars: [...],
  logos: [...],
  // Ajoutez votre nouvelle catégorie
  nouvelleCategorie: ['fichier1.png', 'fichier2.png']
};

const PATHS = {
  // ...
  nouvelleCategorie: 'public/votre/chemin'
};
```

2. Testez la validation:
```bash
npm run validate:assets
```

### Formats Supportés

- **Images**: PNG (recommandé), JPG, SVG
- **Transparence**: Utilisez PNG pour les images avec transparence
- **Performance**: Optimisez les images avant de les ajouter

## 🛠️ Dépannage

### Erreur: "Fichiers manquants"

```bash
# Créer les placeholders automatiquement
npm run setup:assets
```

### Erreur: "Cannot find module"

```bash
# Réinstaller les dépendances
npm install
```

### Les images ne s'affichent pas

1. Vérifiez que les fichiers existent:
   ```bash
   npm run validate:assets
   ```

2. Vérifiez les chemins dans le code:
   - Les chemins doivent commencer par `/` (ex: `/images/avatars/reading.png`)
   - Pas de `./` ou `../` dans les chemins

3. Vérifiez que les fichiers ne sont pas vides:
   ```bash
   ls -lh public/images/avatars/
   ```

## 📦 Build et Déploiement

### Build Local

```bash
npm run build
```

Le dossier `public/` est copié automatiquement dans `dist/` lors du build.

### Déploiement

Assurez-vous que:
1. Toutes les ressources sont présentes et valides
2. Les images ne sont pas trop volumineuses (< 500KB par fichier recommandé)
3. Le script de validation passe sans erreurs

```bash
npm run validate:assets && npm run build
```

## 🔗 Références

- Composant principal: `src/components/AvatarDrMimi.tsx`
- Configuration Vite: `vite.config.ts`
- Documentation projet: `README.md`
- Setup complet: `SETUP_COMPLETE.md`

## 📞 Support

En cas de problème:
1. Exécutez `npm run validate:assets` pour diagnostiquer
2. Vérifiez ce document pour les solutions courantes
3. Consultez les logs de build pour plus de détails

---

**Dernière mise à jour**: Octobre 2025
**Version**: 1.0.0
