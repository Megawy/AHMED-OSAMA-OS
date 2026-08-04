# Contributing — MegaPortfolio

## Coding Standards

- Read `AI_RULES.md` and `CODING_GUIDELINES.md` before contributing
- All components must be **standalone** (`standalone: true`)
- Use **Angular Signals** for state, not RxJS BehaviorSubject
- Use `inject()` for dependency injection, not constructor parameters
- Use **path aliases**: `@core/*`, `@shared/*`, `@features/*`, `@environments/*`
- Strict TypeScript mode — no `any`
- Run `ng build` to verify zero errors before committing

## Commit Naming

```
feat: add project filter by category
fix: resolve Firebase duplicate-app error on SSR
docs: update FIREBASE_STRUCTURE.md with media collection
style: format admin-projects template
refactor: extract shared CRUD toolbar component
perf: lazy-load Firebase SDK for admin routes
test: add unit tests for AdminProjectService
chore: update angular.json budget limits
```

## Branch Naming

```
feature/blog-posts          # New feature
fix/firebase-duplicate      # Bug fix
docs/update-architecture    # Documentation
refactor/admin-crud         # Refactoring
```

## Folder Rules

- **New page** → `src/app/features/{feature}/pages/{page}/`
- **New component** → `src/app/features/{feature}/components/{component}/` or `src/app/shared/components/`
- **New service** → `src/app/core/services/`
- **New model** → `src/app/core/models/`
- **New guard** → `src/app/core/guards/`
- **New data** → `src/app/core/data/`

## PR Rules

1. One feature/fix per PR
2. Include description of changes
3. Verify `ng build` passes
4. No generated files in PR (no `dist/`, no `node_modules/`)
5. Update relevant documentation if behavior changes
6. Follow existing code patterns — don't introduce new architectures

## Code Review Checklist

- [ ] Standalone component
- [ ] Signal-based state
- [ ] Path aliases used
- [ ] No `any` types
- [ ] No `100vw` usage
- [ ] Logical CSS properties in layout
- [ ] GSAP dynamic import
- [ ] `isPlatformBrowser()` for browser APIs
- [ ] `ng build` passes with zero errors
- [ ] Translations added (en.json + ar.json) if user-facing
