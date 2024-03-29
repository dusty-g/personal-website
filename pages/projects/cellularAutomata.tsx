import Head from "next/head";
import Link from "next/link";
import Automata from "src/components/automata";
import Nav from "src/components/nav";
import styles from "../../styles/CellularAutomata.module.css";
import { generateRule } from "../api/generalRule";
import { useState } from "react";




export default function CellularAutomata() {
    const [ruleNumberInput, setRuleNumberInput] = useState(45);
    const [ruleNumber, setRuleNumber] = useState(45);
    const [randomizeFirstRow, setRandomizeFirstRow] = useState(false);
    const [randomizeFirstRow30, setRandomizeFirstRow30] = useState(false);
    const [randomizeFirstRow90, setRandomizeFirstRow90] = useState(false);
    const [randomizeFirstRow254, setRandomizeFirstRow254] = useState(false);
    // when button is clicked, reload the Automata component with the new rule number
    const handleRuleNumberInput = () => {
        setRuleNumber(ruleNumberInput);
    }

    
    



    
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
        <p>The state of a cell is determined by the state of it and it&apos;s neighbors in the previous row. There are 8 possible combinations of three cells, so 256 possible sets of cellular automata rules. <Link href="https://www.wolframscience.com/nks/p53--more-cellular-automata/">Wolfram&apos;s numbering system</Link> assigns a 0 or 1 to each configuration if the next cell will be white or black. The resulting 8 digit binary number is converted to base 10.</p>
        <div>
        <img src="https://files.wolframcdn.com/pub/www.wolframscience.com/nks/page0053b-600.png" alt="Wolfram's numbering system" width="400" height="400" />
        <p className={styles.caption}>Wolfram&apos;s numbering system</p>
        </div>
        <div>
            <hr/>    
            <p><b>Try it:</b></p>
            
            <p>Enter a number between 0 and 255 to see the corresponding cellular automata. <br></br>
            Note: these start with a single black cell in the middle of the first row unless randomize is selected. Also the left and right edges are connected.</p>
            {/* number input with inital value set to 30 */}
            
            {/* button to generate automata */}
            


            <h3>Rule {ruleNumberInput}</h3>
            <Automata generateGrid={generateRule} ruleNumber={ruleNumber} randomFirstRow={randomizeFirstRow} />
            <div>
            <label htmlFor="ruleNumberInput">Rule Number {ruleNumberInput.toString(2).padStart(8, '0')}</label>
            <input type="number" min="0" max="255" id="ruleNumberInput" defaultValue="45" onChange={(e) => setRuleNumberInput(Number(e.target.value))} />
            


            <button onClick={handleRuleNumberInput}>Generate</button>
            
            </div>
            <input type="radio" id="randomFirstRow" name="randomFirstRow" value="true" checked={randomizeFirstRow} onChange={() => setRandomizeFirstRow(true)} />
            <label htmlFor="randomFirstRow">Randomize first row</label>
            <input type="radio" id="randomFirstRow" name="randomFirstRow" value="false" checked={!randomizeFirstRow} onChange={() => setRandomizeFirstRow(false)} />
            <label htmlFor="randomFirstRow">Don&apos;t randomize first row</label>

            <hr/>    
            <p><b>Rule 30 (00011110)</b> - A cell is set to the color of it&apos;s left neighbor in the previous row if it and it&apos;s right neighbor are white in the previous row. Otherwise it is set to the opposite value of that left neighbor.</p>
            <div>
            <input type="radio" id="randomFirstRow30" name="randomFirstRow30" value="true" checked={randomizeFirstRow30} onChange={() => setRandomizeFirstRow30(true)} />
            <label htmlFor="randomFirstRow30">Randomize first row</label>
            <input type="radio" id="randomFirstRow30" name="randomFirstRow30" value="false" checked={!randomizeFirstRow30} onChange={() => setRandomizeFirstRow30(false)} />
            <label htmlFor="randomFirstRow30">Don&apos;t randomize first row</label>
            </div>
            <Automata generateGrid={generateRule} ruleNumber={30} randomFirstRow={randomizeFirstRow30}/>
            <code className={styles.codeBlock}>
                if (previousRight === 0 &amp;&amp; previousCenter === 0) &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;grid[col][row] = previousLeft;<br/>
                &#125; else &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;grid[col][row] = previousLeft === 0 ? 1 : 0;<br/>
                &#125;
            </code>

            <hr/>
            <p><b>Rule 90 (01011010)</b> - A cell is black if either (but not both) of it&apos;s neighbors were black on the previous row.</p>
            <div>
            <input type="radio" id="randomFirstRow90" name="randomFirstRow90" value="true" checked={randomizeFirstRow90} onChange={() => setRandomizeFirstRow90(true)} />
            <label htmlFor="randomFirstRow90">Randomize first row</label>
            <input type="radio" id="randomFirstRow90" name="randomFirstRow90" value="false" checked={!randomizeFirstRow90} onChange={() => setRandomizeFirstRow90(false)} />
            <label htmlFor="randomFirstRow90">Don&apos;t randomize first row</label>
            </div>
            <Automata generateGrid={generateRule} ruleNumber={90} randomFirstRow={randomizeFirstRow90}/>
            <code className={styles.codeBlock}>
            if (previousLeft ^ previousRight) &#123;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;grid[col][row] = 1;<br/>
            &#125;
            </code>
            <hr/>
            <p><b>Rule 254 (11111110)</b> - A cell is black if it or it&apos;s left or right neighbor were black in the previous row.</p>
            <div>
            <input type="radio" id="randomFirstRow254" name="randomFirstRow254" value="true" checked={randomizeFirstRow254} onChange={() => setRandomizeFirstRow254(true)} />
            <label htmlFor="randomFirstRow254">Randomize first row</label>
            <input type="radio" id="randomFirstRow254" name="randomFirstRow254" value="false" checked={!randomizeFirstRow254} onChange={() => setRandomizeFirstRow254(false)} />
            <label htmlFor="randomFirstRow254">Don&apos;t randomize first row</label>
            </div>
            <Automata generateGrid={generateRule} ruleNumber={254} randomFirstRow={randomizeFirstRow254}/>
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
