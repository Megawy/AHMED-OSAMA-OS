# AI Context — MegaPortfolio

## Project
Angular 21 portfolio with Firebase backend, admin dashboard, SSR, GSAP animations, i18n (EN/AR+RTL).

## Stack
Angular 21 | Firebase (Firestore+Auth+Storage) | GSAP | Tailwind CSS v4 | Express SSR | Vitest

## Architecture
Feature-Based: `core/` (services, models, data, guards) | `features/` (lazy-loaded pages) | `shared/` (layout, components)

## State
Angular Signals only. `signal<T>()`, `computed()`, `signal.update()`. No NgRx/BehaviorSubject.

## Firebase
8 collections: projects, technologies, skills, experience, settings, messages, media, admins.
Singleton init: `getApps().length === 0 ? initializeApp(config) : getApp()`

## Routes
13 prerendered: /, /projects, /architecture, /contact, /admin/login, /admin (7 child CRUD pages)

## Key Files
- Routes: `src/app/app.routes.ts`
- Firebase: `src/app/core/firebase/firebase.config.ts`
- Styles: `src/styles.scss` (`.admin-page` shared styles)
- i18n: `src/assets/i18n/{en,ar}.json`
- Environments: `src/environments/`
- Rules: `firestore.rules`, `storage.rules`

## Build
`ng serve` | `ng build` (production default) | `ng serve --configuration local`
