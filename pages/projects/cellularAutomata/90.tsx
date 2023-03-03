// import canvas
import { createCanvas } from "canvas";
import { useEffect, useRef, useState } from "react";
import { generateRule90 } from "src/pages/api/rule90";






const Rule90 = () => {
    
  //   const width = 1600;
  // set width to screen width
    //   const width = 400;
    //   const height = 800;
  
    // to create dynamic canvas size based on screen size use this:
    const width = 400;
    const height = 400;

    // but it doesn't work because the canvas is created before the window is resized

    // create the canvas and context and use state to set them
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [scaleFactor, setScaleFactor] = useState<number>(1);

    const fillCanvas = (ctx: CanvasRenderingContext2D, scaleFactor: number) => {
        ctx.fillStyle = 'black';
        const grid = generateRule90(width/scaleFactor,height/scaleFactor);
        for (let i = 0; i < width/scaleFactor; i++) {
            
          for (let j = 0; j < height/scaleFactor; j++) {
           
        
            if (grid[i][j] === 1) {
                ctx.fillStyle = 'black';
             
            } else {
                ctx.fillStyle = 'white';
            }
            


            ctx.fillRect(i * scaleFactor, j * scaleFactor, scaleFactor,   scaleFactor);

            // wait for 1 second
            // setTimeout(() => {
            //     ctx.fillRect(i * scaleFactor, j * scaleFactor, scaleFactor,   scaleFactor);
            // }, 1000);
        
          }
        }
      };
      
   
    useEffect(() => {
      setCanvas(canvasRef.current);
    }, [canvasRef]);
  
    useEffect(() => {
      if (canvas) {
        setCtx(canvas.getContext('2d'));
      }
    }, [canvas]);
    useEffect(() => {
        if (ctx) {
            fillCanvas(ctx, scaleFactor);
        }
    }, [ctx]);
  
    
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allowedValues = [1, 4, 16];
    const currentValue = Number(event.target.value);
    const newValue = allowedValues.reduce((prev, curr) =>
      Math.abs(curr - currentValue) < Math.abs(prev - currentValue) ? curr : prev
    );
    setScaleFactor(Number(newValue));
    if (ctx) {
        fillCanvas(ctx, scaleFactor);
    }
  };

    
  
      

    
  


    return (
      <div>
        <main className="main">
        <h1>Rule 90</h1>

        {/* description of "rule 90" */}
        <p>A cell is black if either (but not both) of it&apos;s neighbors were black on the previous row</p>
          <canvas ref={canvasRef} width={width} height={height} />
        {/* add buttons for scale factor (16, 1) */}
        <div>
        <input
        type="range"
        min="1"
        max="16"
        step="1"
        value={scaleFactor}
        onChange={handleSliderChange}
      /> Zoom Factor: {scaleFactor}
        </div>
        </main>
      </div>
    );
  };


export default Rule90;


