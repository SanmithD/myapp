// components/Notes/TrashModal.jsx
import { RotateCcw, Trash2, X } from 'lucide-react'

function TrashModal({ isOpen, onClose, deletedNotes, onRestore, onPermanentDelete, onClearAll }) {
  if (!isOpen) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-dark-800 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col border border-dark-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trash2 size={20} />
            Recently Deleted
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {deletedNotes.length === 0 ? (
            <div className="text-center py-8 text-dark-400">
              <Trash2 size={40} className="mx-auto mb-3 opacity-50" />
              <p>Trash is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {deletedNotes.map(note => (
                <div
                  key={note.id}
                  className="bg-dark-700 rounded-lg p-3 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{note.title}</h4>
                    <p className="text-xs text-dark-400 mt-1">
                      Deleted {formatDate(note.deletedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRestore(note.id)}
                      className="p-2 rounded hover:bg-dark-600 text-green-400 transition-colors"
                      title="Restore"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => onPermanentDelete(note.id)}
                      className="p-2 rounded hover:bg-dark-600 text-red-400 transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {deletedNotes.length > 0 && (
          <div className="p-4 border-t border-dark-700">
            <button
              onClick={onClearAll}
              className="w-full py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
            >
              Empty Trash
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrashModal