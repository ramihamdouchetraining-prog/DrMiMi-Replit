#!/bin/bash
echo "📦 Création d'une archive allégée..."

# Créer dossier temporaire
mkdir -p /tmp/dr-mimi-light

# Copier UNIQUEMENT les fichiers essentiels (sans node_modules, .git, dist)
rsync -av --exclude='node_modules' \
          --exclude='.git' \
          --exclude='dist' \
          --exclude='/tmp' \
          --exclude='*.log' \
          . /tmp/dr-mimi-light/

# Créer le zip
cd /tmp
zip -r dr-mimi-light.zip dr-mimi-light/

# Déplacer dans le workspace
mv dr-mimi-light.zip /home/runner/workspace/

echo "✅ Archive créée : dr-mimi-light.zip"
echo "📊 Taille : $(du -sh /home/runner/workspace/dr-mimi-light.zip | cut -f1)"
echo ""
echo "📥 Téléchargez-la via : Files → dr-mimi-light.zip → Download"
