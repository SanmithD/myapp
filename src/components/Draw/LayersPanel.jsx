import {
    ChevronDown,
    ChevronUp,
    Copy,
    Eye,
    EyeOff,
    Lock,
    Merge,
    MoreVertical,
    Plus,
    Trash2,
    Unlock,
} from 'lucide-react';
import { useState } from 'react';

const LayersPanel = ({
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
  isOpen,
  onClose,
}) => {
  const [editingLayerId, setEditingLayerId] = useState(null);
  const [editName, setEditName] = useState('');
  const [showMenu, setShowMenu] = useState(null);

  const startRename = (layer) => {
    setEditingLayerId(layer.id);
    setEditName(layer.name);
  };

  const finishRename = (layerId) => {
    if (editName.trim()) {
      renameLayer(layerId, editName.trim());
    }
    setEditingLayerId(null);
    setEditName('');
  };

  const reversedLayers = [...layers].reverse();

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-28 w-72 bg-white rounded-xl shadow-2xl z-40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h3 className="font-semibold">Layers</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={addLayer}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Add Layer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      </div>

      {/* Layers List */}
      <div className="max-h-80 overflow-y-auto">
        {reversedLayers.map((layer, index) => (
          <div
            key={layer.id}
            className={`group relative border-b border-gray-100 ${
              activeLayerId === layer.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
            }`}
          >
            <div
              className="flex items-center gap-2 p-3 cursor-pointer"
              onClick={() => layer.type !== 'background' && setActiveLayerId(layer.id)}
            >
              {/* Visibility Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLayerVisibility(layer.id);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {layer.visible ? (
                  <Eye className="w-4 h-4 text-gray-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Layer Preview */}
              <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                <canvas
                  ref={(el) => {
                    if (el && layer.canvas) {
                      const ctx = el.getContext('2d');
                      el.width = 40;
                      el.height = 40;
                      ctx.drawImage(layer.canvas, 0, 0, 40, 40);
                    }
                  }}
                  className="w-full h-full"
                />
              </div>

              {/* Layer Name */}
              <div className="flex-1 min-w-0">
                {editingLayerId === layer.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => finishRename(layer.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') finishRename(layer.id);
                      if (e.key === 'Escape') setEditingLayerId(null);
                    }}
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="block truncate text-sm font-medium text-gray-700"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (layer.type !== 'background') startRename(layer);
                    }}
                  >
                    {layer.name}
                  </span>
                )}
                
                {/* Opacity Slider */}
                {layer.type !== 'background' && (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={layer.opacity}
                      onChange={(e) => {
                        e.stopPropagation();
                        setLayerOpacity(layer.id, Number(e.target.value));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 h-1"
                    />
                    <span className="text-xs text-gray-500">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Lock Toggle */}
              {layer.type !== 'background' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerLock(layer.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {layer.locked ? (
                    <Lock className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              )}

              {/* More Options */}
              {layer.type !== 'background' && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(showMenu === layer.id ? null : layer.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>

                  {showMenu === layer.id && (
                    <>
                      <div
                        className="fixed inset-0 z-50"
                        onClick={() => setShowMenu(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl z-50 py-1 border">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateLayer(layer.id);
                            setShowMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayer(layer.id, 'up');
                            setShowMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          <ChevronUp className="w-4 h-4" />
                          Move Up
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayer(layer.id, 'down');
                            setShowMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          <ChevronDown className="w-4 h-4" />
                          Move Down
                        </button>

                        {index < reversedLayers.length - 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              mergeLayerDown(layer.id);
                              setShowMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            <Merge className="w-4 h-4" />
                            Merge Down
                          </button>
                        )}

                        <div className="border-t my-1" />
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLayer(layer.id);
                            setShowMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Active Indicator */}
            {activeLayerId === layer.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
        {layers.length - 1} drawing layer{layers.length - 1 !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default LayersPanel;