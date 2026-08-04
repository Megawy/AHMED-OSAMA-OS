import { initializeApp, getApp, type FirebaseApp } from 'firebase/app';

import { environment } from '@environments/environment.development';

export const firebaseConfig = environment.firebase;

// globalThis persists across Vite's dual module graphs (SSR + browser)
// that share the same Firebase internal registry but have separate getApps() scopes.
const __key = '__firebase_app_initialized__';

export const firebaseApp: FirebaseApp = (globalThis as Record<string, unknown>)[__key]
  ? getApp()
  : (() => {
      (globalThis as Record<string, unknown>)[__key] = true;
      return initializeApp(firebaseConfig);
    })();
