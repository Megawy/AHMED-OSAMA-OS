# Changelog — MegaPortfolio

## [1.0.0] — 2026-08-02

### Added
- Angular 21 project with standalone components and Feature-Based Architecture
- Firebase integration (Auth, Firestore, Storage) with singleton initialization
- SSR with prerendering (13 routes) and client hydration with event replay
- Express server for static files and SSR
- Shell layout with navbar, footer, and mobile sidebar
- i18n support (English + Arabic with RTL direction)
- Language service with localStorage persistence
- GSAP animation service with 7-layer overflow defense and `prefers-reduced-motion` guard
- Home page: Hero, Stats, Architecture Preview, Featured Projects, System Design Lab, Tech Radar
- Projects page: filter, search, grid, modal, pagination
- Architecture page: hero, microservices diagram, Kafka, Redis, K8s, Docker, best practices
- Contact page: form validation and Firestore submission
- Experience page: timeline display
- Admin dashboard: login, guard, shell layout (sidebar + navbar)
- Admin CRUD: projects (with image uploads), technologies, skills, experience, messages, settings, media
- Firestore security rules (`firestore.rules`)
- Storage security rules (`storage.rules`)
- Environment configuration system (development, production, local)
- Path aliases (`@core`, `@shared`, `@features`, `@environments`)
- Tailwind CSS v4 + SCSS styling
- Dark theme (cyan `#00e5ff` / purple `#7c3aed` palette)
- Shared admin styles in global `styles.scss` (`.admin-page` prefix)
- Reusable components: empty state, error state, skeleton card, language switcher
- Prettier + EditorConfig configuration
- Comprehensive documentation suite (AI_RULES, PROJECT_CONTEXT, ARCHITECTURE, etc.)
- `.ai/` hidden workspace for AI agent context

### Fixed
- Firebase duplicate-app error (`getApps()` singleton guard)
- NG8107 warnings (unnecessary `?.` on signal reads)
- NG8113 warnings (unused RouterLink imports in AdminShell)
- NG8001 error (orphaned `app-overflow-detector` tag)
- RTL horizontal overflow (`100vw` → `100%`)
