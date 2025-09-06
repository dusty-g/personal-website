import "server-only";
import * as admin from "firebase-admin";

const credential =
  process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? admin.credential.cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS))
    : admin.credential.applicationDefault();

if (!admin.apps.length) {
  admin.initializeApp({ credential });
}

export const adb = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
