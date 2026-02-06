import Head from "next/head";
import { Fragment, useMemo, useState } from "react";
import Nav from "src/components/nav";
import styles from "../../styles/KnittingVisualizer.module.css";

type Stitch = "K" | "P";
type Side = "RS" | "WS";
type FabricMode = "yarn" | "symbol";

const createGrid = (rows: number, cols: number, fill: Stitch = "K") =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));

const oppositeStitch = (stitch: Stitch): Stitch => (stitch === "K" ? "P" : "K");

type StitchGlyphOpts = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const knitLoopPath = ({ x, y, w, h }: StitchGlyphOpts) => {
  const insetX = w * 0.22;
  const topY = y + h * 0.12;
  const midY = y + h * 0.52;
  const botY = y + h * 0.88;

  const leftX = x + insetX;
  const rightX = x + w - insetX;
  const cx = x + w / 2;

  return `
    M ${leftX} ${topY}
    C ${leftX} ${midY}, ${cx - w * 0.18} ${midY}, ${cx - w * 0.12} ${botY}
    C ${cx - w * 0.06} ${botY + h * 0.06}, ${cx + w * 0.06} ${botY + h * 0.06}, ${cx + w * 0.12} ${botY}
    C ${cx + w * 0.18} ${midY}, ${rightX} ${midY}, ${rightX} ${topY}
  `;
};

const purlBumpRects = ({ x, y, w, h }: StitchGlyphOpts) => {
  const bumpW = w * 0.62;
  const bumpH = h * 0.2;
  const bx = x + (w - bumpW) / 2;
  const by = y + h * 0.52;

  const shadow = {
    x: bx + w * 0.03,
    y: by + h * 0.03,
    w: bumpW,
    h: bumpH,
    r: bumpH / 2,
  };

  const main = { x: bx, y: by, w: bumpW, h: bumpH, r: bumpH / 2 };

  return { shadow, main };
};

