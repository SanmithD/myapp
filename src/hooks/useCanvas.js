import { useRef, useState, useEffect, useCallback } from 'react';

const useCanvas = (initialColor = '#000000', initialSize = 5) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [brushSize, setBrushSize] = useState(initialSize);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(dataUrl);
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);
  
  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Set display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Set actual size in memory (scaled for retina)
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext('2d');
    context.scale(scale, scale);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    
    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    contextRef.current = context;
    setCanvasSize({ width, height });

    // Save initial state
    saveToHistory();
  // eslint-disable-next-line react-hooks/immutability
  }, [brushSize, color, saveToHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const img = new Image();
    img.src = history[newIndex];
    img.onload = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      context.clearRect(0, 0, canvasSize.width, canvasSize.height);
      context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      setHistoryIndex(newIndex);
    };
  }, [historyIndex, history, canvasSize]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const img = new Image();
    img.src = history[newIndex];
    img.onload = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      context.clearRect(0, 0, canvasSize.width, canvasSize.height);
      context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      setHistoryIndex(newIndex);
    };
  }, [historyIndex, history, canvasSize]);

  // Get mouse position relative to canvas
  const getMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((e) => {
    e.preventDefault();
    const { x, y } = getMousePos(e);
    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.moveTo(x, y);
    
    if (tool === 'eraser') {
      context.strokeStyle = '#ffffff';
      context.lineWidth = brushSize * 3;
    } else {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }

    setIsDrawing(true);
  }, [color, brushSize, tool, getMousePos]);

  // Draw
  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const { x, y } = getMousePos(e);
    const context = contextRef.current;
    if (!context) return;

    context.lineTo(x, y);
    context.stroke();
  }, [isDrawing, getMousePos]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      contextRef.current?.closePath();
      setIsDrawing(false);
      saveToHistory();
    }
  }, [isDrawing, saveToHistory]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    saveToHistory();
  }, [canvasSize, saveToHistory]);

  // Get canvas data URL
  const getDataUrl = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  }, []);

  // Load image to canvas
  const loadImage = useCallback((dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      context.clearRect(0, 0, canvasSize.width, canvasSize.height);
      context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      saveToHistory();
    };
  }, [canvasSize, saveToHistory]);

  // Download canvas as image
  const downloadImage = useCallback((filename = 'drawing.png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Save current drawing
      const dataUrl = canvas.toDataURL();

      // Reinitialize canvas
      initCanvas();

      // Restore drawing
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const context = contextRef.current;
        if (context) {
          context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
        }
      };
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, canvasSize]);

  return {
    canvasRef,
    contextRef,
    isDrawing,
    color,
    setColor,
    brushSize,
    setBrushSize,
    tool,
    setTool,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    initCanvas,
    getDataUrl,
    loadImage,
    downloadImage,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};

export default useCanvas;