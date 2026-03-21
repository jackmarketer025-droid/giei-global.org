'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    
    // If we have a firebaseConfig, use it directly. 
    // This is safer for non-Firebase Hosting environments like Vercel.
    if (firebaseConfig && Object.keys(firebaseConfig).length > 0 && firebaseConfig.apiKey) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      try {
        // Fallback to automatic initialization if config is missing
        firebaseApp = initializeApp();
      } catch (e) {
        if (process.env.NODE_ENV === "production") {
          console.error('Firebase initialization failed. No config found and automatic initialization failed.', e);
        }
        // Last resort: try with empty/default config if somehow it's still needed
        firebaseApp = initializeApp(firebaseConfig);
      }
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
