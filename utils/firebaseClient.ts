// utils/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken as getAppCheckToken,
  AppCheck,
} from "firebase/app-check";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

let appCheck: AppCheck | undefined;
if (typeof window !== "undefined" && !appCheck) {
  // Enable debug only in dev if needed
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_FB_APPCHECK_DEBUG === "true";
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FB_RECAPTCHA_V3_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
}

export const db = getFirestore(app);

export async function getAppCheckHeader() {
  if (typeof window === "undefined" || !appCheck) return {};
  try {
    const { token } = await getAppCheckToken(appCheck, /* forceRefresh */ false);
    return token ? { "X-Firebase-AppCheck": token } : {};
  } catch {
    return {};
  }
}