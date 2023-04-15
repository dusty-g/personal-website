import Automata from "src/components/automata";
import { generateRule90 } from "src/pages/api/rule90";







const Rule90 = () => {
    return (
      <div>
        <main className="main">
        <h1>Rule 90</h1>
        <p>A cell is black if either (but not both) of it&apos;s neighbors were black on the previous row</p>
          <Automata generateGrid={generateRule90} ruleNumber={90} randomFirstRow={true}/>
        </main>
      </div>
    );
  };


export default Rule90;


