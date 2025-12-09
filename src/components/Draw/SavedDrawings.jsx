import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Edit3, 
  Check, 
  Clock,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { getDrawings, deleteDrawing, renameDrawing } from '../../utils/storage';

const SavedDrawings = ({ isOpen, onClose, onLoadDrawing }) => {
  const [drawings, setDrawings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrawings(getDrawings());
    }
  }, [isOpen]);

  const handleDelete = (id) => {
    const remaining = deleteDrawing(id);
    setDrawings(remaining);
    setDeleteConfirm(null);
  };

  const handleRename = (id) => {
    if (editName.trim()) {
      renameDrawing(id, editName.trim());
      setDrawings(getDrawings());
      setEditingId(null);
      setEditName('');
    }
  };

  const startEditing = (drawing) => {
    setEditingId(drawing.id);
    setEditName(drawing.name);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Panel */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Saved Drawings</h2>
            <p className="text-sm text-gray-500 mt-1">
              {drawings.length} {drawings.length === 1 ? 'drawing' : 'drawings'} saved
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {drawings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No saved drawings yet</p>
              <p className="text-sm mt-1">Start drawing and save your artwork!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {drawings.map((drawing) => (
                <div
                  key={drawing.id}
                  className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div 
                    className="aspect-video bg-white cursor-pointer"
                    onClick={() => {
                      onLoadDrawing(drawing.dataUrl);
                      onClose();
                    }}
                  >
                    <img
                      src={drawing.dataUrl}
                      alt={drawing.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="p-3">
                    {editingId === drawing.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(drawing.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => handleRename(drawing.id)}
                          className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-800 truncate">
                          {drawing.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(drawing.updatedAt)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  {editingId !== drawing.id && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(drawing);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
                        title="Rename"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(drawing.id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}

                  {/* Delete confirmation */}
                  {deleteConfirm === drawing.id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in">
                      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                      <p className="text-sm font-medium text-gray-800 text-center mb-3">
                        Delete this drawing?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(drawing.id)}
                          className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedDrawings;