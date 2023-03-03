import Head from "next/head";
import Link from "next/link";
import Nav from "src/components/nav";
// import styles from "../styles/About.module.css";
import styles from "../../styles/CellularAutomata.module.css";

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
            <li><a href="./cellularAutomata/90">Rule 90</a> - A cell is black if either (but not both) of it&apos;s neighbors were black on the previous row</li>
        </ul>
        </div>
        </main>
        </>
    );
    }
