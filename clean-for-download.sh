#!/bin/bash

echo "🧹 Nettoyage du projet pour téléchargement..."

# Supprimer node_modules (sera réinstallé avec npm install)
echo "📦 Suppression de node_modules/ (472 MB)..."
rm -rf node_modules

# Supprimer dist (sera recréé avec npm run build)
echo "🏗️ Suppression de dist/ (2.2 MB)..."
rm -rf dist

# Supprimer logs temporaires
echo "🗑️ Suppression des logs temporaires..."
rm -rf /tmp/logs

# Vérifier la nouvelle taille
echo ""
echo "✅ Nettoyage terminé !"
echo "📊 Nouvelle taille :"
du -sh . 2>/dev/null

echo ""
echo "⚠️ IMPORTANT : Dans le nouveau Replit, lancez :"
echo "   npm install"
echo "   npm run build"
