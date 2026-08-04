// Applies cors.json to the Firebase Storage bucket via the GCS JSON API.
// Uses the OAuth refresh token from `firebase login` (no gcloud/gsutil needed).
// Run: npm run storage:cors
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { getAccessToken } = require('firebase-tools/lib/auth');
const scopes = require('firebase-tools/lib/scopes');

const PROJECT = process.env.FIREBASE_PROJECT_ID ?? 'ahmed-osama-portfolio';
const BUCKET = process.env.FIREBASE_STORAGE_BUCKET ?? `${PROJECT}.firebasestorage.app`;
const CORS_FILE = path.join(__dirname, '..', 'cors.json');
const SCOPES = [
  scopes.EMAIL,
  scopes.OPENID,
  scopes.CLOUD_PROJECTS_READONLY,
  scopes.FIREBASE_PLATFORM,
  scopes.CLOUD_PLATFORM,
];

function loadRefreshToken() {
  const cfgPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (!existsSync(cfgPath)) {
    console.error('✗ Not logged in. Run: npx firebase login');
    process.exit(1);
  }
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  const tokens = cfg.tokens ?? {};
  return tokens.refresh_token ?? Object.values(tokens).find((t) => t?.refresh_token)?.refresh_token;
}

async function main() {
  const { access_token } = await getAccessToken(loadRefreshToken(), SCOPES);
  const headers = { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' };

  // 1. Bucket must exist — otherwise Firebase Storage was never provisioned.
  const check = await fetch(`https://storage.googleapis.com/storage/v1/b/${BUCKET}`, { headers });
  if (check.status === 404) {
    console.error(`✗ Bucket not found: ${BUCKET}`);
    console.error('  Enable billing for the project, then run: node scripts/provision-storage.cjs');
    process.exit(1);
  }
  if (!check.ok) throw new Error(`Bucket check failed: ${check.status} ${await check.text()}`);

  // 2. Apply the CORS configuration.
  const cors = JSON.parse(readFileSync(CORS_FILE, 'utf8'));
  const res = await fetch(`https://storage.googleapis.com/storage/v1/b/${BUCKET}?fields=cors`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ cors }),
  });
  if (!res.ok) throw new Error(`CORS config failed: ${res.status} ${await res.text()}`);

  const applied = await res.json();
  console.log(`✓ CORS applied to gs://${BUCKET}`);
  console.log(JSON.stringify(applied.cors, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('✗ Failed:', e.message);
    process.exit(1);
  });
