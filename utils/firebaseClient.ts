import { ensureAppAndAppCheck , getAppCheckInstance} from "./appInit";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getToken as getAppCheckToken, type AppCheck } from "firebase/app-check";

let _db: Firestore | undefined;
let _auth: Auth | undefined;
let _rtdb: Database | undefined;

export function getDb()   { return _db   ?? (_db   = getFirestore(ensureAppAndAppCheck())); }
export function getAuthC(){ return _auth ?? (_auth = getAuth(ensureAppAndAppCheck())); }
export function getRtdb() { return _rtdb ?? (_rtdb = getDatabase(ensureAppAndAppCheck())); }

export async function getAppCheckHeader() {
  if (typeof window === "undefined") return {};
  const ac: AppCheck | undefined = getAppCheckInstance();
  if (!ac) {
    console.warn("[AppCheck] no AppCheck instance available");
    return {};
  }
  try {
    const { token } = await getAppCheckToken(ac, false);
    if (token) {
    //   console.log("[AppCheck] token retrieved:", token.substring(0, 12) + "…");
      return { "X-Firebase-AppCheck": token };
    } else {
      console.warn("[AppCheck] no token returned");
      return {};
    }
  } catch (err) {
    console.error("[AppCheck] getToken failed", err);
    return {};
  }
}


// --- one-time probe on module load (client only) ---
// if (typeof window !== "undefined") {
//   const ac = getAppCheckInstance();
//   if (ac) {
//     getAppCheckToken(ac, false)
//       .then(({ token }) => {
//         console.log("[AppCheck probe] initial token?", !!token);
//       })
//       .catch((e) => {
//         console.error("[AppCheck probe] failed", e);
//       });
//   }
// }