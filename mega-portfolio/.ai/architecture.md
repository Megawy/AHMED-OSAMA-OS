# AI Architecture — MegaPortfolio

## Data Flow
Firestore → Services (signal state) → Pages (UI)
Admin → Firestore (write) + Storage (images)
Contact Form → Firestore messages collection

## Layers
1. **Firebase**: `firebase.config.ts` (singleton), `auth.service.ts`, `firestore.service.ts`, `storage.service.ts`
2. **Services**: `core/services/` — public (project, experience, contact, animation, language) + admin (admin-project, admin-technology, etc.)
3. **Models**: `core/models/` — Project, Technology, Skill, Experience, Admin, Settings, ContactMessage, MediaItem
4. **Pages**: `features/{name}/pages/` — standalone components, lazy-loaded
5. **Layout**: Shell (public) / AdminShell (admin)

## Admin CRUD Pattern
Service holds signals → Page reads via `computed()` → Form uses `signal<Partial<T>>({})` → `updateField<K>()`

## Routing
All lazy: `loadComponent()`. Admin guarded by `adminGuard` (auth + Firestore role check). Login guarded by `loginGuard`.

## SSR
`main.server.ts` → `AngularNodeAppEngine` → Express. All routes `RenderMode.Prerender`. Client: `provideClientHydration(withEventReplay())`.

## Animation
`AnimationService.reveal()` → GSAP ScrollTrigger. Dynamic import in `afterNextRender()`. 7-layer overflow defense. `prefers-reduced-motion` guard. Cleanup on destroy.
