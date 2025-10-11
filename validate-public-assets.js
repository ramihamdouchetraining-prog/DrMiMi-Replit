#!/usr/bin/env node
/**
 * Script de validation des ressources du dossier public
 * Vérifie que tous les fichiers attendus sont présents
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ressources requises
const REQUIRED_ASSETS = {
  avatars: [
    'reading.png',
    'stethoscope.png',
    'medicine.png',
    'idea.png',
    'pointing.png',
    'greeting.png',
    'writing.png',
    'thinking.png',
    'smiling.png',
    'laptop.png',
    'pondering.png',
    'celebration.png',
    'teaching.png',
    'encouragement.png',
    'questioning.png'
  ],
  logos: [
    'logo-hijab.png'
  ],
  generated: [
    'Dr._Mimi_medical_logo_6b7ade86.png'
  ]
};

const PATHS = {
  avatars: 'public/images/avatars',
  logos: 'public/images/logos',
  generated: 'public/attached_assets/generated_images'
};

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function createPlaceholder(path) {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  // Créer un fichier placeholder vide
  writeFileSync(path, '');
  log(`  ✓ Créé: ${path}`, colors.green);
}

function validateAssets(category, files, basePath) {
  log(`\n📁 Validation: ${category}`, colors.cyan);
  log(`   Chemin: ${basePath}`, colors.blue);
  
  let missing = [];
  let present = [];
  
  for (const file of files) {
    const fullPath = join(basePath, file);
    if (existsSync(fullPath)) {
      present.push(file);
      log(`  ✓ ${file}`, colors.green);
    } else {
      missing.push(file);
      log(`  ✗ ${file} - MANQUANT`, colors.red);
    }
  }
  
  return { missing, present, total: files.length };
}

function generateReport(results) {
  log('\n' + '='.repeat(60), colors.cyan);
  log('📊 RAPPORT DE VALIDATION', colors.cyan);
  log('='.repeat(60), colors.cyan);
  
  let totalMissing = 0;
  let totalPresent = 0;
  let totalFiles = 0;
  
  for (const [category, result] of Object.entries(results)) {
    totalMissing += result.missing.length;
    totalPresent += result.present.length;
    totalFiles += result.total;
    
    log(`\n${category}:`, colors.yellow);
    log(`  Présents: ${result.present.length}/${result.total}`, 
        result.present.length === result.total ? colors.green : colors.yellow);
    log(`  Manquants: ${result.missing.length}/${result.total}`, 
        result.missing.length > 0 ? colors.red : colors.green);
  }
  
  log('\n' + '-'.repeat(60), colors.cyan);
  log(`Total: ${totalPresent}/${totalFiles} fichiers présents`, 
      totalPresent === totalFiles ? colors.green : colors.yellow);
  
  if (totalMissing > 0) {
    log(`\n⚠️  ${totalMissing} fichier(s) manquant(s)`, colors.red);
    return false;
  } else {
    log('\n✅ Tous les fichiers requis sont présents!', colors.green);
    return true;
  }
}

function createMissingDirectories() {
  log('\n🔨 Création des dossiers manquants...', colors.yellow);
  
  for (const [key, path] of Object.entries(PATHS)) {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
      log(`  ✓ Créé: ${path}`, colors.green);
    } else {
      log(`  ✓ Existe: ${path}`, colors.blue);
    }
  }
}

function createPlaceholderFiles(results, createFiles = false) {
  if (!createFiles) {
    log('\n💡 Pour créer des fichiers placeholder, utilisez: --create-placeholders', colors.yellow);
    return;
  }
  
  log('\n🔨 Création des fichiers placeholder...', colors.yellow);
  
  for (const [category, result] of Object.entries(results)) {
    if (result.missing.length > 0) {
      const basePath = PATHS[category];
      for (const file of result.missing) {
        const fullPath = join(basePath, file);
        createPlaceholder(fullPath);
      }
    }
  }
}

// Main
function main() {
  const args = process.argv.slice(2);
  const createPlaceholders = args.includes('--create-placeholders');
  const createDirs = args.includes('--create-dirs');
  
  log('🔍 VALIDATION DES RESSOURCES DU DOSSIER PUBLIC', colors.cyan);
  log('='.repeat(60), colors.cyan);
  
  // Créer les dossiers si demandé
  if (createDirs) {
    createMissingDirectories();
  }
  
  // Valider les ressources
  const results = {
    avatars: validateAssets('Avatars Dr. Mimi', REQUIRED_ASSETS.avatars, PATHS.avatars),
    logos: validateAssets('Logos', REQUIRED_ASSETS.logos, PATHS.logos),
    generated: validateAssets('Images générées', REQUIRED_ASSETS.generated, PATHS.generated)
  };
  
  // Générer le rapport
  const allPresent = generateReport(results);
  
  // Créer les placeholders si demandé
  if (createPlaceholders) {
    createPlaceholderFiles(results, true);
  }
  
  // Documentation
  log('\n📝 NOTES:', colors.cyan);
  log('  • Les avatars Dr. Mimi doivent être des images PNG', colors.blue);
  log('  • Les logos doivent être aux formats PNG ou SVG', colors.blue);
  log('  • Placez les vraies images dans les dossiers appropriés', colors.blue);
  log('\n🔧 OPTIONS:', colors.cyan);
  log('  --create-dirs        Créer les dossiers manquants', colors.blue);
  log('  --create-placeholders Créer des fichiers placeholder vides', colors.blue);
  
  process.exit(allPresent ? 0 : 1);
}

main();
