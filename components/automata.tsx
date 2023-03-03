import React, { useRef, useState, useEffect, FunctionComponent } from 'react';
// should take in a function that generates the grid
type generatingFunction = (width: number, height: number) => number[][];

const Automata: FunctionComponent<{ generateGrid: generatingFunction }> = ({ generateGrid }) => {
    //todo: update with slider like in 90.tsx
    //todo: update 90.tsx to use this component
    const width = 400;
    const height = 400;
    const scaleFactor = 4;
    // create the canvas and context and use state to set them
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    useEffect(() => {
        setCanvas(canvasRef.current);
      }, [canvasRef]);
    
      useEffect(() => {
        if (canvas) {
          setCtx(canvas.getContext('2d'));
        }
      }, [canvas]);

      const fillCanvas = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'black';
        const grid = generateGrid(width/4,height/4)
        for (let i = 0; i < width/4; i++) {
            
          for (let j = 0; j < height/4; j++) {
           
        
            if (grid[i][j] === 1) {
                ctx.fillStyle = 'black';
             
            } else {
                ctx.fillStyle = 'white';
            }
            
            ctx.fillRect(i * 4, j * 4, 4, 4);

          }
        }
      };
      
      return (
        <canvas ref={canvasRef} width={width} height={height} />
        );
    }
    export default Automata;
