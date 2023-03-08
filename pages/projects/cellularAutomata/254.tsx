import Automata from "src/components/automata";
import { generateRule254 } from "src/pages/api/rule254";






const Rule254 = () => {
    
  
    return (
      <div>
        <main className="main">
        <h1>Rule 254</h1>
        <p>A cell is black if it's left or right neighbor were black in the previous row</p>
        <Automata generateGrid={generateRule254} />
        </main>
      </div>
    );
  };


export default Rule254;


