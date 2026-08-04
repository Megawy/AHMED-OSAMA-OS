# Security — MegaPortfolio

## Authentication

- **Provider**: Firebase Authentication (Email/Password)
- **Admin Verification**: Firestore `admins` collection lookup by email
- **Guard Flow**:
  1. `adminGuard` checks `AuthService.user` signal
  2. If authenticated → queries `admins/{email}` document
  3. If `active == true` → route allowed
  4. Otherwise → redirect to `/admin/login`
- **Login Guard**: `loginGuard` prevents already-authenticated admins from accessing login page

## Firestore Security Rules

### Helper Function
```
function isAdminActive() {
  return request.auth != null
    && request.auth.token.email != null
    && exists(/databases/$(database)/documents/admins/$(request.auth.token.email))
    && get(/databases/$(database)/documents/admins/$(request.auth.token.email)).data.active == true;
}
```

### Collection Rules

| Collection | Read | Write | Delete |
|-----------|------|-------|--------|
| `projects` | Public | Admin | Admin |
| `technologies` | Public | Admin | Admin |
| `skills` | Public | Admin | Admin |
| `experience` | Public | Admin | Admin |
| `settings` | Public | Admin | Admin |
| `messages` | Admin | Public (create only, email validated) | Admin |
| `media` | Admin | Admin | Admin |
| `admins` | Admin | Admin | Admin |

### Message Create Validation
- `name` must be non-empty string
- `email` must match email regex pattern
- `message` must be non-empty string
- `status` auto-set to `'new'`

## Storage Security Rules

### Admin Check
Uses cross-service `firestore.exists()` to verify admin status:
```
function isAdmin() {
  return request.auth != null
    && firestore.exists(/databases/(default)/documents/admins/$(request.auth.token.email));
}
```

### Folder Rules

| Folder | Read | Write | Delete |
|--------|------|-------|--------|
| `projects/**` | Public | Admin | Admin |
| `blog/**` | Public | Admin | Admin |
| `general/**` | Public | Admin | Admin |
| `avatars/**` | Public | Authenticated (own file) | Admin |

## Environment Security

### Secrets Management
- All secrets and API keys live in `.env` — the single source of truth
- `.env` and `.env.*` ignored (`.env.example` is the committed template)
- `src/environments/environment.{development,production}.ts` are generated from
  `.env` by `npm run env:generate` and are git-ignored
- `environment.local.ts` and the `*.local.ts` pattern ignored
- `serviceAccountKey.json`, `*.pem`, `*.key` ignored
- `.firebase/` cache and `firebase-debug.log` ignored

### File Replacements
- `ng serve` → uses `environment.development.ts` (generated)
- `ng build` → replaces with `environment.production.ts` (generated)
- `ng serve --configuration local` → replaces with `environment.local.ts`

### Production Deployment
- Never commit `.env` or the generated `src/environments/environment.*.ts` files
- Never commit `environment.local.ts`
- Provide `.env` values via CI/CD secrets, then run `npm run env:generate` in the
  pipeline before building
- Deploy Firestore rules separately: `firebase deploy --only firestore:rules`
- Deploy Storage rules separately: `firebase deploy --only storage:rules`

## Recommendations

1. **Add reCAPTCHA** to contact form to prevent spam
2. **Enable Firebase App Check** to prevent unauthorized API access
3. **Set up Firebase Authentication providers** (Google) as backup
4. **Add rate limiting** via Cloud Functions for message submission
5. **Monitor** Firebase Console for unusual usage patterns
6. **Rotate API keys** if exposed in git history
7. **Enable Firestore audit logging** for admin actions
