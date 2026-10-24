import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export async function loginWithEmail(email: string, pass: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { user: cred.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message };
  }
}

export async function signupWithEmail(email: string, pass: string, name: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    return { user: cred.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message };
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
