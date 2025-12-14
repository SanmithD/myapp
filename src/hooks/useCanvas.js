/* eslint-disable react-hooks/immutability */
import { useCallback, useEffect, useRef, useState } from 'react';

const useCanvas = (initialColor = '#000000', initialSize = 5) => {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [brushSize, setBrushSize] = useState(initialSize);
  const [tool, setTool] = useState('pen');
  const [brushStyle, setBrushStyle] = useState('normal');
  const [opacity, setOpacity] = useState(1);
  const [fillShape, setFillShape] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // For shape drawing
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [tempCanvas, setTempCanvas] = useState(null);

  // Layers system
  const [layers, setLayers] = useState([]);
  const [activeLayerId, setActiveLayerId] = useState(null);
  const layerCanvasRefs = useRef({});

  // Selection system
  const [selection, setSelection] = useState(null); // { x, y, width, height, imageData }
  const [selectionMode, setSelectionMode] = useState('none'); // none, selecting, selected, moving
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [clipboard, setClipboard] = useState(null);

  // Elements for drag feature (stored objects)
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isDraggingElement, setIsDraggingElement] = useState(false);

  const backgroundColorRef = useRef(backgroundColor);

  useEffect(() => {
    backgroundColorRef.current = backgroundColor;
  }, [backgroundColor]);

  // Initialize layers
  const initializeLayers = useCallback((width, height) => {
    const scale = window.devicePixelRatio || 1;
    
    // Create background layer
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = width * scale;
    bgCanvas.height = height * scale;
    const bgContext = bgCanvas.getContext('2d');
    bgContext.scale(scale, scale);
    bgContext.fillStyle = backgroundColorRef.current;
    bgContext.fillRect(0, 0, width, height);

    // Create default drawing layer
    const drawCanvas = document.createElement('canvas');
    drawCanvas.width = width * scale;
    drawCanvas.height = height * scale;
    const drawContext = drawCanvas.getContext('2d');
    drawContext.scale(scale, scale);
    drawContext.lineCap = 'round';
    drawContext.lineJoin = 'round';

    const initialLayers = [
      {
        id: 'background',
        name: 'Background',
        canvas: bgCanvas,
        visible: true,
        opacity: 1,
        locked: true,
        type: 'background'
      },
      {
        id: 'layer-1',
        name: 'Layer 1',
        canvas: drawCanvas,
        visible: true,
        opacity: 1,
        locked: false,
        type: 'drawing'
      }
    ];

    layerCanvasRefs.current = {
      'background': bgCanvas,
      'layer-1': drawCanvas
    };

    setLayers(initialLayers);
    setActiveLayerId('layer-1');

    return initialLayers;
  }, []);

  // Get active layer context
  const getActiveContext = useCallback(() => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return null;
    return activeLayer.canvas?.getContext('2d');
  }, [layers, activeLayerId]);

  // Composite all layers to main canvas
  const compositeLayersToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvasSize.width, canvasSize.height);

    layers.forEach(layer => {
      if (!layer.visible) return;
      
      context.globalAlpha = layer.opacity;
      context.drawImage(layer.canvas, 0, 0, canvasSize.width, canvasSize.height);
    });

    context.globalAlpha = 1;
  }, [layers, canvasSize]);

  // Update composite when layers change
  useEffect(() => {
    if (layers.length > 0) {
      compositeLayersToCanvas();
    }
  }, [layers, compositeLayersToCanvas]);

  // Save to history (saves all layers state)
  const saveToHistory = useCallback(() => {
    const layerStates = layers.map(layer => ({
      id: layer.id,
      dataUrl: layer.canvas.toDataURL()
    }));

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ layers: layerStates, activeLayerId });
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [layers, activeLayerId, historyIndex]);

  // Add new layer
  const addLayer = useCallback((name = null) => {
    const scale = window.devicePixelRatio || 1;
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvasSize.width * scale;
    newCanvas.height = canvasSize.height * scale;
    const newContext = newCanvas.getContext('2d');
    newContext.scale(scale, scale);
    newContext.lineCap = 'round';
    newContext.lineJoin = 'round';

    const newId = `layer-${Date.now()}`;
    const newLayer = {
      id: newId,
      name: name || `Layer ${layers.length}`,
      canvas: newCanvas,
      visible: true,
      opacity: 1,
      locked: false,
      type: 'drawing'
    };

    layerCanvasRefs.current[newId] = newCanvas;

    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newId);
    saveToHistory();

    return newId;
  }, [canvasSize, layers.length, saveToHistory]);

  // Delete layer
  const deleteLayer = useCallback((layerId) => {
    if (layers.length <= 2) return; // Keep at least background + 1 layer
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer || layer.type === 'background') return;

    setLayers(prev => prev.filter(l => l.id !== layerId));
    delete layerCanvasRefs.current[layerId];

    if (activeLayerId === layerId) {
      const remainingLayers = layers.filter(l => l.id !== layerId && l.type !== 'background');
      if (remainingLayers.length > 0) {
        setActiveLayerId(remainingLayers[0].id);
      }
    }
    saveToHistory();
  }, [layers, activeLayerId, saveToHistory]);

  // Duplicate layer
  const duplicateLayer = useCallback((layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const scale = window.devicePixelRatio || 1;
    const newCanvas = document.createElement('canvas');
    newCanvas.width = layer.canvas.width;
    newCanvas.height = layer.canvas.height;
    const newContext = newCanvas.getContext('2d');
    newContext.drawImage(layer.canvas, 0, 0);

    const newId = `layer-${Date.now()}`;
    const newLayer = {
      id: newId,
      name: `${layer.name} Copy`,
      canvas: newCanvas,
      visible: true,
      opacity: layer.opacity,
      locked: false,
      type: 'drawing'
    };

    layerCanvasRefs.current[newId] = newCanvas;

    const layerIndex = layers.findIndex(l => l.id === layerId);
    setLayers(prev => {
      const newLayers = [...prev];
      newLayers.splice(layerIndex + 1, 0, newLayer);
      return newLayers;
    });
    setActiveLayerId(newId);
    saveToHistory();
  }, [layers, saveToHistory]);

  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  }, []);

  // Set layer opacity
  const setLayerOpacity = useCallback((layerId, opacity) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  }, []);

  // Toggle layer lock
  const toggleLayerLock = useCallback((layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.type === 'background') return;
    
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  }, [layers]);

  // Rename layer
  const renameLayer = useCallback((layerId, newName) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, name: newName } : layer
    ));
  }, []);

  // Move layer in stack
  const moveLayer = useCallback((layerId, direction) => {
    const index = layers.findIndex(l => l.id === layerId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index + 1 : index - 1;
    if (newIndex < 1 || newIndex >= layers.length) return; // Can't move past background

    setLayers(prev => {
      const newLayers = [...prev];
      [newLayers[index], newLayers[newIndex]] = [newLayers[newIndex], newLayers[index]];
      return newLayers;
    });
    saveToHistory();
  }, [layers, saveToHistory]);

  // Merge layer down
  const mergeLayerDown = useCallback((layerId) => {
    const index = layers.findIndex(l => l.id === layerId);
    if (index <= 1) return; // Can't merge with background

    const currentLayer = layers[index];
    const belowLayer = layers[index - 1];
    
    if (belowLayer.type === 'background') return;

    const belowContext = belowLayer.canvas.getContext('2d');
    belowContext.globalAlpha = currentLayer.opacity;
    belowContext.drawImage(currentLayer.canvas, 0, 0);
    belowContext.globalAlpha = 1;

    deleteLayer(layerId);
    setActiveLayerId(belowLayer.id);
    saveToHistory();
  }, [layers, deleteLayer, saveToHistory]);

  // Selection functions
  const startSelection = useCallback((x, y) => {
    setSelectionStart({ x, y });
    setSelection({ x, y, width: 0, height: 0, imageData: null });
    setSelectionMode('selecting');
  }, []);

  const updateSelection = useCallback((x, y) => {
    if (selectionMode !== 'selecting') return;

    const width = x - selectionStart.x;
    const height = y - selectionStart.y;

    setSelection({
      x: width >= 0 ? selectionStart.x : x,
      y: height >= 0 ? selectionStart.y : y,
      width: Math.abs(width),
      height: Math.abs(height),
      imageData: null
    });
  }, [selectionMode, selectionStart]);

  const finishSelection = useCallback(() => {
    if (!selection || selection.width < 5 || selection.height < 5) {
      clearSelection();
      return;
    }

    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer) return;

    const context = activeLayer.canvas.getContext('2d');
    const scale = window.devicePixelRatio || 1;

    const imageData = context.getImageData(
      selection.x * scale,
      selection.y * scale,
      selection.width * scale,
      selection.height * scale
    );

    setSelection(prev => ({ ...prev, imageData }));
    setSelectionMode('selected');
  }, [selection, layers, activeLayerId]);

  const clearSelection = useCallback(() => {
    setSelection(null);
    setSelectionMode('none');
    setSelectedElementId(null);
  }, []);

  // Move selection
  const startMoveSelection = useCallback((x, y) => {
    if (!selection || selectionMode !== 'selected') return;

    setDragOffset({
      x: x - selection.x,
      y: y - selection.y
    });
    setSelectionMode('moving');

    // Clear the original area on the active layer
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (activeLayer) {
      const context = activeLayer.canvas.getContext('2d');
      context.clearRect(selection.x, selection.y, selection.width, selection.height);
      compositeLayersToCanvas();
    }
  }, [selection, selectionMode, layers, activeLayerId, compositeLayersToCanvas]);

  const moveSelection = useCallback((x, y) => {
    if (selectionMode !== 'moving') return;

    setSelection(prev => ({
      ...prev,
      x: x - dragOffset.x,
      y: y - dragOffset.y
    }));
  }, [selectionMode, dragOffset]);

  const finishMoveSelection = useCallback(() => {
    if (!selection || !selection.imageData) return;

    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer) return;

    // Create temporary canvas for the selection
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = selection.imageData.width;
    tempCanvas.height = selection.imageData.height;
    const tempContext = tempCanvas.getContext('2d');
    tempContext.putImageData(selection.imageData, 0, 0);

    // Draw to active layer at new position
    const context = activeLayer.canvas.getContext('2d');
    const scale = window.devicePixelRatio || 1;
    context.drawImage(tempCanvas, selection.x * scale, selection.y * scale);

    compositeLayersToCanvas();
    setSelectionMode('selected');
    saveToHistory();
  }, [selection, layers, activeLayerId, compositeLayersToCanvas, saveToHistory]);

  // Copy selection
  const copySelection = useCallback(() => {
    if (!selection || !selection.imageData) return;
    setClipboard({
      imageData: selection.imageData,
      width: selection.width,
      height: selection.height
    });
  }, [selection]);

  // Cut selection
  const cutSelection = useCallback(() => {
    if (!selection || !selection.imageData) return;
    
    copySelection();

    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (activeLayer) {
      const context = activeLayer.canvas.getContext('2d');
      context.clearRect(selection.x, selection.y, selection.width, selection.height);
      compositeLayersToCanvas();
    }
    
    clearSelection();
    saveToHistory();
  }, [selection, layers, activeLayerId, copySelection, clearSelection, compositeLayersToCanvas, saveToHistory]);

  // Paste
  const paste = useCallback(() => {
    if (!clipboard) return;

    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    // Create temporary canvas for the clipboard data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = clipboard.imageData.width;
    tempCanvas.height = clipboard.imageData.height;
    const tempContext = tempCanvas.getContext('2d');
    tempContext.putImageData(clipboard.imageData, 0, 0);

    // Paste at center of visible area
    const x = (canvasSize.width - clipboard.width) / 2;
    const y = (canvasSize.height - clipboard.height) / 2;

    const context = activeLayer.canvas.getContext('2d');
    const scale = window.devicePixelRatio || 1;
    context.drawImage(tempCanvas, x * scale, y * scale);

    // Set selection at pasted position
    setSelection({
      x,
      y,
      width: clipboard.width,
      height: clipboard.height,
      imageData: clipboard.imageData
    });
    setSelectionMode('selected');

    compositeLayersToCanvas();
    saveToHistory();
  }, [clipboard, layers, activeLayerId, canvasSize, compositeLayersToCanvas, saveToHistory]);

  // Delete selection content
  const deleteSelection = useCallback(() => {
    if (!selection) return;

    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    const context = activeLayer.canvas.getContext('2d');
    context.clearRect(selection.x, selection.y, selection.width, selection.height);

    compositeLayersToCanvas();
    clearSelection();
    saveToHistory();
  }, [selection, layers, activeLayerId, compositeLayersToCanvas, clearSelection, saveToHistory]);

  // Select all
  const selectAll = useCallback(() => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer) return;

    const context = activeLayer.canvas.getContext('2d');
    const scale = window.devicePixelRatio || 1;
    const imageData = context.getImageData(0, 0, canvasSize.width * scale, canvasSize.height * scale);

    setSelection({
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      imageData
    });
    setSelectionMode('selected');
  }, [layers, activeLayerId, canvasSize]);

  // Apply brush style helper
  const applyBrushStyle = useCallback((context) => {
    context.globalAlpha = opacity;
    
    switch (brushStyle) {
      case 'spray':
        context.lineWidth = 1;
        break;
      case 'marker':
        context.lineCap = 'square';
        context.lineJoin = 'miter';
        break;
      case 'highlighter':
        context.globalAlpha = 0.3;
        context.lineCap = 'square';
        context.lineWidth = brushSize * 3;
        break;
      default:
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = brushSize;
    }
  }, [brushSize, brushStyle, opacity]);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(scale, scale);
    contextRef.current = context;
    setCanvasSize({ width, height });

    // Initialize layers
    const initialLayers = initializeLayers(width, height);
    
    // Composite layers
    setTimeout(() => {
      initialLayers.forEach(layer => {
        if (!layer.visible) return;
        context.globalAlpha = layer.opacity;
        context.drawImage(layer.canvas, 0, 0, width, height);
      });
      context.globalAlpha = 1;
    }, 0);

    // Create temp canvas for shape preview
    const temp = document.createElement('canvas');
    temp.width = canvas.width;
    temp.height = canvas.height;
    setTempCanvas(temp);

    // Initial save
    setTimeout(() => {
      const layerStates = initialLayers.map(layer => ({
        id: layer.id,
        dataUrl: layer.canvas.toDataURL()
      }));
      setHistory([{ layers: layerStates, activeLayerId: 'layer-1' }]);
      setHistoryIndex(0);
    }, 100);
  }, [initializeLayers]);

  // Get mouse position
  const getMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) / zoom,
      y: (clientY - rect.top) / zoom,
    };
  }, [zoom]);

  // Check if point is inside selection
  const isPointInSelection = useCallback((x, y) => {
    if (!selection) return false;
    return (
      x >= selection.x &&
      x <= selection.x + selection.width &&
      y >= selection.y &&
      y <= selection.y + selection.height
    );
  }, [selection]);

  // Draw spray effect
  const drawSpray = useCallback((x, y, context) => {
    const density = brushSize * 2;
    const radius = brushSize * 2;
    
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const offsetX = Math.cos(angle) * r;
      const offsetY = Math.sin(angle) * r;
      
      context.fillStyle = color;
      context.globalAlpha = opacity * Math.random();
      context.beginPath();
      context.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = opacity;
  }, [brushSize, color, opacity]);

  // Draw shapes
  const drawShape = useCallback((startX, startY, endX, endY, context, isPreview = false) => {
    const width = endX - startX;
    const height = endY - startY;

    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = brushSize;
    context.globalAlpha = opacity;

    context.beginPath();

    switch (tool) {
      case 'line':
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
        break;

      case 'arrow':
        { context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
        
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = brushSize * 4;
        
        context.beginPath();
        context.moveTo(endX, endY);
        context.lineTo(
          endX - headLength * Math.cos(angle - Math.PI / 6),
          endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        context.moveTo(endX, endY);
        context.lineTo(
          endX - headLength * Math.cos(angle + Math.PI / 6),
          endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        context.stroke();
        break; }

      case 'rectangle':
        if (fillShape) {
          context.fillRect(startX, startY, width, height);
        } else {
          context.strokeRect(startX, startY, width, height);
        }
        break;

      case 'circle':
        { const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        
        context.beginPath();
        context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        if (fillShape) {
          context.fill();
        } else {
          context.stroke();
        }
        break; }

      case 'triangle':
        context.beginPath();
        context.moveTo(startX + width / 2, startY);
        context.lineTo(startX, endY);
        context.lineTo(endX, endY);
        context.closePath();
        if (fillShape) {
          context.fill();
        } else {
          context.stroke();
        }
        break;

      default:
        break;
    }

    context.closePath();
  }, [tool, color, brushSize, opacity, fillShape]);

  // Fill tool (flood fill)
  const floodFill = useCallback((startX, startY) => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    const canvas = activeLayer.canvas;
    const context = canvas.getContext('2d');
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const scale = window.devicePixelRatio || 1;
    
    const x = Math.floor(startX * scale);
    const y = Math.floor(startY * scale);
    const width = canvas.width;
    const height = canvas.height;

    const getPixelIndex = (px, py) => (py * width + px) * 4;
    const startIndex = getPixelIndex(x, y);
    
    const startColor = {
      r: data[startIndex],
      g: data[startIndex + 1],
      b: data[startIndex + 2],
      a: data[startIndex + 3]
    };

    const fillColor = {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16),
      a: Math.floor(opacity * 255)
    };

    if (
      startColor.r === fillColor.r &&
      startColor.g === fillColor.g &&
      startColor.b === fillColor.b
    ) return;

    const matchesStart = (index) => {
      return (
        Math.abs(data[index] - startColor.r) < 10 &&
        Math.abs(data[index + 1] - startColor.g) < 10 &&
        Math.abs(data[index + 2] - startColor.b) < 10
      );
    };

    const stack = [[x, y]];
    const visited = new Set();

    while (stack.length > 0) {
      const pos = stack.pop();
      if (!pos) continue;
      const [px, py] = pos;
      const key = `${px},${py}`;
      
      if (visited.has(key)) continue;
      if (px < 0 || px >= width || py < 0 || py >= height) continue;
      
      const index = getPixelIndex(px, py);
      if (!matchesStart(index)) continue;

      visited.add(key);
      
      data[index] = fillColor.r;
      data[index + 1] = fillColor.g;
      data[index + 2] = fillColor.b;
      data[index + 3] = fillColor.a;

      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
      
      if (visited.size > 500000) break;
    }

    context.putImageData(imageData, 0, 0);
    compositeLayersToCanvas();
    saveToHistory();
  }, [color, opacity, layers, activeLayerId, compositeLayersToCanvas, saveToHistory]);

  // Eyedropper
  const pickColor = useCallback((x, y) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return null;

    const scale = window.devicePixelRatio || 1;
    const pixel = context.getImageData(x * scale, y * scale, 1, 1).data;
    
    const hex = '#' + 
      pixel[0].toString(16).padStart(2, '0') +
      pixel[1].toString(16).padStart(2, '0') +
      pixel[2].toString(16).padStart(2, '0');
    
    return hex;
  }, []);

  // Add text
  const addText = useCallback((x, y, text, fontSize = 20, fontFamily = 'Arial') => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked || !text) return;

    const context = activeLayer.canvas.getContext('2d');
    context.font = `${fontSize}px ${fontFamily}`;
    context.fillStyle = color;
    context.globalAlpha = opacity;
    context.fillText(text, x, y);
    context.globalAlpha = 1;
    
    compositeLayersToCanvas();
    saveToHistory();
  }, [color, opacity, layers, activeLayerId, compositeLayersToCanvas, saveToHistory]);

  // Add image
  const addImage = useCallback((imageFile, x = 0, y = 0, width = null, height = null) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const activeLayer = layers.find(l => l.id === activeLayerId);
          if (!activeLayer || activeLayer.locked) {
            resolve(false);
            return;
          }

          const context = activeLayer.canvas.getContext('2d');
          const drawWidth = width || Math.min(img.width, canvasSize.width);
          const drawHeight = height || Math.min(img.height, canvasSize.height);
          
          context.drawImage(img, x, y, drawWidth, drawHeight);
          compositeLayersToCanvas();
          saveToHistory();
          resolve(true);
        };
        if (e.target?.result) {
          img.src = e.target.result;
        }
      };
      reader.readAsDataURL(imageFile);
    });
  }, [layers, activeLayerId, canvasSize, compositeLayersToCanvas, saveToHistory]);

  // Start drawing
  const startDrawing = useCallback((e) => {
    if (e.cancelable) e.preventDefault();
    const { x, y } = getMousePos(e);

    // Handle selection tool
    if (tool === 'select') {
      if (selectionMode === 'selected' && isPointInSelection(x, y)) {
        startMoveSelection(x, y);
        return;
      }
      startSelection(x, y);
      return;
    }

    // Clear selection when using other tools
    if (selectionMode === 'selected') {
      finishMoveSelection();
      clearSelection();
    }

    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    const context = activeLayer.canvas.getContext('2d');
    if (!context) return;

    setStartPos({ x, y });

    if (tool === 'eyedropper') {
      const pickedColor = pickColor(x, y);
      if (pickedColor) {
        setColor(pickedColor);
        setTool('pen');
      }
      return;
    }

    if (tool === 'fill') {
      floodFill(x, y);
      return;
    }

    if (['line', 'rectangle', 'circle', 'arrow', 'triangle'].includes(tool)) {
      if (tempCanvas) {
        const tempContext = tempCanvas.getContext('2d');
        const scale = window.devicePixelRatio || 1;
        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        layers.forEach(layer => {
          if (layer.visible) {
            tempContext.globalAlpha = layer.opacity;
            tempContext.drawImage(layer.canvas, 0, 0);
          }
        });
        tempContext.globalAlpha = 1;
      }
      setIsDrawing(true);
      return;
    }

    context.beginPath();
    context.moveTo(x, y);
    
    applyBrushStyle(context);

    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = brushSize * 3;
    } else {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = color;
    }

    setIsDrawing(true);
  }, [tool, getMousePos, selectionMode, isPointInSelection, startMoveSelection, startSelection, 
      finishMoveSelection, clearSelection, layers, activeLayerId, pickColor, floodFill, 
      tempCanvas, applyBrushStyle, brushSize, color]);

  // Draw
  const draw = useCallback((e) => {
    if (e.cancelable) e.preventDefault();
    const { x, y } = getMousePos(e);

    // Handle selection
    if (tool === 'select') {
      if (selectionMode === 'selecting') {
        updateSelection(x, y);
        return;
      }
      if (selectionMode === 'moving') {
        moveSelection(x, y);
        return;
      }
      return;
    }

    if (!isDrawing) return;

    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    const context = activeLayer.canvas.getContext('2d');
    if (!context) return;

    // Shape preview
    if (['line', 'rectangle', 'circle', 'arrow', 'triangle'].includes(tool)) {
      if (tempCanvas) {
        const mainContext = contextRef.current;
        if (mainContext) {
          mainContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
          mainContext.drawImage(tempCanvas, 0, 0, canvasSize.width, canvasSize.height);
          drawShape(startPos.x, startPos.y, x, y, mainContext, true);
        }
      }
      return;
    }

    // Spray brush
    if (brushStyle === 'spray') {
      drawSpray(x, y, context);
      compositeLayersToCanvas();
      return;
    }

    // Normal drawing
    context.lineTo(x, y);
    context.stroke();
    compositeLayersToCanvas();
  }, [isDrawing, getMousePos, tool, selectionMode, updateSelection, moveSelection,
      layers, activeLayerId, tempCanvas, canvasSize, drawShape, startPos, 
      brushStyle, drawSpray, compositeLayersToCanvas]);

  // Stop drawing
  const stopDrawing = useCallback((e) => {
    // Handle selection
    if (tool === 'select') {
      if (selectionMode === 'selecting') {
        finishSelection();
        return;
      }
      if (selectionMode === 'moving') {
        finishMoveSelection();
        return;
      }
      return;
    }

    if (!isDrawing) return;
    
    const { x, y } = getMousePos(e);

    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer) return;

    const context = activeLayer.canvas.getContext('2d');

    // Finalize shape
    if (['line', 'rectangle', 'circle', 'arrow', 'triangle'].includes(tool)) {
      if (context) {
        drawShape(startPos.x, startPos.y, x, y, context, false);
        compositeLayersToCanvas();
      }
    }

    context?.closePath();
    context.globalCompositeOperation = 'source-over';
    setIsDrawing(false);
    saveToHistory();
  }, [tool, selectionMode, finishSelection, finishMoveSelection, isDrawing, 
      getMousePos, layers, activeLayerId, drawShape, startPos, compositeLayersToCanvas, saveToHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const state = history[newIndex];
    
    state.layers.forEach(layerState => {
      const layer = layers.find(l => l.id === layerState.id);
      if (!layer) return;

      const img = new Image();
      img.src = layerState.dataUrl;
      img.onload = () => {
        const context = layer.canvas.getContext('2d');
        context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        context.drawImage(img, 0, 0);
        compositeLayersToCanvas();
      };
    });

    setHistoryIndex(newIndex);
  }, [historyIndex, history, layers, compositeLayersToCanvas]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const state = history[newIndex];
    
    state.layers.forEach(layerState => {
      const layer = layers.find(l => l.id === layerState.id);
      if (!layer) return;

      const img = new Image();
      img.src = layerState.dataUrl;
      img.onload = () => {
        const context = layer.canvas.getContext('2d');
        context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        context.drawImage(img, 0, 0);
        compositeLayersToCanvas();
      };
    });

    setHistoryIndex(newIndex);
  }, [historyIndex, history, layers, compositeLayersToCanvas]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    const context = activeLayer.canvas.getContext('2d');
    context.clearRect(0, 0, canvasSize.width * 2, canvasSize.height * 2);
    
    compositeLayersToCanvas();
    saveToHistory();
  }, [layers, activeLayerId, canvasSize, compositeLayersToCanvas, saveToHistory]);

  // Change background color
  const changeBackground = useCallback((newColor) => {
    const bgLayer = layers.find(l => l.type === 'background');
    if (!bgLayer) return;

    const context = bgLayer.canvas.getContext('2d');
    context.fillStyle = newColor;
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    setBackgroundColor(newColor);
    compositeLayersToCanvas();
    saveToHistory();
  }, [layers, canvasSize, compositeLayersToCanvas, saveToHistory]);

  // Zoom functions
  const zoomIn = useCallback(() => setZoom(prev => Math.min(prev + 0.25, 3)), []);
  const zoomOut = useCallback(() => setZoom(prev => Math.max(prev - 0.25, 0.5)), []);
  const resetZoom = useCallback(() => setZoom(1), []);

  // Get canvas data URL
  const getDataUrl = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    compositeLayersToCanvas();
    return canvas.toDataURL('image/png');
  }, [compositeLayersToCanvas]);

  // Load image to canvas
  const loadImage = useCallback((dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      // Clear all drawing layers and draw image on active layer
      layers.forEach(layer => {
        if (layer.type !== 'background') {
          const context = layer.canvas.getContext('2d');
          context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        }
      });

      const activeLayer = layers.find(l => l.id === activeLayerId);
      if (activeLayer) {
        const context = activeLayer.canvas.getContext('2d');
        context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      }

      compositeLayersToCanvas();
      saveToHistory();
    };
  }, [layers, activeLayerId, canvasSize, compositeLayersToCanvas, saveToHistory]);

  // Download canvas as image
  const downloadImage = useCallback((filename = 'drawing.png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    compositeLayersToCanvas();
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [compositeLayersToCanvas]);

  // Flip canvas horizontally
  const flipHorizontal = useCallback(() => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    const canvas = activeLayer.canvas;
    const context = canvas.getContext('2d');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(canvas, 0, 0);

    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(-1, 1);
    context.drawImage(tempCanvas, -canvas.width, 0);
    context.restore();
    
    compositeLayersToCanvas();
    saveToHistory();
  }, [layers, activeLayerId, compositeLayersToCanvas, saveToHistory]);

  // Flip canvas vertically
  const flipVertical = useCallback(() => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    const canvas = activeLayer.canvas;
    const context = canvas.getContext('2d');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(canvas, 0, 0);

    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(1, -1);
    context.drawImage(tempCanvas, 0, -canvas.height);
    context.restore();
    
    compositeLayersToCanvas();
    saveToHistory();
  }, [layers, activeLayerId, compositeLayersToCanvas, saveToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            e.shiftKey ? redo() : undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'c':
            e.preventDefault();
            copySelection();
            break;
          case 'x':
            e.preventDefault();
            cutSelection();
            break;
          case 'v':
            e.preventDefault();
            paste();
            break;
          case 'a':
            e.preventDefault();
            selectAll();
            break;
          case 'd':
            e.preventDefault();
            clearSelection();
            break;
          case '=':
          case '+':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
          case '0':
            e.preventDefault();
            resetZoom();
            break;
          default:
            break;
        }
      } else {
        switch (e.key.toLowerCase()) {
          case 'b':
            setTool('pen');
            break;
          case 'e':
            setTool('eraser');
            break;
          case 'l':
            setTool('line');
            break;
          case 'r':
            setTool('rectangle');
            break;
          case 'c':
            setTool('circle');
            break;
          case 'g':
            setTool('fill');
            break;
          case 'i':
            setTool('eyedropper');
            break;
          case 't':
            setTool('text');
            break;
          case 'v':
          case 's':
            setTool('select');
            break;
          case 'delete':
          case 'backspace':
            if (selection) {
              e.preventDefault();
              deleteSelection();
            }
            break;
          case 'escape':
            clearSelection();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copySelection, cutSelection, paste, selectAll, clearSelection, 
      deleteSelection, selection, zoomIn, zoomOut, resetZoom]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Save current layer states
      const layerDataUrls = layers.map(layer => ({
        id: layer.id,
        dataUrl: layer.canvas.toDataURL()
      }));

      initCanvas();

      // Restore layer states
      setTimeout(() => {
        layerDataUrls.forEach(({ id, dataUrl }) => {
          const layer = layers.find(l => l.id === id);
          if (!layer) return;

          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            const context = layer.canvas.getContext('2d');
            context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
            compositeLayersToCanvas();
          };
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, layers, canvasSize, compositeLayersToCanvas]);

  return {
    canvasRef,
    contextRef,
    overlayCanvasRef,
    isDrawing,
    color,
    setColor,
    brushSize,
    setBrushSize,
    tool,
    setTool,
    brushStyle,
    setBrushStyle,
    opacity,
    setOpacity,
    fillShape,
    setFillShape,
    backgroundColor,
    setBackgroundColor: changeBackground,
    showGrid,
    setShowGrid,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    initCanvas,
    getDataUrl,
    loadImage,
    downloadImage,
    addText,
    addImage,
    flipHorizontal,
    flipVertical,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    // Layers
    layers,
    activeLayerId,
    setActiveLayerId,
    addLayer,
    deleteLayer,
    duplicateLayer,
    toggleLayerVisibility,
    setLayerOpacity,
    toggleLayerLock,
    renameLayer,
    moveLayer,
    mergeLayerDown,
    // Selection
    selection,
    selectionMode,
    clearSelection,
    copySelection,
    cutSelection,
    paste,
    deleteSelection,
    selectAll,
  };
};

export default useCanvas;