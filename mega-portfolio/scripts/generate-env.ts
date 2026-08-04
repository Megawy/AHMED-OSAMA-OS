/**
 * Generates `src/environments/environment.development.ts` and
 * `environment.production.ts` from the git-ignored `.env` file.
 *
 * The generated files are git-ignored: secrets live only in `.env`.
 * Run via `npm run env:generate` (also hooked into prestart / prebuild).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const ENV_FILE = resolve(ROOT, '.env');
const OUT_DIR = resolve(ROOT, 'src', 'environments');

// ---------------------------------------------------------------------------
// .env loader (standalone: must not pull in scripts/lib.ts firebase bootstrap)
// ---------------------------------------------------------------------------
function loadEnv(): void {
  if (!existsSync(ENV_FILE)) {
    console.error('✗ .env not found — copy .env.example to .env and fill in your values');
    process.exit(1);
  }
  for (const line of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && line.trimStart().charAt(0) !== '#' && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const missing: string[] = [];

function req(name: string): string {
  const v = process.env[name];
  if (!v) {
    missing.push(name);
    return '';
  }
  return v;
}

function opt(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

// ---------------------------------------------------------------------------
// File emitter
// ---------------------------------------------------------------------------
interface Target {
  file: string;
  production: boolean;
  debug: boolean;
  analytics: boolean;
  portfolioUrl: string;
  baseApiUrl: string;
}

function quote(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function render(target: Target): string {
  return `// ============================================================
// AUTO-GENERATED FILE — DO NOT EDIT.
// Generated from .env by scripts/generate-env.ts (npm run env:generate).
// This file is git-ignored; edit .env instead.
// ============================================================

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: ${target.production},
  debug: ${target.debug},
  analytics: ${target.analytics},
  appName: ${quote(opt('APP_NAME', 'Ahmed Osama Portfolio'))},
  version: ${quote(opt('APP_VERSION', '1.0.0'))},
  contactEmail: ${quote(opt('CONTACT_EMAIL'))},
  portfolioUrl: ${quote(target.portfolioUrl)},
  githubUrl: ${quote(opt('GITHUB_URL'))},
  linkedinUrl: ${quote(opt('LINKEDIN_URL'))},
  baseApiUrl: ${quote(target.baseApiUrl)},
  firebase: {
    apiKey: ${quote(req('FIREBASE_API_KEY'))},
    authDomain: ${quote(req('FIREBASE_AUTH_DOMAIN'))},
    projectId: ${quote(req('FIREBASE_PROJECT_ID'))},
    storageBucket: ${quote(req('FIREBASE_STORAGE_BUCKET'))},
    messagingSenderId: ${quote(req('FIREBASE_MESSAGING_SENDER_ID'))},
    appId: ${quote(req('FIREBASE_APP_ID'))},
    measurementId: ${quote(opt('FIREBASE_MEASUREMENT_ID'))},
  },
};
`;
}

loadEnv();

const targets: Target[] = [
  {
    file: 'environment.development.ts',
    production: false,
    debug: true,
    analytics: false,
    portfolioUrl: opt('PORTFOLIO_URL_DEV', 'http://localhost:4200'),
    baseApiUrl: opt('API_BASE_URL_DEV', 'http://localhost:3000/api'),
  },
  {
    file: 'environment.production.ts',
    production: true,
    debug: false,
    analytics: true,
    portfolioUrl: req('PORTFOLIO_URL_PROD'),
    baseApiUrl: req('API_BASE_URL_PROD'),
  },
];

const contents = targets.map((t) => [t.file, render(t)] as const);

if (missing.length) {
  console.error(`✗ Missing env var(s) in .env: ${[...new Set(missing)].join(', ')}`);
  console.error('  See .env.example for the full list.');
  process.exit(1);
}

for (const [file, content] of contents) {
  writeFileSync(resolve(OUT_DIR, file), content, 'utf8');
  console.log(`  ✓ generated src/environments/${file}`);
}
