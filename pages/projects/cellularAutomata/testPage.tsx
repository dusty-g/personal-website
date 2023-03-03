import { useEffect, useRef, useState } from 'react';
import { generateRule254 } from 'src/pages/api/rule254';

const CanvasTest = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
//   const width = 1600;
// set width to screen width
    const width = 400;
    const height = 800;


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
    const grid = generateRule254(width/4,height/4)
    for (let i = 0; i < width/4; i++) {
        
      for (let j = 0; j < height/4; j++) {
       
    
        if (grid[i][j] === 1) {
            ctx.fillStyle = 'black';
         
        } else {
            ctx.fillStyle = 'white';
        }
        
        ctx.fillRect(i * 4, j * 4, 4, 4);
        // ctx.fillRect(i, j, 1, 1)
      }
    }
  };

    useEffect(() => {
        if (ctx) {
            fillCanvas(ctx);
        }
    }, [ctx]);

  

  return (
    <div>
      <h1>Canvas Test</h1>
        <canvas ref={canvasRef} width={width} height={height} />

    </div>
  );
};

export default CanvasTest;
