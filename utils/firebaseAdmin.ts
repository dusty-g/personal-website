import * as admin from "firebase-admin";

// Ensure this file is only executed in a server-side context.
if (typeof window !== "undefined") {
  throw new Error("firebaseAdmin must be used only on the server");
}

const credential =
  process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? admin.credential.cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS))
    : admin.credential.applicationDefault();

if (!admin.apps.length) {
  admin.initializeApp({ credential });
}

export const adb = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
