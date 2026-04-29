/**
 * scripts/seed.js
 *
 * Creates test data in Firebase (Auth + Firestore).
 * Uses Firebase Admin SDK — requires a service account key.
 *
 * Setup:
 *   1. Download a service account key from Firebase console
 *      Project settings → Service accounts → Generate new private key
 *   2. Save it as app/service-account-key.json  (already gitignored)
 *   3. Copy .env.example to .env.local and fill in FIREBASE_PROJECT_ID
 *   4. From app/ directory: node scripts/seed.js
 *
 * Test credentials created:
 *   seller@test.com  / Test1234!
 *   buyer@test.com   / Test1234!
 *   rm@test.com      / Test1234!
 *   admin@test.com   / Test1234!
 */

import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);

// Load service account key
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync('./service-account-key.json', 'utf8'));
} catch {
  console.error('❌  service-account-key.json not found. See setup instructions above.');
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });

const adminAuth = getAuth();
const db        = getFirestore();

// ── Helpers ───────────────────────────────────────────────────────────────────

async function createUser(email, password, profile) {
  let userRecord;
  try {
    userRecord = await adminAuth.getUserByEmail(email);
    console.log(`  ↩  Existing user: ${email}`);
  } catch {
    userRecord = await adminAuth.createUser({ email, password, displayName: profile.name });
    console.log(`  ✓  Created user: ${email}`);
  }
  // Write Firestore profile
  await db.collection('users').doc(userRecord.uid).set({
    name:      profile.name,
    email,
    phone:     profile.phone,
    role:      profile.role,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }, { merge: true });
  return userRecord.uid;
}

async function run() {
  console.log('\n🌱  Seeding resalehome Firebase...\n');

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log('Creating users…');
  const sellerUid = await createUser('seller@test.com', 'Test1234!', {
    name: 'Suresh Venkataraman', phone: '+91 98400 11111', role: 'seller',
  });
  const buyerUid = await createUser('buyer@test.com', 'Test1234!', {
    name: 'Priya Krishnaswamy',  phone: '+91 98400 22222', role: 'buyer',
  });
  const rmUid = await createUser('rm@test.com', 'Test1234!', {
    name: 'Anand Ramasubramanian', phone: '+91 98400 33333', role: 'rm',
  });
  await createUser('admin@test.com', 'Test1234!', {
    name: 'Admin User', phone: '+91 98400 44444', role: 'admin',
  });

  // ── Properties ─────────────────────────────────────────────────────────────
  console.log('\nCreating properties…');

  const prop1Ref = db.collection('properties').doc();
  await prop1Ref.set({
    participantUids:    [sellerUid, rmUid],
    sellerUid,
    assignedRMUid:      rmUid,
    title:              '3 BHK Apartment in Anna Nagar',
    location:           'Anna Nagar, Chennai',
    area_sqft:          1450,
    asking_price_lakhs: 95,
    property_type:      'apartment',
    bedrooms:           3,
    bathrooms:          2,
    age_years:          8,
    description:        'Well-maintained 3BHK in prime Anna Nagar location. Close to schools, hospitals and metro.',
    status:             'listed',
    createdAt:          Timestamp.now(),
    updatedAt:          Timestamp.now(),
    listedAt:           Timestamp.now(),
  });
  console.log(`  ✓  Property 1: ${prop1Ref.id}`);

  const prop2Ref = db.collection('properties').doc();
  await prop2Ref.set({
    participantUids:    [sellerUid],
    sellerUid,
    assignedRMUid:      null,
    title:              'Independent House in Adyar',
    location:           'Adyar, Chennai',
    area_sqft:          2200,
    asking_price_lakhs: 180,
    property_type:      'house',
    bedrooms:           4,
    bathrooms:          3,
    age_years:          15,
    description:        'Spacious independent house on 4 grounds in quiet Adyar neighbourhood.',
    status:             'draft',
    createdAt:          Timestamp.now(),
    updatedAt:          Timestamp.now(),
    listedAt:           null,
  });
  console.log(`  ✓  Property 2: ${prop2Ref.id}`);

  // ── Enquiry ────────────────────────────────────────────────────────────────
  console.log('\nCreating enquiry…');
  const enqRef = db.collection('enquiries').doc();
  await enqRef.set({
    participantUids: [buyerUid, sellerUid, rmUid],
    propertyId:      prop1Ref.id,
    buyerUid,
    sellerUid,
    assignedRMUid:   rmUid,
    message:         'I am very interested in this property. Could we schedule a viewing this weekend?',
    status:          'new',
    createdAt:       Timestamp.now(),
    updatedAt:       Timestamp.now(),
  });
  console.log(`  ✓  Enquiry: ${enqRef.id}`);

  // ── Valuation request ──────────────────────────────────────────────────────
  console.log('\nCreating valuation request…');
  const valRef = db.collection('valuations').doc();
  await valRef.set({
    participantUids: [sellerUid, rmUid],
    propertyId:      prop1Ref.id,
    sellerUid,
    assignedRMUid:   rmUid,
    requestedAt:     Timestamp.now().toDate().toISOString(),
    status:          'requested',
    report_url:      null,
    valuedAt_lakhs:  null,
    valuedBy:        null,
    createdAt:       Timestamp.now(),
    updatedAt:       Timestamp.now(),
  });
  console.log(`  ✓  Valuation: ${valRef.id}`);

  console.log('\n✅  Seed complete!\n');
  console.log('Test credentials:');
  console.log('  seller@test.com  / Test1234!');
  console.log('  buyer@test.com   / Test1234!');
  console.log('  rm@test.com      / Test1234!');
  console.log('  admin@test.com   / Test1234!\n');
  process.exit(0);
}

run().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
