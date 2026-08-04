# Project Context — MegaPortfolio

## Overview

Professional portfolio for **Ahmed Osama** — Software Architect & Technical Lead specializing in .NET, Microservices, and Cloud-Native systems. Built with **Angular 21**, **Firebase**, **GSAP**, and full **SSR/prerendering**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21 (Standalone, Signals) |
| Backend | Firebase (Firestore, Auth, Storage) |
| SSR | Angular SSR + Express + Prerendering |
| Styling | Tailwind CSS v4 + SCSS |
| Animations | GSAP + ScrollTrigger |
| i18n | ngx-translate (EN/AR with RTL) |
| Icons | Lucide Angular |
| Build | Angular CLI + Vite (ESBuild) |
| Testing | Vitest |

## Pages & Routes

| Route | Component | Guard | Status |
|-------|-----------|-------|--------|
| `/` | Home | — | Complete |
| `/projects` | Projects | — | Complete |
| `/architecture` | Architecture | — | Complete |
| `/contact` | Contact | — | Complete |
| `/admin/login` | Login | loginGuard | Complete |
| `/admin` | Dashboard | adminGuard | Complete |
| `/admin/projects` | AdminProjects | adminGuard | Complete |
| `/admin/technologies` | AdminTechnologies | adminGuard | Complete |
| `/admin/skills` | AdminSkills | adminGuard | Complete |
| `/admin/experience` | AdminExperience | adminGuard | Complete |
| `/admin/messages` | AdminMessages | adminGuard | Complete |
| `/admin/settings` | AdminSettings | adminGuard | Complete |
| `/admin/media` | AdminMedia | adminGuard | Complete |

## Home Page Sections

Hero → Stats → Architecture Preview → Featured Projects → System Design Lab → Tech Radar

## Admin Dashboard Features

- **Dashboard**: Overview stats (project count, messages, technologies, skills)
- **Projects**: Full CRUD, search, filter by category/status, sort, pagination, image uploads (cover + gallery)
- **Technologies**: CRUD, filter by category
- **Skills**: CRUD, filter by category, level ordering
- **Experience**: CRUD with date ranges, current-job toggle
- **Messages**: Read/unread tracking, status transitions (new → read → replied → archived)
- **Settings**: Single-document site settings with dynamic social links array
- **Media**: Folder-based file management, upload/delete, clipboard URL copy

## Theme

- **Dark theme**: `#030712` background, `#0b1329` surface
- **Primary**: `#00e5ff` (cyan)
- **Secondary**: `#7c3aed` (purple)
- **Text**: `#f8fafc` (near-white), `#64748b` (muted)

## Languages

- English (`en`) — LTR
- Arabic (`ar`) — RTL with `dir="rtl"` and `.rtl` class on `<html>`

## Firebase Collections

`projects`, `technologies`, `skills`, `experience`, `settings`, `messages`, `media`, `admins`

## Environment System

Secrets and API keys live in `.env` (git-ignored). `npm run env:generate`
(`scripts/generate-env.ts`) renders the Angular environment files from it; the
`prestart` / `prebuild` / `prewatch` / `pretest` hooks run it automatically.

| File | Purpose |
|------|---------|
| `.env` | Source of truth for secrets (git-ignored, template in `.env.example`) |
| `environment.development.ts` | Generated, default for `ng serve` (git-ignored) |
| `environment.production.ts` | Generated, used by `ng build --configuration production` (git-ignored) |
| `environment.local.ts` | Hand-written local overrides (copy from `.example`, git-ignored) |
