# AI Rules — MegaPortfolio

## Critical Rules

1. **NEVER regenerate working files.** Modify only the minimum required code.
2. **NEVER rewrite the architecture.** Preserve Feature-Based Architecture.
3. **NEVER use `any`.** All types must be explicit.
4. **NEVER call `initializeApp()` without `getApps()` guard.**
5. **NEVER hardcode Firebase config.** Always read from `environment`.
6. **NEVER use `?.` on `signal()` calls.** Signals never return null.
7. **NEVER use `100vw`.** Use `100%` or `100dvw` (RTL scrollbar overflow).
8. **NEVER use physical CSS properties** (`left`, `right`) in navbar/layout. Use logical properties (`inset-inline-start`, `inset-inline-end`).
9. **NEVER import GSAP at module top-level.** Use dynamic `import('gsap')` inside `afterNextRender`.
10. **ALWAYS use standalone components.** No NgModules.
11. **ALWAYS use Signals** for component state. No RxJS BehaviorSubject for UI state.
12. **ALWAYS use path aliases:** `@core/*`, `@shared/*`, `@features/*`, `@environments/*`.
13. **ALWAYS check `isPlatformBrowser()`** before using browser APIs (GSAP, localStorage, window).
14. **ALWAYS run `ng build` after changes** to verify zero TypeScript errors.

## Angular 21 Conventions

- **Standalone components only.** `standalone: true` on every `@Component`.
- **`inject()` over constructor DI.** Use `private readonly service = inject(MyService)`.
- **Signal-based state.** `readonly data = signal<T[]>([])`, `readonly loading = signal(false)`.
- **Computed for derived state.** `readonly filtered = computed(() => ...)`.
- **`afterNextRender()` for DOM/GSAP.** Never in constructor or `ngOnInit` for DOM work.
- **`toObservable()` / `effect()` sparingly.** Prefer signal-based reactivity.
- **Form binding pattern:** `[ngModel]="form().field" (ngModelChange)="updateField('field', $event)"`.
- **Signal form pattern:** `form = signal<Partial<T>>({})` + `updateField<K>(key: K, value: T[K])`.

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase class, kebab-case selector | `ProjectCard` / `app-project-card` |
| Services | PascalCase + `Service` suffix | `AdminProjectService` |
| Interfaces | PascalCase, no `I` prefix | `Project`, `Technology` |
| Signals | camelCase, descriptive | `readonly loading = signal(false)` |
| Methods | camelCase, verb-first | `loadProjects()`, `saveSettings()` |
| CSS classes | kebab-case | `.stat-card`, `.page-header` |
| Route paths | kebab-case, lowercase | `/admin/projects`, `/contact` |
| File names | kebab-case | `project-card.ts`, `admin-shell.html` |

## Token Optimization Rules

- Return only modified code blocks, not entire files.
- Use `SearchReplace` tool, never `Write` on existing files (unless creating new).
- Reuse existing services — never duplicate Firestore queries.
- Reuse shared admin styles from `styles.scss` (`.admin-page` prefix).
- Preserve formatting, naming, folder structure.
- One feature = one folder under `src/app/features/`.

## Common Mistakes to Avoid

| Mistake | Correct Approach |
|---------|-----------------|
| `form()?.field` | `form().field` — signals never return null |
| `initializeApp(config)` | `getApps().length === 0 ? initializeApp(config) : getApp()` |
| `import gsap from 'gsap'` at top | `const { gsap } = await import('gsap')` inside `afterNextRender` |
| `width: 100vw` | `width: 100%` or `width: 100dvw` |
| `left: 0` in layout | `inset-inline-start: 0` |
| `@NgModule` usage | Standalone components only |
| `new BehaviorSubject()` | `signal<T>()` |
| Hardcoded Firebase keys | `environment.firebase` |
| `RouterLink` import in shell | Import only in components that use it in template |