export default function KnittingVisualizer() {
  const [rows, setRows] = useState(12);
  const [cols, setCols] = useState(12);
  const [viewSide, setViewSide] = useState<Side>("RS");
  const [fabricMode, setFabricMode] = useState<FabricMode>("yarn");
  const [chart, setChart] = useState<Stitch[][]>(() => createGrid(12, 12, "K"));

  const cellSize = 28;
  const rowPitch = Math.round(cellSize * 0.72);
  const labelWidth = 40;
  const fabricWidth = labelWidth + cols * cellSize;
  const fabricHeight = rows * rowPitch + cellSize * 0.5;

  const resizeChart = (nextRows: number, nextCols: number) => {
    setChart((prev) =>
      Array.from({ length: nextRows }, (_, r) =>
        Array.from({ length: nextCols }, (_, c) => prev[r]?.[c] ?? "K"),
      ),
    );
  };

  const toggleStitch = (r: number, c: number) => {
    setChart((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = next[r][c] === "K" ? "P" : "K";
      return next;
    });
  };

  const fillChart = (stitch: Stitch) => {
    setChart(createGrid(rows, cols, stitch));
  };

  const fabric = useMemo(
    () =>
      chart.map((row, r) => {
        const rowNumberFromBottom = rows - r;
        const workedSide: Side = rowNumberFromBottom % 2 === 1 ? "RS" : "WS";

        return row.map((stitch) =>
          viewSide === workedSide ? stitch : oppositeStitch(stitch),
        );
      }),
    [chart, rows, viewSide],
  );

  return (
    <>
      <Head>
        <title>Knitting Visualizer</title>
        <meta
          name="description"
          content="2D stitch-chart editor + fabric preview for knit/purl textures"
        />
      </Head>
      <Nav />
      <main className={`main ${styles.page}`}>
        <h1>Knitting Visualizer (K/P MVP)</h1>
        <p className={styles.lead}>
          Edit the chart as stitches you work. Fabric preview converts stitches based
          on whether you are viewing the right side (RS) or wrong side (WS).
        </p>

        <section className={styles.controls}>
          <label>
            Rows
            <input
              type="number"
              min={1}
              max={60}
              value={rows}
              onChange={(e) => {
                const nextRows = Math.max(1, Math.min(60, Number(e.target.value) || 1));
                setRows(nextRows);
                resizeChart(nextRows, cols);
              }}
            />
          </label>
          <label>
            Columns
            <input
              type="number"
              min={1}
              max={60}
              value={cols}
              onChange={(e) => {
                const nextCols = Math.max(1, Math.min(60, Number(e.target.value) || 1));
                setCols(nextCols);
                resizeChart(rows, nextCols);
              }}
            />
          </label>
          <label>
            Fabric side
            <select value={viewSide} onChange={(e) => setViewSide(e.target.value as Side)}>
              <option value="RS">RS (right side)</option>
              <option value="WS">WS (wrong side)</option>
            </select>
          </label>
          <label>
            Fabric style
            <select
              value={fabricMode}
              onChange={(e) => setFabricMode(e.target.value as FabricMode)}
            >
              <option value="yarn">Yarn glyphs</option>
              <option value="symbol">Symbol fallback</option>
            </select>
          </label>
          <div className={styles.buttonRow}>
            <button type="button" onClick={() => fillChart("K")}>Fill K</button>
            <button type="button" onClick={() => fillChart("P")}>Fill P</button>
          </div>
        </section>

        <section className={styles.visualizers}>
          <div>
            <h2>Chart view (what you work)</h2>
            <div
              className={styles.grid}
              style={{ gridTemplateColumns: `40px repeat(${cols}, minmax(24px, 1fr))` }}
            >
              {chart.map((row, r) => {
                const rowNumber = rows - r;
                const direction = rowNumber % 2 === 1 ? "←" : "→";
                return (
                  <Fragment key={`chart-row-${rowNumber}`}>
                    <div className={styles.rowLabel}>
                      {rowNumber} {direction}
                    </div>
                    {row.map((stitch, c) => (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        className={`${styles.cell} ${stitch === "K" ? styles.knit : styles.purl}`}
                        onClick={() => toggleStitch(r, c)}
                        aria-label={`Row ${rowNumber}, stitch ${c + 1}, ${stitch}`}
                      >
                        {stitch}
                      </button>
                    ))}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div>
            <h2>Fabric view ({viewSide})</h2>
            <p className={styles.fabricHint}>K = knit loop, P = purl bump. Rows overlap to mimic interlocked fabric.</p>
            <div className={styles.fabricWrap}>
              <svg
                className={styles.fabricSvg}
                viewBox={`0 0 ${fabricWidth} ${fabricHeight}`}
                role="img"
                aria-label={`Fabric preview on ${viewSide} with ${fabricMode} style`}
              >
                <rect x="0" y="0" width={fabricWidth} height={fabricHeight} fill="#e9c7a5" />
                {fabric.map((row, r) => {
                  const rowNumber = rows - r;
                  const y = r * rowPitch;

                  return (
                    <Fragment key={`fabric-row-${rowNumber}`}>
                      <text x={labelWidth - 4} y={y + cellSize * 0.62} textAnchor="end" className={styles.fabricLabel}>
                        {rowNumber}
                      </text>
                      {row.map((stitch, c) => {
                        const x = labelWidth + c * cellSize;
                        const isKnit = stitch === "K";
                        const loopColor = isKnit ? "#7c563b" : "#8d6245";

                        if (fabricMode === "symbol") {
                          return (
                            <g key={`f-${r}-${c}`}>
                              <text
                                x={x + cellSize / 2}
                                y={y + cellSize * 0.65}
                                textAnchor="middle"
                                className={styles.fabricSymbol}
                              >
                                {isKnit ? "V" : "•"}
                              </text>
                            </g>
                          );
                        }

                        if (isKnit) {
                          return (
                            <path
                              key={`f-${r}-${c}`}
                              d={knitLoopPath({ x, y, w: cellSize, h: cellSize })}
                              fill="none"
                              stroke={loopColor}
                              strokeWidth={2.7}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity={0.96}
                            />
                          );
                        }

                        const { shadow, main } = purlBumpRects({ x, y, w: cellSize, h: cellSize });
                        return (
                          <g key={`f-${r}-${c}`}>
                            <rect
                              x={shadow.x}
                              y={shadow.y}
                              width={shadow.w}
                              height={shadow.h}
                              rx={shadow.r}
                              ry={shadow.r}
                              fill="black"
                              opacity={0.13}
                            />
                            <rect
                              x={main.x}
                              y={main.y}
                              width={main.w}
                              height={main.h}
                              rx={main.r}
                              ry={main.r}
                              fill="#80593d"
                              opacity={0.93}
                            />
                          </g>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
