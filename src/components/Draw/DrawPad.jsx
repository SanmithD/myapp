import React, { useState, useCallback } from 'react';
import Toolbar from './Toolbar';
import SavedDrawings from './SavedDrawings';
import Modal from './Modal';
import Canvas from './Canvas';
import useCanvas from '../../hooks/useCanvas';
import { saveDrawing } from "../../utils/storage";
import { Save, FileText } from 'lucide-react';

const DrawPad = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [drawingName, setDrawingName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    canvasRef,
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
    canUndo,
    canRedo,
  } = useCanvas('#000000', 5);

  const handleSave = useCallback(() => {
    setShowSaveModal(true);
    setDrawingName('');
  }, []);

  const confirmSave = useCallback(() => {
    const dataUrl = getDataUrl();
    if (dataUrl) {
      saveDrawing(drawingName || `Drawing ${Date.now()}`, dataUrl);
      setShowSaveModal(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }, [drawingName, getDataUrl]);

  const handleDownload = useCallback(() => {
    downloadImage(`drawing-${Date.now()}.png`);
  }, [downloadImage]);

  const handleLoadDrawing = useCallback((dataUrl) => {
    loadImage(dataUrl);
  }, [loadImage]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <Toolbar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        tool={tool}
        setTool={setTool}
        clearCanvas={clearCanvas}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onSave={handleSave}
        onOpenGallery={() => setShowGallery(true)}
        onDownload={handleDownload}
      />

      {/* Canvas */}
      <Canvas
        canvasRef={canvasRef}
        startDrawing={startDrawing}
        draw={draw}
        stopDrawing={stopDrawing}
        initCanvas={initCanvas}
        tool={tool}
      />

      {/* Gallery Modal */}
      <SavedDrawings
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        onLoadDrawing={handleLoadDrawing}
      />

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Drawing"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drawing Name
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={drawingName}
                onChange={(e) => setDrawingName(e.target.value)}
                placeholder="Enter a name for your drawing..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmSave();
                }}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowSaveModal(false)}
              className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all font-medium"
            >
              <Save className="w-5 h-5" />
              Save Drawing
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Drawing saved successfully!</span>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-400">
        <span className="hidden md:inline">
          Shortcuts: Ctrl+Z (Undo) • Ctrl+Y (Redo) • Ctrl+S (Save)
        </span>
      </div>
    </div>
  );
};

export default DrawPad;