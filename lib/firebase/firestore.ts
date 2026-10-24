import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { Incident, Device } from '@/types';

export async function fetchLiveIncidents(): Promise<Incident[]> {
  try {
    const q = query(collection(db, 'incidents'), orderBy('timestamp', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Incident));
  } catch (err: any) {
    console.warn('Using fallback mock incidents due to offline/demo mode:', err);
    return [];
  }
}

export function subscribeToIncidents(callback: (incidents: Incident[]) => void) {
  try {
    const q = query(collection(db, 'incidents'), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(q, (snap: any) => {
      const list = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Incident));
      callback(list);
    }, (err: any) => {
      console.warn('Firestore snapshot error (expected in demo bypass):', err);
    });
  } catch (err: any) {
    return () => {};
  }
}

export async function logIncidentToLedger(incident: Partial<Incident>) {
  try {
    await addDoc(collection(db, 'incidents'), {
      ...incident,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not write to Firestore in local/demo mode:', err);
  }
}

export async function updateDeviceStatusInCloud(deviceId: string, status: string) {
  try {
    const ref = doc(db, 'devices', deviceId);
    await updateDoc(ref, { status, lastPing: new Date().toISOString() });
  } catch (err) {
    console.warn('Device update fallback:', err);
  }
}
