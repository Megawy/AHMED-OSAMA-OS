# Optimized AI Prompts — MegaPortfolio

## Add a New Public Page

```
Add a new page "X" at route /x.
Model: src/app/core/models/x.model.ts
Service: src/app/core/services/x.service.ts
Page: src/app/features/x/pages/x/{x.ts, x.html, x.scss}
Add route to app.routes.ts (lazy-loaded).
Add server route to app.routes.server.ts (prerender).
Add translation keys to en.json and ar.json.
Add nav link to navbar.
Follow existing patterns. Read AI_RULES.md first.
```

## Add a New Admin CRUD Page

```
Add admin CRUD page for collection "X".
Model: src/app/core/models/x.model.ts (if not exists)
Service: src/app/core/services/admin-x.service.ts
Page: src/app/features/admin/pages/x/{x.ts, x.html, x.scss}
Add child route under admin in app.routes.ts with adminGuard.
Add sidebar link in admin-sidebar.
Use signal form pattern from COMPONENT_GUIDELINES.md.
Reuse .admin-page styles from styles.scss.
Read AI_RULES.md first.
```

## Create a New Firebase Collection

```
Add Firestore collection "X" with fields: [list fields].
Create model: src/app/core/models/x.model.ts
Create service: src/app/core/services/x.service.ts (or admin-x.service.ts)
Update firestore.rules with read/write rules.
Follow existing FirestoreService patterns.
Read FIREBASE_STRUCTURE.md for collection conventions.
```

## Fix a Bug

```
Bug: [describe symptom]
Expected: [expected behavior]
File(s) affected: [file paths]
Read AI_RULES.md. Modify only the minimum code to fix.
Run ng build to verify zero errors.
```

## Add GSAP Animation

```
Add [animation type] animation to [component/section].
Use AnimationService.reveal() pattern.
Dynamic import GSAP inside afterNextRender().
Add prefers-reduced-motion guard.
Cleanup on ngOnDestroy.
Read CODING_GUIDELINES.md animations section.
```

## Add Translation Keys

```
Add translations for [feature]:
en.json: [key structure]
ar.json: [Arabic translations]
Use translate pipe: {{ 'KEY' | translate }}
```

## Create a New Component

```
Create standalone component "X" in [location].
standalone: true, use inject() for DI.
Signal-based state. Path aliases for imports.
Read COMPONENT_GUIDELINES.md for template.
```

## Refactor / Optimize

```
Refactor [file/feature] to [goal].
Preserve behavior. Modify minimum code.
Read AI_RULES.md token optimization rules.
Run ng build to verify.
```

## Write Tests

```
Write Vitest unit tests for [service/component].
File: [file].spec.ts
Test: initialization, happy path, edge cases.
Use existing test patterns from project.
```

## Add a Guard

```
Create guard: src/app/core/guards/x.guard.ts
Use CanActivateFn (functional guard).
Add to route in app.routes.ts.
Follow admin.guard.ts pattern.
```

## Deploy

```
Build: ng build --configuration production
Verify: dist/mega-portfolio/browser/index.html exists
Deploy: firebase deploy (or your hosting platform)
```
