import Link from "next/link";
import ClickCounter from "src/components/ClickCounter";

export default function ClickPage() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", gap: 12 }}>
      <ClickCounter />
      <p>
        More info here: <Link href="/blog/click-counter">Building a secure Click Counter</Link>
      </p>
    </div>
  );
}

