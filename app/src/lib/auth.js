import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';
import { setUser } from './firestore';

export async function signUp(email, password, { name, phone, role }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  // Persist profile in /users/{uid}
  await setUser(user.uid, { name, email, phone, role });
  return user;
}

export async function signIn(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
