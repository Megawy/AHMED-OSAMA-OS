# Architecture — MegaPortfolio

## Feature-Based Architecture

```
src/app/
├── core/          # Singleton services, models, data, guards, utils
├── features/      # Feature modules (lazy-loaded)
│   ├── home/      # Landing page + sections
│   ├── projects/  # Project showcase + filtering
│   ├── architecture/ # System design showcase
│   ├── contact/   # Contact form
│   ├── blog/      # Blog (placeholder)
│   ├── experience/ # Experience timeline
│   └── admin/     # Admin dashboard (protected)
├── shared/        # Reusable components, layout, pipes, directives
└── app.ts         # Root component
```

## Data Flow

```
Firestore → Admin Services (Signal state) → Admin Pages (CRUD UI)
Firestore → Public Services → Feature Pages (Display)
Admin Pages → Firestore (write) → Storage (images)
Contact Form → Firestore (messages collection)
```

## Firebase Layer

```
firebase.config.ts     # Singleton app init (getApps guard)
auth.service.ts        # Auth state, login/signup/logout
firestore.service.ts   # Generic CRUD with query constraints
storage.service.ts     # File upload/delete/download URLs
```

All services use `providedIn: 'root'` and receive the shared `firebaseApp` instance.

## Admin Architecture

```
admin/
├── layout/
│   ├── admin-shell/     # Sidebar + navbar + router-outlet
│   ├── admin-sidebar/   # Navigation links
│   └── admin-navbar/    # Top bar with user info
├── pages/               # CRUD pages (one per collection)
│   ├── dashboard/       # Overview stats
│   ├── projects/        # Project CRUD + images
│   ├── technologies/    # Technology CRUD
│   ├── skills/          # Skill CRUD
│   ├── experience/      # Experience CRUD
│   ├── messages/        # Message moderation
│   ├── settings/        # Site settings
│   └── media/           # File management
└── services/            # (in core/services/admin-*.service.ts)
```

## State Management

- **Angular Signals** for all reactive state
- **No NgRx/Redux** — Signals + computed signals handle all reactivity
- **Pattern**: Service holds `signal<T[]>([])`, component calls service methods, template reads signals

## Signal CRUD Pattern (used by all admin pages)

```typescript
readonly items = signal<T[]>([]);
readonly loading = signal(false);
readonly form = signal<Partial<T>>({});
readonly editingId = signal<string | null>(null);

updateField<K extends keyof T>(key: K, value: T[K]): void {
  this.form.update(f => ({ ...f, [key]: value }));
}
```

## Routing Strategy

- **Lazy-loaded** routes via `loadComponent()`
- **Admin routes** protected by `adminGuard` (checks Firestore admins collection)
- **Login route** protected by `loginGuard` (redirects if already authenticated)
- **All routes** prerendered at build time (`RenderMode.Prerender`)

## SSR Architecture

```
main.server.ts → bootstrapApplication(App, config, context)
server.ts → Express + AngularNodeAppEngine → static files + SSR
app.config.server.ts → mergeApplicationConfig(appConfig, serverConfig)
```

## Animation Architecture

```
AnimationService.reveal(element, options)
  → GSAP ScrollTrigger
  → 7-layer overflow defense
  → prefers-reduced-motion guard
  → cleanup on component destroy
```

## Shared Layout

```
Shell (navbar + mobile-sidebar + router-outlet + footer)
  → Used by App root component
  → All public pages render inside Shell

AdminShell (admin-sidebar + admin-navbar + router-outlet)
  → Used by admin routes
  → All admin pages render inside AdminShell
```

## Shared Admin Styles

Global `styles.scss` contains `.admin-page` prefixed classes shared by all 7 CRUD pages:
`.page-header`, `.toolbar`, `.data-table`, `.badge`, `.btn-*`, `.modal-*`, `.form-grid`, `.pagination`, `.loading`, `.empty`, `.alert`
