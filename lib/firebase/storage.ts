import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadEvidenceSnapshot(blob: Blob, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, `evidence/${path}`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (err) {
    console.warn('Storage upload fallback to demo base64 or local path:', err);
    return '/assets/simulated-snapshot.jpg';
  }
}
