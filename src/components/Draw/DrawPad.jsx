import { FileText, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useCanvas from "../../hooks/useCanvas";
import { saveDrawing } from "../../utils/storage";
import Canvas from "./Canvas";
import LayersPanel from "./LayersPanel";
import Modal from "./Modal";
import SavedDrawings from "./SavedDrawings";
import Toolbar from "./Toolbar";

const DrawPad = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [drawingName, setDrawingName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    canvasRef,
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
    setBackgroundColor,
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
    canUndo,
    canRedo,
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
  } = useCanvas("#000000", 5);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // browser needs this
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSave = useCallback(() => {
    setShowSaveModal(true);
    setDrawingName("");
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

  const handleLoadDrawing = useCallback(
    (dataUrl) => {
      loadImage(dataUrl);
    },
    [loadImage]
  );

  const handleAddImage = useCallback(
    async (file) => {
      await addImage(file, 50, 50);
    },
    [addImage]
  );

  const handleAddText = useCallback(
    (x, y, text) => {
      addText(x, y, text, brushSize * 4);
    },
    [addText, brushSize]
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <Toolbar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        tool={tool}
        setTool={setTool}
        brushStyle={brushStyle}
        setBrushStyle={setBrushStyle}
        opacity={opacity}
        setOpacity={setOpacity}
        fillShape={fillShape}
        setFillShape={setFillShape}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        zoom={zoom}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
        clearCanvas={clearCanvas}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        flipHorizontal={flipHorizontal}
        flipVertical={flipVertical}
        onSave={handleSave}
        onOpenGallery={() => setShowGallery(true)}
        onDownload={handleDownload}
        onAddImage={handleAddImage}
        showLayersPanel={showLayersPanel}
        setShowLayersPanel={setShowLayersPanel}
        // Selection props
        selection={selection}
        selectionMode={selectionMode}
        copySelection={copySelection}
        cutSelection={cutSelection}
        paste={paste}
        deleteSelection={deleteSelection}
        selectAll={selectAll}
        clearSelection={clearSelection}
      />

      {/* Canvas */}
      <Canvas
        canvasRef={canvasRef}
        startDrawing={startDrawing}
        draw={draw}
        stopDrawing={stopDrawing}
        initCanvas={initCanvas}
        tool={tool}
        showGrid={showGrid}
        zoom={zoom}
        onAddText={handleAddText}
        selection={selection}
        selectionMode={selectionMode}
      />

      {/* Layers Panel */}
      <LayersPanel
        layers={layers}
        activeLayerId={activeLayerId}
        setActiveLayerId={setActiveLayerId}
        addLayer={addLayer}
        deleteLayer={deleteLayer}
        duplicateLayer={duplicateLayer}
        toggleLayerVisibility={toggleLayerVisibility}
        setLayerOpacity={setLayerOpacity}
        toggleLayerLock={toggleLayerLock}
        renameLayer={renameLayer}
        moveLayer={moveLayer}
        mergeLayerDown={mergeLayerDown}
        isOpen={showLayersPanel}
        onClose={() => setShowLayersPanel(false)}
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
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmSave();
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-green-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              <Save className="w-5 h-5" />
              Save Drawing
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 bg-green-500 text-white rounded-xl shadow-lg">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="font-medium">Drawing saved successfully!</span>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-400 hidden md:block">
        <span>
          V: Select • B: Pen • E: Eraser • L: Line • R: Rectangle • C: Circle •
          G: Fill • Ctrl+C/X/V: Copy/Cut/Paste
        </span>
      </div>
    </div>
  );
};

export default DrawPad;
