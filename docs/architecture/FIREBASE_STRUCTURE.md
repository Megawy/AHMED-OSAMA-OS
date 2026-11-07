# Firebase Structure — MegaPortfolio

## Project

- **Project ID**: `ahmed-osama-portfolio`
- **Auth Domain**: `ahmed-osama-portfolio.firebaseapp.com`
- **Storage Bucket**: `ahmed-osama-portfolio.firebasestorage.app`

## Collections

### `projects`

| Field | Type | Notes |
|-------|------|-------|
| title | string | Project name |
| slug | string | URL-friendly identifier |
| description | string | Short description |
| category | string | `dotnet`, `microservices`, `angular`, `fullstack` |
| status | string | `completed`, `in-progress`, `planned` |
| featured | boolean | Show on home page |
| technologies | string[] | Tech stack tags |
| coverImage | string | Firebase Storage URL |
| gallery | string[] | Array of Storage URLs |
| githubUrl | string | Source code link |
| liveUrl | string | Demo link |
| order | number | Sort order |

**Access**: Public read, admin write.

### `technologies`

| Field | Type | Notes |
|-------|------|-------|
| name | string | Technology name |
| category | string | Group category |
| icon | string | Icon identifier |
| level | string | Proficiency level |
| years | number | Years of experience |

**Access**: Public read, admin write.

### `skills`

| Field | Type | Notes |
|-------|------|-------|
| name | string | Skill name |
| category | string | Skill category |
| level | string | `beginner`, `intermediate`, `advanced`, `expert` |
| years | number | Years of experience |
| order | number | Display order |

**Access**: Public read, admin write.

### `experience`

| Field | Type | Notes |
|-------|------|-------|
| company | string | Company name |
| role | string | Job title |
| startDate | Timestamp | Start date |
| endDate | Timestamp | End date (null if current) |
| current | boolean | Currently working here |
| description | string | Role description |
| achievements | string[] | Key achievements |
| technologies | string[] | Tech stack used |
| order | number | Sort order |

**Access**: Public read, admin write.

### `settings` (single document: `settings/site`)

| Field | Type | Notes |
|-------|------|-------|
| siteName | string | Portfolio name |
| siteDescription | string | Meta description |
| contactEmail | string | Public contact email |
| socialLinks | SocialLink[] | Array of `{platform, url, icon}` |
| resumeUrl | string | PDF resume link |
| updatedAt | Timestamp | Last modification |

**Access**: Public read, admin write.

### `messages`

| Field | Type | Notes |
|-------|------|-------|
| name | string | Sender name |
| email | string | Sender email (validated regex) |
| subject | string | Message subject |
| message | string | Message body |
| status | string | `new`, `read`, `replied`, `archived` |
| createdAt | Timestamp | Submission time |

**Access**: Public create (email validated), admin read/update/delete.

### `media`

| Field | Type | Notes |
|-------|------|-------|
| name | string | File name |
| path | string | Storage path |
| url | string | Download URL |
| size | number | File size in bytes |
| type | string | MIME type |
| folder | string | Storage folder |
| uploadedAt | Timestamp | Upload time |

**Access**: Admin only.

### `admins`

| Field | Type | Notes |
|-------|------|-------|
| email | string | Admin email (document ID) |
| role | string | `super_admin`, `editor`, `viewer` |
| active | boolean | Access enabled |
| name | string | Display name |

**Access**: Admin only. Document ID = email address.

## Storage Folders

| Folder | Purpose | Access |
|--------|---------|--------|
| `projects/` | Project cover images and galleries | Public read, admin write |
| `blog/` | Blog post images | Public read, admin write |
| `general/` | General media files | Public read, admin write |
| `avatars/` | User avatars | Public read, auth write |

## Security Rules

- **Helper function**: `isAdminActive()` checks `request.auth.token.email` against `admins` collection
- **Public read**: `projects`, `technologies`, `skills`, `experience`, `settings`
- **Public create** (validated): `messages` (email regex required)
- **Admin only**: `media`, `admins`, message read/update/delete
- **Storage**: Cross-service `firestore.exists()` for admin verification

## Authentication

- **Method**: Email/Password
- **Admin verification**: Firestore `admins` collection lookup by email
- **Guard flow**: `adminGuard` → `AuthService.user` signal → Firestore `admins/{email}` → `active == true`
