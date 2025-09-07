import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from "firebase/app-check";

let app: FirebaseApp | undefined;
let appCheck: AppCheck | undefined;

export function ensureAppAndAppCheck(): FirebaseApp {
  if (!app) {
    app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
      // ...existing code...
    });
  }

  if (typeof window !== "undefined" && !appCheck) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FB_RECAPTCHA_V3_SITE_KEY!),
      isTokenAutoRefreshEnabled: true,
    });
  }

  return app;
}

export function getAppCheckInstance(): AppCheck | undefined {
  return appCheck;
}