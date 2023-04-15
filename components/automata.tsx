import React, { useRef, useState, useEffect, FunctionComponent } from 'react';
// should take in a function that generates the grid
type generatingFunction = (width: number, height: number, ruleNumber: number, randomFirstRow: boolean) => number[][];

const Automata: FunctionComponent<{ generateGrid: generatingFunction, ruleNumber: number, randomFirstRow: boolean }> = ({ generateGrid, ruleNumber, randomFirstRow }) => {

    

    const width = 400;
    const height = 400;

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
        const grid = generateGrid(width,height, ruleNumber, randomFirstRow);
        for (let i = 0; i < width; i++) {
            
          for (let j = 0; j < height; j++) {
           
        
            if (grid[i][j] === 1) {
                ctx.fillStyle = 'black';
             
            } else {
                ctx.fillStyle = 'white';
            }
            
            ctx.fillRect(i, j, 1, 1);

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
              fillCanvas(ctx);
          }
      }, [ctx, ruleNumber, randomFirstRow]);
      
      return (
        <>
        <canvas ref={canvasRef} width={width} height={height} />
        </>
        );
    }
    export default Automata;
