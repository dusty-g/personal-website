import Head from "next/head";
import { Fragment, useMemo, useState } from "react";
import Nav from "src/components/nav";
import styles from "../../styles/KnittingVisualizer.module.css";

type Stitch = "K" | "P";
type Side = "RS" | "WS";

const createGrid = (rows: number, cols: number, fill: Stitch = "K") =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));

const oppositeStitch = (stitch: Stitch): Stitch => (stitch === "K" ? "P" : "K");

export default function KnittingVisualizer() {
  const [rows, setRows] = useState(12);
  const [cols, setCols] = useState(12);
  const [viewSide, setViewSide] = useState<Side>("RS");
  const [chart, setChart] = useState<Stitch[][]>(() => createGrid(12, 12, "K"));

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
            <div
              className={styles.grid}
              style={{ gridTemplateColumns: `40px repeat(${cols}, minmax(24px, 1fr))` }}
            >
              {fabric.map((row, r) => {
                const rowNumber = rows - r;
                return (
                  <Fragment key={`fabric-row-${rowNumber}`}>
                    <div className={styles.rowLabel}>{rowNumber}</div>
                    {row.map((stitch, c) => (
                      <div
                        key={`f-${r}-${c}`}
                        className={`${styles.cell} ${stitch === "K" ? styles.knit : styles.purl}`}
                        title={`Visible on ${viewSide}: ${stitch}`}
                      >
                        {stitch === "K" ? "V" : "•"}
                      </div>
                    ))}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
