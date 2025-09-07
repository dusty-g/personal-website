import type { NextApiRequest, NextApiResponse } from "next";
import { adb, FieldValue } from "../../utils/firebaseAdmin";
import crypto from "crypto";

// Limits: human-ish ceiling;
const MAX_PER_SEC = 8;
const MAX_PER_MIN = 200;
console.log("Admin projectId:", (await import("firebase-admin/app")).getApp().options.projectId);

async function verifyAppCheck(req: NextApiRequest) {
  const token = (req.headers["x-firebase-appcheck"] as string) || "";
  if (!token) throw new Error("NO_APPCHECK");
  try {
    const { getAppCheck } = await import("firebase-admin/app-check");
    const ac = getAppCheck();
    const decoded = await ac.verifyToken(token);
    // console.log("AppCheck OK", decoded.appId, decoded.sub);
    return decoded;
  } catch (e: any) {
    // console.error("AppCheck verify failed:", e?.code, e?.message, e);
    throw new Error("BAD_APPCHECK");
  }
}

function clientIp(req: NextApiRequest) {
  const xf = (req.headers["x-forwarded-for"] as string) || "";
  return (xf.split(",")[0] || req.socket.remoteAddress || "0.0.0.0").trim();
}

async function rateLimit(ip: string) {
  const now = Date.now();
  const id = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
  const ref = adb.doc(`ratelimits/${id}`);

  await adb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const d = snap.exists ? (snap.data() as any) : {};
    const secStart = d.secStart ?? 0, minStart = d.minStart ?? 0;
    const secCount = (now - secStart >= 1000) ? 0 : (d.secCount ?? 0);
    const minCount = (now - minStart >= 60_000) ? 0 : (d.minCount ?? 0);

    if (secCount + 1 > MAX_PER_SEC || minCount + 1 > MAX_PER_MIN) throw new Error("RATE");

    tx.set(ref, {
      secStart: (now - secStart >= 1000) ? now : (secStart || now),
      secCount: secCount + 1,
      minStart: (now - minStart >= 60_000) ? now : (minStart || now),
      minCount: minCount + 1,
      updatedAt: now,
    }, { merge: true });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    await verifyAppCheck(req);
  } catch {
    return res.status(401).json({ error: "invalid app check" });
  }

  try {
    await rateLimit(clientIp(req));
    await adb.doc("counters/global").update({ count: FieldValue.increment(1) });
    return res.status(204).end();
  } catch (e: any) {
    if (e?.message === "RATE") return res.status(429).json({ error: "too many" });
    return res.status(500).json({ error: "server error" });
  }
}
