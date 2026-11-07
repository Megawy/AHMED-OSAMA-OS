# Coding Guidelines — MegaPortfolio

## Angular

- **Standalone components only.** Every `@Component` must have `standalone: true`.
- **`inject()` for DI.** Prefer `private readonly svc = inject(MyService)` over constructor injection.
- **`OnPush` change detection.** All components use `ChangeDetectionStrategy.OnPush` (default for standalone).
- **Template-first.** Keep logic in `.ts`, markup in `.html`, styles in `.scss`/`.css`.
- **No `any`.** Use explicit types, interfaces, or `unknown`.
- **Strict mode enabled.** `strict: true`, `strictTemplates: true`, `strictInjectionParameters: true`.

## Signals

```typescript
// Component state
readonly items = signal<Project[]>([]);
readonly loading = signal(false);
readonly search = signal('');

// Derived state
readonly filtered = computed(() =>
  this.items().filter(i => i.name.includes(this.search()))
);

// Form state
readonly form = signal<Partial<Project>>({});
readonly editingId = signal<string | null>(null);

// Update form fields
updateField<K extends keyof Project>(key: K, value: Project[K]): void {
  this.form.update(f => ({ ...f, [key]: value }));
}
```

**Rules:**
- Never use `?.` on signal reads: `form().name` not `form()?.name`
- Use `signal.update()` for immutable updates
- Use `computed()` for derived/filtered data
- Use `effect()` only for side effects (logging, syncing)

## TypeScript

- Target: `ES2022`
- Strict mode with all strict flags
- Path aliases: `@core/*`, `@shared/*`, `@features/*`, `@environments/*`
- Interfaces for data models, no `I` prefix
- `readonly` on all signals and class fields that don't change

## SCSS / Tailwind

- **Tailwind CSS v4** for utility classes in templates
- **SCSS** for component-specific styles (`.scss` files)
- **CSS** for simpler components (`.css` files)
- **Global admin styles** in `styles.scss` under `.admin-page` prefix
- **No `100vw`** — causes RTL horizontal overflow
- **Logical properties** for RTL: `inset-inline-start`, `inset-inline-end`, `margin-inline-start`
- **Responsive**: `minmax(0, 1fr)` in grids to prevent overflow
- **Dark theme** via CSS custom properties in `:root`

## Firebase

- **Singleton pattern**: `getApps().length === 0 ? initializeApp(config) : getApp()`
- **Environment-based config**: Always `environment.firebase`, never hardcoded
- **`providedIn: 'root'`** for all Firebase services
- **Platform check**: `isPlatformBrowser()` before auth listeners or storage operations
- **Firestore queries**: Use `QueryOptions` with `where`, `orderBy`, `limit`

## Animations (GSAP)

```typescript
// ALWAYS dynamic import inside afterNextRender
afterNextRender(async () => {
  const { gsap, ScrollTrigger } = await import('gsap');
  // Setup animations here
});

// ALWAYS guard with prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

// ALWAYS cleanup on destroy
ngOnDestroy() {
  this.animations?.forEach(a => a.kill());
}
```

## Accessibility

- Label `for`/input `id` pairing on all forms
- `placeholder` on all inputs
- `aria-label` on select elements and icon buttons
- `alt` text on images
- `prefers-reduced-motion` check before animations
- Focus management in modals

## Dependency Injection

```typescript
@Injectable({ providedIn: 'root' })  // Singleton services
export class MyService {
  private readonly firestore = inject(FirestoreService);
}
```

- All core services: `providedIn: 'root'`
- Admin services: `providedIn: 'root'`
- No component-level providers unless strictly necessary

## Performance

- **Lazy routes**: All feature routes use `loadComponent()`
- **Dynamic GSAP import**: Never at module top-level
- **`afterNextRender()`**: For DOM measurements and animation setup
- **`minmax(0, 1fr)`**: Prevents grid overflow
- **`force3D: false`**: Reduces compositor layer promotion in GSAP
- **`clearProps: 'all'`**: Strips inline styles after GSAP animation completes
