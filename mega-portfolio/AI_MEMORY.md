# AI Memory — MegaPortfolio

> **Purpose**: Allow any AI agent to immediately understand this project without analyzing the repository.

## Project Identity

- **Name**: MegaPortfolio — Ahmed Osama's professional portfolio
- **Stack**: Angular 21 + Firebase + GSAP + Tailwind CSS v4 + SSR
- **Architecture**: Feature-Based (core / features / shared)
- **State**: Angular Signals only (no NgRx, no RxJS BehaviorSubject)
- **Components**: All standalone (no NgModules)
- **Backend**: Firebase (Firestore + Auth + Storage)
- **Languages**: English + Arabic (RTL)

## What Works

- 5 public pages (Home, Projects, Architecture, Contact, Experience)
- Home has 6 animated sections (Hero, Stats, Architecture Preview, Featured Projects, System Design Lab, Tech Radar)
- Admin dashboard with 7 CRUD pages (Projects, Technologies, Skills, Experience, Messages, Settings, Media)
- Admin login with Firebase Auth + Firestore admin role check
- Full SSR with prerendering (13 routes)
- GSAP ScrollTrigger animations with 7-layer overflow defense
- Dark theme (cyan/purple), RTL support
- Environment config (development/production/local)
- Firebase security rules (firestore.rules, storage.rules)
- Zero TypeScript errors

## What Doesn't Work / Missing

- Blog page is empty placeholder
- No unit tests (spec files exist but empty)
- No SEO meta tags
- Bundle size warning (917 kB > 500 kB budget)
- No PWA/service worker
- No analytics

## Key Patterns

### Signal Form (all admin CRUD pages)
```typescript
readonly form = signal<Partial<T>>({});
updateField<K extends keyof T>(key: K, value: T[K]): void {
  this.form.update(f => ({ ...f, [key]: value }));
}
```
Template: `[ngModel]="form().field" (ngModelChange)="updateField('field', $event)"`

### Firebase Singleton
```typescript
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
```

### GSAP Animation
```typescript
afterNextRender(async () => {
  const { gsap } = await import('gsap');
  // setup with prefers-reduced-motion guard
});
```

## File Locations

| What | Where |
|------|-------|
| Routes | `src/app/app.routes.ts` |
| Firebase init | `src/app/core/firebase/firebase.config.ts` |
| All services | `src/app/core/services/` |
| All models | `src/app/core/models/` |
| Admin pages | `src/app/features/admin/pages/` |
| Shared styles | `src/styles.scss` (`.admin-page` prefix) |
| Translations | `src/assets/i18n/{en,ar}.json` |
| Environments | `src/environments/` |
| Security rules | `firestore.rules`, `storage.rules` |

## Conventions

- Path aliases: `@core/*`, `@shared/*`, `@features/*`, `@environments/*`
- `inject()` for DI, `signal()` for state, `computed()` for derived
- No `?.` on signal reads
- No `100vw` (RTL overflow)
- No physical CSS properties in layout (use logical)
- GSAP dynamic import only
- `isPlatformBrowser()` before browser APIs
- Shared admin styles in `styles.scss` under `.admin-page`

## Critical Rules (from AI_RULES.md)

1. Never regenerate working files
2. Modify minimum code only
3. Never use `any`
4. Never hardcode Firebase config
5. Always use standalone components
6. Always use Signals for state
7. Always run `ng build` to verify
