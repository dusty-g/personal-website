import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from "firebase/app-check";

let app: FirebaseApp | undefined;
let appCheck: AppCheck | undefined;

function logApps(label: string) {
  console.log(
    `[firebase] ${label}`,
    getApps().map((a) => ({
      name: a.name,
      projectId: a.options.projectId,
      appId: a.options.appId,
    }))
  );
}

export function ensureAppAndAppCheck(): FirebaseApp {
  if (!app) {
    logApps("existing apps before init");

    const projectId = process.env.NEXT_PUBLIC_FB_PROJECT_ID;
    const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
    if (!projectId || !appId) {
      console.error("[firebase] missing env", { projectId, appId });
      throw new Error("Firebase env vars missing");
    }

    app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
      appId,
      // ...existing code...
    });

    logApps("apps after init");
    console.log("[firebase] initialized", {
      projectId: app.options.projectId,
      appId: app.options.appId,
    });
  }

  if (typeof window !== "undefined" && !appCheck) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_FB_RECAPTCHA_V3_SITE_KEY!
      ),
      isTokenAutoRefreshEnabled: true,
    });
    console.log("[AppCheck] initialized", {
      siteKey: process.env.NEXT_PUBLIC_FB_RECAPTCHA_V3_SITE_KEY,
    });
  }

  return app;
}

export function getAppCheckInstance(): AppCheck | undefined {
  return appCheck;
}