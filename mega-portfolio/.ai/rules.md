# AI Rules — MegaPortfolio (Quick Reference)

## Must Do
- Standalone components, `inject()`, `signal()`, `computed()`
- Path aliases: `@core/*`, `@shared/*`, `@features/*`, `@environments/*`
- `isPlatformBrowser()` before browser APIs
- GSAP dynamic import in `afterNextRender()`
- Run `ng build` after changes
- Minimum code changes only

## Must NOT Do
- `any` type
- `?.` on signal reads
- `100vw` (use `100%` or `100dvw`)
- Physical CSS in layout (`left`/`right` → `inset-inline-start`/`inset-inline-end`)
- Top-level `import gsap`
- `@NgModule`
- `BehaviorSubject`
- Hardcoded Firebase config
- `initializeApp()` without `getApps()` guard
- `RouterLink` import in components that don't use it in template

## Patterns
- Form: `signal<Partial<T>>({})` + `updateField<K>(key, value)`
- Firebase: `getApps().length === 0 ? initializeApp(cfg) : getApp()`
- Admin styles: `.admin-page` prefix in `styles.scss`
- Template: `[ngModel]="form().field" (ngModelChange)="updateField('field', $event)"`
