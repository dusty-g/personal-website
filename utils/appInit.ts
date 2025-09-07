import { initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from "firebase/app-check";

let app: FirebaseApp | undefined;
let appCheck: AppCheck | undefined;

export function ensureAppAndAppCheck(): FirebaseApp {
  if (!app) {
    app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    });
  }

  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_FB_APPCHECK_DEBUG) {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN =
    process.env.NEXT_PUBLIC_FB_APPCHECK_DEBUG === "true"
      ? true
      : process.env.NEXT_PUBLIC_FB_APPCHECK_DEBUG || undefined;
    }
    if (!appCheck) {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FB_RECAPTCHA_V3_SITE_KEY!),
        isTokenAutoRefreshEnabled: true,
      });
    }
  }

  return app;
}

export function getAppCheckInstance(): AppCheck | undefined {
  return appCheck;
}