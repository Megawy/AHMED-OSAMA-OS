// One-shot provisioner: enables Firebase Storage API + creates the default bucket.
// Uses the OAuth refresh token from `firebase login` (no service account needed).
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { getAccessToken } = require('firebase-tools/lib/auth');
const scopes = require('firebase-tools/lib/scopes');

const PROJECT = process.env.FIREBASE_PROJECT_ID ?? 'ahmed-osama-portfolio';
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
  const rt =
    tokens.refresh_token ?? Object.values(tokens).find((t) => t?.refresh_token)?.refresh_token;
  if (!rt) {
    console.error('✗ No refresh token found. Run: npx firebase login --reauth');
    process.exit(1);
  }
  return rt;
}

async function waitOperation(op, headers) {
  if (!op?.name) return;
  for (let i = 0; i < 30 && !op.done; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`https://serviceusage.googleapis.com/v1/${op.name}`, { headers });
    op = await res.json();
  }
  if (op?.error) throw new Error(`Operation failed: ${JSON.stringify(op.error)}`);
}

async function main() {
  const { access_token } = await getAccessToken(loadRefreshToken(), SCOPES);
  const info = await (
    await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${access_token}`)
  ).json();
  console.log(`→ token scopes: ${info.scope}`);
  const headers = { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' };

  // 1. Enable Firebase Storage API
  let res = await fetch(
    `https://serviceusage.googleapis.com/v1/projects/${PROJECT}/services/firebasestorage.googleapis.com:enable`,
    { method: 'POST', headers },
  );
  if (!res.ok) throw new Error(`API enable failed: ${res.status} ${await res.text()}`);
  await waitOperation(await res.json(), headers);
  console.log('✓ firebasestorage.googleapis.com enabled');

  // 2. Create the bucket via GCS JSON API (firebase login token has full GCS access)
  const proj = await (
    await fetch(`https://firebase.googleapis.com/v1beta1/projects/${PROJECT}`, { headers })
  ).json();
  const projectNumber = proj.projectNumber;
  const bucketName = `${PROJECT}.firebasestorage.app`;
  res = await fetch(`https://storage.googleapis.com/storage/v1/b?project=${projectNumber}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: bucketName, location: 'US' }),
  });
  if (res.status === 409) {
    console.log(`✓ Bucket already exists: ${bucketName}`);
  } else if (!res.ok) {
    throw new Error(`GCS bucket creation failed: ${res.status} ${await res.text()}`);
  } else {
    console.log(`✓ Bucket created: ${bucketName}`);
  }

  // 3. Best-effort: link as Firebase default bucket (ignored if blocked)
  const link = await fetch(
    `https://firebasestorage.googleapis.com/v1beta/projects/${PROJECT}/defaultBucket`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ bucket: { name: `projects/${PROJECT}/buckets/${bucketName}` } }),
    },
  );
  console.log(
    link.ok
      ? '✓ Linked as default bucket'
      : `! defaultBucket link skipped (${link.status}) — firebase.json pins the bucket explicitly`,
  );

  // 4. Apply CORS so browser uploads (XHR preflight) succeed from any origin.
  //    Without this, uploads fail with ERR_FAILED / ERR_HTTP2_PROTOCOL_ERROR.
  const cors = [
    {
      origin: ['*'],
      method: ['GET', 'HEAD', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
      responseHeader: ['Content-Type', 'Content-Disposition', 'x-goog-resumable'],
      maxAgeSeconds: 3600,
    },
  ];
  res = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucketName}?fields=cors`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ cors }),
  });
  if (!res.ok) throw new Error(`CORS config failed: ${res.status} ${await res.text()}`);
  console.log('✓ CORS configuration applied to bucket');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('✗ Provision failed:', e.message);
    process.exit(1);
  });
