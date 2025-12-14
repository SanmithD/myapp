// components/Notes/StatsModal.jsx
import { BarChart3, FileText, Hash, Type, X } from 'lucide-react'

function StatsModal({ isOpen, onClose, stats }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-dark-800 rounded-lg w-full max-w-sm border border-dark-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 size={20} />
            Statistics
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="bg-dark-700 rounded-lg p-4 text-center">
            <FileText size={24} className="mx-auto mb-2 text-amber-400" />
            <p className="text-2xl font-bold text-white">{stats.totalNotes}</p>
            <p className="text-sm text-dark-400">Total Notes</p>
          </div>

          <div className="bg-dark-700 rounded-lg p-4 text-center">
            <Type size={24} className="mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold text-white">{stats.totalWords.toLocaleString()}</p>
            <p className="text-sm text-dark-400">Total Words</p>
          </div>

          <div className="bg-dark-700 rounded-lg p-4 text-center">
            <Hash size={24} className="mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold text-white">{stats.totalCharacters.toLocaleString()}</p>
            <p className="text-sm text-dark-400">Characters</p>
          </div>

          <div className="bg-dark-700 rounded-lg p-4 text-center">
            <FileText size={24} className="mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold text-white">{stats.pinnedCount}</p>
            <p className="text-sm text-dark-400">Pinned</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-dark-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-dark-700 text-white rounded hover:bg-dark-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatsModal