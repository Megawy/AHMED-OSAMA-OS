# Folder Structure — MegaPortfolio

```
mega-portfolio/
├── .ai/                          # AI workflow context (hidden)
├── .vscode/                      # VS Code settings (extensions, launch, tasks)
├── docs/                         # Comprehensive project documentation
│   ├── README.md                 # Documentation table of contents
│   ├── ai/                       # AI development rules, memory & prompts
│   ├── architecture/             # Architecture, Firebase & folder structures
│   ├── guidelines/               # Coding, component, security & workflow standards
│   ├── planning/                 # Project status, TODO, changelog & issues
│   └── archive/                  # Historical investigations & bug post-mortems
├── dist/                         # Build output (git-ignored)
│   └── mega-portfolio/
│       ├── browser/              # Client-side bundles
│       └── server/               # SSR server bundles
├── node_modules/                 # Dependencies (git-ignored)
├── public/
│   ├── assets/i18n/              # Public translation files
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── core/                 # Singleton services, models, data, guards, utils
│   │   │   ├── data/             # Static data files (architecture, experience, projects, radar, technologies)
│   │   │   ├── firebase/         # Firebase init, auth, firestore, storage services
│   │   │   ├── guards/           # Route guards (admin.guard.ts)
│   │   │   ├── interceptors/     # HTTP interceptors (empty)
│   │   │   ├── models/           # TypeScript interfaces (Project, Technology, Skill, Experience, Admin, etc.)
│   │   │   ├── services/         # Core + admin services (animation, language, project, admin-*)
│   │   │   └── utils/            # Utilities (firestore.mapper.ts, overflow-detector.ts)
│   │   ├── features/             # Feature modules (lazy-loaded)
│   │   │   ├── home/
│   │   │   │   ├── pages/home/   # Home page component
│   │   │   │   └── sections/     # Hero, Stats, Architecture Preview, Featured Projects, System Design Lab, Tech Radar
│   │   │   ├── projects/
│   │   │   │   ├── components/   # ProjectCard, ProjectFilter, ProjectGrid, ProjectHero, ProjectModal, ProjectPagination, ProjectSearch
│   │   │   │   ├── pages/        # Projects page
│   │   │   │   └── services/     # project-state.service.ts
│   │   │   ├── architecture/
│   │   │   │   ├── components/   # ArchitectureHero, BestPractices, DockerSection, KafkaSection, K8sSection, MicroservicesDiagram, RedisSection
│   │   │   │   └── pages/        # Architecture page
│   │   │   ├── contact/
│   │   │   │   └── pages/        # Contact form page
│   │   │   ├── experience/
│   │   │   │   └── pages/        # Experience timeline page
│   │   │   ├── blog/
│   │   │   │   └── pages/        # Blog page (placeholder)
│   │   │   └── admin/
│   │   │       ├── layout/       # AdminShell, AdminSidebar, AdminNavbar
│   │   │       └── pages/        # Dashboard, Projects, Technologies, Skills, Experience, Messages, Settings, Media, Login
│   │   ├── shared/               # Reusable components and layout
│   │   │   ├── components/       # EmptyState, ErrorState, LanguageSwitcher, MobileSidebar, Sidebar, SkeletonCard
│   │   │   ├── directives/       # Custom directives (empty)
│   │   │   ├── layout/           # Shell, Navbar, Footer
│   │   │   └── pipes/            # Custom pipes (empty)
│   │   ├── app.ts                # Root component (imports Shell)
│   │   ├── app.html              # Root template
│   │   ├── app.css               # Root styles
│   │   ├── app.config.ts         # App providers (router, HTTP, i18n, hydration)
│   │   ├── app.config.server.ts  # SSR server config
│   │   ├── app.routes.ts         # Client routes (lazy-loaded)
│   │   └── app.routes.server.ts  # Server routes (all prerendered)
│   ├── assets/i18n/              # Source translation files (en.json, ar.json)
│   ├── environments/             # Environment configs
│   │   ├── environment.interface.ts
│   │   ├── environment.development.ts   # generated from .env (git-ignored)
│   │   ├── environment.production.ts    # generated from .env (git-ignored)
│   │   └── environment.local.ts.example
│   ├── index.html                # HTML shell
│   ├── main.ts                   # Browser bootstrap
│   ├── main.server.ts            # Server bootstrap
│   ├── server.ts                 # Express SSR server
│   └── styles.scss               # Global styles + admin shared styles
├── firestore.rules               # Firestore security rules
├── storage.rules                 # Storage security rules
├── angular.json                  # Angular CLI config
├── package.json                  # Dependencies + scripts
├── tsconfig.json                 # TypeScript config (strict)
├── tsconfig.app.json             # App TS config (path aliases)
├── tsconfig.spec.json            # Test TS config
├── .prettierrc                   # Prettier config
├── .editorconfig                 # Editor config
└── .gitignore                    # Git ignore rules
```

## Key Folders

| Folder | Purpose | Count |
|--------|---------|-------|
| `core/services/` | All services (public + admin) | ~15 files |
| `core/models/` | All TypeScript interfaces | ~8 files |
| `core/data/` | Static data for display | 5 files |
| `features/admin/pages/` | Admin CRUD pages | 9 folders |
| `features/home/sections/` | Home page sections | 6 folders |
| `shared/layout/` | Shell, Navbar, Footer | 3 folders |
| `shared/components/` | Reusable UI components | 6 folders |
