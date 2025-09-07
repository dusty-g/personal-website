// pages/api/increment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adb, FieldValue } from "@/utils/firebaseAdmin";
import crypto from "crypto";

// Limits: human-ish ceiling
const MAX_PER_SEC = 8;
const MAX_PER_MIN = 200;

async function logAdminProjectOnce() {
  try {
    // @ts-ignore
    const pid = (await import("firebase-admin/app")).getApp().options.projectId;
    console.log("[increment] Admin projectId:", pid);
  } catch (e) {
    console.error("[increment] Failed to read admin projectId:", e);
  }
}

async function verifyAppCheck(req: NextApiRequest) {
  const token = (req.headers["x-firebase-appcheck"] as string) || "";
  if (!token) throw new Error("NO_APPCHECK");
  const { getAppCheck } = await import("firebase-admin/app-check");
  const ac = getAppCheck();
  return ac.verifyToken(token);
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

  // Helpful request context
  await logAdminProjectOnce();
  const ip = clientIp(req);
  const appCheckHeader = (req.headers["x-firebase-appcheck"] as string) || "";
  console.log("[increment] IP:", ip, "AppCheck hdr len:", appCheckHeader.length);

  // 1) Verify App Check
  try {
    await verifyAppCheck(req);
    console.log("[increment] AppCheck verified");
  } catch (e: any) {
    console.error("[increment] AppCheck verify failed:", e?.code || e?.message, e);
    return res.status(401).json({ error: "invalid app check" });
  }

  // 2) Rate limit + write
  try {
    console.log("[increment] rateLimit start");
    await rateLimit(ip);
    console.log("[increment] rateLimit ok");

    // Use set(..., {merge:true}) so missing doc can't cause a 500
    await adb.doc("counters/global").set({ count: FieldValue.increment(1) }, { merge: true });
    console.log("[increment] write ok");

    return res.status(204).end();
  } catch (e: any) {
    console.error("[increment] Increment failed:", e?.code || e?.message, e);
    if (e?.message === "RATE") return res.status(429).json({ error: "too many" });
    return res.status(500).json({ error: "server error" });
  }
}
