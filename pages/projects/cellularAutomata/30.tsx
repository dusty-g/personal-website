import Automata from "src/components/automata"
import { generateRule30 } from "src/pages/api/rule30";

const Rule30 = () => {
    return (
    <>
    <main className="main">
        <h1>Rule 30</h1>
        <p>A cell is set to the color of it&apos;s left neighbor in the previous row if it and it&apos;s right neighbor are white in the previous row. Otherwise it is set to the opposite value of that left neighbor.</p>
    
    <Automata generateGrid={generateRule30} />
    </main>
    </>);
}

export default Rule30