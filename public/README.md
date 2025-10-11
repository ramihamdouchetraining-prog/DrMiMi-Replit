# 📁 Dossier Public - Ressources Statiques

Ce dossier contient toutes les ressources statiques accessibles publiquement par l'application Dr. Mimi.

## 🗂️ Structure

```
public/
├── vite.svg                    # Logo Vite par défaut
├── images/
│   ├── avatars/               # 15 avatars Dr. Mimi (PNG)
│   └── logos/                 # Logos de l'application
└── attached_assets/
    └── generated_images/      # Images générées
```

## ⚠️ Important

### Placeholders
Les fichiers actuellement présents sont des **placeholders vides**. Ils doivent être remplacés par de vraies images avant la mise en production.

### Validation
Utilisez le script de validation pour vérifier les ressources :

```bash
npm run validate:assets
```

## 📝 Documentation Complète

Voir le fichier `PUBLIC_ASSETS.md` à la racine du projet pour la documentation détaillée.

## 🎨 Spécifications des Images

### Avatars (15 poses)
- Format: PNG avec transparence
- Taille: 256x256px minimum
- Poses requises: reading, stethoscope, medicine, idea, pointing, greeting, writing, thinking, smiling, laptop, pondering, celebration, teaching, encouragement, questioning

### Logos
- Format: PNG avec transparence
- logo-hijab.png: 128x128px
- Dr._Mimi_medical_logo: 256x256px

## 🚀 Workflow

1. Remplacer les placeholders par les vraies images
2. Valider: `npm run validate:assets`
3. Tester: `npm run dev`
4. Builder: `npm run build`

---
**Note**: Ne commitez pas d'images trop volumineuses (< 500KB recommandé par fichier)
