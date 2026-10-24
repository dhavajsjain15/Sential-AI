import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { app } from './firebase';

export async function logTelemetryEvent(eventName: string, params?: Record<string, any>) {
  try {
    const supported = await isSupported();
    if (supported && typeof window !== 'undefined') {
      const analytics = getAnalytics(app);
      logEvent(analytics, eventName, params);
    }
  } catch (err) {
    // Safe fallback in SSR or demo environments
  }
}
