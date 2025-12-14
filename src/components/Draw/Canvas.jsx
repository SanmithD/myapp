import { useEffect, useRef } from 'react';
import SelectionOverlay from './SelectionOverlay';

const Canvas = ({
  canvasRef,
  startDrawing,
  draw,
  stopDrawing,
  initCanvas,
  tool,
  showGrid,
  zoom,
  onAddText,
  selection,
  selectionMode,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const handleCanvasClick = (e) => {
    if (tool === 'text') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      
      const text = prompt('Enter text:');
      if (text) {
        onAddText(x, y, text);
      }
    }
  };

  const getCursor = () => {
    switch (tool) {
      case 'select':
        return selectionMode === 'selected' ? 'move' : 'crosshair';
      case 'pen':
        return 'crosshair';
      case 'eraser':
        return 'cell';
      case 'fill':
        return 'cell';
      case 'eyedropper':
        return 'crosshair';
      case 'text':
        return 'text';
      default:
        return 'crosshair';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-auto bg-gray-200 relative"
    >
      {/* Grid Overlay */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          }}
        />
      )}

      {/* Selection Overlay */}
      <SelectionOverlay
        selection={selection}
        selectionMode={selectionMode}
        zoom={zoom}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onClick={handleCanvasClick}
        className="block shadow-2xl bg-white mx-auto my-4"
        style={{
          cursor: getCursor(),
          transform: `scale(${zoom})`,
          transformOrigin: 'center top',
        }}
      />

      {/* Selection Handles (when selected) */}
      {selection && selectionMode === 'selected' && (
        <div
          className="absolute border-2 border-blue-500 pointer-events-none"
          style={{
            left: selection.x * zoom,
            top: selection.y * zoom + 16,
            width: selection.width * zoom,
            height: selection.height * zoom,
          }}
        >
          {/* Resize handles */}
          {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((pos) => (
            <div
              key={pos}
              className="absolute w-2 h-2 bg-white border border-blue-500 pointer-events-auto cursor-pointer"
              style={{
                ...getHandlePosition(pos),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const getHandlePosition = (position) => {
  const positions = {
    nw: { top: -4, left: -4 },
    n: { top: -4, left: '50%', transform: 'translateX(-50%)' },
    ne: { top: -4, right: -4 },
    e: { top: '50%', right: -4, transform: 'translateY(-50%)' },
    se: { bottom: -4, right: -4 },
    s: { bottom: -4, left: '50%', transform: 'translateX(-50%)' },
    sw: { bottom: -4, left: -4 },
    w: { top: '50%', left: -4, transform: 'translateY(-50%)' },
  };
  return positions[position];
};

export default Canvas;