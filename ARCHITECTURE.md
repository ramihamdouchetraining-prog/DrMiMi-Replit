# Architecture Dr.MiMi

## Vue d'ensemble

Dr.MiMi est une application web progressive (PWA) construite avec React, TypeScript et Vite. Elle suit une architecture modulaire et componentisée.

## Stack Technique

### Frontend
- **Framework**: React 18 avec Hooks
- **Langage**: TypeScript (strict mode)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Context API + React Query
- **i18n**: i18next (FR/EN/AR)

### Outils de Développement
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript compiler
- **CI/CD**: GitHub Actions

## Structure du Projet

```
DrMiMi-Replit/
├── .github/                 # GitHub configuration
│   ├── workflows/          # CI/CD workflows
│   └── ISSUE_TEMPLATE/     # Issue templates
├── public/                  # Static assets
│   ├── icons/              # PWA icons
│   ├── images/             # Images
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service Worker
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── AdvancedChatbot.tsx
│   │   ├── EnhancedDrMimiAvatar.tsx
│   │   ├── ModernNavbar.tsx
│   │   └── ...
│   ├── contexts/           # React Contexts
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── data/              # Données statiques
│   │   └── medicalContent.ts
│   ├── extensions/        # Extensions TipTap
│   │   ├── Callout.ts
│   │   ├── ImageGallery.ts
│   │   └── PaywallBlock.ts
│   ├── hooks/             # Custom Hooks
│   │   ├── useAuth.ts
│   │   └── useRBAC.tsx
│   ├── locales/           # Fichiers de traduction
│   │   ├── fr/
│   │   ├── en/
│   │   └── ar/
│   ├── pages/             # Pages de l'application
│   │   ├── Admin/         # Pages admin
│   │   ├── CoursesPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── ...
│   ├── utils/             # Fonctions utilitaires
│   │   └── editorTemplates.ts
│   ├── App.tsx            # Composant principal
│   ├── main.tsx           # Point d'entrée
│   ├── index.css          # Styles globaux
│   └── i18n.ts            # Configuration i18n
├── index.html             # Template HTML
├── package.json           # Dépendances
├── tsconfig.json          # Config TypeScript
├── vite.config.ts         # Config Vite
├── tailwind.config.js     # Config Tailwind
└── README.md              # Documentation

```

## Patterns et Conventions

### Composants

#### Composants Fonctionnels
Tous les composants utilisent des fonctions avec hooks :

```typescript
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<Type>(initialValue);
  
  return <div>...</div>;
};
```

#### Props et Types
Toujours définir les types des props :

```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
  optional?: number;
}
```

### State Management

#### Context API
Pour l'état global (thème, langue, auth) :

```typescript
const ThemeContext = createContext<ThemeContextType>();
```

#### React Query
Pour les données serveur :

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses
});
```

### Routing

#### Routes protégées
```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute roles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Styling

#### Tailwind CSS
Utiliser les classes utilitaires :

```typescript
<div className="flex items-center justify-center p-4 bg-blue-500 rounded-lg">
```

#### Animations
Framer Motion pour les animations :

```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
```

## Flux de Données

### Authentification
```
User -> LoginPage -> useAuth -> API -> Context -> Protected Routes
```

### Contenu Médical
```
User -> CoursesPage -> React Query -> API -> Cache -> Display
```

### Thème
```
User -> ThemeToggle -> ThemeContext -> All Components
```

## Performance

### Code Splitting
- Lazy loading des routes
- Dynamic imports pour les composants lourds
- Chunking configuré dans Vite

### Optimisations
- React.memo pour les composants coûteux
- useMemo/useCallback pour les calculs lourds
- Image optimization
- PWA caching

## Sécurité

### Frontend
- Input sanitization
- XSS protection
- CSRF tokens
- Secure cookies
- Content Security Policy

### Backend (À implémenter)
- JWT authentication
- Rate limiting
- Data encryption
- SQL injection prevention

## Testing (À implémenter)

### Structure de Tests
```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
```

### Types de Tests
- Unit tests: Vitest
- Integration tests: React Testing Library
- E2E tests: Playwright

## Déploiement

### Environnements
1. **Development**: Local (`npm run dev`)
2. **Staging**: Preview branches
3. **Production**: Main branch

### CI/CD Pipeline
1. Lint
2. Type check
3. Build
4. Test (quand implémenté)
5. Deploy

## Évolutivité

### Backend API
Prévoir l'intégration d'un backend :
- Node.js + Express ou NestJS
- Base de données PostgreSQL
- Redis pour le cache
- S3 pour les fichiers

### Microservices
Possibilité de séparer en services :
- Auth service
- Content service
- Quiz service
- Analytics service

## Monitoring

### Métriques à suivre
- Performance (FCP, LCP, TTI)
- Erreurs JavaScript
- API response times
- User analytics

### Outils recommandés
- Sentry (erreurs)
- Google Analytics (analytics)
- Lighthouse (performance)

## Documentation

### Code
- JSDoc pour les fonctions complexes
- README dans chaque dossier important
- Types TypeScript comme documentation

### API (À créer)
- OpenAPI/Swagger specification
- Postman collections
- Example requests/responses

## Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines de contribution.

## Roadmap

### Phase 1 (Actuelle)
- ✅ Setup initial
- ✅ Structure de base
- ✅ Composants principaux
- ⏳ Contenu médical

### Phase 2
- ⏳ Backend API
- ⏳ Authentication
- ⏳ Base de données
- ⏳ Tests

### Phase 3
- ⏳ Paiement
- ⏳ Analytics
- ⏳ App mobile
- ⏳ Gamification

---

Document mis à jour le : ${new Date().toLocaleDateString()}
