import React, { useEffect } from 'react';

const Canvas = ({
  canvasRef,
  startDrawing,
  draw,
  stopDrawing,
  initCanvas,
  tool,
}) => {
  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  return (
    <div className="flex-1 relative bg-gray-100 overflow-hidden">
      {/* Canvas container */}
      <div className="absolute inset-4 bg-white rounded-xl shadow-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`w-full h-full ${
            tool === 'eraser' ? 'cursor-eraser' : 'cursor-pen'
          }`}
        />
      </div>

      {/* Grid pattern overlay (optional visual guide) */}
      <div 
        className="absolute inset-4 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
};

export default Canvas;