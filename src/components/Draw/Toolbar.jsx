import {
  ArrowRight,
  ChevronDown,
  Circle,
  Download,
  Eraser,
  FlipHorizontal,
  FlipVertical,
  FolderOpen,
  Grid3X3,
  Image as ImageIcon,
  Layers,
  Menu,
  Minus,
  MousePointer2,
  PaintBucket,
  Palette,
  Pencil,
  Pipette,
  Plus,
  Redo2,
  Save,
  Sparkles,
  Square,
  Trash2,
  Triangle,
  Type,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import ColorPicker from "./ColorPicker";

const TOOLS = [
  { id: "select", icon: MousePointer2, label: "Select (V)", shortcut: "V" },
  { id: "pen", icon: Pencil, label: "Pen (B)", shortcut: "B" },
  { id: "eraser", icon: Eraser, label: "Eraser (E)", shortcut: "E" },
  {
    id: "line",
    icon: ArrowRight,
    label: "Line (L)",
    shortcut: "L",
    rotate: -45,
  },
  { id: "arrow", icon: ArrowRight, label: "Arrow" },
  { id: "rectangle", icon: Square, label: "Rectangle (R)", shortcut: "R" },
  { id: "circle", icon: Circle, label: "Circle (C)", shortcut: "C" },
  { id: "triangle", icon: Triangle, label: "Triangle" },
  { id: "fill", icon: PaintBucket, label: "Fill (G)", shortcut: "G" },
  { id: "eyedropper", icon: Pipette, label: "Eyedropper (I)", shortcut: "I" },
  { id: "text", icon: Type, label: "Text (T)", shortcut: "T" },
];

const BRUSH_STYLES = [
  { id: "normal", label: "Normal", icon: "●" },
  { id: "spray", label: "Spray", icon: "◌" },
  { id: "marker", label: "Marker", icon: "■" },
  { id: "highlighter", label: "Highlighter", icon: "▬" },
];

const ToolButton = ({
  icon: Icon,
  label,
  onClick,
  active,
  disabled,
  className = "",
  rotate = 0,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 ${
      active
        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
        : disabled
        ? "text-gray-300 cursor-not-allowed"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
    } ${className}`}
    title={label}
  >
    <Icon
      className="w-4 h-4 sm:w-5 sm:h-5"
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  </button>
);

const Toolbar = ({
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
  clearCanvas,
  undo,
  redo,
  canUndo,
  canRedo,
  flipHorizontal,
  flipVertical,
  onSave,
  onOpenGallery,
  onDownload,
  onAddImage,
  // Layers props
  showLayersPanel,
  setShowLayersPanel,
  // Selection props (optional)
  selection,
  selectionMode,
  copySelection,
  cutSelection,
  paste,
  deleteSelection,
  // selectAll,
  // clearSelection,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showBrushSettings, setShowBrushSettings] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const currentTool = TOOLS.find((t) => t.id === tool) || TOOLS[0];

  return (
    <>
      {/* Main Toolbar */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-9 h-9 bg-linear-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Draw
              </h1>
            </div>

            {/* Drawing Tools */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
              {TOOLS.slice(0, 7).map((t) => (
                <ToolButton
                  key={t.id}
                  icon={t.icon}
                  label={t.label}
                  onClick={() => setTool(t.id)}
                  active={tool === t.id}
                  rotate={t.rotate || 0}
                />
              ))}

              {/* More tools dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowToolsMenu(!showToolsMenu)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showToolsMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowToolsMenu(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 text-black bg-white rounded-xl shadow-2xl p-2 z-50 min-w-40">
                      {TOOLS.slice(7).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTool(t.id);
                            setShowToolsMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            tool === t.id
                              ? "bg-indigo-50 text-indigo-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <t.icon className="w-4 h-4" />
                          <span className="text-sm">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200 mx-1" />

              <ToolButton
                icon={Undo2}
                label="Undo (Ctrl+Z)"
                onClick={undo}
                disabled={!canUndo}
              />
              <ToolButton
                icon={Redo2}
                label="Redo (Ctrl+Y)"
                onClick={redo}
                disabled={!canRedo}
              />
              <ToolButton
                icon={Trash2}
                label="Clear Canvas"
                onClick={clearCanvas}
              />
            </div>

            {/* Brush Settings */}
            <div className="flex items-center gap-3">
              {/* Color Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                  <Palette className="w-4 h-4 text-gray-500" />
                </button>

                {showColorPicker && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowColorPicker(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl p-4 z-50 min-w-[280px]">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Stroke Color
                      </p>
                      <ColorPicker color={color} onChange={setColor} />
                    </div>
                  </>
                )}
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                <button
                  onClick={() => setBrushSize(Math.max(1, brushSize - 2))}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Minus className="w-3 h-3 text-gray-500" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm font-medium text-gray-600 w-6 text-center">
                  {brushSize}
                </span>
                <button
                  onClick={() => setBrushSize(Math.min(50, brushSize + 2))}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="w-3 h-3 text-gray-500" />
                </button>
              </div>

              {/* Opacity */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                <span className="text-xs text-gray-500">Opacity</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-16"
                />
                <span className="text-sm font-medium text-gray-600 w-8">
                  {Math.round(opacity * 100)}%
                </span>
              </div>

              {/* Fill Shape Toggle */}
              {["rectangle", "circle", "triangle"].includes(tool) && (
                <button
                  onClick={() => setFillShape(!fillShape)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    fillShape
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {fillShape ? "Filled" : "Stroke"}
                </button>
              )}

              {/* Brush Style */}
              <div className="relative">
                <button
                  onClick={() => setShowBrushSettings(!showBrushSettings)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg">
                    {BRUSH_STYLES.find((b) => b.id === brushStyle)?.icon}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {showBrushSettings && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowBrushSettings(false)}
                    />
                    <div className="absolute top-full text-black mt-2 left-0 bg-white rounded-xl shadow-2xl p-2 z-50 min-w-[140px]">
                      {BRUSH_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => {
                            setBrushStyle(style.id);
                            setShowBrushSettings(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            brushStyle === style.id
                              ? "bg-indigo-50 text-indigo-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-lg w-6 text-center">
                            {style.icon}
                          </span>
                          <span className="text-sm">{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* More Options */}
            <div className="relative">
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>

              {showMoreOptions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMoreOptions(false)}
                  />
                  <div className="absolute top-full mt-2 text-black right-0 bg-white rounded-xl shadow-2xl p-3 z-50 min-w-[200px] space-y-3">
                    {/* Background Color */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Background Color
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-8 h-8 text-black rounded cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">
                          {backgroundColor}
                        </span>
                      </div>
                    </div>

                    {/* Grid Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Show Grid</span>
                      <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`p-2 rounded-lg transition-colors ${
                          showGrid
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Zoom Controls */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Zoom: {Math.round(zoom * 100)}%
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={zoomOut}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <button
                          onClick={resetZoom}
                          className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-xs"
                        >
                          Reset
                        </button>
                        <button
                          onClick={zoomIn}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Flip Options */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Transform
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={flipHorizontal}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                        >
                          <FlipHorizontal className="w-4 h-4" />
                          Flip H
                        </button>
                        <button
                          onClick={flipVertical}
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                        >
                          <FlipVertical className="w-4 h-4" />
                          Flip V
                        </button>
                      </div>
                    </div>

                    {/* Selection Options (when selection is active) */}
                    {selection && selectionMode === 'selected' && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Selection
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={copySelection}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-xs"
                          >
                            Copy
                          </button>
                          <button
                            onClick={cutSelection}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-xs"
                          >
                            Cut
                          </button>
                          <button
                            onClick={paste}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-xs"
                          >
                            Paste
                          </button>
                          <button
                            onClick={deleteSelection}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Import Image */}
                    <div>
                      <label className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-sm">Import Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              onAddImage(e.target.files[0]);
                              setShowMoreOptions(false);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Layers Button */}
              <button
                onClick={() => setShowLayersPanel && setShowLayersPanel(!showLayersPanel)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                  showLayersPanel
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="text-sm">Layers</span>
              </button>

              <button
                onClick={onOpenGallery}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                <span className="text-sm">Gallery</span>
              </button>

              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>

              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Quick Tools */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
              <ToolButton
                icon={currentTool.icon}
                label={currentTool.label}
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                active
                rotate={currentTool.rotate || 0}
              />
              <ToolButton
                icon={Eraser}
                label="Eraser"
                onClick={() => setTool("eraser")}
                active={tool === "eraser"}
              />

              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <div
                  className="w-5 h-5 rounded border-2 border-white shadow"
                  style={{ backgroundColor: color }}
                />
              </button>

              <ToolButton
                icon={Undo2}
                label="Undo"
                onClick={undo}
                disabled={!canUndo}
              />
              <ToolButton
                icon={Redo2}
                label="Redo"
                onClick={redo}
                disabled={!canRedo}
              />
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tools Menu */}
        {showToolsMenu && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowToolsMenu(false)}
            />
            <div className="absolute text-black left-3 right-3 mt-2 bg-white rounded-xl shadow-2xl p-3 z-50">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Drawing Tools
              </p>
              <div className="grid grid-cols-5 gap-2">
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTool(t.id);
                      setShowToolsMenu(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                      tool === t.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <t.icon
                      className="w-5 h-5"
                      style={{
                        transform: t.rotate
                          ? `rotate(${t.rotate}deg)`
                          : undefined,
                      }}
                    />
                    <span className="text-[10px]">{t.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Color Picker */}
        {showColorPicker && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowColorPicker(false)}
            />
            <div className="absolute left-3 right-3 mt-2 bg-white rounded-xl shadow-2xl p-4 z-50">
              <ColorPicker color={color} onChange={setColor} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Full Menu */}
      {showMobileMenu && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="lg:hidden fixed top-[100px] text-black left-0 right-0 bg-white border-b shadow-lg z-50 max-h-[70vh] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Brush Size */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Brush Size
                </p>
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl">
                  <button
                    onClick={() => setBrushSize(Math.max(1, brushSize - 5))}
                    className="p-2 bg-white rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-bold w-8 text-center">{brushSize}</span>
                  <button
                    onClick={() => setBrushSize(Math.min(50, brushSize + 5))}
                    className="p-2 bg-white rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Opacity
                </p>
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl">
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-bold w-12 text-center">
                    {Math.round(opacity * 100)}%
                  </span>
                </div>
              </div>

              {/* Brush Styles */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Brush Style
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {BRUSH_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setBrushStyle(style.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                        brushStyle === style.id
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <span className="text-xl">{style.icon}</span>
                      <span className="text-xs">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fill Toggle for shapes */}
              {["rectangle", "circle", "triangle"].includes(tool) && (
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                  <span className="text-sm font-medium">Fill Shape</span>
                  <button
                    onClick={() => setFillShape(!fillShape)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      fillShape
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {fillShape ? "Filled" : "Stroke Only"}
                  </button>
                </div>
              )}

              {/* Background Color */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Background Color
                </p>
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm font-mono">{backgroundColor}</span>
                </div>
              </div>

              {/* Grid & Zoom */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-colors ${
                    showGrid ? "bg-indigo-500 text-white" : "bg-gray-100"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                  <span className="text-sm">Grid</span>
                </button>

                <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={zoomOut}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={zoomIn}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transform */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={flipHorizontal}
                  className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  <FlipHorizontal className="w-5 h-5" />
                  <span className="text-sm">Flip H</span>
                </button>
                <button
                  onClick={flipVertical}
                  className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  <FlipVertical className="w-5 h-5" />
                  <span className="text-sm">Flip V</span>
                </button>
              </div>

              {/* Layers Button (Mobile) */}
              <button
                onClick={() => {
                  setShowLayersPanel && setShowLayersPanel(!showLayersPanel);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-colors ${
                  showLayersPanel
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <Layers className="w-5 h-5" />
                <span className="text-sm">Layers</span>
              </button>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    clearCanvas();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="text-sm">Clear</span>
                </button>

                <label className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl cursor-pointer">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">Import</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        onAddImage(e.target.files[0]);
                        setShowMobileMenu(false);
                      }
                    }}
                  />
                </label>
              </div>

              {/* File Actions */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <button
                  onClick={() => {
                    onOpenGallery();
                    setShowMobileMenu(false);
                  }}
                  className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span className="text-xs">Gallery</span>
                </button>
                <button
                  onClick={() => {
                    onDownload();
                    setShowMobileMenu(false);
                  }}
                  className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-xs">Download</span>
                </button>
                <button
                  onClick={() => {
                    onSave();
                    setShowMobileMenu(false);
                  }}
                  className="flex flex-col items-center gap-1 p-3 bg-linear-to-br from-green-500 to-teal-600 text-white rounded-xl"
                >
                  <Save className="w-5 h-5" />
                  <span className="text-xs">Save</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Toolbar;