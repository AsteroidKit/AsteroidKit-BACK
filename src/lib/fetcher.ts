import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

export interface AppConfigInterface {
  accentColor: string;
  accentForegroundColor: string;
  appId: string;
  chains: string[];
  siwe: boolean;
  social: boolean;
  theme: string;
  themeId: string;
  wallets: string[];
}

const firebaseConfig = {
  apiKey: 'AIzaSyC6VU0evv45aA8auEpAR7_oJkNrUtu_vm0',
  authDomain: 'asteroidkit-dashboard.firebaseapp.com',
  projectId: 'asteroidkit-dashboard',
  storageBucket: 'asteroidkit-dashboard.appspot.com',
  messagingSenderId: '770385218222',
  appId: '1:770385218222:web:f2e9b78ee12eb871a47b3f',
  measurementId: 'G-X8B1V12YB8',
};

const app = initializeApp(firebaseConfig);

export const fetchFromServers = async (
  appId: string
): Promise<AppConfigInterface> => {
  const db = getFirestore(app);

  const appInfoDocRef = doc(db, 'appInfo', appId);
  const appInfoSnap = await getDoc(appInfoDocRef);

  if (!appInfoSnap.exists()) {
    throw new Error('No application was found');
  }

  return {
    ...appInfoSnap.data(),
    appId: appInfoSnap.id,
  } as AppConfigInterface;
};
