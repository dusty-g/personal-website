import { Firestore, FieldValue } from "@google-cloud/firestore";
import { GoogleAuth } from "google-auth-library";

if (typeof window !== "undefined") {
  throw new Error("firebaseAdmin must be used only on the server");
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is required");
}

const appCheckAuth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/firebase"],
});

export const adb = new Firestore({ projectId });
export { FieldValue };

export async function verifyAppCheckToken(appCheckToken: string) {
  const client = await appCheckAuth.getClient();
  return client.request({
    url: `https://firebaseappcheck.googleapis.com/v1beta/projects/${projectId}:verifyAppCheckToken`,
    method: "POST",
    data: { appCheckToken },
  });
}
