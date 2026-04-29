import {
  collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ── Helpers ──────────────────────────────────────────────────────────────────

const col = (name) => collection(db, name);
const ref = (name, id) => doc(db, name, id);

async function getDocData(docRef) {
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function getQueryDocs(q) {
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getUser(uid) {
  return getDocData(ref('users', uid));
}

export async function setUser(uid, data) {
  await setDoc(ref('users', uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUser(uid, data) {
  await updateDoc(ref('users', uid), { ...data, updatedAt: serverTimestamp() });
}

export async function getAllUsers() {
  return getQueryDocs(query(col('users'), orderBy('createdAt', 'desc')));
}

// ── Properties ────────────────────────────────────────────────────────────────

export async function getProperty(id) {
  return getDocData(ref('properties', id));
}

export async function getPropertiesByParticipant(uid) {
  return getQueryDocs(
    query(col('properties'), where('participantUids', 'array-contains', uid), orderBy('createdAt', 'desc'))
  );
}

export async function getListedProperties() {
  return getQueryDocs(
    query(col('properties'), where('status', '==', 'listed'), orderBy('createdAt', 'desc'))
  );
}

export async function createProperty(data) {
  const docRef = await addDoc(col('properties'), {
    ...data,
    status: data.status || 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProperty(id, data) {
  await updateDoc(ref('properties', id), { ...data, updatedAt: serverTimestamp() });
}

// ── Enquiries ─────────────────────────────────────────────────────────────────

export async function getEnquiry(id) {
  return getDocData(ref('enquiries', id));
}

export async function getEnquiriesByParticipant(uid) {
  return getQueryDocs(
    query(col('enquiries'), where('participantUids', 'array-contains', uid), orderBy('createdAt', 'desc'))
  );
}

export async function getEnquiriesByProperty(propertyId) {
  return getQueryDocs(
    query(col('enquiries'), where('propertyId', '==', propertyId), orderBy('createdAt', 'desc'))
  );
}

export async function createEnquiry(data) {
  const docRef = await addDoc(col('enquiries'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateEnquiry(id, data) {
  await updateDoc(ref('enquiries', id), { ...data, updatedAt: serverTimestamp() });
}

// ── Valuations ────────────────────────────────────────────────────────────────

export async function getValuation(id) {
  return getDocData(ref('valuations', id));
}

export async function getValuationsByParticipant(uid) {
  return getQueryDocs(
    query(col('valuations'), where('participantUids', 'array-contains', uid), orderBy('createdAt', 'desc'))
  );
}

export async function createValuation(data) {
  const docRef = await addDoc(col('valuations'), {
    ...data,
    status: 'requested',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateValuation(id, data) {
  await updateDoc(ref('valuations', id), { ...data, updatedAt: serverTimestamp() });
}

// ── Loan Applications ─────────────────────────────────────────────────────────

export async function getLoanApplication(id) {
  return getDocData(ref('loanApplications', id));
}

export async function getLoanApplicationsByParticipant(uid) {
  return getQueryDocs(
    query(col('loanApplications'), where('participantUids', 'array-contains', uid), orderBy('createdAt', 'desc'))
  );
}

export async function createLoanApplication(data) {
  const docRef = await addDoc(col('loanApplications'), {
    ...data,
    status: 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateLoanApplication(id, data) {
  await updateDoc(ref('loanApplications', id), { ...data, updatedAt: serverTimestamp() });
}
