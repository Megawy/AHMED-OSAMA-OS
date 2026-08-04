# Known Issues — MegaPortfolio

## Build Warnings

### Bundle Size Exceeds Budget
- **Severity**: Warning
- **Detail**: Initial bundle 917 kB exceeds 500 kB warning budget
- **Cause**: Firebase SDK included in initial bundle
- **Fix**: Lazy-load Firebase SDK, defer initialization until admin routes load
- **Priority**: High

### CommonJS Dependencies
- **Severity**: Warning
- **Detail**: `@grpc/grpc-js` and `@grpc/proto-loader` are CommonJS modules
- **Cause**: Firebase Firestore server SDK uses CommonJS
- **Impact**: Non-blocking, optimization bailout warning only
- **Fix**: No fix available (upstream Firebase dependency)
- **Priority**: Low (ignore)

## Bugs

### Overflow Detector Disabled
- **Severity**: Low
- **Detail**: `OverflowDetector` component import is commented out in `home.ts`
- **Impact**: Debug tool unavailable (non-user-facing)
- **Fix**: Re-enable if needed for debugging
- **Priority**: Low

### Blog Page Empty
- **Severity**: Medium
- **Detail**: Blog page exists as route placeholder but has no content
- **Impact**: `/blog` route shows empty page
- **Fix**: Implement blog feature with Firestore posts collection
- **Priority**: Medium

### Stats Section Hardcoded
- **Severity**: Low
- **Detail**: Home stats section (3+ projects, 10+ technologies, etc.) uses hardcoded HTML
- **Impact**: Stats don't reflect actual Firestore data
- **Fix**: Load stats from settings or computed from Firestore collections
- **Priority**: Low

## Technical Debt

### Missing Unit Tests
- **Detail**: `.spec.ts` files exist but contain no meaningful tests
- **Impact**: No automated quality assurance
- **Fix**: Write Vitest tests for all services and key components
- **Priority**: High

### No E2E Tests
- **Detail**: No end-to-end testing framework configured
- **Impact**: No integration testing
- **Priority**: Medium

### Admin Pages Not Translated
- **Detail**: Admin dashboard uses English-only text (no `translate` pipe)
- **Impact**: Admin interface not localized
- **Priority**: Low

### No SEO Implementation
- **Detail**: No `<meta>` tags, Open Graph, Twitter Cards, or JSON-LD
- **Impact**: Poor search engine visibility
- **Fix**: Add `Meta` service with per-page tags
- **Priority**: High

### No Image Optimization
- **Detail**: Images served at full resolution without WebP/lazy loading
- **Impact**: Slow page loads on mobile
- **Priority**: Medium

### Firebase SDK in Initial Bundle
- **Detail**: Firebase loads on every page even for non-admin visitors
- **Impact**: 917 kB initial bundle
- **Fix**: Dynamic import Firebase only when admin routes load
- **Priority**: High

## Limitations

### Single Admin Support
- **Detail**: Guard checks Firestore `admins` collection but UI doesn't support multi-admin management
- **Impact**: Must manually add admin documents to Firestore
- **Priority**: Low

### No Offline Support
- **Detail**: No Firestore offline persistence configured
- **Impact**: Admin dashboard requires internet connection
- **Priority**: Low

### No Rate Limiting
- **Detail**: Contact form has no server-side rate limiting
- **Impact**: Potential spam
- **Fix**: Add Cloud Function with rate limiting or reCAPTCHA
- **Priority**: Medium

### Prerender Limitation
- **Detail**: All routes prerendered with static data at build time
- **Impact**: Dynamic content (projects, experience) requires rebuild to update on public pages
- **Fix**: Use client-side Firestore fetch for dynamic pages instead of prerender data
- **Priority**: Medium
