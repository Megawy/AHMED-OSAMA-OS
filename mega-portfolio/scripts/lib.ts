import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import * as admin from 'firebase-admin';
import { FieldValue, Firestore } from '@google-cloud/firestore';
export { FieldValue };

// ---------------------------------------------------------------------------
// .env loader (no external dependency)
// ---------------------------------------------------------------------------
export function loadEnv(): void {
  const path = resolve(process.cwd(), '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && line.trimStart().charAt(0) !== '#' && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Missing env var: ${name} (copy .env.example to .env)`);
    process.exit(1);
  }
  return v;
}

// ---------------------------------------------------------------------------
// Firebase Admin bootstrap (emulator-aware)
// Credential priority: emulator > FIREBASE_REFRESH_TOKEN / `firebase login`
// token > GOOGLE_APPLICATION_CREDENTIALS / ADC.
// ---------------------------------------------------------------------------
loadEnv();

if (process.argv.includes('--emulator')) {
  process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST ??= '127.0.0.1:9199';
}

function readCliRefreshToken(): string | undefined {
  if (process.env.FIREBASE_REFRESH_TOKEN) return process.env.FIREBASE_REFRESH_TOKEN;
  const cfgPath = join(homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (!existsSync(cfgPath)) return undefined;
  try {
    const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
    const tokens: any = cfg.tokens ?? {};
    return (
      tokens.refresh_token ??
      Object.values(tokens).find((t: any) => t?.refresh_token)?.refresh_token
    );
  } catch {
    return undefined;
  }
}

function cliCredential(): admin.credential.Credential | undefined {
  const refreshToken = readCliRefreshToken();
  if (!refreshToken) return undefined;
  try {
    const require_ = createRequire(resolve(process.cwd(), 'package.json'));
    const { getAccessToken } = require_('firebase-tools/lib/auth');
    const scopes = [
      'email',
      'openid',
      'https://www.googleapis.com/auth/cloudplatformprojects.readonly',
      'https://www.googleapis.com/auth/firebase',
      'https://www.googleapis.com/auth/cloud-platform',
    ];
    return {
      getAccessToken: async () => {
        const t = await getAccessToken(refreshToken, scopes);
        return { access_token: t.access_token, expires_in: 3600 };
      },
    };
  } catch {
    return undefined;
  }
}

const useEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
const credential = useEmulator ? undefined : cliCredential();

const app = admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID ?? 'ahmed-osama-portfolio',
  ...(credential ? { credential } : {}),
});

// Firestore client: direct @google-cloud/firestore so the `firebase login`
// OAuth token works without a service account or ADC.
export const db = credential
  ? new Firestore({
      projectId: app.options.projectId,
      authClient: {
        getRequestHeaders: async () => {
          const h: Record<string, string> = {
            Authorization: `Bearer ${(await credential.getAccessToken()).access_token}`,
          };
          // gRPC auth plugin iterates via forEach (Headers-like contract)
          return {
            ...h,
            forEach: (cb: (value: string, key: string) => void) =>
              Object.entries(h).forEach(([k, v]) => cb(v, k)),
          };
        },
      } as never,
    })
  : admin.firestore();
export const auth = admin.auth();
export { admin };

console.log(`→ Firebase project: ${app.options.projectId}`);
console.log(
  `→ Mode: ${useEmulator ? 'EMULATOR' : credential ? 'PRODUCTION (firebase login token)' : 'PRODUCTION (ADC)'}`,
);

// ---------------------------------------------------------------------------
// Upsert helper: skip existing (default), update with --update flag
// ---------------------------------------------------------------------------
export interface SeedDoc {
  id: string;
  data: Record<string, unknown>;
}

export async function upsert(
  collection: string,
  docs: SeedDoc[],
  withTimestamps: boolean,
): Promise<void> {
  const update = process.argv.includes('--update');
  const now = FieldValue.serverTimestamp();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const { id, data } of docs) {
    const ref = db.collection(collection).doc(id);
    const exists = (await ref.get()).exists;

    if (exists && !update) {
      skipped++;
      continue;
    }

    const payload = { ...data };
    if (withTimestamps) {
      if (!exists) payload.createdAt = now;
      payload.updatedAt = now;
    }

    await ref.set(payload, { merge: true });
    exists ? updated++ : created++;
  }

  console.log(`  ✓ ${collection}: created=${created} updated=${updated} skipped=${skipped}`);
}

export async function ensureAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    console.log('  ! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin bootstrap');
    return;
  }

  try {
    await auth.getUserByEmail(email);
    console.log(`  ✓ auth user exists: ${email}`);
  } catch {
    await auth.createUser({ email, password, displayName: name });
    console.log(`  ✓ auth user created: ${email}`);
  }

  await upsert(
    'admins',
    [{ id: email, data: { email, displayName: name, role: 'super_admin', active: true } }],
    true,
  );
}
