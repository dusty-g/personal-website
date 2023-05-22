import { useState } from "react";

interface DualTextProps {
  text: string;
  defaultSpacing: number;
}

const DualText: React.FC<DualTextProps> = ({ text, defaultSpacing }) => {
  const [spacing, setSpacing] = useState<number>(defaultSpacing);

  const handleChangeSpacing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpacing(parseInt(e.target.value));
  };

  return (
    <div>
      <input
        type="range"
        min="50"
        max="300"
        value={spacing}
        onChange={handleChangeSpacing}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: spacing }}>
          <p>{text}</p>
        </div>
        <div style={{ width: spacing }}>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default DualText;
