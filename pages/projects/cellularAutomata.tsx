import Head from "next/head";
import Link from "next/link";
import Automata from "src/components/automata";
import Nav from "src/components/nav";
import styles from "../../styles/CellularAutomata.module.css";
import { generateRule254 } from "../api/rule254";
import { generateRule30 } from "../api/rule30";
import { generateRule90 } from "../api/rule90";

export default function CellularAutomata() {
    return (
        <>
        <Head>
            <title>Cellular Automata</title>

            <meta name="description" content="Personal website for Dusty Galindo" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <main className={styles.automataMain}>

        
        <h1 className={styles.heading}>Cellular Automata</h1>
        <div className={styles.text}>
        <p>I am currently reading <Link href="https://www.wolframscience.com/nks/">Stephen Wolfram&apos;s A New Kind of Science</Link></p>
        <p >In Chapter 3, he discusses cellular automata. I thought it would be fun to try to implement a few of them.</p>
        
        <div>
            <hr/>    
            <p><b>Rule 30</b> - A cell is set to the color of it&apos;s left neighbor in the previous row if it and it&apos;s right neighbor are white in the previous row. Otherwise it is set to the opposite value of that left neighbor.</p>
            <Automata generateGrid={generateRule30} />
            <code className={styles.codeBlock}>
                if (previousRight === 0 &amp;&amp; previousCenter === 0) &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;grid[col][row] = previousLeft;<br/>
                &#125; else &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;grid[col][row] = previousLeft === 0 ? 1 : 0;<br/>
                &#125;
            </code>

            <hr/>
            <p><b>Rule 90</b> - A cell is black if either (but not both) of it&apos;s neighbors were black on the previous row.</p>
            <Automata generateGrid={generateRule90} />
            <code className={styles.codeBlock}>
            if (previousLeft ^ previousRight) &#123;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;grid[col][row] = 1;<br/>
            &#125;
            </code>
            <hr/>
            <p><b>Rule 254</b> - A cell is black if it or it&apos;s left or right neighbor were black in the previous row.</p>
            <Automata generateGrid={generateRule254} />
            <code className={styles.codeBlock}>
            if (previousLeft || previousRight || previousCenter) &#123;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;grid[col][row] = 1;<br/>
            &#125;
            </code>
        </div>
        </div>
        </main>
        </>
    );
    }
