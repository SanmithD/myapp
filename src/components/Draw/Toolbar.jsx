/* eslint-disable react-hooks/static-components */
import React, { useState } from 'react';
import {
  Pencil,
  Eraser,
  Trash2,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Download,
  Palette,
  Minus,
  Plus,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import ColorPicker from './ColorPicker';

const Toolbar = ({
  color,
  setColor,
  brushSize,
  setBrushSize,
  tool,
  setTool,
  clearCanvas,
  undo,
  redo,
  canUndo,
  canRedo,
  onSave,
  onOpenGallery,
  onDownload,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBrushSettings, setShowBrushSettings] = useState(false);

  const ToolButton = ({ icon: Icon, label, onClick, active, disabled, className = '' }) => (
    <div className="tooltip-container relative">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
          active
            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
            : disabled
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        } ${className}`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <span className="tooltip -bottom-10 left-1/2 -translate-x-1/2 hidden sm:block">
        {label}
      </span>
    </div>
  );

  return (
    <>
      {/* Main Toolbar */}
      <div className="bg-white border-b border-gray-200 mt-15 px-3 sm:px-4 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Draw
              </h1>
            </div>

            {/* Drawing Tools */}
            <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl">
              <ToolButton
                icon={Pencil}
                label="Pen"
                onClick={() => setTool('pen')}
                active={tool === 'pen'}
              />
              <ToolButton
                icon={Eraser}
                label="Eraser"
                onClick={() => setTool('eraser')}
                active={tool === 'eraser'}
              />
              
              <div className="w-px h-8 bg-gray-200 mx-2" />
              
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
              
              <div className="w-px h-8 bg-gray-200 mx-2" />
              
              <ToolButton
                icon={Trash2}
                label="Clear Canvas"
                onClick={clearCanvas}
              />
            </div>

            {/* Color & Size */}
            <div className="flex items-center gap-4">
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
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl p-4 z-50 animate-scale-in min-w-[280px]">
                      <ColorPicker color={color} onChange={setColor} />
                    </div>
                  </>
                )}
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
                <button
                  onClick={() => setBrushSize(Math.max(1, brushSize - 2))}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-500" />
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm font-medium text-gray-600 w-8 text-center">
                    {brushSize}
                  </span>
                </div>
                <button
                  onClick={() => setBrushSize(Math.min(50, brushSize + 2))}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-500" />
                </button>
                
                {/* Size preview */}
                <div className="w-10 h-10 flex items-center justify-center">
                  <div
                    className="rounded-full"
                    style={{
                      width: Math.min(brushSize, 30),
                      height: Math.min(brushSize, 30),
                      backgroundColor: tool === 'eraser' ? '#e5e7eb' : color,
                      border: tool === 'eraser' ? '2px dashed #9ca3af' : 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenGallery}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FolderOpen className="w-5 h-5" />
                <span className="text-sm font-medium">Gallery</span>
              </button>
              
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">Download</span>
              </button>
              
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all"
              >
                <Save className="w-5 h-5" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          </div>

          {/* Tablet Layout (md to lg) */}
          <div className="hidden md:flex lg:hidden items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Draw
              </h1>
            </div>

            {/* Drawing Tools */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
              <ToolButton
                icon={Pencil}
                label="Pen"
                onClick={() => setTool('pen')}
                active={tool === 'pen'}
              />
              <ToolButton
                icon={Eraser}
                label="Eraser"
                onClick={() => setTool('eraser')}
                active={tool === 'eraser'}
              />
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
              <ToolButton
                icon={Trash2}
                label="Clear"
                onClick={clearCanvas}
              />
            </div>

            {/* Color & Size Compact */}
            <div className="flex items-center gap-2">
              {/* Color */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-md border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                </button>
                
                {showColorPicker && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowColorPicker(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl p-4 z-50 animate-scale-in min-w-[280px]">
                      <ColorPicker color={color} onChange={setColor} />
                    </div>
                  </>
                )}
              </div>

              {/* Brush Size Compact */}
              <div className="relative">
                <button
                  onClick={() => setShowBrushSettings(!showBrushSettings)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: Math.min(brushSize, 20),
                      height: Math.min(brushSize, 20),
                      backgroundColor: tool === 'eraser' ? '#e5e7eb' : color,
                      border: tool === 'eraser' ? '1px dashed #9ca3af' : 'none',
                      minWidth: 8,
                      minHeight: 8,
                    }}
                  />
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {showBrushSettings && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowBrushSettings(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl p-4 z-50 animate-scale-in">
                      <p className="text-xs font-medium text-gray-500 mb-2">Brush Size</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setBrushSize(Math.max(1, brushSize - 2))}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-500" />
                        </button>
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={brushSize}
                          onChange={(e) => setBrushSize(Number(e.target.value))}
                          className="w-32"
                        />
                        <span className="text-sm font-medium text-gray-600 w-6 text-center">
                          {brushSize}
                        </span>
                        <button
                          onClick={() => setBrushSize(Math.min(50, brushSize + 2))}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenGallery}
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Gallery"
              >
                <FolderOpen className="w-5 h-5" />
              </button>
              
              <button
                onClick={onDownload}
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-200 transition-all"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          </div>

          {/* Mobile Layout (below md) */}
          <div className="flex md:hidden items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Draw
              </h1>
            </div>

            {/* Quick Tools */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
              <ToolButton
                icon={Pencil}
                label="Pen"
                onClick={() => setTool('pen')}
                active={tool === 'pen'}
              />
              <ToolButton
                icon={Eraser}
                label="Eraser"
                onClick={() => setTool('eraser')}
                active={tool === 'eraser'}
              />
              
              {/* Color Quick Pick */}
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-5 h-5 rounded-md border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                />
              </button>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Color Picker Dropdown */}
        {showColorPicker && (
          <div className="md:hidden">
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowColorPicker(false)}
            />
            <div className="absolute left-3 right-3 mt-2 bg-white rounded-xl shadow-2xl p-4 z-50 animate-scale-in">
              <ColorPicker color={color} onChange={setColor} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="md:hidden fixed top-[56px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 animate-slide-down">
            <div className="p-4 space-y-4">
              {/* Tools Section */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tools</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setTool('pen'); }}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                      tool === 'pen' 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="text-sm font-medium">Pen</span>
                  </button>
                  <button
                    onClick={() => { setTool('eraser'); }}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                      tool === 'eraser' 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Eraser className="w-4 h-4" />
                    <span className="text-sm font-medium">Eraser</span>
                  </button>
                </div>
              </div>

              {/* Brush Size */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brush Size</p>
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-3 rounded-xl">
                  <button
                    onClick={() => setBrushSize(Math.max(1, brushSize - 5))}
                    className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
                  >
                    <Minus className="w-4 h-4 text-gray-500" />
                  </button>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold text-gray-700 w-8 text-center bg-white px-2 py-1 rounded-lg">
                      {brushSize}
                    </span>
                  </div>
                  <button
                    onClick={() => setBrushSize(Math.min(50, brushSize + 5))}
                    className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                  {/* Preview */}
                  <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                    <div
                      className="rounded-full"
                      style={{
                        width: Math.min(brushSize, 30),
                        height: Math.min(brushSize, 30),
                        backgroundColor: tool === 'eraser' ? '#e5e7eb' : color,
                        border: tool === 'eraser' ? '2px dashed #9ca3af' : 'none',
                        minWidth: 4,
                        minHeight: 4,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* History Actions */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">History</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { undo(); }}
                    disabled={!canUndo}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                      canUndo 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-gray-50 text-gray-300'
                    }`}
                  >
                    <Undo2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Undo</span>
                  </button>
                  <button
                    onClick={() => { redo(); }}
                    disabled={!canRedo}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                      canRedo 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-gray-50 text-gray-300'
                    }`}
                  >
                    <Redo2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Redo</span>
                  </button>
                  <button
                    onClick={() => { clearCanvas(); setShowMobileMenu(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Clear</span>
                  </button>
                </div>
              </div>

              {/* File Actions */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Actions</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { onOpenGallery(); setShowMobileMenu(false); }}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <FolderOpen className="w-5 h-5" />
                    <span className="text-xs font-medium">Gallery</span>
                  </button>
                  
                  <button
                    onClick={() => { onDownload(); setShowMobileMenu(false); }}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-xs font-medium">Download</span>
                  </button>
                  
                  <button
                    onClick={() => { onSave(); setShowMobileMenu(false); }}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Save className="w-5 h-5" />
                    <span className="text-xs font-medium">Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Toolbar;