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
        <main className="main">

        
        <h1>Cellular Automata</h1>
        <div className={styles.text}>
        <p className={styles.text}>I am currently reading <Link href="https://www.wolframscience.com/nks/">Stephen Wolfram&apos;s A New Kind of Science</Link></p>
        <p></p>
        <p className={styles.text}>In Chapter 3, he discusses cellular automata. I thought it would be fun to try to implement a few of them.</p>
        <p></p>
    
        <ul>
            <li><b>Rule 30</b> - A cell is set to the color of it's left neighbor in the previous row if it and it's right neighbor are white in the previous row. Otherwise it is set to the opposite value of that left neighbor.</li>
            <Automata generateGrid={generateRule30} />
            <li><b>Rule 90</b> - A cell is black if either (but not both) of it&apos;s neighbors were black on the previous row.</li>
            <Automata generateGrid={generateRule90} />
            <li><b>Rule 254</b> - A cell is black if it's left or right neighbor were black in the previous row.</li>
            <Automata generateGrid={generateRule254} />
        </ul>
        </div>
        </main>
        </>
    );
    }
