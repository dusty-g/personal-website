import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (typeof window !== "undefined") {
  throw new Error("firebaseAdmin must be used only on the server");
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: applicationDefault() });

export const adb = getFirestore(app);
export { FieldValue };