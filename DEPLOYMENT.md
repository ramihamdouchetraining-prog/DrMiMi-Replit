# Guide de Déploiement Dr.MiMi

Ce guide vous explique comment déployer Dr.MiMi sur différentes plateformes.

## 📋 Prérequis

Avant de déployer, assurez-vous que :

1. Le projet build sans erreurs : `npm run build`
2. Tous les tests passent (si disponibles)
3. Les variables d'environnement sont configurées
4. Les icônes PWA sont générées et placées dans `/public/icons/`

## 🚀 Déploiement sur Vercel (Recommandé)

### Via l'interface Vercel

1. Connectez-vous sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre dépôt GitHub
4. Vercel détectera automatiquement Vite
5. Configurez les variables d'environnement si nécessaire
6. Cliquez sur "Deploy"

### Via la CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

## 🌐 Déploiement sur Netlify

### Via l'interface Netlify

1. Connectez-vous sur [netlify.com](https://netlify.com)
2. Cliquez sur "Add new site" > "Import an existing project"
3. Sélectionnez votre dépôt GitHub
4. Configurez :
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Ajoutez les variables d'environnement dans Settings
6. Cliquez sur "Deploy site"

### Via la CLI Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Se connecter
netlify login

# Déployer
npm run build
netlify deploy --prod --dir=dist
```

## 🐳 Déploiement Docker

### Créer un Dockerfile

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Déployer

```bash
# Build l'image
docker build -t drmimi .

# Lancer le conteneur
docker run -p 80:80 drmimi
```

## ☁️ Déploiement sur AWS S3 + CloudFront

```bash
# Build le projet
npm run build

# Synchroniser avec S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalider le cache CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 🔧 Configuration des Variables d'Environnement

Créez un fichier `.env.production` :

```bash
VITE_API_URL=https://api.drmimi.com
VITE_FIREBASE_API_KEY=your_production_key
VITE_OPENAI_API_KEY=your_production_key
VITE_ENV=production
```

## 📱 Configuration PWA

Assurez-vous que :

1. Tous les icônes PWA sont présents dans `/public/icons/`
2. Le `manifest.json` est correctement configuré
3. Le service worker `sw.js` fonctionne
4. HTTPS est activé (obligatoire pour PWA)

## 🔒 Sécurité

### Avant le déploiement en production :

- [ ] Changer tous les mots de passe par défaut
- [ ] Configurer CORS correctement
- [ ] Activer HTTPS/SSL
- [ ] Configurer les en-têtes de sécurité
- [ ] Activer rate limiting
- [ ] Configurer CSP (Content Security Policy)
- [ ] Auditer les dépendances : `npm audit`

## 🔍 Monitoring

Configurez le monitoring après le déploiement :

- **Performance**: Google Lighthouse, WebPageTest
- **Erreurs**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Uptime**: UptimeRobot, Pingdom

## 🆘 Dépannage

### Le build échoue

```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Les assets ne chargent pas

Vérifiez que le `base` dans `vite.config.ts` correspond à votre URL de déploiement.

### Le service worker ne fonctionne pas

- Vérifiez que le site est servi en HTTPS
- Videz le cache du navigateur
- Vérifiez la console pour les erreurs

## 📚 Ressources Utiles

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)

---

Pour toute question sur le déploiement, ouvrez une issue sur GitHub.
