import ClickCounter from "src/components/ClickCounter";

export default function ClickPage() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", gap: 12 }}>
      <ClickCounter />
    </div>
  );
}
