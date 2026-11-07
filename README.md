# Ahmed Osama — Portfolio

Professional minimalist portfolio showcasing software architecture, full-stack systems, and engineering experience. Built with **Angular 21**, **PrimeNG**, **Tailwind CSS**, and **SSR**.

## Features

- **Single Page Portfolio**: Minimalist layout with Bio, Skills, Work History (Timeline), and Uses
- **Static Architecture**: Fast, zero-backend, zero-database dependencies, 100% typed static data
- **PrimeNG Integration**: Smooth `p-skeleton` shimmer and `p-progressSpinner` loading states
- **SSR**: Server-side rendering with lightning-fast prerendering
- **Dark Theme**: Minimalist dark slate palette inspired by Andrei Hudovich & Wes Bos

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (Standalone, Signals) |
| UI & Components | PrimeNG + PrimeIcons + @primeuix/themes |
| Styling | Tailwind CSS v4 |
| SSR | Angular SSR + Express |
| Build | Angular CLI + Vite |

## Quick Start

```bash
git clone https://github.com/Megawy/AHMED-OSAMA-OS.git
cd AHMED-OSAMA-OS
npm install
npm start
```

Open `http://localhost:4200/`

## Build & Preview

```bash
npm start     # Dev server (ng serve)
npm run build # Production build
npm run watch # Development watch build
npm run serve:ssr # Run SSR server locally
```

## Project Structure

```
src/app/
├── core/
│   └── data/
│       └── portfolio.data.ts    # Central static data (Bio, Skills, Work, Uses)
└── features/
    └── portfolio/               # Single-Page Portfolio component
        ├── portfolio.ts
        ├── portfolio.html
        └── portfolio.scss
```

## License

Private — All rights reserved.
