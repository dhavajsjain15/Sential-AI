import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app } from './firebase';

export async function requestPushNotificationPermission(): Promise<string | null> {
  try {
    const supported = await isSupported();
    if (!supported || typeof window === 'undefined') return null;

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'BF_demo_vapid_key_for_sentinel_ai_push_notifications',
      });
      return token;
    }
    return null;
  } catch (err) {
    console.warn('Push messaging permission fallback:', err);
    return null;
  }
}

export async function subscribeToPushMessages(callback: (payload: any) => void) {
  try {
    const supported = await isSupported();
    if (!supported || typeof window === 'undefined') return () => {};

    const messaging = getMessaging(app);
    return onMessage(messaging, callback);
  } catch (err) {
    return () => {};
  }
}
