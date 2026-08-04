# TODO — MegaPortfolio

## Completed

- [x] Angular 21 project setup with standalone components
- [x] Feature-Based Architecture (core, features, shared)
- [x] Firebase initialization with singleton guard (`getApps()`)
- [x] Environment configuration system (development, production, local)
- [x] Firebase Auth service (email/password)
- [x] Firestore CRUD service with query constraints
- [x] Firebase Storage service (upload, delete, list)
- [x] Firestore security rules (`firestore.rules`)
- [x] Storage security rules (`storage.rules`)
- [x] Path aliases (`@core`, `@shared`, `@features`, `@environments`)
- [x] SSR with prerendering (13 routes)
- [x] Client hydration with event replay
- [x] Express server (`server.ts`)
- [x] Shell layout (navbar + footer + mobile sidebar)
- [x] Navbar with language switcher
- [x] Footer
- [x] i18n (English + Arabic with RTL)
- [x] Language service with localStorage persistence
- [x] GSAP animation service with 7-layer overflow defense
- [x] Home page with 6 sections (hero, stats, architecture preview, featured projects, system design lab, tech radar)
- [x] Projects page with filter, search, grid, modal, pagination
- [x] Architecture page with hero, diagram, Kafka, Redis, K8s, Docker, best practices
- [x] Contact page with form validation and submission
- [x] Experience page
- [x] Blog page (basic structure)
- [x] Admin login page
- [x] Admin guard + login guard
- [x] Admin shell layout (sidebar + navbar)
- [x] Admin dashboard overview
- [x] Admin projects CRUD (search, filter, sort, pagination, image uploads)
- [x] Admin technologies CRUD
- [x] Admin skills CRUD
- [x] Admin experience CRUD
- [x] Admin messages (status tracking, read/unread)
- [x] Admin settings (single document, social links)
- [x] Admin media library (folder filter, upload, delete, copy URL)
- [x] Shared admin styles in global `styles.scss`
- [x] Reusable components (empty state, error state, skeleton card)
- [x] Dark theme (cyan/purple palette)
- [x] Tailwind CSS v4 + SCSS styling
- [x] Prettier + EditorConfig
- [x] Zero TypeScript errors build verification
- [x] Firebase duplicate-app fix (singleton pattern)

## In Progress

- [ ] Blog feature (full implementation with posts)
- [ ] Unit tests (Vitest specs)

## Missing / High Priority

- [ ] SEO meta tags per page (Open Graph, Twitter cards)
- [ ] Structured data (JSON-LD for Person, Project)
- [ ] Sitemap.xml generation
- [ ] robots.txt
- [ ] Performance audit (Lighthouse optimization)
- [ ] Bundle size reduction (917 kB > 500 kB budget warning)
- [ ] Lazy-load Firebase SDK (defer until needed)
- [ ] Image optimization (WebP, lazy loading)
- [ ] Service worker / PWA support
- [ ] E2E tests

## Future / Low Priority

- [ ] Blog post editor in admin
- [ ] Blog post categories/tags
- [ ] Analytics integration (Google Analytics / Firebase Analytics)
- [ ] Email notification on new contact message
- [ ] Admin activity log
- [ ] Admin role-based permissions (editor vs viewer)
- [ ] Multi-language admin dashboard
- [ ] Dark/light theme toggle
- [ ] Print-friendly resume page
- [ ] API rate limiting for contact form
- [ ] CDN configuration for Firebase Hosting
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated deployment to Firebase Hosting
