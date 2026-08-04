# Development Workflow — MegaPortfolio

## Daily Workflow

1. `git pull` — sync with remote
2. `npm install` — if dependencies changed
3. `ng serve` — start dev server (http://localhost:4200)
4. Make changes → save → browser auto-reloads
5. `ng build` — verify zero errors before committing
6. `git add . && git commit -m "type: description"`

## Feature Workflow

1. Create branch: `git checkout -b feature/my-feature`
2. Create model (if needed): `src/app/core/models/x.model.ts`
3. Create service (if needed): `src/app/core/services/x.service.ts`
4. Create component: `src/app/features/x/pages/x/` (ts, html, scss)
5. Add route to `app.routes.ts` (lazy-loaded)
6. Add server route to `app.routes.server.ts` (prerender)
7. Add translations to `en.json` and `ar.json`
8. Run `ng build` to verify
9. Commit and push

## Admin CRUD Workflow

1. Model: `src/app/core/models/x.model.ts`
2. Service: `src/app/core/services/admin-x.service.ts`
3. Page: `src/app/features/admin/pages/x/` (ts, html, scss)
4. Add child route under `/admin` in `app.routes.ts`
5. Add sidebar link in `admin-sidebar`
6. Use `.admin-page` shared styles
7. Run `ng build` to verify

## Git Workflow

```bash
# Feature branch
git checkout -b feature/feature-name
# ... make changes ...
ng build
git add .
git commit -m "feat: add feature-name"
git push origin feature/feature-name

# Fix branch
git checkout -b fix/bug-description
# ... fix ...
ng build
git commit -m "fix: resolve bug-description"
git push origin fix/bug-description
```

## AI Workflow

1. Start session by referencing `AI_RULES.md`
2. Describe task using prompts from `PROMPTS.md`
3. AI reads `PROJECT_CONTEXT.md` for project understanding
4. AI modifies minimum code, preserves architecture
5. Run `ng build` to verify
6. Commit changes

## Deployment Workflow

### Local
```bash
ng build --configuration production
node dist/mega-portfolio/server/server.mjs
# Visit http://localhost:4000
```

### Firebase Hosting
```bash
ng build --configuration production
firebase deploy
```

### Environment Switch
```bash
ng serve                              # development
ng serve --configuration local        # local secrets
ng build                              # production (default)
ng build --configuration development  # development build
```
