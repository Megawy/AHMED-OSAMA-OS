# Ahmed Osama — Portfolio

Professional portfolio showcasing software architecture, microservices, and cloud-native systems. Built with **Angular 21**, **Firebase**, **GSAP**, and **SSR**.

## Features

- **5 Public Pages**: Home, Projects, Architecture, Contact, Experience
- **Admin Dashboard**: Full CMS with CRUD for projects, technologies, skills, experience, messages, settings, and media
- **Animations**: GSAP ScrollTrigger with overflow-safe reveals
- **i18n**: English + Arabic with full RTL support
- **SSR**: Server-side rendering with prerendering (13 routes)
- **Dark Theme**: Cyan/purple palette with Tailwind CSS v4

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21 (Standalone, Signals) |
| Backend | Firebase (Firestore, Auth, Storage) |
| SSR | Angular SSR + Express |
| Styling | Tailwind CSS v4 + SCSS |
| Animations | GSAP + ScrollTrigger |
| i18n | ngx-translate (EN/AR) |
| Build | Angular CLI + Vite |

## Quick Start

```bash
git clone https://github.com/AHMED-OSAMA-OS/mega-portfolio.git
cd mega-portfolio
npm install
cp .env.example .env        # then fill in your Firebase credentials
npm start
```

Open `http://localhost:4200/`

## Environment Setup

All secrets and API keys live in `.env` (git-ignored). The Angular environment
files are generated from it and are git-ignored too:

```bash
cp .env.example .env        # fill in your values
npm run env:generate        # writes src/environments/environment.{development,production}.ts
```

`npm start`, `npm run build`, `npm run watch` and `npm test` run `env:generate`
automatically, so you only call it directly after editing `.env`.

Never edit `src/environments/environment.development.ts` or
`environment.production.ts` by hand — they are overwritten on every build.
For extra local-only overrides, copy `environment.local.ts.example` to
`environment.local.ts` and use `ng serve --configuration local`.

## Build Commands

```bash
npm start                             # Dev server (regenerates env first)
npm run env:generate                  # Regenerate env files from .env
ng serve --configuration local        # Dev server (local env override)
npm run build                         # Production build (default)
ng build --configuration development  # Development build
```

## Project Structure

```
src/app/
├── core/          # Services, models, data, guards, utils
├── features/      # Feature modules (lazy-loaded)
│   ├── home/      # Landing page + 6 animated sections
│   ├── projects/  # Project showcase with filtering
│   ├── architecture/ # System design showcase
│   ├── contact/   # Contact form
│   ├── experience/ # Experience timeline
│   └── admin/     # Admin dashboard (protected)
└── shared/        # Reusable components, layout
```

## Firebase

- **Collections**: projects, technologies, skills, experience, settings, messages, media, admins
- **Security Rules**: `firestore.rules` + `storage.rules`
- **Deploy Rules**: `firebase deploy --only firestore:rules`

## Deployment

```bash
ng build --configuration production
node dist/mega-portfolio/server/server.mjs  # Local preview
firebase deploy                              # Firebase Hosting
```

## Documentation

| File | Purpose |
|------|---------|
| `AI_RULES.md` | Rules for AI-assisted development |
| `PROJECT_CONTEXT.md` | Full project context |
| `ARCHITECTURE.md` | Architecture overview |
| `CODING_GUIDELINES.md` | Coding standards |
| `FIREBASE_STRUCTURE.md` | Firebase collections and rules |
| `COMPONENT_GUIDELINES.md` | Component patterns |
| `FOLDER_STRUCTURE.md` | Folder map |
| `PROMPTS.md` | Optimized AI prompts |
| `SECURITY.md` | Security documentation |
| `TODO.md` | Task tracking |
| `KNOWN_ISSUES.md` | Bugs and technical debt |

## License

Private — All rights reserved.
