import { useEffect, useRef } from 'react';

const SelectionOverlay = ({ selection, selectionMode, zoom }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);

  useEffect(() => {
    if (!selection || selectionMode === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    let offset = 0;

    const drawMarchingAnts = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (!selection || selection.width < 1 || selection.height < 1) return;

      const { x, y, width, height } = selection;

      context.save();
      context.scale(zoom, zoom);

      // Draw selection preview (semi-transparent overlay outside selection)
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      context.fillRect(0, 0, canvas.width / zoom, y);
      context.fillRect(0, y + height, canvas.width / zoom, canvas.height / zoom - y - height);
      context.fillRect(0, y, x, height);
      context.fillRect(x + width, y, canvas.width / zoom - x - width, height);

      // Draw marching ants border
      context.strokeStyle = '#000';
      context.lineWidth = 1;
      context.setLineDash([5, 5]);
      context.lineDashOffset = -offset;
      context.strokeRect(x, y, width, height);

      context.strokeStyle = '#fff';
      context.lineDashOffset = -offset + 5;
      context.strokeRect(x, y, width, height);

      context.restore();

      offset = (offset + 0.5) % 10;
      animationRef.current = requestAnimationFrame(drawMarchingAnts);
    };

    drawMarchingAnts();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [selection, selectionMode, zoom]);

  if (!selection || selectionMode === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default SelectionOverlay;