import { useEffect, useState } from "react";
import { getDb } from "../../utils/firebaseClient";
import { getAppCheckHeader } from "../../utils/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";


export default function ClickPage() {
  const [count, setCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
  const ref = doc(getDb(), "counters", "global");
  const unsub = onSnapshot(ref, snap => {/* ... */}, err => console.error("snapshot err", err));
  return () => unsub();
}, []);

  const increment = async () => {
    setBusy(true);
    setErr(null);
    try {
      const appCheckHeader = await getAppCheckHeader();
      const headers = new Headers(Object.entries(appCheckHeader).filter(([, value]) => value !== undefined) as [string, string][]);
      const res = await fetch("/api/increment", { method: "POST", headers });
      if (!res.ok) throw new Error(String(res.status));
    } catch (e: any) {
      setErr(e.message === "429" ? "Rate-limited." : "Increment failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{display:"grid",placeItems:"center",minHeight:"60vh",gap:12}}>
      <div style={{fontSize:48,fontFamily:"system-ui"}}>{count ?? "…"}</div>
      <button onClick={increment} disabled={busy} style={{padding:"10px 16px",fontSize:18}}>
        {busy ? "…" : "Click"}
      </button>
      {err && <div style={{color:"crimson"}}>{err}</div>}
      <p style={{opacity:.7}}>Realtime from Firestore. Writes go through a rate-limited API.</p>
    </div>
  );
}
