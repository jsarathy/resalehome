# resalehome.com

South India's trusted resale property platform.  
TNRERA Registered · Independent valuation · Legal due diligence · Home loan facilitation.

---

## Repository layout

```
resalehome/
├── index.html          # Static marketing site (self-contained HTML/CSS/JS)
├── css/styles.css
├── js/main.js
└── app/                # React 18 + Firebase web app (Vite)
    ├── src/
    ├── firestore.rules
    ├── storage.rules
    ├── firestore.indexes.json
    ├── vercel.json
    └── scripts/seed.js
```

---

## Local development — React app

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 or 20 LTS |
| npm | 9+ (bundled with Node) |
| Firebase CLI | `npm i -g firebase-tools` |

---

### 1 — Install dependencies

```powershell
cd app
npm install
```

---

### 2 — Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Enable **Firestore Database** (start in **test mode**, then deploy rules in step 5).
4. Enable **Storage** (start in **test mode**, then deploy rules in step 5).

---

### 3 — Configure environment variables

```powershell
copy .env.example .env.local
```

Open `.env.local` and fill in the values from  
**Firebase console → Project settings → Your apps → Web app → SDK snippet (Config)**:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Used by the seed script
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

---

### 4 — Download a service account key (for seed script)

1. Firebase console → **Project settings → Service accounts**
2. Click **Generate new private key** → Save as `app/service-account-key.json`
3. This file is already in `.gitignore` — never commit it.

---

### 5 — Deploy Firestore and Storage security rules

```powershell
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules,storage
```

Or deploy the composite indexes at the same time:

```powershell
firebase deploy --only firestore
```

---

### 6 — Seed test data

The seed script creates four Firebase Auth users, two properties, one enquiry, and one valuation request.  
Run it **once** from the `app/` directory:

```powershell
node scripts/seed.js
```

Expected output:

```
🌱  Seeding resalehome Firebase...

Creating users…
  ✓  Created user: seller@test.com
  ✓  Created user: buyer@test.com
  ✓  Created user: rm@test.com
  ✓  Created user: admin@test.com

Creating properties…
  ✓  Property 1: <id>
  ✓  Property 2: <id>

Creating enquiry…
  ✓  Enquiry: <id>

Creating valuation request…
  ✓  Valuation: <id>

✅  Seed complete!
```

Re-running the script is safe — existing users are reused (not duplicated).

---

### 7 — Start the development server

```powershell
npm run dev
```

App runs at **http://localhost:5173**

---

## Test credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Seller | `seller@test.com` | `Test1234!` | `/seller/dashboard` |
| Buyer | `buyer@test.com` | `Test1234!` | `/buyer/dashboard` |
| Relationship Manager | `rm@test.com` | `Test1234!` | `/rm/dashboard` |
| Admin | `admin@test.com` | `Test1234!` | `/admin/dashboard` |

All test passwords are `Test1234!` (capital T, ends with exclamation mark).

---

## Role capabilities

| Feature | Seller | Buyer | RM | Admin |
|---------|--------|-------|----|-------|
| List / edit own properties | ✓ | — | — | ✓ |
| Browse public listings | ✓ | ✓ | ✓ | ✓ |
| Send property enquiries | — | ✓ | — | ✓ |
| Request valuation | ✓ | — | — | ✓ |
| Upload valuation PDF | — | — | ✓ | ✓ |
| Manage loan applications | — | ✓ | ✓ | ✓ |
| View all users / data | — | — | — | ✓ |

---

## Deploy to Vercel

```powershell
# From app/ directory
vercel --prod
```

`vercel.json` already configures the SPA rewrite (`/(.*) → /index.html`), the build command (`npm run build`), and the output directory (`dist`).

Set the `VITE_FIREBASE_*` environment variables in **Vercel → Project → Settings → Environment Variables** — they are **not** read from `.env.local` in production.

---

## Security rules summary

### Firestore (`firestore.rules`)

| Collection | Public read | Authenticated read | Create | Update | Delete |
|------------|-------------|-------------------|--------|--------|--------|
| `users` | — | Own record or Admin | Own record | Own record or Admin | Admin |
| `properties` | `status == 'listed'` | Participant or Admin | Seller (own) | Participant or Admin | Admin |
| `enquiries` | — | Participant or Admin | Buyer (own) | Participant or Admin | Admin |
| `valuations` | — | Participant or Admin | RM or Admin | Participant or Admin | Admin |
| `loanApplications` | — | Participant or Admin | Buyer (own) | Participant or Admin | Admin |

All documents include a `participantUids[]` array. Participant access is granted via  
`request.auth.uid in resource.data.participantUids`.

### Storage (`storage.rules`)

| Path | Read | Write |
|------|------|-------|
| `/valuations/**` | Authenticated | RM or Admin |
| `/users/{uid}/**` | Authenticated | Own uid only |
| `/properties/{id}/**` | Public | Authenticated |
