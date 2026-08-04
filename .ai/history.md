# AI History — MegaPortfolio

## Session 1 — Project Creation
- Angular 21 project initialized with standalone components
- Feature-Based Architecture (core/features/shared)
- Firebase integration (Auth, Firestore, Storage)
- SSR with prerendering

## Session 2 — Admin Dashboard
- Complete admin CMS: 7 CRUD pages
- Login + guards (adminGuard, loginGuard)
- Admin shell layout (sidebar + navbar)
- Shared admin styles in global styles.scss

## Session 3 — Bug Fixes
- NG8107: Removed `?.` on signal reads
- NG8113: Removed unused RouterLink imports
- NG8001: Removed orphaned overflow-detector tag

## Session 4 — Environment Configuration
- Created src/environments/ with development/production/local
- Firebase config moved to environment.firebase
- angular.json fileReplacements configured
- .gitignore updated for secrets

## Session 5 — Firebase Fix
- Fixed duplicate-app error: `getApps()` singleton guard
- Root cause: module-level `initializeApp()` without guard

## Session 6 — Documentation
- Created 17 documentation files + .ai/ workspace
- Rewrote README.md professionally
- All project context, rules, guidelines, status documented
